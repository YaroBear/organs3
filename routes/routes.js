var express = require('express');
var router = express.Router();

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// connecting to Mlab
var mongodb_uri = process.env.MONGODB_URI;
mongoose.connect(mongodb_uri);

/*
var doctorSchema = new Schema({
	ssn : {
		type: String,
		validate: {
			validator: function(v) {
				return /\d{3}-\d{2}-\d{4}/.test(v);
			},
			message: "{VALUE} is not a valid SSN"
		},
		required: [true, "Social Security number required"]
	},
	name : {
		type: String,
		required: [true, "A name is required"]
	},
	patients : []
});
*/


var doctorSchema = new Schema({
	ssn: {type :String, required: true},
	name: {type :String, required: true},
	patients: []
});


var userSchema = new Schema({
	ssn : {type: String, required: true, unique: true},
	name: {type: String, required: true},
	username : {type: String, required: true, unique: true},
	password : {type: String, required: true},
	admin : Boolean
});


// API Routes

router.get('/api/doctors', function(req, res) {
	Doctors.find(function(err, data){
		if(err)
			res.send(err);
		else
			res.json(data);
	});
});

router.post('/api/doctors', function(req, res) {
	console.log(req.body);
	var User = mongoose.model('User', userSchema);
	var request = req.body;
	var isAdmin = false;

	// is request code is 1234, then user is an admin
	if (request.code == "1234")
	{
		isAdmin = true;
	}

	if (request.code == "4321" || request.code == "1234")
	{
		// create a new user
		var newUser = User({
			ssn : request.SSN,
			name : request.name,
			username : request.username,
			password : request.password,
			admin : isAdmin
		});

		// save the user
		newUser.save(function(err) {
			if (err) throw err;
			else
			{
				console.log("User Created");
			} 
		});
	}
	else
	{
		res.send("Permission code is incorrect");
		console.log("A person who is not an admin or doctor is requesting access");
	}
	if (request.code == "4321")
	{
		// create a new doctor
		var Doctor = mongoose.model('Doctors', doctorSchema);
		var newDoctor = Doctor({
			ssn: request.SSN,
			name : request.name,
			patients: []
		});

		// save the new doctor
		newDoctor.save(function(err) {
			if (err) throw err;
			else
			{
				console.log("New Doctor added")
			}
		});
	}
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


module.exports = router;
