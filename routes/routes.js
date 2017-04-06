var express = require('express');
var router = express.Router();

//authentication
var app = express();
var jwt = require('jsonwebtoken');
app.set('superSecret', process.env.SECRET);
app.set('doctorSecret', process.env.DOCTOR_SECRET);

var ObjectId = require('mongoose').Types.ObjectId; 


//matching functions
var matchingFunctions = require("../matchingFunctions");

var schemas = require("../models/schemas");

var Hospital = schemas.Hospital;

var Doctor = schemas.Doctor;

var Donor = schemas.Donor;

var Recipient = schemas.Recipient;

var User = schemas.User;

var DoctorNotifications = schemas.DoctorNotifications;


//******************************
//******************************
//***** PUBLIC API ROUTES*******
//******************************
//******************************


Recipient.findOne()
    .then(function(recip)
    {

        return matchingFunctions.generateMatchforRecipient(recip);
        
    });


router.get('/api/hospitals/names', function(req, res){
    Hospital.find({}, {name: 1}, function(err, data){
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
        	var newDoctor = new Doctor({
        		_id : newUser._id,
        		name : newUser.name
        	});

        	return newDoctor.save().then(function() {return newUser;});
        
        }).then(function(newUser) {
        	Hospital.findOneAndUpdate({"_id": request.selectedHospital._id}, {$push: {doctors: {"_id" :newUser._id}}}).then(function() {return Hospital});
        }).then(function(Hospitals){
            res.status(201).send({ok: true, message: 'Added user successfully'});
        }).catch(function(err) {
			var errorCode = err.code || 500;
            res.status(errorCode).send({ok: false, message: err.message, errors: err.errors});
        });
    });



//user
router.post('/api/authenticate', function(req, res) {
    //console.log(req.body);
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
    Hospital.find(function(err, data){
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

    Hospital.findOne({
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

    var recip;

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

            console.log(request.dob);

            return newRecipient.save().then(function() { return newRecipient; });
        }).catch(function(err) {
            errors.validationError = err;
            res.status(500).send({success: false, errors});
        }).then(function(newRecipient){
            recip = newRecipient;
            Doctor.findOneAndUpdate({"_id": request.doctor_id}, {$push:{patients: newRecipient._id}
        }).then(function(newRecipient) {return newRecipient});
            if (newRecipient){
                return matchingFunctions.addRecipientToWaitlist(newRecipient);
            }
      
        }).then(function(){
        	
            matchingFunctions.generateMatchforRecipient(recip);
            
        }).then(function(){
        	res.status(201).send({ok: true, message: 'Recipient added successfully'});

        }).catch(function(err) {
            console.log(err);
            res.status(500).send({success: false, err});
        });
    });

//ADD Donors to donor list
router.post('/doctor/api/donors', function(req, res) {
    //console.log(req.body);
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
                dob : new Date(Date.parse(request.dob)),
                organType : request.selectedOrganType,
                bloodType : request.selectedBloodType,
                HLAType : request.HLAType,
                organSize : request.organSize,
                deceased : request.selectedDeceased,
            });
            return newDonor.save().then(function() { return newDonor; });
        }).catch(function(err) {
            errors.validationError = err;
            res.status(500).send({success: false, errors});
        }).then(function(newDonor){
            return Doctor.findOneAndUpdate({"_id": request.doctor_id}, {$push:{patients: newDonor._id}});
        }).then(function(newDonor){
            if (newDonor)
            {
                res.status(201).send({ok: true, message: 'Donor added successfully'});
                return matchingFunctions.generateMatchforDonor(newDonor);
            }
        }).catch(function(err) {
            console.log(err);
            res.status(500).send({success: false, err});
        });
    });

router.get('/doctor/api/hospital-info/:doctor_id', function(req, res){
    console.log(req.params.doctor_id);
    Hospital.findOne({"doctors" : { "_id" : ObjectId(req.params.doctor_id)}})
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

router.get('/doctor/api/doctor-notification/:doctor_id', function(req, res){

	DoctorNotifications.findOne({"_id" : ObjectId(req.params.doctor_id)})
		.then(function(notification){
			if (notification)
			{
				res.status(201).send({success: true, hasNotification: true, notification});
			}
		}).catch(function(err){
            res.status(500).send({success: false, error : err});	
		});
});


router.get('/doctor/api/doctors', function(req, res) {
    Doctor.find(function(err, data){
        if(err)
            res.send(err);
        else
            res.json(data);
    });
});


router.get('/doctor/api/donors', function(req, res) {
    Donor.find(function(err, data){
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

    Doctor.findOne({_id : req.params.doctor_id})
        .then(function(doctor){
            patient_ids  = doctor.patients;
            return patient_ids;
        }).then(function(patient_ids){
            return Donor.find({_id : {$in : patient_ids}}).then(function(donors) {return donors;});

        }).then(function(donors){
            if (donors)
            {
            donorPatients = donors;
            patients.donorPatients = donorPatients;
            }
            return Recipient.find({_id : {$in : patient_ids}}).then(function(recipients) {return recipients;});
        }).then(function(recipients){
            if (recipients)
            {
            recipientPatients = recipients;
            patients.recipientPatients = recipientPatients;
            }
            res.status(201).send({success: true, patients});
        });
    
});

router.post('/doctor/api/view-recipient-donor-info', function(req,res){
    var request = {};
    var response = {};
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

    Recipient.findOne({"_id" : ObjectId(request.recipient_id)})
    	.then(function(recipient){
    		response.recipient = recipient;

    		return Donor.findOne({"_id": ObjectId(request.donor_id)});
    	}).then(function(donorInfo){
    		var donor = {};
    		donor.organType = donorInfo.organType;
    		donor.HLAType = donorInfo.HLAType;
    		donor.bloodType = donorInfo.bloodType;
    		donor.organSize = donorInfo.organSize;
    		response.donor = donor;

    		res.status(201).send({success:true, response});
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