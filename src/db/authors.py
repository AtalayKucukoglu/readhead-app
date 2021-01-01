import psycopg2
from psycopg2.extras import RealDictCursor
from psycopg2.extensions import AsIs
from src.db.connection import execute_statement
from app import app
from flask import jsonify, request, abort

@app.route('/api/authors/<author_id>', methods=['GET'])
def get_author_with_id(author_id):
    statement = """SELECT * FROM authors
                        WHERE (author_id = %s)"""
    author = execute_statement(statement, author_id, True)
    return jsonify(author)

# FIXME
@app.route('/api/authors/search', methods=['GET'])
def search_authors():
    req = request.json

@app.route('/api/authors/<author_id>/books', methods=['GET'])
def get_books(author_id):
    statement = """select b.* from
                        books b join books_authors ba on b.book_id = ba.book_id
                            join authors a on ba.author_id = a.author_id
                                where a.author_id = %s"""
    data = execute_statement(statement, (author_id, ), True)
    return jsonify(data)
