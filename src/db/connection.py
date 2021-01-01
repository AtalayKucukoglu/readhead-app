from psycopg2 import Error
import psycopg2
from psycopg2.extras import RealDictCursor

dsn = """   user='postgres'
            password='3334444'
            host='127.0.0.1'
            port='5432'
            dbname='books'  """


def execute_statement(statement, params, is_read_mode):
    with psycopg2.connect(dsn) as connection:
        cursor = connection.cursor(cursor_factory=RealDictCursor)
        cursor.execute(statement, params)
        data = {}
        if is_read_mode:
            data = cursor.fetchall()
        cursor.close()
        return data if is_read_mode else True


def db_connect():
    connection = None
    cursor = None
    try:
        # Connect to an existing database
        connection = psycopg2.connect(dsn)

        # Create a cursor to perform database operations
        cursor = connection.cursor()
        # Print PostgreSQL details
        print("PostgreSQL server information")
        print(connection.get_dsn_parameters(), "\n")
        # Executing a SQL query
        cursor.execute("SELECT version();")
        # Fetch result
        record = cursor.fetchone()
        print("You are connected to - ", record, "\n")

    except (Exception, Error) as error:
        print("Error while connecting to PostgreSQL", error)
    finally:
        if connection:
            cursor.close()
            connection.close()
            print("PostgreSQL connection is closed")
