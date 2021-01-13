import psycopg2
from psycopg2.extras import RealDictCursor
from psycopg2.extensions import AsIs
from server.db.connection import execute_statement,  dsn
from server.authentication import is_authenticated, token_required, is_token_valid
from server.users import get_user
from app import app
from flask import jsonify, request, abort
from werkzeug.security import generate_password_hash
from server.db.errors import Unauthorized

# TODO use classes for user, book, author

def register_has_errors(user):
    if not user or 'username' not in user or 'email' not in user or 'password' not in user:
        return False
    else:
        return True

# {"username": "wadawada", "email": "wadawada@wadawada.com", "gender": "M", "birth_date": "1999-01-28"}

# create user
@app.route('/api/users/create', methods=['POST'])
def create_user():
    user_data = request.json
    print(user_data)
    if not register_has_errors(user_data):
        abort(400)
    hashed_password = generate_password_hash(user_data['password'], 'pbkdf2:sha512')
    with psycopg2.connect(dsn) as connection:
        cursor = connection.cursor(cursor_factory=RealDictCursor)
        statement = """insert into users (email, username, hashed_password, gender, birth_date)
                            values (%s, %s, %s, %s, %s);"""
        cursor.execute(statement, (user_data['email'], user_data['username'], hashed_password,
                                   user_data['gender'], user_data['birth_date']))
        cursor.execute("""select * from users
                            where (email = %s and username = %s )""", (user_data['email'], user_data['username']))
        created_user = cursor.fetchone()
        return jsonify(created_user), 201

# TODO: login with username and password

@app.route('/api/users/login', methods=['POST'])
def login():
    user = get_user(username=request.json['username'])
    token = is_authenticated(request, user)
    if token:
        return jsonify({'token': token, 'status': True, 'data': user}), 201
    else:
        return jsonify({'status': False, 'message': 'Username or password is not correct.'})
        # raise Unauthorized('Username or password is not correct.')

@app.route('/api/users/check_token', methods=['GET'])
@token_required       
def check_token():
    token = request.headers['Authorization']
    user = is_token_valid(token)  
    if not user:
        return jsonify({'error': 'Unauthorized', 'status': False, 'authentication': False}), 401
    else:
        return jsonify({'status': True, 'data': user}), 200



# get user
# TODO: auth
@app.route('/api/users/<username>', methods=['GET'])
@token_required
def get_user_with_username(username):
    
    statement = """SELECT * FROM users
                            WHERE (username = %s)"""
    user = execute_statement(statement, (username,), True, False)
    
    if not user:
        return jsonify({'status': False, 'message': "There is no such user: " + username + "."})
    return jsonify({'status': True, 'data': user}), 200


@app.route('/api/users', methods=['GET'])
def get_all_users():
    with psycopg2.connect(dsn) as connection:
        cursor = connection.cursor(cursor_factory=RealDictCursor)
        cursor.execute("SELECT * FROM users;")
        data = cursor.fetchall()
        return jsonify(data), 200


# update user
# TODO: auth
@app.route('/api/users/<username>/update', methods=['PUT'])
def update_user(username):
    user = get_user(username)
    update = {**user, **request.json}
    statement = "update users set "
    for key in update:
        statement += key + ' = ' + ' %s, '
    statement = statement[:len(statement) - 2] + " where (user_id = %s and username = %s)"
    params = tuple(update[key] for key in update) + (user['user_id'], user['username'])
    execute_statement(statement, params, False)
    return 'user updated', 200


# TODO: auth
@app.route('/api/users/<username>/<list_name>', methods=['GET'])
def get_list(username, list_name):
    if list_name not in ('favorites', 'have-read', 'to-read'):
        abort(404)
    user = get_user(username)
    if not user:
        abort(404)
    tables = {'favorites': 'users_favorites', 'have-read': 'users_have_read', 'to-read': 'users_to_read'}
    statement = """select * from %s
                        where (user_id = %s)"""
    data = execute_statement(statement, (AsIs(tables[list_name]), user['user_id']), True)
    return jsonify(data), 200


# TODO: auth
@app.route('/api/users/<username>/<list_name>', methods=['POST'])
def add_book_to_list(username, list_name):
    if list_name not in ('favorites', 'have-read', 'to-read'):
        abort(404)
    req = request.json
    user = get_user(username)
    if not user:
        abort(404)
    tables = {'favorites': 'users_favorites', 'have-read': 'users_have_read', 'to-read': 'users_to_read'}
    statement = """insert into %s (user_id, book_id) values (%s, %s);"""
    data = execute_statement(statement, (AsIs(tables[list_name]), user['user_id'], req['book_id']), False)
    return 'book succesfully added to list', 201

# TODO: auth
# FIXME
@app.route('/api/users/<username>/<list_name>', methods=['DELETE'])
def delete_book_from_list(username, list_name):
    if list_name not in ('favorites', 'have-read', 'to-read'):
        abort(404)
    req = request.json
    user = get_user(username)
    if not user:
        abort(404)
    print(user)
    tables = {'favorites': 'users_favorites', 'have-read': 'users_have_read', 'to-read': 'users_to_read'}
    statement = """delete from %s where (user_id = %s and book_id = %s);"""
    data = execute_statement(statement, (AsIs(tables[list_name]), user['user_id'], req['book_id']), False)
    print(data)
    return 'book succesfully deleted from list', 201

# delete user



