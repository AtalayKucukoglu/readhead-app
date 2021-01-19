import psycopg2
from psycopg2.extras import RealDictCursor
from psycopg2.extensions import AsIs
from server.db.connection import execute_statement
from app import app
from flask import jsonify, request, abort
from server.authentication import is_authenticated, token_required, is_token_valid

@app.route('/api/authors/<author_id>', methods=['GET'])
def get_author_with_id(author_id):
    statement = """select * from authors a
                    join birthplaces bp on bp.birthplace_id = a.birthplace_id
                        where (author_id = %s)"""
    author = execute_statement(statement, (author_id,), True, False)
    if author:
        author['birth_date'] = author['birth_date'].strftime('%Y-%m-%d') if author['birth_date'] else None
        author['death_date'] = author['death_date'].strftime('%Y-%m-%d') if author['death_date'] else None
        return jsonify({'status': True, 'data': author})
    else:
        return jsonify({'status': False, 'message': "Author not found."})


@app.route('/api/authors/create', methods=['POST'])
@token_required
def create_author():
    data = request.json['data']
    print(data)
    statement = """insert into authors (name, gender, birthplace_id, birth_date, death_date)
                            values (%s, %s, %s, %s, %s) returning author_id;"""
    params = (data['name'], data['gender'], data['birthplace_id'], data['birth_date'], data['death_date'])
    author = execute_statement(statement, params, True, False)
    # author_id = execute_statement("""select author_id from author
    #                                 where (name = %s and gender = %s and birthplace_id = %s and birth_date = %s and death_date = %s);""")
    print(author)
    if author:
        return jsonify({'status': True, 'author_id': author['author_id'] }), 201
    else:
        return jsonify({'status': False })


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
@token_required
def update_author(author_id):
    get_author = """select * from authors where author_id = %s limit 1"""
    author = execute_statement(get_author, (author_id,), True, False)
    if not author:
        return jsonify({'status': False, 'message': 'Author does not exists.' }), 200

    print("---------")
    print(request.json)
    update = {**author, **request.json['data']}
    statement = "update authors set "
    for key in update:
        if key is 'author_id':
            continue        
        statement += key + ' = ' + ' %s, '
    statement = statement[:len(statement) - 2] + " where (author_id = %s)"
    params = tuple(update[key] for key in update if key is not 'author_id') + (author['author_id'],)
    status = execute_statement(statement, params, False)
    return jsonify({'status': status }), 200


@app.route('/api/authors/delete', methods=['DELETE'])
@token_required
def delete_author():
    if 'author_id' not in request.json:
        return jsonify({"status": False, "message": "Author id is missing."})

    statement = """delete from authors where author_id = %s"""
    status = execute_statement(statement, (request.json['author_id'],))
    if status:
        return jsonify({"status": True}), 200
    else:
        return jsonify({"status": False, "message": "Could not delete author."})




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