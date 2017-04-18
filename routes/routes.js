var express = require('express');
var router = express.Router();

//authentication
var app = express();
var jwt = require('jsonwebtoken');
app.set('superSecret', process.env.SECRET);
app.set('doctorSecret', process.env.DOCTOR_SECRET);

var cron = require("node-cron");

//plotly 
var plotly = require('plotly')("hasnainbilgrami", "Tp0ci7oUZdLrQ5Dg3AdZ")

var mongoose = require('mongoose');

var ObjectId = require('mongoose').Types.ObjectId;
mongoose.Promise = Promise;



//matching functions
var matchingFunctions = require("../matchingFunctions");

var schemas = require("../models/schemas");

var Hospital = schemas.Hospital;

var Doctor = schemas.Doctor;

var Donor = schemas.Donor;

var Recipient = schemas.Recipient;

var User = schemas.User;

var DoctorNotifications = schemas.DoctorNotifications;

var Matches = schemas.Matches;

var Wasted = schemas.WastedOrgans;

var Rejection = schemas.Rejection;

cron.schedule('* * * * *', function() {
    console.log('Running organ expiration checks every minute');

    var now = new Date();
    Donor.find().then(function(donors) {
        for (var i = 0; i < donors.length; i++) {
            var timeLeft = matchingFunctions.getOrganTimeScore(donors[i]);

            if (timeLeft <= 0) {
                matchingFunctions.deleteDonorUpdateWastedCollection(donors[i]);
                console.log("Removing doctor notification");
                DoctorNotifications.remove({ donor : donors[i]._id }, function(update){
                });
            }

        }
    });
});




var Heart_Waitlist = schemas.Heart_Waitlist;

var Kidney_Waitlist = schemas.Kidney_Waitlist;

var Lung_Waitlist = schemas.Lung_Waitlist;

var Liver_Waitlist = schemas.Liver_Waitlist;

var Pancreas_Waitlist = schemas.Pancreas_Waitlist;



//******************************
//******************************
//***** PUBLIC API ROUTES*******
//******************************
//******************************

/*
Recipient.findOne({"organType" : "Lung"})
    .then(function(recip)
    {
    	if (recip)
    	{
    		return matchingFunctions.generateMatchforRecipient(recip);
    	}
        
        
    });
*/

/*
Donor.findOne({"_id" : ObjectId("58f324cebd02080d54e01589")})
    .then(function(donor)
    {
    	if (donor)
    	{
    		return matchingFunctions.generateMatchforDonor(donor);
    	}
        
        
    });
*/
/*
    Donor.find()
        .then(function(allDonors){
            for (var i = 0; i < allDonors.length; i++)
            {
                matchingFunctions.generateMatchforDonor(allDonors[i]);
            }
        });
*/
router.get('/api/hospitals/names', function(req, res) {
    Hospital.find({}, { name: 1 }, function(err, data) {
        if (err)
            res.send(err);
        else
            res.json(data);
    });
});


router.post('/api/register', function(req, res) {
    //console.log(req.body);
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
            var newDoctor = new Doctor({
                _id: newUser._id,
                name: newUser.name
            });

            return newDoctor.save().then(function() { return newUser; });

        }).then(function(newUser) {
            Hospital.findOneAndUpdate({ "_id": request.selectedHospital._id }, { $push: { doctors: { "_id": newUser._id } } }).then(function() { return Hospital });
        }).then(function(Hospitals) {
            res.status(201).send({ ok: true, message: 'Added user successfully' });
        }).catch(function(err) {
            var errorCode = err.code || 500;
            res.status(errorCode).send({ ok: false, message: err.message, errors: err.errors });
        });
});



//user
router.post('/api/authenticate', function(req, res) {
    //console.log(req.body);
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

    if (request.username == null) {
        errors.usernameError = { message: "Please enter your username" };
    }
    if (request.password == null) {
        errors.passwordError = { message: "Please enter your password" };
    }


    if (request.username && request.password) {

        User.findOne({
            username: request.username
        }, function(err, user) {

            //console.log(user.username);
            if (err) throw err;

            if (!user) {
                errors.usernameError = { message: 'Authentication failed.' };
                res.status(401).send({ success: false, errors });
            } else if (user) {

                //check password
                if (user.password != request.password) {
                    errors.passwordError = { message: 'Authentication failed.' };
                    res.status(401).send({ success: false, errors });
                } else {

                    if (user.admin) {

                        //if user is found and password is correct generate token
                        var token = jwt.sign(user, app.get('superSecret'), {
                            expiresIn: 60 * 60
                        });


                        //return message and token
                        res.json({
                            success: true,
                            message: 'Admin Login successful',
                            token: token,
                            user: user.name,
                            userType: "admin",
                            mongo_id: user._id
                        });
                    } else {

                        var token = jwt.sign(user, app.get('doctorSecret'), {
                            expiresIn: 60 * 60
                        });

                        res.json({
                            success: true,
                            message: 'Doctor Login successful',
                            token: token,
                            user: user.name,
                            userType: "doctor",
                            mongo_id: user._id
                        });
                    }
                }
            }
        });
    } else {
        res.status(400).send({ success: false, errors });
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

/* GET home page. */
router.get('/about', function(req, res, next) {
    res.render('about');
});

/* GET register page. */
// router.get('/register', function(req, res, next) {
//   res.render('register');
// });


//  GET login page. 
// router.get('/authenticate', function(req, res, next) {
//   res.render('authenticate');
// });





//protect?
router.get('/statistics', function(req, res, next) {
    res.render('statisticsMatching');
});

router.get('/admin/statistics', function(req, res, next) {
    res.render('admin_statisticsMatching');
});




//******************************
//******************************
//** PROTECTED ADMIN ROUTES*****
//******************************
//******************************

// admin JWT checker

router.use('/admin/', function(req, res, next) {

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
    } else {
        return res.status(403).send({
            success: false,
            message: "No token provided"
        });
    }
});

// put apis you want to secure with admin token here VVVVVVV

router.get('/admin/api/hospitals', function(req, res) {
    Hospital.find(function(err, data) {
        if (err)
            res.send(err);
        else
            res.json(data);
    });
});



//ADD HOSPITAL ROUTE
router.post('/admin/api/hospitals', function(req, res) {
    //console.log(req.body);
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

    Hospital.findOne({
        $or: [
            { address: { street: request.street } },
            { name: request.name }
        ]
    }, function(err, hospital) {
        console.log(err);
        if (err) throw err;
        if (hospital) {
            errors.HospitalExists = "A hospital with this name or address already exists";
        }

    }).then(function() {
        var newHospital = new Hospital({
            name: request.name,
            address: {
                street: request.street,
                city: request.city,
                state: request.state,
                zip: request.zip,
                region: request.region,
            },
            phone: request.phoneNumber,
            procedures: [],
            doctors: []
        });

        return newHospital.validate().then(function() { return newHospital; });

    }).catch(function(err) {
        errors.validationError = err;
    }).then(function(newHospital) {
        if (errors.validationError || errors.HospitalExists) {
            throw errors;
        } else {
            newHospital.save().then(function() { return newHospital; });
        }
    }).then(function(newHospital) {
        console.log(newHospital);
        res.status(201).send({ ok: true, message: 'Hospital added successfully' });
    }).catch(function(err) {
        res.status(500).send({ success: false, errors });
    });
});



// //GET COLLECTION STATS
router.get("/admin/api/collection/stats/:collectionName", (req, res) => {
    var cName = req.params.collectionName;
    console.log(req);
    if (cName == 'lung_waitlists') {
        Lung_Waitlist.collection.stats(function(err, results) {
            if (err) {
                res.send(err);
            } else {
                res.json(results);
            }
        });
    }
    if (cName == 'pancreas_waitlists') {
        Pancreas_Waitlist.collection.stats(function(err, results) {
            if (err) {
                res.send(err);
            } else {
                res.json(results);
            }
        });
    }

    if (cName == 'doctor_notifications') {
        DoctorNotifications.collection.stats(function(err, results) {
            if (err) {
                res.send(err);
            } else {
                res.json(results);
            }
        });
    }
    if (cName == 'users') {
        User.collection.stats(function(err, results) {
            if (err) {
                res.send(err);
            } else {
                res.json(results);
            }
        });
    }
    if (cName == 'liver_waitlists') {
        Liver_Waitlist.collection.stats(function(err, results) {
            if (err) {
                res.send(err);
            } else {
                res.json(results);
            }
        });
    }
    if (cName == 'matches') {
        Matches.collection.stats(function(err, results) {
            if (err) {
                res.send(err);
            } else {
                res.json(results);
            }
        });
    }
    if (cName == 'recipients') {
        Recipient.collection.stats(function(err, results) {
            if (err) {
                res.send(err);
            } else {
                res.json(results);
            }
        });
    }
    if (cName == 'heart_waitlists') {
        Heart_Waitlist.collection.stats(function(err, results) {
            if (err) {
                res.send(err);
            } else {
                res.json(results);
            }
        });
    }
    if (cName == 'kidney_waitlists') {
        Kidney_Waitlist.collection.stats(function(err, results) {
            if (err) {
                res.send(err);
            } else {
                res.json(results);
            }
        });
    }
    if (cName == 'hospitals') {
        Hospital.collection.stats(function(err, results) {
            if (err) {
                res.send(err);
            } else {
                res.json(results);
            }
        });
    }
    if (cName == 'donors') {
        Donor.collection.stats(function(err, results) {
            if (err) {
                res.send(err);
            } else {
                res.json(results);
            }
        });
    }
    if (cName == 'doctors') {
        Doctor.collection.stats(function(err, results) {
            if (err) {
                res.send(err);
            } else {
                res.json(results);
            }
        });
    }
    if (cName == 'wasted_organs') {
        Wasted.collection.stats(function(err, results) {
            if (err) {
                res.send(err);
            } else {
                res.json(results);
            }
        });
    }




});








router.get('/admin/api/hospital-info/:admin_id', function(req, res) {
    console.log(req.params.admin_id);
    Hospital.findOne({ "doctors": { "_id": ObjectId(req.params.admin_id) } })
        .then(function(hospital) {
            if (hospital) {
                res.status(201).send({ success: true, hospital: hospital });
            } else {
                res.status(201).send({ success: true, hospital: "Not found" });
            }
        }).catch(function(err) {
            res.status(500).send({ success: false, error: err });
        });
});



//deleteHospital
router.post('/admin/api/deletehospital', function(req, res) {
    console.log("/admin/api/deletehospital");
    console.log(req.body);
    //var Hospital = mongoose.model('hospitals', hospitalSchema);
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

    var ObjectId = require('mongoose').Types.ObjectId;

    Hospital.remove({ "_id": ObjectId(request.id) }, function(err, success) {
        if (err) console.log("error: ", err);
        else console.log("success: ", success);
    });
});

//Move Doctors
router.post('/admin/api/hospital/moveDoctors', function(req, res) {
    //var Hospital = mongoose.model('hospitals', hospitalSchema);
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
    var ObjectId = require('mongoose').Types.ObjectId;

    Hospital.findOneAndUpdate({ "_id": request.destHosp }, { $push: { doctors: { "_id": request.docid } } })
        .catch(function(err) {
            console.log(err);
        }).then(function(mongoResponse) {
            console.log(mongoResponse);
            //return Hospital.findOneAndUpdate({"_id": request.oldHosp}, {$pull: {doctors: {"_id" :ObjectId(request.docid)}}});
            return Hospital.findOneAndUpdate({ "_id": ObjectId(request.oldHosp) }, { $pull: { doctors: { "_id": ObjectId(request.docid) } } });
        }).catch(function(err) {
            console.log(err);
            res.status(500).send({ success: false, message: err });
        }).then(function(mongoResponse) {
            if (mongoResponse) { res.status(201).send({ success: true, message: "The hospital doctor list was successfully updated!" }); }
        });

});

//list hospitals
router.get('/admin/api/listHosp', function(req, res) {
    //console.log(req.body);
    //var Hospital = mongoose.model('hospitals', hospitalSchema);
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

    console.log(request);
    console.log(Hospital)

    Hospital.find({ size: 'small' }).where('createdDate').gt(oneYearAgo).exec(callback);

    console.log("Hospitals: ")
    console.log(Hospital);
    return Hospitals;
});



/*GET addHospital page. */
router.get('/admin/addHospital', function(req, res, next) {
    res.render('addHospital');
});
/*GET manageHospital page. */
router.get('/admin/manageHospitals', function(req, res, next) {
    res.render('manageHospitals');
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
    } else {
        return res.status(403).send({
            success: false,
            message: "No token provided"
        });
    }
});


//ADD RECIPIENT ROUTE
router.post('/doctor/api/recipients', function(req, res) {
    //console.log(req.body);
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

    var recip;

    Recipient.findOne({ ssn: request.ssn })
        .then(function(ssn) {
            if (ssn) {
                errors.ssnExists = "A recipient with that SSN already exists";
            }

        }).then(function() {


            // create a new recipient
            //drop down attributes not working
            var newRecipient = Recipient({
                ssn: request.ssn,
                name: {
                    firstName: request.firstName,
                    lastName: request.lastName
                },

                address: {
                    street: request.street,
                    city: request.city,
                    state: request.selectedState,
                    zip: request.zip
                },

                phoneNumber: request.phoneNumber,

                dateAdded: new Date(Date.now()),
                urgency: request.selectedUrgency,
                sex: request.selectedSex,
                height: request.height,
                weight: request.weight,
                dob: new Date(Date.parse(request.dob)),


                organType: request.selectedOrganType,
                bloodType: request.selectedBloodType,
                HLAType: request.HLAType,
                organSize: request.organSize
            });

            return newRecipient.save().then(function() { return newRecipient; });
        }).then(function(newRecipient) {
        	if (newRecipient)
        	{
        		recip = newRecipient;
	            return Doctor.findOneAndUpdate({ "_id": request.doctor_id }, {
	                $push: { patients: newRecipient._id }});
        	}
        }).then(function(updated) {
            if (updated) {
                return matchingFunctions.addRecipientToWaitlist(recip);
            }
        }).then(function(added) {
        	if (added)
        	{
        		matchingFunctions.generateMatchforRecipient(recip);
       			res.status(201).send({ ok: true, message: 'Recipient added successfully' });
        	}
        }).catch(function(err) {
        	errors.validationError = err
            res.status(400).send({ success: false, errors: errors });
    });
});
//ADD Donors to donor list
router.post('/doctor/api/donors', function(req, res) {
    //console.log(req.body);
    var genForDonor;
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
    Donor.findOne({ ssn: request.ssn })
        .then(function(ssn) {
            if (ssn) {
                errors.ssnExists = "A donor with that SSN already exists";
            }
        }).then(function() {
            // create a new donor
            //drop down attributes not working
            var newDonor = Donor({
                ssn: request.ssn,
                name: {
                    firstName: request.firstName,
                    lastName: request.lastName
                },
                address: {
                    street: request.street,
                    city: request.city,
                    state: request.selectedState,
                    zip: request.zip
                },
                phoneNumber: request.phoneNumber,
                dateAdded: new Date(Date.now()),
                sex: request.selectedSex,
                height: request.height,
                weight: request.weight,
                dob: new Date(Date.parse(request.dob)),
                organType: request.selectedOrganType,
                bloodType: request.selectedBloodType,
                HLAType: request.HLAType,
                organSize: request.organSize,
                deceased: request.selectedDeceased,
            });
            return newDonor.save().then(function() { return newDonor; });
        }).then(function(newDonor) {
            if (newDonor) {
                genForDonor = newDonor;
                return Doctor.findOneAndUpdate({ "_id": request.doctor_id }, { $push: { patients: newDonor._id } });
            }
        }).then(function(newDonor) {
            if (newDonor) {
                res.status(201).send({ ok: true, message: 'Donor added successfully' });
                return matchingFunctions.generateMatchforDonor(genForDonor);
            }
        }).catch(function(err) {
        	errors.validationError = err;
            res.status(400).send({ success: false, errors });
        });
});

router.get('/doctor/api/hospital-info/:doctor_id', function(req, res) {
    Hospital.findOne({ "doctors": { "_id": ObjectId(req.params.doctor_id) } })
        .then(function(hospital) {
            if (hospital) {
                res.status(201).send({ success: true, hospital: hospital });
            } else {
                res.status(201).send({ success: true, hospital: "Not found" });
            }
        }).catch(function(err) {
            res.status(500).send({ success: false, error: err });
        });
});



router.get('/doctor/api/doctor-notification/:doctor_id', function(req, res) {
    var donorOldScores;
    DoctorNotifications.findOne({ "_id": ObjectId(req.params.doctor_id) })
        .then(function(notification) {
            if (notification) {
                donorOldScores = notification.scores;
                return Donor.findOne({ "_id": ObjectId(notification.donor) });
            }
            else
            {
            	res.status(201).send({ success: true, hasNotification: false });
            }
        }).then(function(donor) {
            console.log(donor);
            if (donor) {
                var newExpireScore = matchingFunctions.getOrganTimeScore(donor);
                var oldExpireScore = donorOldScores.expireScore;
                var oldTotalScore = donorOldScores.totalScore;
                var newTotalScore = (oldTotalScore - oldExpireScore) + newExpireScore;

                console.log(newExpireScore);
                console.log(newTotalScore);

                if (newExpireScore > 0 && newTotalScore >= 60) 
                {
                	console.log("Updating doctor notification");
                    return DoctorNotifications.update({ "_id": ObjectId(req.params.doctor_id) }, {
                        $set: {
                            "scores.expireScore": newExpireScore,
                            "scores.totalScore": newTotalScore,
                            "createdAt": new Date()
                        }
                    });
                }
                else 
           		{
	            	console.log("Removing doctor notification");
	                DoctorNotifications.remove({ "_id": ObjectId(req.params.doctor_id) }, function(update){
	                	if (update)
	                	{
	                		res.status(201).send({ success: true, hasNotification: false });
	                	}
	                });
	            }
            }
        }).then(function(update) {
            if (update) {
                return DoctorNotifications.findOne({ "_id": ObjectId(req.params.doctor_id) });
            }
        }).then(function(notification) {
            if (notification) {
                res.status(201).send({ success: true, hasNotification: true, notification });
            }
        }).catch(function(err) {
            if (err)
            {
                res.status(500).send({ success: false, error: err });
            }
        });
});

router.post('/doctor/api/respond-to-match/', function(req, res) {
    var request = req.body;
    console.log(request);
    //res.status(201).send("Acknowledged");
    var today = new Date();
    if (request.choice == "accept") {

        Matches.findOne({ "_id": new Date(today.getFullYear(), today.getMonth(), today.getDate(), 0, 0, 0) })
            .then(function(date) {
            	console.log(date);
                if (date == null) {
                    var newMatchDoc = new Matches({
                        _id: new Date(today.getFullYear(), today.getMonth(), today.getDate(), 0, 0, 0),
                        organs: {
                            heart: 0,
                            kidney: 0,
                            liver: 0,
                            lung: 0,
                            pancreas: 0
                        }
                    });
                    return newMatchDoc.save();
                }

            }).then(function() {
        		if (request.organType == "Heart")
                {
                    return Matches.update({"_id": new Date(today.getFullYear(), today.getMonth(), today.getDate(), 0, 0, 0)},
                        {$inc : {"organs.heart": 1}});
                }
                else if (request.organType == "Kidney")
                {
                    return Matches.update({"_id": new Date(today.getFullYear(), today.getMonth(), today.getDate(), 0, 0, 0)},
                        {$inc : {"organs.kidney": 1}});
                }
                else if (request.organType == "Pancreas")
                {
                    return Matches.update({"_id": new Date(today.getFullYear(), today.getMonth(), today.getDate(), 0, 0, 0)},
                        {$inc : {"organs.pancreas": 1}});
                }
                else if (request.organType == "Lung")
                {
                    return Matches.update({"_id": new Date(today.getFullYear(), today.getMonth(), today.getDate(), 0, 0, 0)},
                        {$inc : {"organs.lung": 1}});
                }
                else if (request.organType == "Liver")
                {
                    return Matches.update({"_id": new Date(today.getFullYear(), today.getMonth(), today.getDate(), 0, 0, 0)},
                        {$inc : {"organs.liver": 1}});
                }

            	
            }).then(function(update){
            	if (update)
            	{
            		return Recipient.remove({"_id" : ObjectId(request.recipientId)});
            	}
            }).then(function(removed){
            	if (removed)
            	{	
            		return Donor.remove({"_id": ObjectId(request.donorId)});
            	}
            }).then(function(removed){
            	if (removed)
            	{
            		return Doctor.update({"patients" : ObjectId(request.recipientId)}, {$pull : {"patients" :  ObjectId(request.recipientId)}});	
            	}
            }).then(function(removed){
            	if (removed)
            	{
            		return Doctor.update({"patients" : ObjectId(request.donorId)}, {$pull : {"patients" :  ObjectId(request.donorId)}});
            	}
            }).then(function(removed){
            	if (removed)
            	{
            		return DoctorNotifications.remove({"_id" : ObjectId(request.doctorId)});
            	}	
            }).then(function(removed){
            	if (removed)
            	{	var waitlist;
        		    if (request.organType  == "Heart")
				    {

				        waitlist = schemas.Heart_Waitlist;
				    }
				    else if (request.organType  == "Liver")
				    {

				        waitlist = schemas.Liver_Waitlist;
				    }
				    else if (request.organType  == "Lung")
				    {
				        waitlist = schemas.Lung_Waitlist;
				    }
				    else if (request.organType  == "Pancreas")
				    {

				        waitlist = schemas.Pancreas_Waitlist;
				    }
				    else if (request.organType  == "Kidney")
				    {
				        waitlist = schemas.Kidney_Waitlist;
					}
					return waitlist.remove({"_id" : ObjectId(request.recipientId)});
            	}
            }).then(function(removed){
            	if (removed)
            	{
            		res.status(201).send({success : true, message : "All collections updated"});
            	}
            }).catch(function(err){
            	console.log(err);
            	res.status(500).send({success : true, message : "One of the update collections failed"});
            });
    }
    if (request.choice == "reject") 
    {
    	var newRejection = new Rejection({
    		organType: request.organType,
    		recipientId: request.recipientId,
    		donorId: request.donorId
    	});

    	newRejection.save()
    		.then(function(added){

    			return DoctorNotifications.remove({"_id" : ObjectId(request.doctorId)});
    		}).then(function(removed){
    			res.status(201).send({success : true, message : "Rejection accepted"});
    		}).catch(function(err){
    			res.status(500).send({success : true, err: err, message : "Adding to rejection collection failed"});
    		});
    }

    Donor.find()
    	.then(function(allDonors){
    		for (var i = 0; i < allDonors.length; i++)
    		{
    			matchingFunctions.generateMatchforDonor(allDonors[i]);
    		}
    	});


});

router.get('/doctor/api/doctors', function(req, res) {
    Doctor.find(function(err, data) {
        if (err)
            res.send(err);
        else
            res.json(data);
    });
});


router.get('/doctor/api/donors', function(req, res) {
    Donor.find(function(err, data) {
        if (err)
            res.send(err);
        else
            res.json(data);
    });
});

router.get('/doctor/api/recipients', function(req, res) {
    Recipient.find(function(err, data) {
        if (err)
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

    Doctor.findOne({ _id: req.params.doctor_id })
        .then(function(doctor) {
            patient_ids = doctor.patients;
            return patient_ids;
        }).then(function(patient_ids) {
            return Donor.find({ _id: { $in: patient_ids } }).then(function(donors) { return donors; });

        }).then(function(donors) {
            if (donors) {
                donorPatients = donors;
                patients.donorPatients = donorPatients;
            }
            return Recipient.find({ _id: { $in: patient_ids } }).then(function(recipients) { return recipients; });
        }).then(function(recipients) {
            if (recipients) {
                recipientPatients = recipients;
                patients.recipientPatients = recipientPatients;
            }
            res.status(201).send({ success: true, patients });
        });

});






//get donors on waitlist
router.get('/doctor/api/donors/waitlist/:organ/:start_date?/:end_date?', (req, res) => {
    var organType = req.params.organ;
    var start_date = req.params.start_date;
    var end_date = req.params.end_date;

    if (organType == "all") {
        if (start_date == undefined || end_date == undefined) {

            Donor.find((err, data) => {
                if (err)
                    res.send(err)
                else {
                    res.json(data);


                }
            })
        } else {
            Donor.find({ "created_on": { "$gte": start_date, "$lte": end_date } }, (err, data) => {
                if (err)
                    res.send(err)
                else
                    res.json(data);
            })
        }
    } else {
        if (start_date == undefined || end_date == undefined) {
            Donor.find({
                    "organType": organType
                },
                (err, data) => {
                    if (err)
                        res.send(err)
                    else {
                        res.json(data);

                    }
                })
        } else {
            Donor.find({ dateAdded: { "$gte": start_date, "$lt": end_date }, "organType": organType }, (err, data) => {
                if (err)
                    res.send(err)
                else {

                    res.json(data);
                }
            })
        }
    }

});

router.get('/doctor/api/recipients/waitlist/:organ/:start_date?/:end_date?', (req, res) => {
    var organ = req.params.organ;
    var start_date = req.params.start_date;
    var end_date = req.params.end_date;
    console.log(start_date, end_date);
    if (start_date != undefined && end_date != undefined) {
        if (organ == "Heart") {
            Heart_Waitlist.find({ dateAdded: { "$gte": start_date, "$lt": end_date } }, (err, data) => {
                if (err) {
                    res.send(err);
                } else {
                    console.log(data);
                    res.json(data);

                }
            });
        }
        if (organ == "Kidney") {
            Kidney_Waitlist.find({ dateAdded: { "$gte": start_date, "$lt": end_date } }, (err, data) => {
                if (err) {
                    res.send(err);
                } else {
                    res.json(data);

                }
            });
        }
        if (organ == "Lung") {
            Lung_Waitlist.find({ dateAdded: { "$gte": start_date, "$lt": end_date } }, (err, data) => {
                if (err) {
                    res.send(err);
                } else {
                    console.log(data);
                    res.json(data);

                }
            });
        }
        if (organ == "Liver") {
            Liver_Waitlist.find({ dateAdded: { "$gte": start_date, "$lt": end_date } }, (err, data) => {
                if (err) {
                    res.send(err);
                } else {
                    res.json(data);

                }
            });
        }
        if (organ == "Pancreas") {
            Pancreas_Waitlist.find({ dateAdded: { "$gte": start_date, "$lt": end_date } }, (err, data) => {
                if (err) {
                    res.send(err);
                } else {
                    res.json(data);

                }
            });
        }
    } else {
        if (organ == "Heart") {
            Heart_Waitlist.find((err, data) => {
                if (err) {
                    res.send(err);
                } else {
                    res.json(data);

                }
            });
        }
        if (organ == "Kidney") {
            Kidney_Waitlist.find((err, data) => {
                if (err) {
                    res.send(err);
                } else {
                    res.json(data);

                }
            });
        }
        if (organ == "Lung") {
            Lung_Waitlist.find((err, data) => {
                if (err) {
                    res.send(err);
                } else {
                    res.json(data);

                }
            });
        }
        if (organ == "Liver") {
            Liver_Waitlist.find((err, data) => {
                if (err) {
                    res.send(err);
                } else {
                    res.json(data);

                }
            });
        }
        if (organ == "Pancreas") {
            Pancreas_Waitlist.find((err, data) => {
                if (err) {
                    res.send(err);
                } else {
                    res.json(data);

                }
            });
        }
    }

});

router.get('/doctor/api/matches/:organ/:start_date?/:end_date?', (req, res) => {
    var organName = req.params.organ.toLowerCase();
    var start_date = req.params.start_date;
    var end_date = req.params.end_date;
    var selectCommand = 'organs.' + organName;
    if (start_date != undefined && end_date != undefined) {
        Matches.find({ _id: { "$gte": start_date, "$lte": end_date } }).select(selectCommand).exec((err, data) => {
            if (err)
                res.send(err);
            else {
                res.json(data);
            }
        });
    } else {
        Matches.find().select(selectCommand).exec((err, data) => {
            if (err)
                res.send(err);
            else {
                res.json(data);
            }

        });
    }
});

router.get('/doctor/api/wasted_organs/:organ/:start_date?/:end_date?', (req, res) => {
    var organName = req.params.organ.toLowerCase();
    var start_date = req.params.start_date;
    var end_date = req.params.end_date;
    var selectCommand = 'organs.' + organName;
    if (start_date != undefined && end_date != undefined) {
        Wasted.find({ _id: { "$gte": start_date, "$lte": end_date } }).select(selectCommand).exec((err, data) => {
            if (err)
                res.send(err);
            else {
                res.json(data);
            }
        });
    } else {
        Wasted.find().select(selectCommand).exec((err, data) => {
            if (err)
                res.send(err);
            else {
                res.json(data);
            }
        });
    }
});


router.get("/doctor/api/recipentsByID/:id", (req, res) => {
    var id = req.params.id;
    Recipient.findOne({ _id: ObjectId(id) }, (err, data) => {
        if (err) {
            res.send(err);
        } else {
            res.json(data);
        }
    });
});









router.post('/doctor/api/view-recipient-donor-info', function(req, res) {
    var request = {};
    var response = {};
    // if req.body is empty (form is empty), use query parameters 
    // to test API without front end via Postman or regular xmlhttprequest
    if (Object.keys(req.body).length === 0 && req.body.constructor === Object) {
        console.log("using req.query");
        request = req.query;
    } else {
        console.log("using req.body")
        request = req.body;
    }

    console.log(request);

    Recipient.findOne({ "_id": ObjectId(request.recipient_id) })
        .then(function(recipient) {
            response.recipient = recipient;

            return Donor.findOne({ "_id": ObjectId(request.donor_id) });
        }).then(function(donorInfo) {
            if (donorInfo) {
                var donor = {};
                donor.organType = donorInfo.organType;
                donor.HLAType = donorInfo.HLAType;
                donor.bloodType = donorInfo.bloodType;
                donor.organSize = donorInfo.organSize;
                response.donor = donor;

                res.status(201).send({ success: true, response });
            } else {
                res.status(201).send({ success: true, response: "Donor no longer in system, but notification still exists" });
            }
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