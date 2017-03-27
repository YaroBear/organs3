var express = require('express');
var router = express.Router();

var mongoose = require('mongoose');
var Schema = mongoose.Schema;
mongoose.Promise = Promise;

// connecting to Mlab
var mongodb_uri = process.env.MONGODB_URI;
mongoose.connect(mongodb_uri);

// models
var doctorSchema = new Schema({
	ssn : {
		type: String,
		validate: {
			validator: function(v) {
				return /\d{3}-\d{2}-\d{4}/.test(v);
			},
			message: "Please enter your SSN as xxx-xx-xxx"
		},
		required: [true, "Social Security number required"]
	},
	name : {
		type: String,
		required: [true, "A name is required"]
	},
	patients : []
});


var userSchema = new Schema({
	ssn : {
		type: String,
		unique: true,
		validate: {
			validator: function(v) {
				return /\d{3}-\d{2}-\d{4}/.test(v);
			},
			message: "Please enter your SSN as xxx-xx-xxx"
		},
		required: [true, "Social Security number required"]
	},
	name: {type: String, required: true},
	username : {type: String, required: true, unique: true},
	password : {type: String, required: true},
	admin : Boolean
});


// API Routes

router.get('/api/doctors', function(req, res) {
	var Doctors = mongoose.model('doctors', userSchema);
	Doctors.find(function(err, data){
		if(err)
			res.send(err);
		else
			res.json(data);
	});
});

router.post('/api/doctors', function(req, res) {
	console.log(req.body);
	var User = mongoose.model('users', userSchema);
	var request = {};
	// if req.body is empty (form is empty), use query parameters 
	// to test API without front end via Postman or regular xmlhttprequest
	if (Object.keys(req.body).length === 0 && req.body.constructor === Object)
	{	
		console.log("using req.query");
		request = req.query;
	}
	else
	{
		console.log("using req.body")
		request = req.body;
	}

	var duplicateErrors ={};

	User.findOne({ssn : request.SSN}, function(err, ssn){
		if (err) throw err;

		//if ssn exists, respond with message
		if (ssn)
		{
			var message = "A user with that SSN already exists";
			duplicateErrors.ssn = {};
			duplicateErrors.ssn.message = message;
		}

		User.findOne({username : request.username}, function(err, username){
			if (username)
			{
				var message = "A user with that username already exists";
				duplicateErrors.username = {};
				duplicateErrors.username.message = message;
			}
		});
	}).then(function(){

		var codeErrors = {};
		var isAdmin = false;

		if (request.code == undefined)
		{
			codeErrors.message = "A system permission code is required";
		}
		else if (request.code == "1234")
		{
			isAdmin = true;
		}

		// create a new user
		var newUser = User({
			ssn : request.SSN,
			name : request.name,
			username : request.username,
			password : request.password,
			admin : isAdmin
		});


		newUser.validate(function (err){
			if (err)
			{	
				res.send(err);
			}
			else
			{
			// save the user
			newUser.save(function(err) {
				if (err)
				{
					console.log(err);
					res.json(err);
				}
				else
				{
					res.json("User Created")
					console.log("User Created");
				}
			});
			}
		});
	});
});






//Angular Routes

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index');
});

/* GET register page. */
router.get('/register', function(req, res, next) {
  res.render('register');
});


module.exports = router