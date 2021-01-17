import psycopg2
from psycopg2.extras import RealDictCursor
from psycopg2.extensions import AsIs
from server.db.connection import execute_statement
from app import app
from flask import jsonify, request, abort

@app.route('/api/authors/<author_id>', methods=['GET'])
def get_author_with_id(author_id):
    statement = """select * from authors a
                    join birthplaces bp on bp.birthplace_id = a.birthplace_id
                        where (author_id = %s)"""
    author = execute_statement(statement, (author_id,), True, False)
    if author:
        return jsonify({'status': True, 'data': author})
    else:
        return jsonify({'status': False, 'message': "Author not found."})


@app.route('/api/authors/search', methods=['POST'])
def search_authors():
    value = request.json['value'].lower()
    statement = """select * from authors a
                    join birthplaces bp on bp.birthplace_id = a.birthplace_id
                        where lower(name) like """ + "'%%" + '%s' + "%%'"
    data = execute_statement(statement, (AsIs(value),), True)
    if data:
        return jsonify({"status": True, "data": data}), 200
    else:
        return jsonify({"status": False, "message": "Could not found."})

@app.route('/api/authors/<author_id>/books', methods=['GET'])
def get_books(author_id):
    statement = """select b.* from
                        books b join books_authors ba on b.book_id = ba.book_id
                            join authors a on ba.author_id = a.author_id
                                where a.author_id = %s"""
    data = execute_statement(statement, (author_id, ), True)
    if data:
        return jsonify({'status': True, 'data': data})
    else:
        return jsonify({'status': False, 'message': "Author books not found."})
#TODO: filter authors