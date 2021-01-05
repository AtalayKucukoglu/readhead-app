from app import app
from flask import request, jsonify
from werkzeug.security import  check_password_hash
import jwt
import datetime
from functools import wraps
from server.users import get_user

# TODO: use User class
# TODO: use a separate public_id for users

# returns a decorator
def token_required(f):
    @wraps(f)
    def decorator(*args, **kwargs):
        print("decorator called")
        token = None
        print(request.headers['x-access-tokens'], type(request.headers['x-access-tokens']))
        if 'x-access-tokens' in request.headers:
            token = request.headers['x-access-tokens']

        if not token:
            return jsonify({'message': 'a valid token is missing'})

        # try:
        data = jwt.decode(token, app.config['SECRET_KEY'], algorithms='HS256')
        print("data: ", data)
        current_user = get_user(user_id=data['user_id'])
        print("current_user: ", current_user)

        # except:
        #     return jsonify({'message': 'token is invalid'})

        return f(*args, **kwargs)

    return decorator

# used for login operations
def is_authenticated(req, user):
    auth = req.authorization
    print("auth: ", auth)
    if not auth or not auth.username or not auth.password:
        return False

    # TODO: add password for users
    if check_password_hash(user['hashed_password'].strip(), auth.password.strip()):
        token = jwt.encode({'user_id': user['user_id'], 'exp': datetime.datetime.utcnow() + datetime.timedelta(minutes=30)}, app.config['SECRET_KEY'])
        print("encoded token: ", token)
        return token

    return False
