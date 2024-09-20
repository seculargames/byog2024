#!/usr/bin/env node 

const ghpages = require('gh-pages');

ghpages.publish('../build', { nojekyll: true}, function(err) {
    console.log(err);
})
