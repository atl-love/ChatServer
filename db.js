var mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/chatServer', function(err){
	if(err) {
		console.log(err);
	} else {
	}
});

//create new user schema
var newUserSchema = mongoose.Schema({
	user: String,
	password: String,
	timeStamp: {type: Date, default: Date.now}
});
var NewUser = mongoose.model('User', newUserSchema);

//create schema for chat
var chatSchema = mongoose.Schema({
	msg: String, 
	user: String, 
	img: String,
	timeStamp: {type: Date, default: Date.now}
});
var Chat = mongoose.model('Message', chatSchema);

//export function for New User, retrieving/saving messages, messages, and logging in
exports.login = function(data, cb){
	var query = NewUser.findOne(data);
	query.exec(function(err, docs){
		cb(err, docs);
	});
}
exports.NewUserSignUp = function(data, cb){
	var newUser = new NewUser({user: data.user, password: data.password});
	newUser.save(function(err){
		cb(err);
	});
}
exports.getOldMsgs = function(limit, cb){
	var query = Chat.find({});
	query.sort('-timeStamp').limit(limit).exec(function(err, docs){
		cb(err, docs);
	});
}
exports.saveMsg = function(data, cb){
	var newMsg = new Chat({msg: data.msg, user: data.user, img: data.img});
	newMsg.save(function(err){
		cb(err);
	});
};
