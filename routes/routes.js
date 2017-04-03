var express = require('express');
var router = express.Router();


//authentication
var app = express();
var jwt = require('jsonwebtoken');

//plotly 
var plotly = require('plotly')("hasnainbilgrami", "Tp0ci7oUZdLrQ5Dg3AdZ")

//var config = require('./config');
app.set('superSecret', process.env.SECRET);


var mongoose = require('mongoose');
var ObjectId = require('mongoose').Schema.ObjectId

var Schema = mongoose.Schema;
mongoose.Promise = Promise;

// connecting to Mlab
var mongodb_uri = process.env.MONGODB_URI;
mongoose.connect(mongodb_uri);

// models
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

var hospitalSchema = new Schema({
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
});

var donorsSchema = new Schema({
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
    status: { type: String, required: [true, "Is the donor alive?"] },
    matching_info: {
        organs: [{
                name: { type: String, required: [true, "Organ Name is required"] },
                measurement: Number,
                measurement_type: { type: String, required: [true, "Volume or size?"] }

            }

        ]
    },
    health: {
        sex: { type: String, required: [true, "Is the donor a Male of Female"] },
        height: { type: String, required: [true, "How tall is the donor"] },
        dob: {
            type: String,
            unique: false,
            validate: {
                validator: function(v) {
                    return /\d{2}-\d{2}-\d{4}/.test(v);
                },
                message: "Please enter your DOB as xx-xx-xxxx"
            },
            required: [true, "Date of birth required"]
        },
        blood_type: { type: String, required: [true, "Blood type is required"] },
        HLA_class: { type: Number, required: [true, "HLA class is required"] },
        weight: { type: Number, required: [true, "Weight is required"] }
    },
    created_on: { type: Date, required: [true, "Date is required"] }
})

var waitlistSchema = new Schema({
    _id: {
        type: Schema.Types.ObjectId
            //, required: true
    },
    time_added: {
        date: { type: Date, default: Date.now }
    }
});
// API Routes

var Hospitals = mongoose.model('hospitals', hospitalSchema);

router.get('/api/hospitals/names', function(req, res) {
    Hospitals.find({}, { name: 1 }, function(err, data) {
        if (err)
            res.send(err);
        else
            res.json(data);
    });
});

var Doctors = mongoose.model('doctors', doctorSchema);

router.get('/api/doctors', function(req, res) {
    Doctors.find(function(err, data) {
        if (err)
            res.send(err);
        else {

            res.json(data);

        }
    });
});

router.post('/api/doctors', function(req, res) {
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
            Hospitals.findOneAndUpdate({ "_id": request.selectedHospital._id }, { $push: { doctors: newUser._id } }).then(function() { return Hospitals });
        }).then(function(Hospitals) {
            res.status(201).send({ ok: true, message: 'Added user successfully' });
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

    console.log(request.username);

    if (request.username != null) {

        User.findOne({
            username: request.username
        }, function(err, user) {

            //console.log(user.username);
            if (err) throw err;

            if (!user) {
                res.json({ success: false, message: 'Authentication failed. User not found.' });
            } else if (user) {

                //check password
                if (user.password != request.password) {
                    res.json({ success: false, message: 'Authentication failed. Wrong password.' });
                } else {
                    //if user is found and password is correct generate token
                    var token = jwt.sign(user, app.get('superSecret'), {
                        expiresIn: 60 * 60
                    });

                    if (user.admin) {

                        //return message and token
                        res.json({
                            success: true,
                            message: 'Admin Login successful',
                            token: token
                        });
                    } else {
                        //return message and token
                        res.json({
                            success: true,
                            message: 'Doctor Login successful',
                            token: token
                        });
                    }

                }

            }

        });
    } else {
        res.send("Please enter a username");
    }
});


var Donors = mongoose.model('donors', donorsSchema);
var Heart_Waitlist = mongoose.model('heart_waitlist', waitlistSchema);
var Kidney_Waitlist = mongoose.model('kidney_waitlist', waitlistSchema);
var Lung_Waitlist = mongoose.model('lung_waitlist', waitlistSchema);

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

})

//Angular Routes

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
    // var data = [{ x: [0, 1, 2], y: [3, 2, 1], type: 'bar' }];
    // var layout = { fileopt: "overwrite", filename: "simple-node-example" };

    // var data = [{
    //     x: ["2013-10-04 22:23:00", "2013-11-04 22:23:00", "2013-12-04 22:23:00"],
    //     y: [1, 3, 6],
    //     type: "scatter"
    // }];
    // var graphOptions = { filename: "statisticsMatching", fileopt: "overwrite" };
    // plotly.plot(data, graphOptions, function(err, msg) {
    //     console.log(msg);
    // });
    res.render('statisticsMatching');
})




//token verifying middleware.  This must come after any unprotected routes and 
//before any protected routes
router.use(function(req, res, next) {

    // check header or url parameters or post parameters for token
    var token = req.body.token || req.query.token || req.headers['x-access-token'];

    // decode token
    if (token) {

        // verifies secret and checks exp
        jwt.verify(token, app.get('superSecret'), function(err, decoded) {
            if (err) {
                return res.json({ success: false, message: 'Failed to authenticate token.' });
            } else {
                // if everything is good, save to request for use in other routes
                req.decoded = decoded;
                next();
            }
        });

    } else {

        // if there is no token
        // return an error
        return res.status(403).send({
            success: false,
            message: 'No token provided.'
        });

    }
});




/* GET register page. */
router.get('/admin', function(req, res, next) {
    res.render('admin');
});


//app.use('/api', router);


module.exports = router