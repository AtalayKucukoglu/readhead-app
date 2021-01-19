from psycopg2.extensions import AsIs
from server.db.connection import execute_statement
from app import app
from flask import jsonify, request, abort
from server.authentication import is_authenticated, token_required, is_token_valid

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
    print(data)
    if data:
        return jsonify({"status": True, "data": data}), 200
    else:
        return jsonify({"status": False, "message": "Could not find."})


@app.route('/api/books/create', methods=['POST'])
@token_required
def create_book():
    data = request.json['data']
    print("---------------------")
    print(data)
    # check if author id is present in request.data
    if 'author_id' not in data:
        return jsonify({'status': False, 'message': 'Author id is not set.' })
    get_author = "select * from authors where author_id = %s"
    author = execute_statement(get_author, (data['author_id'], ), True, False)
    print("---------------------")
    print("author: ", author)
    if not author or 'author_id' not in author:
        return jsonify({'status': False, 'message': 'Author id is not valid.' })
    # author id is valid here
    # create the book
    statement = """insert into books (title, pages, publish_date)
                            values (%s, %s, %s) returning book_id;"""
    params = (data['title'], data['pages'], data['publish_date'])
    book = execute_statement(statement, params, True, False)
    print("---------------------")
    print(book)
    # check if book is created succesfully
    if not book or 'book_id' not in book:
        return jsonify({'status': False, 'message': 'Book cannot be created' })
    # insert book_id author_id values to books_authors
    insert_statement = """insert into books_authors (book_id, author_id)
                            values (%s, %s);"""
    params = (book['book_id'], author['author_id'])
    print("---------------------")
    print(params)
    inserted = execute_statement(insert_statement, params)
    if not inserted:
        return jsonify({'status': False, 'message': 'Book is created but could not matched with author.' })
    else:
        return jsonify({'status': True, 'book_id': book['book_id'] }), 201


#TODO: filter books


@app.route('/api/books/<book_id>/update', methods=['PUT'])
@token_required
def update_book(book_id):
    get_book = """select * from books where book_id = %s limit 1"""
    book = execute_statement(get_book, (book_id,), True, False)
    if not book:
        return jsonify({'status': False, 'message': 'Book does not exists.' }), 200

    print("---------------------")
    print("request.data: ", request.json['data'])
    update = {**book, **request.json['data']}
    # if author is changed, delete it for now
    # we will deal with it after updating the books table
    if 'author_id' in update:
        del update['author_id']
    print("---------------------")
    print("update: ", update)

    statement = "update books set "
    for key in book:
        if key is 'book_id':
            continue
        statement += key + ' = ' + ' %s, '
    statement = statement[:len(statement) - 2] + " where (book_id = %s)"
    params = tuple(update[key] for key in update if key is not 'book_id') + (book['book_id'],)
    # update book
    status = execute_statement(statement, params, False)
    # check updates on book's author
    # this is done if book is succesfully updated and author id is sent in request
    if status and 'author_id' in request.json['data']:
        new_author_id = request.json['data']['author_id'] # from request
        # check if new author id from request is valid
        get_new_author_id = "select author_id from authors where author_id = %s"
        new_author = execute_statement(get_new_author_id, (new_author_id, ), True, False)
        print("---------------------")
        print("new author: ", new_author)
        if not new_author or 'author_id' not in new_author:
            return jsonify({'status': False, 'message': 'Author id is not valid.'})
        # new author id is valid here
        new_author_id = new_author['author_id']
        get_current_author_id = """select a.author_id from
                        books b join books_authors ba on b.book_id = ba.book_id
                            join authors a on ba.author_id = a.author_id
                                where (b.book_id = %s) limit 1;"""
        current_author = execute_statement(get_current_author_id, (book['book_id'], ), True, False)
        print("current author: ", current_author)
        # if book does not have an author or it is updated
        if not current_author or 'author_id' not in current_author or current_author['author_id'] != new_author_id:
            print("new author is assigning to the book")
            # match book and author inserting the relation to books_authors
            insert_statement = """update books_authors set author_id=%s where book_id = %s;"""
            inserted = execute_statement(insert_statement, (new_author_id, book['book_id']))
            if not inserted:
                return jsonify({'status': False, 'message': 'Cannot match the book and the author.'})

    return jsonify({'status': status }), 200


@app.route('/api/books/delete', methods=['DELETE'])
@token_required
def delete_book():
    if 'book_id' not in request.json:
        return jsonify({"status": False, "message": "Book id is missing."})
    
    statement = """delete from books where book_id = %s"""
    status = execute_statement(statement, (request.json['book_id'],))
    if status:
        return jsonify({"status": True}), 200
    else:
        return jsonify({"status": False, "message": "Could not delete book."})

