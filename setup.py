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

from chronocommit.db import GithubLocationDB
from chronocommit.archive_importer import JsonArchiveImporter

# Setup the database and add the data
db = GithubLocationDB.create('commits.db')
loader = JsonArchiveImporter(db)
loader.import_directory('data')

# Perform processing on the data to populate the rest of the tables.
db.process_commits()
