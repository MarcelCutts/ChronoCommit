"""
Database interface for the ChronoCommit project.
"""

import sqlite3
from os.path import isfile
from os import remove

from chronocommit import country_finder

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

    @staticmethod
    def dict_factory(cursor, row):
        """Used by sqlite3 to generate dicts instead of lists."""
        d = {}
        for idx, col in enumerate(cursor.description):
            d[col[0]] = row[idx]
        return d

    def __init__(self, filename):
        """Opens the database at the given filename."""
        self.connection = sqlite3.connect(filename)
        self.connection.row_factory = self.dict_factory

    def close(self):
        self._save()
        self.connection.close()

    def add_many(self, records):
        """Adds a collection of records to the DB."""
        self._insert_into('commits', records)

    def create_schema(self):
        self.connection.execute("CREATE TABLE commits (location text, time integer)")
        self.connection.execute("CREATE TABLE locations (location text, country text)")
        self.connection.execute("CREATE TABLE hourly_commits (country text, day int, hour int, commits int)")

    def process_commits(self):
        """
        Performs processing on the data to cache results
        needed for the visualisation.
        """
        self._refresh_countries()
        self._refresh_hourly_commits()

    def export_table(self, table_name):
        """Exports all rows from the given table"""
        return self.connection.execute("SELECT * FROM " + table_name + " WHERE country <> ''").fetchall()

    def _refresh_countries(self):
        """Populates the locations table"""
        # Wipe out anything that's already there
        self.connection.execute("DELETE FROM locations WHERE 1")

        # Convert locations to countries
        locations = [row['location'] for row in self.connection.execute("SELECT DISTINCT location FROM commits")]
        countries = [{'location': loc, 'country': country_finder.get_country_code(loc)} for loc in locations]
        self._insert_into('locations', countries)

    def _refresh_hourly_commits(self):
        self.connection.execute("DELETE FROM hourly_commits WHERE 1")
        self.connection.execute("""
        INSERT INTO hourly_commits (country, day, hour, commits)
        SELECT country, strftime('%w', time) as day, strftime('%H', time) as hour, COUNT(*) AS commits
        FROM commits c
        INNER JOIN locations l on c.location = l.location
        GROUP BY country, day, hour
        ORDER BY commits desc
        """)

    def _insert_into(self, table_name, values_dict):
        """
        Inserts the given iterable of dicts into the table.

        This function chunks the values up if necessary to fit within
        the 500-row limit of SQLite on INSERTs.

        The first dict is used to determine the keys used in the INSERT.
        """

        # Guard against more than 500 values by recursion
        if len(values_dict) > 500:
            chunked_values = list(self._chunk(values_dict, 500))
            for chunk in chunked_values:
                self._insert_into(table_name, chunk)
        else:
            query = "INSERT INTO " + table_name
            column_names = values_dict[0].keys()
            query += " (" + ",".join(column_names) + ") VALUES "

            value_strings = []
            for datum in values_dict:
                value_list = [self._escape_quotes(datum[column_name]) for column_name in column_names]
                value_strings.append("(\"" + "\",\"".join(value_list) + "\")")
            query += ",".join(value_strings)

            try:
                self.connection.execute(query)
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
