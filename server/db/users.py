import psycopg2
from psycopg2.extras import RealDictCursor
from psycopg2.extensions import AsIs
from server.db.connection import execute_statement,  dsn
from server.authentication import is_authenticated, token_required, is_token_valid
from server.helpers import get_user
from app import app
from flask import jsonify, request, abort
from werkzeug.security import generate_password_hash
from server.db.errors import Unauthorized
from datetime import datetime


# TODO use classes for user, book, author  

def is_unique(table, column, value):
    statement = "select * from %s where (%s = %s) limit 1;" 
    params = (AsIs(table), AsIs(column), value)
    data = execute_statement(statement, params, True, False)
    print("is unique: ", data)
    return
    

def register_has_errors(user):
    if not user or 'username' not in user or 'email' not in user or 'password' not in user:
        return False
    is_unique('users', 'username', user['username'])
    return True

# {"username": "wadawada", "email": "wadawada@wadawada.com", "gender": "M", "birth_date": "1999-01-28"}

# TODO: does registered user has unique email and username?

# create user
@app.route('/api/users/register', methods=['POST'])
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
        # delete password before sending data
        del created_user['hashed_password']
        return jsonify({'token':'', 'status': True, 'data': created_user}), 201

# TODO: login with username and password

@app.route('/api/users/login', methods=['POST'])
def login():
    user = get_user(username=request.json['username'])
    token = is_authenticated(request, user)
    if token:
        # delete password before sending data
        del user['hashed_password']
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
        # delete password before sending data
        del user['hashed_password']
        return jsonify({'status': True, 'data': user}), 200



# get user
# TODO: auth
@app.route('/api/users/<username>', methods=['GET'])
def get_user_with_username(username):
    user = get_user(username=username) 
    if not user:
        return jsonify({'status': False, 'message': "There is no such user: " + username + "."})
    # delete password before sending data
    del user['hashed_password']
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
@token_required
def update_user(username):
    user = get_user(username)
    print(request.json)
    update = {**user, **request.json['data']}
    statement = "update users set "
    for key in update:
        statement += key + ' = ' + ' %s, '
    statement = statement[:len(statement) - 2] + " where (user_id = %s and username = %s)"
    params = tuple(update[key] for key in update) + (user['user_id'], user['username'])
    status = execute_statement(statement, params, False)
    return jsonify({'status': status }), 200


# TODO: auth
@app.route('/api/users/<username>/<list_name>', methods=['GET'])
def get_list(username, list_name):
    if list_name not in ('favorites', 'have-read', 'to-read'):
        abort(404)
    user = get_user(username)
    if not user:
        abort(404)
    tables = {'favorites': 'users_favorites', 'have-read': 'users_have_read', 'to-read': 'users_to_read'}
    statement = """
    select * from %s list
        join books b on list.book_id = b.book_id
            join books_authors ba on b.book_id = ba.book_id
                join authors a on a.author_id = ba.author_id
                    where (list.user_id = %s);"""
    book_list = execute_statement(statement, (AsIs(tables[list_name]), user['user_id']), True)
    if book_list:
        return jsonify({"data": book_list, "status": True}), 200
    else:
        return jsonify({"status": False, "message": "Could not get list data."}), 200



# TODO: auth
@app.route('/api/users/<username>/<list_name>', methods=['POST'])
@token_required
def add_book_to_list(username, list_name):
    if list_name not in ('favorites', 'have-read', 'to-read'):
        abort(404)
    req = request.json
    user = get_user(username)
    if not user:
        abort(404)
    tables = {'favorites': 'users_favorites', 'have-read': 'users_have_read', 'to-read': 'users_to_read'}
    statement = """insert into %s (user_id, book_id) values (%s, %s);"""
    status = execute_statement(statement, (AsIs(tables[list_name]), user['user_id'], req['book_id']), False)
    message = 'Book succesfully added to the list.' if status else 'Could not add book to the list.'
    return jsonify({'status': status, 'message': message}), 200

# TODO: auth
# FIXME
@app.route('/api/users/<username>/<list_name>', methods=['DELETE'])
@token_required
def delete_book_from_list(username, list_name):
    if list_name not in ('favorites', 'have-read', 'to-read'):
        abort(404)
    req = request.json
    user = get_user(username)
    if not user:
        abort(404)
    tables = {'favorites': 'users_favorites', 'have-read': 'users_have_read', 'to-read': 'users_to_read'}
    statement = """delete from %s where (user_id = %s and book_id = %s);"""
    status = execute_statement(statement, (AsIs(tables[list_name]), user['user_id'], req['book_id']), False)
    message = 'Book succesfully deleted from the list.' if status else 'Could not delete book from the list.'
    return jsonify({'status': status, 'message': message}), 200

# delete user
@app.route('/api/users/delete', methods=['DELETE'])
@token_required
def delete_user():
    print("(--------------------)")
    print(request.json)
    if 'user_id' not in request.json:
        return jsonify({"status": False, "message": "User id is missing."})

    # check if the user is deleting other users
    token = request.headers['Authorization']
    user = is_token_valid(token)
    if user['user_id'] != request.json['user_id']:
        return jsonify({"status": False, "message": "User is unauthorized."})

    statement = """delete from users where user_id = %s"""
    status = execute_statement(statement, (request.json['user_id'],))
    if status:
        return jsonify({"status": True}), 200
    else:
        return jsonify({"status": False, "message": "Could not delete user."})




