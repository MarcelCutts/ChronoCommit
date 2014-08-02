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
        self.connection.execute("CREATE TABLE hourly_commite (country text, day int, hour int, commits int)")

    def _dict_to_sql_insert(self, commit_dict):
        """Converts a dict into an SQL statement for commits."""
        return "(\"%s\", \"%s\")" % (self._escape_quotes(commit_dict['location']), commit_dict['time'])

    @staticmethod
    def _escape_quotes(quoted_str):
        """Doubles double quotes if found in the string."""
        return "".join(["\"\"" if c == "\"" else c for c in quoted_str])

    def _save(self):
        """Saves changes."""
        self.connection.commit()

    @staticmethod
    def _chunk(list_to_chunk, chunk_size):
        """
        Yield successive equally-sized chunks from list

        Taken from http://stackoverflow.com/questions/312443/how-do-you-split-a-list-into-evenly-sized-chunks-in-python
        """
        for i in xrange(0, len(list_to_chunk), chunk_size):
            yield list_to_chunk[i:i+chunk_size]
