var express = require('express');
var router = express.Router();


//authentication
var app = express();
var jwt = require('jsonwebtoken');
app.set('superSecret', process.env.SECRET);
app.set('doctorSecret', process.env.DOCTOR_SECRET);


var mongoose = require('mongoose');
var Schema = mongoose.Schema;
mongoose.Promise = Promise;

// connecting to Mlab
var mongodb_uri = process.env.MONGODB_URI;
mongoose.connect(mongodb_uri);




//******************************
//******************************
//***********SCHEMAS************
//******************************
//******************************
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
			message: "Please enter your SSN as xxx-xx-xxxx"
		},
		required: [true, "Social Security number required"]
	},
	name: {type: String, required: [true, "Name is required"]},
	username : {type: String, required: [true, "Username is required"], unique: true},
	password : {type: String, required: [true, "Password is required"]},
	admin : Boolean
});


//HOSPITAL SCHEMA
var hospitalSchema = new Schema({
	name: {type: String, required: [true, "Please provide the hospital name"]},
	address : {
		street : {type: String, required: [true, "Please provide the hospital street address"]},
		city: {type: String, required: [true, "Please provide the hospital city"]},
		state: {type: String, required: [true, "Please select a state"]},
		zip: {type: String, required: [true, "Please provide the hospital zipcode"]},
		region: {type: String, required: [true, "Please select a region"]},
	},
	phone : {type: String, required: [true, "Please provide the hospital phone number"]},
	procedures : Array,
	doctors : Array
});


//DONOR SCHEMA
//issues:
//-drop down menu values
//-how do we associate doctors or hospitals with donors?
//-do you think we need all of the attributes to be required? or are there any we let be NULL?
var donorSchema = new Schema({
    ssn : {
        type: String,
        unique: true,
        validate: {
            validator: function(v) {
                return /\d{3}-\d{2}-\d{4}/.test(v);
            },
            message: "Please enter your SSN as xxx-xx-xxxx"
        },
        required: [true, "Social Security number required"]
    },
    name: {
        firstName : {type: String, required: [true, "First name is required"]},
        lastName: {type: String, required: [true, "Last Name is required"]}
    },

    address : {
        street : {type: String, required: [true, "Street address is required"]},
        city: {type: String, required: [true, "City is required"]},

        state: {type: String, required: [true, "Please choose a state"]},
        zip: {type: String, required: [true, "Zip code is required"]},

    },

    dateAdded: {type: Date, required: [true, "Date is required"]},
    HLAType: {type: String, required: [true, "HLA type is required"]},
    height: {type: String, required: [true, "height is required"]},
    weight: {type: String, required: [true, "weight is required"]},

    sex: {type: String, required: [true, "Please enter patient sex"]},
    organType: {type: String, required: [true, "Please select an organ type"]},
    bloodType: {type: String, required: [true, "Please select a blood type"]},
    organType: {type: String, required: [true, "Please select an organ type"]},
    deceased: {type: String, required: [true, "Is the donor deceased?"]},

});



//RECIPIENT SCHEMA
//issues:
//-drop down menu values
//-how do we associate doctors or hospitals with recipients?
//-should medical urgency be a 1-10 scale with a drop down menu or something else?
//-do you think we need all of the attributes to be required? or are there any we let be NULL?
var recipientSchema = new Schema({
    ssn : {
        type: String,
        unique: true,
        validate: {
            validator: function(v) {
                return /\d{3}-\d{2}-\d{4}/.test(v);
            },
            message: "Please enter your SSN as xxx-xx-xxxx"
        },
        required: [true, "Social Security number required"]
    },
    name: {
        firstName : {type: String, required: [true, "First name is required"]},
        lastName: {type: String, required: [true, "Last Name is required"]}
    },

    address : {
        street : {type: String, required: [true, "Street address is required"]},
        city: {type: String, required: [true, "City is required"]},

        //state: {type: String, required: [true, "Please select a state"]},

        zip: {type: String, required: [true, "Zip code is required"]},

    },

    dateAdded: {type: Date, required: [true, "Date is required"]},
    HLAType: {type: String, required: [true, "HLA type is required"]},
    height: {type: String, required: [true, "height is required"]},
    weight: {type: String, required: [true, "weight is required"]}

    //***********************************
    //needs sex from dropdown menu
    //needs bloodType from dropdown menu
    //needs organType from dropdown menu
    //needs medical urgency from dropdown menu
    //***********************************

});

var Hospitals = mongoose.model('hospitals', hospitalSchema);

var Doctors = mongoose.model('doctors', doctorSchema);

var Donors = mongoose.model('donors', donorSchema);

var Recipients = mongoose.model('recipients', recipientSchema);


//******************************
//******************************
//***** PUBLIC API ROUTES*******
//******************************
//******************************

router.get('/api/hospitals/names', function(req, res){
    Hospitals.find({}, {name: 1}, function(err, data){
        if (err)
            res.send(err);
        else
            res.json(data);
    });
});


router.post('/api/register', function(req, res) {
    //console.log(req.body);
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
            else
            {
            	return newUser.save().then(function() {return newUser;});
            }
        }).catch(function(err){
    	    var error = {};
            error.message = err.message;
            error.code = 400;
            error.errors = errors;
            throw error;
        }).then(function(newUser) {
        	var newDoctor = new Doctors({
        		_id : newUser._id,
        		name : newUser.name
        	});

        	return newDoctor.save().then(function() {return newUser;});
        
        }).then(function(newUser) {
        	Hospitals.findOneAndUpdate({"_id": request.selectedHospital._id}, {$push:{doctors: newUser._id}}).then(function() {return Hospitals});
        }).then(function(Hospitals){
            res.status(201).send({ok: true, message: 'Added user successfully'});
        }).catch(function(err) {
			var errorCode = err.code || 500;
            res.status(errorCode).send({ok: false, message: err.message, errors: err.errors});
        });
    });



//user authentication
router.post('/api/authenticate', function(req, res) {
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
        console.log("using req.body");
        request = req.body;
    }

    var errors = {};

    console.log(request.username);

    if(request.username == null)
    {
        errors.usernameError = {message : "Please enter your username"};
    }
    if(request.password == null)
    {
        errors.passwordError = {message : "Please enter your password"};
    }


    if (request.username && request.password){

        User.findOne({
            username: request.username
        }, function(err, user) {

            //console.log(user.username);
            if(err) throw err;

            if(!user){
                errors.usernameError = { message: 'Authentication failed. User not found.' };
                res.status(401).send({success: false, errors});
            } else if (user) {

                //check password
                if (user.password != request.password){
                    errors.passwordError = { message: 'Authentication failed. Wrong password.' };
                   res.status(401).send({success: false, errors});
                } else {

                    if (user.admin){

                        //if user is found and password is correct generate token
                        var token = jwt.sign(user, app.get('superSecret'), {
                            expiresIn: 60*60
                        });
                    

                        //return message and token
                        res.json({
                            success: true,
                            message: 'Admin Login successful',
                            token: token,
                            user : user.name,
                            userType : "admin",
                            mongo_id : user._id
                        });
                    }
                    else{
                        
                        var token = jwt.sign(user, app.get('doctorSecret'), {
                            expiresIn: 60*60
                        });

                        res.json({
                            success: true,
                            message: 'Doctor Login successful',
                            token: token,
                            user : user.name,
                            userType : "doctor",
                            mongo_id : user._id
                        });
                    }
                }
            }
        });
    }
     else
        {
            res.status(400).send({success: false, errors});
        }
});

//******************************
//******************************
//***PUBLIC ANGULAR ROUTES******
//******************************
//******************************

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index');
});

/* GET register page. */
router.get('/register', function(req, res, next) {
  res.render('register');
});


/* GET login page. */
router.get('/authenticate', function(req, res, next) {
  res.render('authenticate');
});



//******************************
//******************************
//** PROTECTED ADMIN ROUTES*****
//******************************
//******************************

// admin JWT checker

router.use('/admin/',function(req, res, next) {

  // check header or url parameters or post parameters for token
  var token = req.body.token || req.query.token || req.headers['x-access-token'];

  // decode token
  if (token) {

    // verifies secret and checks exp
    jwt.verify(token, app.get('superSecret'), function(err, decoded) {      
      if (err) {
        return res.json({ success: false, message: 'Failed to authenticate token.' });    
      } else {
        // if everything is good, next()
        req.decoded = decoded;
        
        next();
      }
    });
    }
    else
    {
        return res.status(403).send({
            success: false,
            message: "No token provided"
        });
    }
});

// put apis you want to secure with admin token here VVVVVVV

router.get('/admin/api/hospitals', function(req, res){
    Hospitals.find(function(err, data){
        if (err)
            res.send(err);
        else
            res.json(data);
    });
});

//ADD HOSPITAL ROUTE
router.post('/admin/api/hospitals', function(req, res) {
    //console.log(req.body);
    var Hospital = mongoose.model('hospitals', hospitalSchema);
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

    console.log(request);

    Hospitals.findOne({
        $or: [
            {address : {street: request.street}},
            {name: request.name}
        ]
    },function(err, hospital) {
        console.log(err);
        if (err) throw err;
        if (hospital)
        {
            errors.HospitalExists = "A hospital with this name or address already exists";
        }

        }).then(function(){
            var newHospital = new Hospital({
            name : request.name,
            address : {
                street : request.street,
                city : request.city,
                state : request.state,
                zip : request.zip,
                region : request.region,
            },
            phone : request.phoneNumber,
            procedures : [],
            doctors: []
            });

            return newHospital.validate().then(function() { return newHospital; });

        }).catch(function(err) {
            errors.validationError = err;
        }).then(function(newHospital){
            if (errors.validationError || errors.HospitalExists)
            {
                throw errors;
            }
            else
            {
                newHospital.save().then(function() { return newHospital; });
            }
        }).then(function(newHospital){
            console.log(newHospital);
            res.status(201).send({ok: true, message: 'Hospital added successfully'});
        }).catch(function(err) {
            res.status(500).send({success: false, errors});
        });
});



/*GET addHospital page. */
router.get('/admin/addHospital', function(req, res, next) {
  res.render('addHospital');
});


/* GET register page. */
router.get('/admin/home', function(req, res, next) {
  res.render('admin');
});



//******************************
//******************************
//*** PROTECTED DOCTOR ROUTES***
//******************************
//******************************

//token verifying middleware for requests sent to doctor apis
router.use('/doctor/', function(req, res, next) {

  // check header or url parameters or post parameters for token
  var token = req.body.token || req.query.token || req.headers['x-access-token'];

  // decode token
  if (token) {


    // verifies secret and checks exp
    jwt.verify(token, app.get('doctorSecret'), function(err, decoded) {      
      if (err) {
        return res.json({ success: false, message: 'Failed to authenticate token.' });    
      } else {
        // if everything is good, next()
        req.decoded = decoded;
        
        next();
      }
    });
    }
    else
    {
        return res.status(403).send({
            success: false,
            message: "No token provided"
        });
    }
});

//ADD RECIPIENT ROUTE
router.post('/doctor/api/recipients', function(req, res) {
    //console.log(req.body);
    var Recipient = mongoose.model('recipients', recipientSchema);
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

    Recipient.findOne({ssn : request.SSN})
        .then(function(ssn) {
            if (ssn)
            {
                errors.ssnExists = "A recipient with that SSN already exists";
            }

        }).then(function(){


            // create a new recipient
            //drop down attributes not working
            var newRecipient = Recipient({
                ssn : request.ssn,
                name : {
                firstName : request.firstName,
                lastName : request.lastName},

                address : {
                street : request.street,
                city : request.city,
                //state : request.state,
                zip : request.zip},


                dateAdded : new Date(Date.now()),



                //bloodType : request.bloodType,
                HLAType : request.HLAType,
                organSize : request.organSize,
                //urgency : request.urgency,
                height : request.height,
                weight : request.weight

            });

            return newRecipient.validate().then(function() { return newRecipient; });
        }).catch(function(err) {
            errors.validationError = err;
        }).then(function(newRecipient) {
            if(errors.validationError) {
                var error = {};
                error.message = 'Failed to add recipient';
                error.code = 400;
                error.errors = errors;
                throw error;
            }
            else
            {
                return newRecipient.save().then(function() {return newRecipient;});
            }
        }).catch(function(err){
            var error = {};
            error.message = err.message;
            error.code = 400;
            error.errors = errors;
            throw error;
        }).catch(function(err) {
            var errorCode = err.code || 500;
            res.status(errorCode).send({ok: false, message: err.message, errors: err.errors});
        });
    });

//ADD DONOR ROUTE
router.post('/doctor/api/donors', function(req, res) {
    //console.log(req.body);
    var Donor = mongoose.model('donors', donorSchema);
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

    console.log(request);

    var errors = {};

    Donor.findOne({ssn : request.SSN})
        .then(function(ssn) {
            if (ssn)
            {
                errors.ssnExists = "A donor with that SSN already exists";
            }
        }).then(function(){


            // create a new donor
            //drop down attributes not working
            var newDonor = Donor({
                ssn : request.ssn,
                name : {
                firstName : request.firstName,
                lastName : request.lastName},

                address : {street : request.street,
                city : request.city,
                state : request.selectedState,
                zip : request.zip},



                dateAdded : new Date(Date.now()),

                sex : request.selectedSex,
                height : request.height,
                weight : request.weight,


                organType : request.selectedOrganType,
                bloodType : request.selectedBloodType,
                HLAType : request.HLAType,
                organSize : request.organSize,
                deceased : request.selectedDeceased,

            });

            return newDonor.validate().then(function() { return newDonor; });
        }).catch(function(err) {
            errors.validationError = err;
        }).then(function(newDonor) {
            if(errors.validationError) {
                var error = {};
                error.message = 'Failed to add user';
                error.code = 400;
                error.errors = errors;
                throw error;
            }
            else
            {
                return newDonor.save().then(function() {return newDonor;});
            }
        }).catch(function(err){
            var error = {};
            error.message = err.message;
            error.code = 400;
            error.errors = errors;
            throw error;
        }).then(function(newDonor) {
            Doctors.findOneAndUpdate({"_id": request.doctor_id}, {$push:{patients: newDonor._id}}).then(function() {return Doctors});
        }).catch(function(err) {
            var errorCode = err.code || 500;
            res.status(errorCode).send({ok: false, message: err.message, errors: err.errors});
        });
    });

router.get('/doctor/api/hospitals', function(req, res){
    Hospitals.find(function(err, data){
        if (err)
            res.send(err);
        else
            res.json(data);
    });
});


router.get('/doctor/api/doctors', function(req, res) {
    Doctors.find(function(err, data){
        if(err)
            res.send(err);
        else
            res.json(data);
    });
});


router.get('/doctor/api/donors', function(req, res) {
    Donors.find(function(err, data){
        if(err)
            res.send(err);
        else
            res.json(data);
    });
});

router.get('/doctor/api/recipients', function(req, res) {
    Recipients.find(function(err, data){
        if(err)
            res.send(err);
        else
            res.json(data);
    });
});


/*GET addDonor page. */
router.get('/doctor/addDonor', function(req, res, next) {
  res.render('addDonor');
});

/*GET addRecipient page. */
router.get('/doctor/addRecipient', function(req, res, next) {
  res.render('addRecipient');
});


/* GET doctor home page. */
router.get('/doctor/home', function(req, res, next) {
  res.render('doctor');
});



//app.use('/api', router);


module.exports = router