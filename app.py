# run this:
# C:\Users\Atalay\PycharmProjects\db-project\venv\Scripts\python.exe -m flask run


from flask import Flask, jsonify
from src.db.connection import db_connect

app = Flask(__name__)

import src.db.books
import src.db.users
import src.db.authors

@app.route('/')
def hello_world():
    return 'Hello World!'

# @app.route('/api/books/<book_id>')
# def get_book_with_id(book_id):
#     book = db.books.get_book_with_id(book_id)
#     return jsonify(book)

@app.route('/connect')
def connect():
    db_connect()
    return 'connect page'


if __name__ == '__main__':
    db_connect()
    app.run(debug=True)
