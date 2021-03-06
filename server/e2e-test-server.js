var testServer = require('./test-malcolm-server');
var express = require('express');
var path = require('path');
var serveStatic = require('serve-static')

var app = express()

app.use(serveStatic(path.resolve('./build'), {'index': ['index.html', 'index.htm']}))



app.get('/settings.json', function (req, res) {
  res.sendFile(path.resolve('./build/settings.json'));
});

app.get('/reset', function (req, res) {
  testServer.resetServer();
  res.status(200).send('server reset');
});

app.get('/*', function (req, res) {
  res.sendFile(path.resolve('./build/index.html'));
});

app.listen(3030)