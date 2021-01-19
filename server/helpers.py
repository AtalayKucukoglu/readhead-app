import psycopg2
from psycopg2.extras import RealDictCursor
from server.db.connection import execute_statement,  dsn

def get_user(username=None, user_id=None):
    if not username and not user_id:
        return None
    with psycopg2.connect(dsn) as connection:
        cursor = connection.cursor(cursor_factory=RealDictCursor)
        if user_id:
            statement = """SELECT * FROM users WHERE (user_id = %s)"""
            cursor.execute(statement, (user_id,))
        else:
            statement = """SELECT * FROM users WHERE (username = %s)"""
            cursor.execute(statement, (username,))
        user = cursor.fetchone()
        cursor.close()
        if user:
            user['birth_date'] = user['birth_date'].strftime('%Y-%m-%d') if user['birth_date'] else None
            user['goal_start_date'] = user['goal_start_date'].strftime('%Y-%m-%d') if user['goal_start_date'] else None
            user['goal_end_date'] = user['goal_end_date'].strftime('%Y-%m-%d') if user['goal_end_date'] else None
        return user

def update_dict(current_dict, new_dict):
    updated = {}

    for key in current_dict:
        updated[key] = new_dict[key] if key in new_dict else current_dict[key]
    return updated
