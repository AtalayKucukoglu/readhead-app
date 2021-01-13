from flask import make_response, jsonify
from app import app

@app.errorhandler(404)
def not_found(error):
    return make_response(jsonify({'error': 'Not found.', 'status': False}), 404)

@app.errorhandler(401)
def unauthorized(error):
    return make_response(jsonify({'error': 'Unauthorized.', 'status': False}), 401)


def error_to_dict(error):
    rv = dict(error.payload or ())
    rv['message'] = error.message
    return rv


class Unauthorized(Exception):
    status_code = 401
    def __init__(self, message, status_code=None, payload=None):
        Exception.__init__(self)
        self.message = message
        if status_code is not None:
            self.status_code = status_code
        self.payload = payload

    def to_dict(self):
        rv = dict(self.payload or ())
        rv['message'] = self.message
        return rv


@app.errorhandler(Unauthorized)
def handle_unauthorized(error):
    print("handle unauthorized")
    response = jsonify(error.to_dict())
    response.status_code = error.status_code
    return response

