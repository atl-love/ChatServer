var express = require('express'), app = express();
var port = process.env.PORT || 2014;
var io = require('socket.io').listen(app.listen(port));

require('./config')(app, io);
require('./routes')(app, io);

console.log('The chat server application is running on http://localhost:' + port);