import psycopg2
from psycopg2.extras import RealDictCursor
from psycopg2.extensions import AsIs
from src.db.connection import execute_statement
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
def search_books(value):
    val = '%' + value + '%'
    with psycopg2.connect(dsn) as connection:
        cursor = connection.cursor()
        statement = """SELECT * from books 
                            WHERE title LIKE (%s) """
        cursor.execute(statement, val)
        data = cursor.fetchall()
        cursor.close()
        return data

@app.route('/api/books/create', methods=['POST'])
def create_book():
    req = request.json




