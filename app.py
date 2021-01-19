# run this:
# C:\Users\Atalay\PycharmProjects\db-project\venv\Scripts\python.exe -m flask run

from flask import Flask, jsonify
from server.db.connection import db_connect
from config_app import secret_key

app = Flask(__name__, static_folder='./client/build', static_url_path='/')
app.config['SECRET_KEY'] = secret_key

import server.db.books
import server.db.users
import server.db.authors

@app.route('/')
def index():
    return app.send_static_file('index.html')

#catch all requests that backend server has nothing to do
#send them index.html
@app.route('/', defaults={'path1': '', 'path2': ''})
@app.route('/<path:path1>', defaults={'path2': ''})
@app.route('/<path:path1>/<path:path2>')
def catch_all(path1, path2):
    return app.send_static_file('index.html')


@app.after_request
def apply_caching(response):
    response.headers.set('Access-Control-Allow-Origin', 'http://localhost:3000')
    response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE')
    response.headers.set('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization')
    return response

if __name__ == '__main__':
    app.run(debug=False)
