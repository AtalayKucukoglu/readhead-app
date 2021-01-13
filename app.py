# run this:
# C:\Users\Atalay\PycharmProjects\db-project\venv\Scripts\python.exe -m flask run


from flask import Flask, jsonify
from server.db.connection import db_connect

app = Flask(__name__)
app.config['SECRET_KEY'] = "\xa3~\x84\x18\r\xa0\xf9\xe4c\xea\x8c\xdeX\x7f\xd8\x1d\xce$O~\xf30i&"

import server.db.books
import server.db.users
import server.db.authors

@app.route('/')
def hello_world():
    return 'Hello World!'

@app.route('/connect')
def connect():
    db_connect()
    return 'connect page'

@app.after_request
def apply_caching(response):
    response.headers.set('Access-Control-Allow-Origin', 'http://localhost:3000')
    # response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE')
    response.headers.set('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization')
    return response

if __name__ == '__main__':
    app.run(debug=True)
