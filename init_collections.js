var mongodb = require("mongodb");

var initial_data = require("./initial_data")

// mongodb URI is stored as an enviroment variable
// as to not reveal username and password
var mongodb_uri = process.env.MONGODB_URI; 

// connecting to the DB
mongodb.MongoClient.connect(mongodb_uri, function(error, db) {

	if (error) throw error;

	var donors = db.collection('donors');
	var recipients = db.collection('recipients');
	var heart_waitlist = db.collection('heart_waitlist');
	var kidney_waitlist = db.collection('kidney_waitlist');
	var lungs_waitlist = db.collection('lungs_waitlist');
	var doctors = db.collection("doctors");
	var hospitals = db.collection("hospitals");

	// inserting all the collections, no relationships yet

	donors.insertMany(initial_data.donors, function(error, result) {
		if (error) throw error;
	});


	recipients.insertMany(initial_data.recipients, function(error, result){
		if (error) throw error;
	});

	doctors.insertMany(initial_data.doctors, function(error, result){
		if (error) throw error;
	});

	hospitals.insertMany(initial_data.hospitals, function(error, result){
		if (error) throw error;
	});

	// inserting doctors into hospitals, establish relationship
	// for each doctor in the doctor collection, find a document in the hospital collection
	// where the doctors array is empty, and add a reference to that doctor
	doctors.find().forEach( function(doctor) {
		hospitals.findOneAndUpdate({doctors: []}, {$push: {doctors : doctor._id}});
	});


	// inserting recipients into the correct waitlist
	// for each recipient, if recipient.organs.heart exists, put a reference to recipient 
	// into the heart waitlist and the time added. And so on...
	recipients.find().forEach (function(recipient) {
		
		var time = new Date();

		if (recipient.matching_info.organs[0].heart)
		{
			heart_waitlist.insert({_id : recipient._id,  time_added : time}, function(error, result){
				if (error) throw error;
		});
		}
		if (recipient.matching_info.organs[0].kidney)
		{
			kidney_waitlist.insert({_id : recipient._id,  time_added : time}, function(error, result){
				if (error) throw error;
		});
		}
		if (recipient.matching_info.organs[0].lungs)
		{
			lungs_waitlist.insert({_id : recipient._id,  time_added : time}, function(error, result){
				if (error) throw error;
		});
		}
	});

	// for each recipient in the recipients collection, find one hospital that has the patient's
	// organ listed in its array of procedures, and assign that patient to a doctor
	recipients.find().forEach (function(recipient) {
		var organ = "";
		for (organ in recipient.matching_info.organs[0]){};
		console.log(organ);
		hospitals.findOne({procedures : { $in :[organ] }}).then(function(result){
			if (result.doctors[0])
			{
			var doctor_id = result.doctors[0];
			doctors.findOneAndUpdate({_id : doctor_id}, {$push : {patients : recipient._id}});
			}
		});
	});

	// same thing for donors


});