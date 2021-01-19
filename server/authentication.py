from app import app
from flask import request, jsonify
from werkzeug.security import  check_password_hash
import jwt
import datetime
from functools import wraps
from server.helpers import get_user
from server.db.errors import Unauthorized

# TODO: use User class
# TODO: use a separate public_id for users

# returns a decorator
def token_required(f):
    @wraps(f)
    def decorator(*args, **kwargs):
        token = None
        print("req headers: ", request.headers)
        if 'Authorization' in request.headers:
            token = request.headers['Authorization']

        if not token:
            return jsonify({'message': 'A valid token is missing.', 'status': False, 'authorized': False})
            # raise Unauthorized('A valid token is missing.', status_code=401)

        try:
            data = jwt.decode(token, app.config['SECRET_KEY'], algorithms='HS256')
            print("data: ", data)
            current_user = get_user(user_id=data['user_id'])
            print("current_user: ", current_user)

        except:
            return jsonify({'message': 'Token is invalid.', 'status': False,  'authorized': False, 'token_valid': False})
            # raise Unauthorized('Token is invalid.', status_code=401)

        return f(*args, **kwargs)

    return decorator

# used for login operations
def is_authenticated(req, user):
    auth = req.json
    if not auth or 'username' not in auth or 'password' not in auth:
        return False

    if not user:
        return False

    if check_password_hash(user['hashed_password'].strip(), auth['password'].strip()):
        token = jwt.encode({'user_id': user['user_id'], 'exp': datetime.datetime.utcnow() + datetime.timedelta(minutes=59)}, app.config['SECRET_KEY'])
        return token

    return False

def is_token_valid(token):
    data = jwt.decode(token, app.config['SECRET_KEY'], algorithms='HS256')
    user = get_user(user_id=data['user_id'])
    if not user:
        return False
    else:
        return user