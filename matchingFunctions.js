var mongoose = require('mongoose');
var Schema = mongoose.Schema;
mongoose.Promise = Promise;
var ObjectId = require('mongoose').Types.ObjectId;

var mapsKey = process.env.GOOGLE_MAPS;

var googleMapsClient = require('@google/maps').createClient({
  key: mapsKey
});

var waitlistSchema = new Schema({
    dateAdded: {type: Date, required: true},
    priority : {type: Number, required: true}
});

var calculateAge = function(dob) //time object
{
    var ageDifMs = Date.now() - dob.getTime();
    var ageDate = new Date(ageDifMs); // miliseconds from epoch
    return Math.abs(ageDate.getUTCFullYear() - 1970); // return age in years
}

var calculatePriority = function(recipient) {
    var score = recipient.urgency * 9.0909;
    var age = calculateAge(recipient.dob);
    if (age <= 18)
    {
        score *= 1.1;
    }
    else if (age > 50)
    {
        score -= (age - 50)*0.2;
    }
    return score;
};

var addRecipientToWaitlist = function(recipient) {

	console.log("Adding recipient to correct waitlist");

    var waitlist;

    if (recipient.organType == "Heart")
    {
        waitlist = mongoose.model('heart_waitlists', waitlistSchema);
    }
    else if (recipient.organType == "Liver")
    {
        waitlist = mongoose.model('liver_waitlists', waitlistSchema);
    }
    else if (recipient.organType == "Lung")
    {
        waitlist = mongoose.model('lung_waitlists', waitlistSchema);
    }
    else if (recipient.organType == "Pancreas")
    {
        waitlist = mongoose.model('pancreas_waitlists', waitlistSchema);
    }
    else if (recipient.organType == "Kidney")
    {
        waitlist = mongoose.model('kidney_waitlists', waitlistSchema);
    }

    var priority = calculatePriority(recipient);

    var targetWaitlist = new waitlist({"_id": recipient._id, "dateAdded" : recipient.dateAdded, "priority" : priority});

    return targetWaitlist.save().then(function(){return waitlist});
};


var getMatchingScore = function(donor, recipient) {

	var score = 0;

	// region hard check
	//
	if (donor.region != recipient.region)
	{
		return score; // 0
	}

    // blood type hard check
	//	
	var bloodMatch = {
		"A+" : ["A+", "A-", "O+", "O-"],
		"A-" : ["A-", "O-"],
		"B+" : ["B+", "B-", "O+", "O-"],
		"A-" : ["B-", "O-"],
		"AB-" : ["AB-", "A-", "B-", "O-"],
		"O+" : ["O+", "O-"],
		"O-": ["O-"],
		// AB+ everyone
        };

    if (recipient.bloodtype != "AB+")
    {
		if (!bloodMatch[recipient.bloodType].includes(donor.bloodType))
		{
			return score; // 0
		}
    }

    // hla type check
    //
    var getHLAscore = function()
    {
    	var matches = 0;
    	for (var i = 0; i < 6; i++)
			{
				if (recipient.HLAType[i] == donor.HLAType[i])
				{
					matches += 1;
				}
			}
		return matches**2;
    }

    var HLAscore = getHLAscore();
    if (HLAscore == 0)
    {
    	return score; //0
    }
    else
    {
    	score += HLAscore;
    }

    // organ age check
    //
    var preservationTimes = {
    	"Kidney" : 36,
    	"Pancreas": 18,
    	"Liver": 12,
    	"Heart": 6,
    	"Lungs": 6
    };

    var getOrganTimeScore = function() {
    	var diffMs = (Date.now() - donor.dateAdded);
    	var diffHours = diffMs/(60*60*1000);
    	var multiplier = 15/(preservationTimes[donor.organType]);

    	if (diffHours <= 0)
    	{
    		return 0;
    	}
    	else
    	{
    		return (diffHours * multiplier); // max 15
    	}
    };

    var organTimeScore = getOrganTimeScore();

    if (organTimeScore == 0)
    {
    	//kick donor off the list
    	return 0; // next candidate
    }

    //organ size check
    //

    var getOrganSizeScore = function(){
    	var difference = Math.abs(recipient.organSize - donor.organSize);
    	var percentDiff = difference/recipient.organSize;

    	if (percentDiff < .15)
    	{
    		return (15 - (percentDiff * 100)); //max score is 15
    	}
    	else
    	{
    		return 0;
    	}
    };

    var organSizeScore = getOrganSizeScorel
    score += organSizeScore;

    // pediatric bonus check
    //

    var recipientAge = calculateAge(recipient.dob);
    var donorAge = calculateAge(donor.dob);

    if (recipientAge <= 18 && donorAge <= 18)
    {
    	score += 10;
    }

    // check kidney living status
    //

    if (recipient.organType == "Kidney" && !donor.deceased)
    {
    	score += 9;
    }


	googleMapsClient.distancematrix({
		origins: '1600 Amphitheatre Parkway, Mountain View, CA',
		destinations: ,
		}, function(err, response) {
			if (!err) {
			console.log(response.json.results);


			// 
		}
	});

   

};

var generateMatchforDonor = function(donor) {
    var waitlist = {};
    if (donor.organType == "Heart")
    {
        waitlist = mongoose.model('heart_waitlists', waitlistSchema);
    }
    else if (donor.organType == "Liver")
    {
        waitlist = mongoose.model('liver_waitlists', waitlistSchema);
    }
    else if (donor.organType == "Lung")
    {
        waitlist = mongoose.model('lung_waitlists', waitlistSchema);
    }
    else if (donor.organType == "Pancreas")
    {
        waitlist = mongoose.model('pancrease_waitlists', waitlistSchema);
    }
    else if (donor.organType == "Kidney")
    {
        waitlist = mongoose.model('kidney_waitlists', waitlistSchema);
    }

    waitlist.find().sort({"priority" : -1}).exec(function(err, sortedList){
        console.log(sortedList);
    });
};

var generateMatchforRecipient = function(reciepint) {

};

exports.generateMatchforDonor = generateMatchforDonor;
exports.addRecipientToWaitlist = addRecipientToWaitlist;
exports.generateMatchforDonor = generateMatchforDonor;