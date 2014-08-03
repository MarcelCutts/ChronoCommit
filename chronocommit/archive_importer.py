"""
Pull filtered GitHub data into SQLite.

Usage:
    python import.py data data.sqlite3
"""

import json
import gzip
from os.path import join, isfile
from os import listdir

class JsonArchiveImporter(object):
    """Imports JSON archives (.json.gz) into a GithubLocationDB."""

    def __init__(self, db):
        self.db = db

    def import_archive(self, json_archive_filename):
        """
        Imports the gives .json.gz file into the database.

        The JSON file is expected to contain many records.
        """
        json_gz = gzip.open(json_archive_filename)

        # The GitHub Archive has a JSON object per line.
        # Therefore, the file is not valid JSON (as it does not
        # have [] at the start/end).
        # We therefore have to read them in one by one.
        json_objects = [self._line_to_dict(line) for line in json_gz]

        # _line_to_dict returns None for non-commit lines, so we need
        # to trim.
        json_objects = [obj for obj in json_objects if obj is not None]

        self.db.add_many(json_objects)

    def import_directory(self, json_archive_directory):
        """
        Imports a directory containing ONLY .json.gz files
        into the database.
        """
        for json_file in listdir(json_archive_directory):
            path = join(json_archive_directory, json_file)

            if isfile(path):
                self.import_archive(path)

    def _line_to_dict(self, line):
        """
        Checks the line to see if it is a commit.
        If so, parses the line for entry into the DB.

        Returns None if the line is not a commit.
        """
        json_object = json.loads(line)

        if self._is_commit(json_object):
            if json_object['actor_attributes'].has_key('location'):
                location = json_object['actor_attributes']['location']
            else:
                location = ''

            return {
                'location': location,
                'time': json_object['created_at']
            }
        else:
            return None

    @staticmethod
    def _is_commit(event_dict):
        """Returns True if the given dict is a commit event."""
        return event_dict['type'] == 'PushEvent'
