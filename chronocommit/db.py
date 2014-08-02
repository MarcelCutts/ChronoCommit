"""
Database interface for the ChronoCommit project.
"""

import sqlite3
from os.path import isfile
from os import remove

class GithubLocationDB(object):
    """Provides information on the locations of commits."""

    @staticmethod
    def create(filename):
        """
        Creates a SQLite database at the given file,
        pre-populated with the schema for the DB.

        Deletes the DB if it already exists.

        Returns the created DB.
        """
        if isfile(filename):
            remove(filename)

        db = GithubLocationDB(filename)
        db.create_schema()
        return db

    def __init__(self, filename):
        """Opens the database at the given filename."""
        self.connection = sqlite3.connect(filename)

    def add_many(self, records):
        """Adds a collection of records to the DB."""
        query = "INSERT INTO 'commits' ('location', 'time') VALUES "
        values = [self._dict_to_sql_insert(d) for d in records]

        # There is an upper limit on the number of records that can be
        # inserted (500). As a result, we break the query into chunks.
        chunked_values = list(self._chunk(values, 500))
        chunked_values = [",".join(l) for l in chunked_values]
        chunked_queries = [query + values for values in chunked_values]

        try:
            for chunked_query in chunked_queries:
                self.connection.execute(chunked_query)
        except sqlite3.OperationalError as exception:
            print("Query threw exception:\n\t%s\nQuery:\n\t%s" % (exception.message, chunked_query))

        self._save()

    def create_schema(self):
        self.connection.execute("CREATE TABLE commits (location text, time integer)")
        self.connection.execute("CREATE TABLE locations (location text, country text)")
        self.connection.execute("CREATE TABLE hourly_commits (country text, day int, hour int, commits int)")

    def process_commits(self):
        """
        Performs processing on the data to cache results
        needed for the visualisation.
        """
        # Convert locations to countries
        locations = [row[0] for row in self.connection.execute("SELECT DISTINCT location FROM commits")]
        # TODO: Make the magic happen
        countries = [{'location': loc, 'country': ''} for loc in locations]

    def _insert_into(self, table_name, values_dict):
        """Inserts the given iterable of dicts into the table."""

        # Guard against more than 500 values by recursion
        if len(values_dict) > 500:
            chunked_values = list(self._chunk(values_dict, 500))
            for chunk in chunked_values:
                self._insert_into(table_name, chunk)
        else:
            query = "INSERT INTO " + table_name
            column_names = values_dict.keys()
            query += " (" + ",".join(column_names) + ") VALUES "

            value_strings = []
            for datum in values_dict:
                value_list = [self._escape_quotes(datum[column_name]) for column_name in column_names]
                value_strings.append("(\"" + "\",\"".join(value_list) + "\")")
            query += ",".join(value_strings)

            try:
                self.connection.execute(query)
                self._save()
            except sqlite3.OperationalError as exception:
                print "Query threw exception:\n\t%s\nQuery:\n\t%s" % (exception.message, query)


    def _save(self):
        """Saves changes."""
        self.connection.commit()

    @staticmethod
    def _escape_quotes(quoted_str):
        """Doubles double quotes if found in the string."""
        return "".join(["\"\"" if c == "\"" else c for c in quoted_str])

    @staticmethod
    def _chunk(list_to_chunk, chunk_size):
        """
        Yield successive equally-sized chunks from list

        Taken from http://stackoverflow.com/questions/312443/how-do-you-split-a-list-into-evenly-sized-chunks-in-python
        """
        for i in xrange(0, len(list_to_chunk), chunk_size):
            yield list_to_chunk[i:i+chunk_size]
