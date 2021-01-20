from flask import Flask, jsonify, send_from_directory
from server.db.connection import db_connect
import os

app = Flask(__name__, static_folder='client/build', static_url_path='')
app.config['SECRET_KEY'] = os.getenv('APP_SECRET_KEY')

import server.db.books
import server.db.users
import server.db.authors

@app.route('/')
def index():
    print("inside /")
    return app.send_static_file('index.html')

#catch all requests that backend server has nothing to do
#send them index.html
@app.route('/', defaults={'path': ''})
@app.route('/<string:path>')
@app.route('/<path:path>')
def catch_all(path):
    print("inside catch all")
    if os.path.isfile('app/public/' + path):
        return send_from_directory('client/build', path)

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
