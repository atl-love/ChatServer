	// Routes needed to support MVC architecture

var express = require('express');
module.exports = function(app, io){

	// default initializations
	app.set('view engine', 'html');
	app.engine('html', require('ejs').renderFile);
	app.set('views', __dirname + '/views');
	app.use(express.static(__dirname + '/public')); 
	app.use(express.urlencoded());
	app.use(express.json());

	// set log level
	io.set('log level', 1);

};
