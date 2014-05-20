var gravatar = require('gravatar');
var db = require('./db');
var sha1 = require('sha1');


module.exports = function(app,io){

	app.get('/', function(req, res){ res.render('home'); }); //default displayed page
	app.get('/create', function(req,res){res.redirect('/chat');});
	app.get('/chat', function(req,res){res.render('chat');});
	app.get('/chat', function(req,res){req.session.user_id = items[0]._id;});

	app.post('/signup', function(req, res) {
		var toInsert = {};
		toInsert.user = req.body.signName;
		toInsert.password = sha1(req.body.signpw);
		console.log(toInsert);
		db.NewUserSignUp(toInsert, function(err) {
			if(err) throw err;else res.redirect('/');
		});
	});

	var chat = io.of('/socket').on('connection', function (socket) {
		socket.on('load',function(data){socket.emit('peopleinchat',{chat:true});});

		socket.on('login', function(data) {
			var toCheck = {};
			toCheck.user = data.user;
			toCheck.password = sha1(data.avatar);
			db.login(toCheck,function(err,docs){
				if(err || !docs) socket.emit('checkLogin', {login:false});
				else {
					socket.emit('checkLogin', {login:true});
					socket.avatar = gravatar.url(data.avatar, {s: '140', r: 'x', d: 'mm'});
					socket.emit('img', socket.avatar);
				}
			});			
		});

		socket.on('disconnect', function() {
			socket.broadcast.to(this.room).emit('leave', {
				boolean: true,
				room: this.room,
				user: this.username,
				avatar: this.avatar
			});
			socket.leave(socket.room);
		});

		socket.on('msg', function(data){
			// send message
			db.saveMsg({msg: data.msg, user: data.user , img: data.img},function(err){if(err) throw err});
			socket.broadcast.to(socket.room).emit('receive', {msg: data.msg, user: data.user, img: data.img});
		});
	});
};