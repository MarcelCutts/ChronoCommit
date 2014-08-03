# When do countries commit the most?

We took a week's worth of commits from the GitHub Archive and found out where they came from and when they were done. Countries are coloured based on how many commits were done, relative to the country's maximum commits per hour.

Data processing was completed with Python and SQLite. The data is available in JSON format on our GitHub. The visualisation uses Datamaps with support from AngularJS.

This visualisation was created as part of the Third Annual GitHub Data Challenge because GitHub is awesome and so are public data sets. The project is on GitHub and we encourage you to poke around the code and contribute!

## How to use
Run the following commands:

```
mkdir data
cd data
wget http://data.githubarchive.org/2014-07-{01..08}-{0..23}.json.gz
cd ..
npm install
python setup.py
npm start
```

You should then have a service on http://localhost:8000/app/index.html
