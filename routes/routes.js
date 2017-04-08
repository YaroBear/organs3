var express = require('express');
var router = express.Router();

//authentication
var app = express();
var jwt = require('jsonwebtoken');
<<<<<<< HEAD

//plotly 
var plotly = require('plotly')("hasnainbilgrami", "Tp0ci7oUZdLrQ5Dg3AdZ")

//var config = require('./config');
<<<<<<< HEAD
=======
>>>>>>> 9a6ae93beb82d5de8280ea927376e2775423f5de
=======

>>>>>>> 18b94d6ca05058c4eca168d52cc765511c8c4433
app.set('superSecret', process.env.SECRET);
app.set('doctorSecret', process.env.DOCTOR_SECRET);


var mongoose = require('mongoose');
var ObjectId = require('mongoose').Schema.ObjectId

var Schema = mongoose.Schema;
mongoose.Promise = Promise;
var ObjectId = require('mongoose').Types.ObjectId; 

// connecting to Mlab
var mongodb_uri = process.env.MONGODB_URI;
mongoose.connect(mongodb_uri);

//matching functions
var matchingFunctions = require("../matchingFunctions");


//******************************
//******************************
//***********SCHEMAS************
//******************************
//******************************
var doctorSchema = new Schema({
    name: {
        type: String,
        required: [true, "A name is required"]
    },
    patients: []
});


var userSchema = new Schema({
    ssn: {
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
    name: { type: String, required: [true, "Name is required"] },
    username: { type: String, required: [true, "Username is required"], unique: true },
    password: { type: String, required: [true, "Password is required"] },
    admin: Boolean
});


//HOSPITAL SCHEMA
var hospitalSchema = new Schema({
<<<<<<< HEAD
<<<<<<< HEAD
    name: String,
    address: {
        street: String,
        city: String,
        state: String,
        zip: String,
        region: Number
    },
    phone: String,
    procedures: Array,
    doctors: Array
=======

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
>>>>>>> 18b94d6ca05058c4eca168d52cc765511c8c4433
});


//DONOR SCHEMA
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

        state: {type: String, required: [true, "Please select a state"]},
        zip: {type: String, validate: {
            validator: function(v) {
                return /\d{5}/.test(v);
            },
            message: "Please enter zip code as xxxxx"
        }, required: [true, "Zip code is required"]},

    },

    phoneNumber:  {type: String, validate: {
            validator: function(v) {
                return /\d{3}-\d{3}-\d{4}/.test(v);
            },
            message: "Please enter phone number as xxx-xxx-xxxx"
        }, required: [false]},

    dateAdded: {type: Date, required: [true, "Date is required"]},
    HLAType: {type: String, required: [true, "HLA type is required"]},
    height: {type: String, required: [true, "height is required"]},
    weight: {type: String, required: [true, "weight is required"]},
    organType: {type: String, required: [true, "Please select an organ type"]},
    sex: {type: String, required: [true, "Please enter patient sex"]},
    organType: {type: String, required: [true, "Please select an organ type"]},
    bloodType: {type: String, required: [true, "Please select a blood type"]},
    organSize: {type: String, required: [true, "Please enter organ size"]},
    deceased: {type: String, required: [true, "Is the donor deceased?"]},

});



//RECIPIENT SCHEMA
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

        state: {type: String, required: [true, "Please select a state"]},

        zip: {type: String, validate: {
            validator: function(v) {
                return /\d{5}/.test(v);
            },
            message: "Please enter zip code as xxxxx"
        },required: [true, "Zip code is required"]},

    },
<<<<<<< HEAD
    created_on: { type: Date, required: [true, "Date is required"] }
=======
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
>>>>>>> 9a6ae93beb82d5de8280ea927376e2775423f5de
=======

    phoneNumber:  {type: String, validate: {
            validator: function(v) {
                return /\d{3}-\d{3}-\d{4}/.test(v);
            },
            message: "Please enter phone number as xxx-xxx-xxxx"
        }, required: [false]},

    dateAdded: {type: Date, required: [true, "Date is required"]},
    HLAType: {type: String, required: [true, "HLA type is required"]},
    height: {type: String, required: [true, "height is required"]},
    weight: {type: String, required: [true, "weight is required"]},
    organType: {type: String, required: [true, "Please select an organ type"]},
    sex: {type: String, required: [true, "Please enter patient sex"]},
    dob: {type: Date, required: [true, "Please enter patient date of birth"]},
    organType: {type: String, required: [true, "Please select an organ type"]},
    bloodType: {type: String, required: [true, "Please select a blood type"]},
    organSize: {type: String, required: [true, "Please enter organ size"]},
    urgency: {type: String, required: [true, "Please specify urgency"]},
>>>>>>> 18b94d6ca05058c4eca168d52cc765511c8c4433
});

var Hospitals = mongoose.model('hospitals', hospitalSchema);

<<<<<<< HEAD
//DONOR SCHEMA
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

        state: {type: String, required: [true, "Please select a state"]},
        zip: {type: String, validate: {
            validator: function(v) {
                return /\d{5}/.test(v);
            },
            message: "Please enter zip code as xxxxx"
        }, required: [true, "Zip code is required"]},

    },

    phoneNumber:  {type: String, validate: {
            validator: function(v) {
                return /\d{3}-\d{3}-\d{4}/.test(v);
            },
            message: "Please enter phone number as xxx-xxx-xxxx"
        }, required: [false]},

    dateAdded: {type: Date, required: [true, "Date is required"]},
    HLAType: {type: String, required: [true, "HLA type is required"]},
    height: {type: String, required: [true, "height is required"]},
    weight: {type: String, required: [true, "weight is required"]},
    organType: {type: String, required: [true, "Please select an organ type"]},
    sex: {type: String, required: [true, "Please enter patient sex"]},
    organType: {type: String, required: [true, "Please select an organ type"]},
    bloodType: {type: String, required: [true, "Please select a blood type"]},
    organSize: {type: String, required: [true, "Please enter organ size"]},
    deceased: {type: String, required: [true, "Is the donor deceased?"]},

});



//RECIPIENT SCHEMA
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

        state: {type: String, required: [true, "Please select a state"]},

        zip: {type: String, validate: {
            validator: function(v) {
                return /\d{5}/.test(v);
            },
            message: "Please enter zip code as xxxxx"
        },required: [true, "Zip code is required"]},

    },

    phoneNumber:  {type: String, validate: {
            validator: function(v) {
                return /\d{3}-\d{3}-\d{4}/.test(v);
            },
            message: "Please enter phone number as xxx-xxx-xxxx"
        }, required: [false]},

    dateAdded: {type: Date, required: [true, "Date is required"]},
    HLAType: {type: String, required: [true, "HLA type is required"]},
    height: {type: String, required: [true, "height is required"]},
    weight: {type: String, required: [true, "weight is required"]},
    organType: {type: String, required: [true, "Please select an organ type"]},
    sex: {type: String, required: [true, "Please enter patient sex"]},
    dob: {type: Date, required: [true, "Please enter patient date of birth"]},
    organType: {type: String, required: [true, "Please select an organ type"]},
    bloodType: {type: String, required: [true, "Please select a blood type"]},
    organSize: {type: String, required: [true, "Please enter organ size"]},
    urgency: {type: String, required: [true, "Please specify urgency"]},

<<<<<<< HEAD
router.get('/api/hospitals/names', function(req, res) {
    Hospitals.find({}, { name: 1 }, function(err, data) {
        if (err)
            res.send(err);
        else
            res.json(data);
    });
=======
>>>>>>> 9a6ae93beb82d5de8280ea927376e2775423f5de
});

var Hospitals = mongoose.model('hospitals', hospitalSchema);

var Doctors = mongoose.model('doctors', doctorSchema);

<<<<<<< HEAD
router.get('/api/doctors', function(req, res) {
    Doctors.find(function(err, data) {
=======
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
>>>>>>> 18b94d6ca05058c4eca168d52cc765511c8c4433
        if (err)
            res.send(err);
        else
            res.json(data);
<<<<<<< HEAD

        }
=======
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
>>>>>>> 9a6ae93beb82d5de8280ea927376e2775423f5de
=======
>>>>>>> 18b94d6ca05058c4eca168d52cc765511c8c4433
    });
});


router.post('/api/register', function(req, res) {
    //console.log(req.body);
    var User = mongoose.model('users', userSchema);
    var request = {};
    // if req.body is empty (form is empty), use query parameters 
    // to test API without front end via Postman or regular xmlhttprequest
    if (Object.keys(req.body).length === 0 && req.body.constructor === Object) {
        console.log("using req.query");
        request = req.query;
    } else {
        console.log("using req.body")
        request = req.body;
    }

    var errors = {};

    User.findOne({ ssn: request.SSN })
        .then(function(ssn) {
            if (ssn) {
                errors.ssnExists = "A user with that SSN already exists";
            }
            return User.findOne({ username: request.username });
        }).then(function(username) {
            if (username) {
                errors.usernameExists = "A user with that username already exists";
            }
        }).then(function() {
            var isAdmin = false;
            if (request.code == undefined) {
                errors.permCode = "A system permission code is required";
            } else if (request.code == "1234") {
                isAdmin = true;
            }

            // create a new user
            var newUser = User({
                ssn: request.SSN,
                name: request.name,
                username: request.username,
                password: request.password,
                admin: isAdmin
            });

            return newUser.validate().then(function() { return newUser; });
        }).catch(function(err) {
            errors.validationError = err;
        }).then(function(newUser) {
            if (errors.validationError || errors.permCode) {
                var error = {};
                error.message = 'Failed to add user';
                error.code = 400;
                error.errors = errors;
                throw error;
            } else {
                return newUser.save().then(function() { return newUser; });
            }
        }).catch(function(err) {
            var error = {};
            error.message = err.message;
            error.code = 400;
            error.errors = errors;
            throw error;
        }).then(function(newUser) {
            var newDoctor = new Doctors({
                _id: newUser._id,
                name: newUser.name
            });

            return newDoctor.save().then(function() { return newUser; });

        }).then(function(newUser) {
<<<<<<< HEAD
<<<<<<< HEAD
            Hospitals.findOneAndUpdate({ "_id": request.selectedHospital._id }, { $push: { doctors: newUser._id } }).then(function() { return Hospitals });
        }).then(function(Hospitals) {
            res.status(201).send({ ok: true, message: 'Added user successfully' });
=======
        	Hospitals.findOneAndUpdate({"_id": request.selectedHospital._id}, {$push: {doctors: {"_id" :newUser._id}}}).then(function() {return Hospitals});
        }).then(function(Hospitals){
            res.status(201).send({ok: true, message: 'Added user successfully'});
>>>>>>> 9a6ae93beb82d5de8280ea927376e2775423f5de
=======

        	Hospitals.findOneAndUpdate({"_id": request.selectedHospital._id}, {$push: {doctors: {"_id" :newUser._id}}}).then(function() {return Hospitals});
        }).then(function(Hospitals){
            res.status(201).send({ok: true, message: 'Added user successfully'});
>>>>>>> 18b94d6ca05058c4eca168d52cc765511c8c4433
        }).catch(function(err) {
            var errorCode = err.code || 500;
            res.status(errorCode).send({ ok: false, message: err.message, errors: err.errors });
        });
});



//user authentication
router.post('/api/authenticate', function(req, res) {
    console.log(req.body);
    var User = mongoose.model('users', userSchema);
    var request = {};
    // if req.body is empty (form is empty), use query parameters 
    // to test API without front end via Postman or regular xmlhttprequest
    if (Object.keys(req.body).length === 0 && req.body.constructor === Object) {
        console.log("using req.query");
        request = req.query;
    } else {
        console.log("using req.body");
        request = req.body;
    }

    var errors = {};

    if(request.username == null)
    {
        errors.usernameError = {message : "Please enter your username"};
    }
    if(request.password == null)
    {
        errors.passwordError = {message : "Please enter your password"};
    }
<<<<<<< HEAD


<<<<<<< HEAD
    if (request.username != null) {
=======
    if (request.username && request.password){
>>>>>>> 9a6ae93beb82d5de8280ea927376e2775423f5de
=======



    if (request.username && request.password){
>>>>>>> 18b94d6ca05058c4eca168d52cc765511c8c4433

        User.findOne({
            username: request.username
        }, function(err, user) {

            //console.log(user.username);
            if (err) throw err;

<<<<<<< HEAD
<<<<<<< HEAD
            if (!user) {
                res.json({ success: false, message: 'Authentication failed. User not found.' });
=======

            if(!user){
                errors.usernameError = { message: 'Authentication failed. User not found.' };
                res.status(401).send({success: false, errors});
>>>>>>> 18b94d6ca05058c4eca168d52cc765511c8c4433
            } else if (user) {

                //check password
                if (user.password != request.password){
                    errors.passwordError = { message: 'Authentication failed. Wrong password.' };
                   res.status(401).send({success: false, errors});
                } else {

<<<<<<< HEAD
                    if (user.admin) {
=======
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
                    
>>>>>>> 9a6ae93beb82d5de8280ea927376e2775423f5de
=======
                    if (user.admin){
>>>>>>> 18b94d6ca05058c4eca168d52cc765511c8c4433

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
<<<<<<< HEAD
                        });
<<<<<<< HEAD
                    } else {
                        //return message and token
=======
                    }
                    else{
                        
                        var token = jwt.sign(user, app.get('doctorSecret'), {
                            expiresIn: 60*60
                        });

>>>>>>> 9a6ae93beb82d5de8280ea927376e2775423f5de
=======
                        });

                    }
                    else{
                        
                        var token = jwt.sign(user, app.get('doctorSecret'), {
                            expiresIn: 60*60
                        });
>>>>>>> 18b94d6ca05058c4eca168d52cc765511c8c4433
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
<<<<<<< HEAD
<<<<<<< HEAD

        });
    } else {
        res.send("Please enter a username");
    }
=======
>>>>>>> 18b94d6ca05058c4eca168d52cc765511c8c4433
});


var Heart_Waitlist = mongoose.model('heart_waitlists', waitListSchema);
var Kidney_Waitlist = mongoose.model('kidney_waitlists', waitListSchema);
var Lung_Waitlist = mongoose.model('lung_waitlists', waitListSchema);
var All_Waitlist = mongoose.model('all_waitlists', waitListSchema);

var Recipents = mongoose.model('recipients', recipientSchema);
//get donors on waitlist
router.get('/api/donors/waitlist/:organ/:start_date?/:end_date?', (req, res) => {
    var organType = req.params.organ;
    var start_date = req.params.start_date;
    var end_date = req.params.end_date;

    if (organType == "all") {
        if (start_date == undefined || end_date == undefined) {

            Donors.find((err, data) => {
                if (err)
                    res.send(err)
                else {
                    res.json(data);


                }
            })
        } else {
            Donors.find({ "created_on": { "$gte": start_date, "$lte": end_date } }, (err, data) => {
                if (err)
                    res.send(err)
                else
                    res.json(data);
            })
        }
    } else {
        if (start_date == undefined || end_date == undefined) {
            Donors.find({
                    "matching_info.organs.name": organType
                },
                (err, data) => {
                    if (err)
                        res.send(err)
                    else {
                        res.json(data);

                    }
                })
        } else {
            Donors.find({ created_on: { "$gte": start_date, "$lt": end_date }, "matching_info.organs.name": organType }, (err, data) => {
                if (err)
                    res.send(err)
                else {

                    res.json(data);
                }
            })
        }
    }

});

router.get('/api/recipents/waitlist/:organ/:start_date?/:end_date?', (req, res) => {
    var organ = req.params.organ;
    var start_date = req.params.start_date;
    var end_date = req.params.end_date;

    if (organ == "heart") {
        Heart_Waitlist.find((err, data) => {
            if (err) {
                res.send(err);
            } else {
                for (var idx in data) {
                    Recipents.find({ _id: data[idx]["user_id"] }, (err, data) => {
                        res.json(data);

                    })
                }
            }
        });
    }
    if (organ == "kidney") {
        Kidney_Waitlist.find((err, data) => {
            if (err) {
                res.send(err);
            } else {
                for (var idx in data) {
                    Recipents.find({ _id: data[idx]["user_id"] }, (err, data) => {
                        res.json(data);

                    })
                }
            }
        });
    }
    if (organ == "lungs") {
        Lung_Waitlist.find((err, data) => {
            if (err) {
                res.send(err);
            } else {
                for (var idx in data) {
                    Recipents.find({ _id: data[idx]["user_id"] }, (err, data) => {
                        res.json(data);

                    })
                }
            }
        });
    }
    if (organ == "all") {
        var finalData = [];
        All_Waitlist.find((err, data) => {
            if (err) {
                res.send(err);
            } else {
                for (var idx in data) {
                    Recipents.find({ _id: data[idx]["user_id"] }, (err, data) => {
                        finalData.push(data[idx]);

                    })
                    res.send(finalData);
                }
            }
        });


    }
});

//Angular Routes
=======
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
>>>>>>> 9a6ae93beb82d5de8280ea927376e2775423f5de

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

router.get('/statistics', function(req, res, next) {
    res.render('statisticsMatching');
})



//******************************
//******************************
//** PROTECTED ADMIN ROUTES*****
//******************************
//******************************
<<<<<<< HEAD

// admin JWT checker

router.use('/admin/',function(req, res, next) {

<<<<<<< HEAD
    // check header or url parameters or post parameters for token
    var token = req.body.token || req.query.token || req.headers['x-access-token'];
=======

// admin JWT checker

router.use('/admin/',function(req, res, next) {
>>>>>>> 18b94d6ca05058c4eca168d52cc765511c8c4433


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
<<<<<<< HEAD
=======
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
=======

    var errors = {};

    Recipient.findOne({ssn : request.ssn})
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

                address : {street : request.street,
                city : request.city,
                state : request.selectedState,
                zip : request.zip},

                phoneNumber : request.phoneNumber,

                dateAdded : new Date(Date.now()),
                urgency : request.selectedUrgency,
                sex : request.selectedSex,
                height : request.height,
                weight : request.weight,
                dob : new Date(Date.parse(request.dob)),


                organType : request.selectedOrganType,
                bloodType : request.selectedBloodType,
                HLAType : request.HLAType,
                organSize : request.organSize
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
        }).then(function(newRecipient){
            if (newRecipient)
            {
                matchingFunctions.addRecipientToWaitlist(newRecipient);
            }            
        }).then(function(waitlist){
            console.log(waitlist);
            res.status(201).send({ok: true, message: 'Recipient added successfully'});
        }).catch(function(err) {
            console.log(err);
            res.status(500).send({success: false, errors});
        });
    });

//ADD Donors to donor list
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


    var errors = {};

    Donor.findOne({ssn : request.ssn})
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

                phoneNumber : request.phoneNumber,

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
            Doctors.findOneAndUpdate({"_id": request.doctor_id}, {$push:{patients: newDonor._id}}).then(function(newDonor) {return newDonor});
        }).catch(function(err) {
            var errorCode = err.code || 500;
            res.status(errorCode).send({ok: false, message: err.message, errors: err.errors});
        }).then(function(newDonor){
            res.status(201).send({ok: true, message: 'Donor added successfully'});
            matchingFunctions.generateMatchforDonor(newDonor);
        }).catch(function(err) {
            res.status(500).send({success: false, errors});
        });
    });

router.get('/doctor/api/hospital-info/:doctor_id', function(req, res){
    console.log(req.params.doctor_id);
    Hospitals.findOne({"doctors" : { "_id" : ObjectId(req.params.doctor_id)}})
        .then(function(hospital){
            if (hospital)
            {
                res.status(201).send({success: true, hospital: hospital});
            }
            else
            {
                res.status(201).send({success: true, hospital: "Not found"});
            }
        }).catch(function(err){
            res.status(500).send({success: false, error : err});
    });
>>>>>>> 18b94d6ca05058c4eca168d52cc765511c8c4433
});

// put apis you want to secure with admin token here VVVVVVV

<<<<<<< HEAD
router.get('/admin/api/hospitals', function(req, res){
    Hospitals.find(function(err, data){
        if (err)
=======
router.get('/doctor/api/doctors', function(req, res) {
    Doctors.find(function(err, data){
        if(err)
>>>>>>> 18b94d6ca05058c4eca168d52cc765511c8c4433
            res.send(err);
        else
            res.json(data);
    });
<<<<<<< HEAD
>>>>>>> 9a6ae93beb82d5de8280ea927376e2775423f5de
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
<<<<<<< HEAD
router.get('/admin', function(req, res, next) {
    res.render('admin');
=======
router.get('/admin/home', function(req, res, next) {
  res.render('admin');
>>>>>>> 9a6ae93beb82d5de8280ea927376e2775423f5de
=======
});


router.get('/doctor/api/donors', function(req, res) {
    Donors.find(function(err, data){
        if(err)
            res.send(err);
        else
            res.json(data);
    });
>>>>>>> 18b94d6ca05058c4eca168d52cc765511c8c4433
});

router.get('/doctor/api/recipients', function(req, res) {
    Recipients.find(function(err, data){
        if(err)
            res.send(err);
        else
            res.json(data);
    });
});

router.get('/doctor/api/view-patients/:doctor_id', function(req, res) {

    var patients = {};
    var donorPatients = [];
    var recipientPatients = [];
    var patient_ids = [];

    Doctors.findOne({_id : req.params.doctor_id})
        .then(function(doctor){
            patient_ids  = doctor.patients;
            return patient_ids;
        }).then(function(patient_ids){
            return Donors.find({_id : {$in : patient_ids}}).then(function(donors) {return donors;});

        }).then(function(donors){
            if (donors)
            {
            donorPatients = donors;
            patients.donorPatients = donorPatients;
            }
            return Recipients.find({_id : {$in : patient_ids}}).then(function(recipients) {return recipients;});
        }).then(function(recipients){
            if (recipients)
            {
            recipientPatients = recipients;
            patients.recipientPatients = recipientPatients;
            }
            res.status(201).send({success: true, patients});
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

    Recipient.findOne({ssn : request.ssn})
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

                address : {street : request.street,
                city : request.city,
                state : request.selectedState,
                zip : request.zip},

                phoneNumber : request.phoneNumber,

                dateAdded : new Date(Date.now()),
                urgency : request.selectedUrgency,
                sex : request.selectedSex,
                height : request.height,
                weight : request.weight,
                dob : new Date(Date.parse(request.dob)),


                organType : request.selectedOrganType,
                bloodType : request.selectedBloodType,
                HLAType : request.HLAType,
                organSize : request.organSize
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
        }).then(function(newRecipient){
            if (newRecipient)
            {
                matchingFunctions.addRecipientToWaitlist(newRecipient);
            }            
        }).then(function(waitlist){
            console.log(waitlist);
            res.status(201).send({ok: true, message: 'Recipient added successfully'});
        }).catch(function(err) {
            console.log(err);
            res.status(500).send({success: false, errors});
        });
    });

//ADD Donors to donor list
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


    var errors = {};

    Donor.findOne({ssn : request.ssn})
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

                phoneNumber : request.phoneNumber,

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
            Doctors.findOneAndUpdate({"_id": request.doctor_id}, {$push:{patients: newDonor._id}}).then(function(newDonor) {return newDonor});
        }).catch(function(err) {
            var errorCode = err.code || 500;
            res.status(errorCode).send({ok: false, message: err.message, errors: err.errors});
        }).then(function(newDonor){
            res.status(201).send({ok: true, message: 'Donor added successfully'});
            matchingFunctions.generateMatchforDonor(newDonor);
        }).catch(function(err) {
            res.status(500).send({success: false, errors});
        });
    });

router.get('/doctor/api/hospital-info/:doctor_id', function(req, res){
    console.log(req.params.doctor_id);
    Hospitals.findOne({"doctors" : { "_id" : ObjectId(req.params.doctor_id)}})
        .then(function(hospital){
            if (hospital)
            {
                res.status(201).send({success: true, hospital: hospital});
            }
            else
            {
                res.status(201).send({success: true, hospital: "Not found"});
            }
        }).catch(function(err){
            res.status(500).send({success: false, error : err});
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

router.get('/doctor/api/view-patients/:doctor_id', function(req, res) {

    var patients = {};
    var donorPatients = [];
    var recipientPatients = [];
    var patient_ids = [];

    Doctors.findOne({_id : req.params.doctor_id})
        .then(function(doctor){
            patient_ids  = doctor.patients;
            return patient_ids;
        }).then(function(patient_ids){
            return Donors.find({_id : {$in : patient_ids}}).then(function(donors) {return donors;});

        }).then(function(donors){
            if (donors)
            {
            donorPatients = donors;
            patients.donorPatients = donorPatients;
            }
            return Recipients.find({_id : {$in : patient_ids}}).then(function(recipients) {return recipients;});
        }).then(function(recipients){
            if (recipients)
            {
            recipientPatients = recipients;
            patients.recipientPatients = recipientPatients;
            }
            res.status(201).send({success: true, patients});
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


module.exports = router;