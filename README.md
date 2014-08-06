# When do countries commit the most?

We took a week's worth of commits from the [GitHub Archive](http://githubarchive.org) and found out where they came from and when they were done. Countries are coloured based on how many commits were done, relative to the country's maximum commits per hour.

Data processing was completed with Python and SQLite. The visualisation uses [Datamaps](http://datamaps.github.io/) with support from [AngularJS](https://angularjs.org/).

This visualisation was created as part of the [Third Annual GitHub Data Challenge](https://github.com/blog/1864-third-annual-github-data-challenge) because GitHub is awesome and so are public data sets. We encourage you to poke around the code and contribute!

[Check it out now.](http://asgardenterprises.github.io/ChronoCommit/)

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

You should then have a service on `http://localhost:8000/app/index.html`

## Updating the project page
A version of the visualisation lives on the ChronoCommit project page at `http://asgardenterprises.github.io/ChronoCommit/)`; this mirrors the content of the gh-pages branch.

To update this, or replace current content:
1. Gather all the client side code. Currently, this is the contents of /app.
2. Ensure all the client side dependencies are present (e.g. bower install).
3. Ensure an index.html file is available at the top level for GH to digest.
4. Push the all the client side content to the gh-pages branch.
5. Wait up to 10 minutes for the changes to manifest.
