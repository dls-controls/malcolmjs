require('./test-malcolm-server');
var express = require('express');
var path = require('path');
var serveStatic = require('serve-static')

var app = express()

app.use(serveStatic(path.resolve('./build'), {'index': ['index.html', 'index.htm']}))
app.listen(3030)