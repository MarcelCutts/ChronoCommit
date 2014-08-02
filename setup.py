"""
Create the database and process the data for use in the
ChronoCommit data visualisation.

Run python setup.py and grab a cup of coffee.

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
