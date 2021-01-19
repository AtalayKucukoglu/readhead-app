from psycopg2 import Error
import psycopg2
from psycopg2.extras import RealDictCursor
from configparser import SafeConfigParser
import os

dsn = os.getenv('DSN')

def execute_statement(statement, params, is_read_mode=False, fetch_all=True, window=None):
    # params = config()
    # with psycopg2.connect(**params) as connection:
    with psycopg2.connect(dsn) as connection:
        cursor = connection.cursor(cursor_factory=RealDictCursor)
        cursor.execute(statement, params)
        data = {}
        if is_read_mode:
            if fetch_all:
                data = cursor.fetchall()
            # elif window:
            #     data = cursor.fetch_all()[window[0]:window[1]]
            else:
                data = cursor.fetchone()

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
