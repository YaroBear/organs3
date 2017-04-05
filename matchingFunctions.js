var mongoose = require('mongoose');
var Schema = mongoose.Schema;
mongoose.Promise = Promise;
var ObjectId = require('mongoose').Types.ObjectId;

var waitlistSchema = new Schema({
    dateAdded: Date,
    priority : Number
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
    var waitlist = {};
    if (recipient.organType == "Heart")
    {
        waitlist = mongoose.model('heart_waitlist', waitlistSchema);
    }
    else if (recipient.organType == "Liver")
    {
        waitlist = mongoose.model('liver_waitlist', waitlistSchema);
    }
    else if (recipient.organType == "Lung")
    {
        waitlist = mongoose.model('lung_waitlist', waitlistSchema);
    }
    else if (recipient.organType == "Pancreas")
    {
        waitlist = mongoose.model('pancrease_waitlist', waitlistSchema);
    }
    else if (recipient.organType == "Kidney")
    {
        waitlist = mongoose.model('kidney_waitlist', waitlistSchema);
    }

    var priority = calculatePriority(recipient);

    waitlist.insert({"_id": recipient._id, "dateAdded" : recipient.dateAdded, "priority" : priority}, function(err, waitlist){
        if (err) throw err;
        else console.log("Added recipient to waitlist");
    });
};


var generateMatchforDonor = function(donor) {
    var waitlist = {};
    if (donor.organType == "Heart")
    {
        waitlist = mongoose.model('heart_waitlist', waitlistSchema);
    }
    else if (donor.organType == "Liver")
    {
        waitlist = mongoose.model('liver_waitlist', waitlistSchema);
    }
    else if (donor.organType == "Lung")
    {
        waitlist = mongoose.model('lung_waitlist', waitlistSchema);
    }
    else if (donor.organType == "Pancreas")
    {
        waitlist = mongoose.model('pancrease_waitlist', waitlistSchema);
    }
    else if (donor.organType == "Kidney")
    {
        waitlist = mongoose.model('kidney_waitlist', waitlistSchema);
    }

    waitlist.find().sort({"priority" : -1}).exec(function(err, sortedList){
        console.log(sortedList);
    });
};

exports.generateMatchforDonor = generateMatchforDonor;
exports.addRecipientToWaitlist = addRecipientToWaitlist;