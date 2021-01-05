from flask import make_response, jsonify
from app import app

@app.errorhandler(404)
def not_found(error):
    return make_response(jsonify({'error': 'Not found.'}), 404)

@app.errorhandler(401)
def unauthorized(error):
    return make_response(jsonify({'error': 'Unauthorized.'}), 401)


