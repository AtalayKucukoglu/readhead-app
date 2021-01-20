from flask import Flask, jsonify, send_from_directory
from server.db.connection import db_connect
import os

app = Flask(__name__, static_folder='client/build', static_url_path='')
app.config['SECRET_KEY'] = os.getenv('APP_SECRET_KEY')

import server.db.books
import server.db.users
import server.db.authors

#catch all requests that backend server has nothing to do
#send them index.html
@app.route('/', defaults={'path1': '', 'path2': ''})
@app.route('/<path:path1>', defaults={'path2': ''})
@app.route('/<path:path1>/<path:path2>')
def catch_all(path1, path2):
    if os.path.isfile('client/build/' + path1 + path2):
        return send_from_directory('client/build', path1 + path2)

    return app.send_static_file("index.html")

@app.after_request
def apply_caching(response):
    # response.headers.set('Access-Control-Allow-Origin', 'http://localhost:3000')
    response.headers.set('Access-Control-Allow-Origin', 'https://readhead.herokuapp.com')
    response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE')
    response.headers.set('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization')
    return response

if __name__ == '__main__':
    app.run(debug=False)
