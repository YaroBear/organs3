var mongoose = require('mongoose');
var Schema = mongoose.Schema;
mongoose.Promise = Promise;
var ObjectId = require('mongoose').Types.ObjectId; 

// connecting to Mlab
var mongodb_uri = process.env.MONGODB_URI;
mongoose.connect(mongodb_uri);

//******************************
//******************************
//***********SCHEMAS************
//******************************
//******************************

var doctorNotificationSchema = new Schema({
    donor: {type: String, required: true},
    recipient : {type: String, required: true},
    scores: {
        HLAscore: {type: Number, required: true},
        sizeScore: {type: Number, required: true},
        travelScore: {type : Number, required: true},
        kidneyBonus: {type :Number, required: true},
        pediatricBonus : {type :Number, required: true},
        expireScore: {type: Number, required: true},
        totalScore: {type: Number, required: true}
    },
    responded: {type: Boolean, default: false}
});

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


//DOCTOR SCHEMA
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
    HLAType: {type: String, validate: {
            validator: function(v) {
                return /\d{6}/.test(v);
            },
            message: "Please enter HLA matching criteria as xxxxxx"
        }, required: [true, "HLA type is required"]},
    height: {type: String, required: [true, "height is required"]},
    weight: {type: String, required: [true, "weight is required"]},
    organType: {type: String, required: [true, "Please select an organ type"]},
    dob: {type: Date, required: [true, "Please enter patient date of birth"]},
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
    HLAType: {type: String, validate: {
            validator: function(v) {
                return /\d{6}/.test(v);
            },
            message: "Please enter HLA matching criteria as xxxxxx"
        }, required: [true, "HLA type is required"]},
    height: {type: String, required: [true, "height is required"]},
    weight: {type: String, required: [true, "weight is required"]},
    organType: {type: String, required: [true, "Please select an organ type"]},
    sex: {type: String, required: [true, "Please enter patient sex"]},
    dob: {type: Date, required: [true, "Please enter patient date of birth"]},
    organType: {type: String, required: [true, "Please select an organ type"]},
    bloodType: {type: String, required: [true, "Please select a blood type"]},
    organSize: {type: String, required: [true, "Please enter organ size"]},
    urgency: {type: String, required: [true, "Please specify urgency"]},

});

var waitlistSchema = new Schema({
    dateAdded: {type: Date, required: true},
    priority : {type: Number, required: true}
});


exports.Hospital = mongoose.model('hospitals', hospitalSchema);

exports.Doctor = mongoose.model('doctors', doctorSchema);

exports.Donor = mongoose.model('donors', donorSchema);

exports.Recipient = mongoose.model('recipients', recipientSchema);

exports.User = mongoose.model('users', userSchema);

exports.DoctorNotifications = mongoose.model('doctor_notifications', doctorNotificationSchema);
