from psycopg2 import Error
import psycopg2
from psycopg2.extras import RealDictCursor
from configparser import SafeConfigParser


dsn = """   user='postgres'
            password='3334444'
            host='127.0.0.1'
            port='5432'
            dbname='books'  """


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
            elif window:
                data = cursor.fetch_all()[window[0]:window[1]]
            else:
                data = cursor.fetchone()

        cursor.close()
        return data if is_read_mode else True


def config(filename="db.ini", section="postgresql"):
    # create a parser
    parser = SafeConfigParser()
    # read config file
    parser.read(filename)
    print(filename)
    print(section)
    print(parser.has_section(section))
    
    # get section, default to postgresql
    db = {}
    if parser.has_section(section):
        params = parser.items(section)
        for param in params:
            db[param[0]] = param[1]
    else:
        raise Exception('Section {0} not found in the {1} file'.format(section, filename))

    return db

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
