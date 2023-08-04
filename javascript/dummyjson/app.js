const fs = require('fs');
const express = require('express');
const dummyjson = require('dummy-json');

const template = fs.readFileSync('template.hbs', { encoding: 'utf8' });
const app = express();

app.get('/api/people', function(req, res) {
  res.set('Content-Type', 'application/json');
  res.status(200).send(dummyjson.parse(template));
});

app.listen(3000);
