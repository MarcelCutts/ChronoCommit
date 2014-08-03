# When do countries commit the most?

We took a week's worth of commits from the [GitHub Archive](http://githubarchive.org) and found out where they came from and when they were done. Countries are coloured based on how many commits were done, relative to the country's maximum commits per hour.

Data processing was completed with Python and SQLite. The visualisation uses [Datamaps](http://datamaps.github.io/) with support from [AngularJS](https://angularjs.org/).

This visualisation was created as part of the [Third Annual GitHub Data Challenge](https://github.com/blog/1864-third-annual-github-data-challenge) because GitHub is awesome and so are public data sets. We encourage you to poke around the code and contribute!

## Getting Up And Running

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
