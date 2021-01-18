from psycopg2.extensions import AsIs
from server.db.connection import execute_statement
from app import app
from flask import jsonify, request, abort

@app.route('/api/books/<book_id>', methods=['GET'])
def get_book_with_id(book_id):
    statement = """select b.*, a.* from
                        books b join books_authors ba on b.book_id = ba.book_id
                            join authors a on ba.author_id = a.author_id
                                where (b.book_id = %s);"""
    data = execute_statement(statement, (book_id,), True, False)
    if data:
        return jsonify({"status": True, "data": data}), 200
    else:
        return jsonify({"status": False, "message": "Book not found."})

@app.route('/api/books/search', methods=['POST'])
def search_books():
    value = request.json['value'].lower()
    print("SEARCH VALUE: ", value)
    statement = """select b.*, a.* from
                        books b join books_authors ba on b.book_id = ba.book_id
                            join authors a on ba.author_id = a.author_id
                                where lower(title) like """ + "'%%" + '%s' + "%%'"
    data = execute_statement(statement, (AsIs(value),), True)
    if data:
        return jsonify({"status": True, "data": data}), 200
    else:
        return jsonify({"status": False, "message": "Could not find."})

@app.route('/api/books/create', methods=['POST'])
def create_book():
    req = request.json

#TODO: filter books


@app.route('/api/books/<book_id>/update', methods=['PUT'])
def update_book(book_id):
    get_book = """select * from books where book_id = %s limit 1"""
    book = execute_statement(get_book, (book_id,), True, False)
    if not book:
        return jsonify({'status': False, 'message': 'Book does not exists.' }), 200

    update = {**book, **request.json.data}
    statement = "update books set "
    for key in update:
        if key is 'book_id':
            continue
        statement += key + ' = ' + ' %s, '
    statement = statement[:len(statement) - 2] + " where (book_id = %s)"
    params = tuple(book[key] for key in update if key is not 'book_id') + (book['book_id'],)
    status = execute_statement(statement, params, False)
    return jsonify({'status': status }), 200
