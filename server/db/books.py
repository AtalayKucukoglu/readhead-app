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

@app.route('/api/books/search', methods=['POST'])
def search_books():
    value = request.json['value'].lower()
    print("SEARCH VALUE: ", value)
    statement = """select b.*, a.* from
                        books b join books_authors ba on b.book_id = ba.book_id
                            join authors a on ba.author_id = a.author_id
                                where lower(title) like """ + "'%%" + '%s' + "%%'"
    response = execute_statement(statement, (AsIs(value),), True)
    return jsonify(response), 200

@app.route('/api/books/create', methods=['POST'])
def create_book():
    req = request.json

#TODO: filter books


