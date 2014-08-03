"""
Create the database and process the data for use in the
ChronoCommit data visualisation.

Run `python setup.py` and grab a cup of coffee.

You will need to have pulled some .json.gz files from
the GitHub Archive (http://githubarchive.org/) before
you run this. The data should be in the /data directory.

Run this script if:
- You haven't run it before.
- The data has changed.
"""

from argparse import ArgumentParser
import json
from os.path import join

from chronocommit.db import GithubLocationDB
from chronocommit.archive_importer import JsonArchiveImporter

parser = ArgumentParser(description='Performs setup tasks for ChronoCommit')
parser.add_argument('commands', nargs='*', default=['import', 'process', 'json'], help='Any of: import process json')
args = parser.parse_args()

# Setup the database and add the data
if 'import' in args.commands:
    print "Importing data from ./data into ./commits.db"
    db = GithubLocationDB.create('commits.db')
    loader = JsonArchiveImporter(db)
    loader.import_directory('data')
else:
    db = GithubLocationDB('commits.db')


# Perform processing on the data to populate the rest of the tables.
if 'process' in args.commands:
    print "Caching calculations for visualisation"
    db.process_commits()

# Output the results required for visualisation to a JSON file.
if 'json' in args.commands:
    print "Exporting JSON to app/assets/hourly_commits.json"
    hourly_commits = db.export_table('hourly_commits')
    with open(join('app', 'assets', 'hourly_commits.json'), 'w') as json_file:
        json.dump(hourly_commits, json_file)

db.close()
