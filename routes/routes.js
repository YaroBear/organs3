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
	name: {type: String, required: [true, "Name is required"]},
	username : {type: String, required: [true, "Username is required"], unique: true},
	password : {type: String, required: [true, "Password is required"]},
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

    var errors = {};

    User.findOne({ssn : request.SSN})
        .then(function(ssn) {
            if (ssn)
            {
                errors.ssnExists = "A user with that SSN already exists";
            }
            return User.findOne({username : request.username});
        }).then(function(username) {
            if (username)
            {
                console.log(username);
                errors.usernameExists = "A user with that username already exists";
            }
        }).then(function(){
            var isAdmin = false;
            if (request.code == undefined)
            {
                errors.permCode = "A system permission code is required";
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

            return newUser.validate().then(function() { return newUser; });
        }).catch(function(err) {
            errors.validationError = err;
        }).then(function(newUser) {
            if(errors.validationError || errors.permCode) {
                var error = {};
                error.message = 'Failed to add user';
                error.code = 400;
                error.errors = errors;
                throw error;
            }
                // save the user
                return newUser.save();
        }).then(function() {
            var Doctor = mongoose.model('doctors', doctorSchema);
            var newDoctor = Doctor({
            	name : request.name,
            	patients : []
            });

            return newDoctor.save().then(function() {return newDoctor;});
        }).catch(function(err){
        	throw err;
        }).then(function(){
        	res.status(201).send({ok: true, message: 'Added user successfully'});
        }).catch(function(err) {
			var errorCode = err.code || 500;
            res.status(errorCode).send({ok: false, message: err.message, errors: err.errors});
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