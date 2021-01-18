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

@app.route('/api/authors/<author_id>/update', methods=['PUT'])
def update_author(author_id):
    get_author = """select * from authors where author_id = %s limit 1"""
    author = execute_statement(get_author, (author_id,), True, False)
    if not author:
        return jsonify({'status': False, 'message': 'Author does not exists.' }), 200

    update = {**author, **request.json.data}
    statement = "update authors set "
    for key in update:
        if key is 'author_id':
            continue        
        statement += key + ' = ' + ' %s, '
    statement = statement[:len(statement) - 2] + " where (author_id = %s)"
    params = tuple(author[key] for key in update if key is not 'author_id') + (author['author_id'],)
    status = execute_statement(statement, params, False)
    return jsonify({'status': status }), 200







@app.route('/api/birthplaces/<bp_id>', methods=['GET'])
def get_birthplace_with_id(bp_id):
    statement = """select * from birthplaces
                        where (birthplace_id = %s)"""
    birthplace = execute_statement(statement, (bp_id,), True, False)
    if birthplace:
        return jsonify({'status': True, 'data': birthplace}), 200
    else:
        return jsonify({'status': False, 'message': "Birthplace not found."}), 200


@app.route('/api/birthplaces/search', methods=['POST'])
def search_birthplaces():
    value = request.json['value'].lower()
    print(request.json)
    statement = """select * from birthplaces
                    where lower(birthplace) like """ + "'%%" + '%s' + "%%'"
    data = execute_statement(statement, (AsIs(value),), True)
    if data:
        return jsonify({"status": True, "data": data}), 200
    else:
        return jsonify({"status": False, "message": "Could not found."})


#TODO: filter authors