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
        return user

