import psycopg2
from psycopg2.extras import RealDictCursor
from psycopg2.extensions import AsIs
from server.db.connection import execute_statement
from app import app
from flask import jsonify, request, abort

@app.route('/api/books/<book_id>', methods=['GET'])
def get_book_with_id(book_id):
    statement = """SELECT * FROM books
                        WHERE (book_id = %s)"""
    data = execute_statement(statement, book_id, True)
    return jsonify(data)

# FIXME
@app.route('/api/books/search', methods=['GET'])
def search_books():
    req = request.json
    statement = """select * from books where lower(title) like """
    print(statement)
    return "ok"
@app.route('/api/books/create', methods=['POST'])
def create_book():
    req = request.json




