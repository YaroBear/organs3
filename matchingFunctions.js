var mongoose = require('mongoose');
var Schema = mongoose.Schema;
mongoose.Promise = Promise;
var ObjectId = require('mongoose').Types.ObjectId;

var mapsKey = process.env.GOOGLE_MAPS;


var schemas = require("./models/schemas");

var Hospital = schemas.Hospital;

var Doctor = schemas.Doctor;

var Donor = schemas.Donor;

var Recipient = schemas.Recipient;

var User = schemas.User;

var DoctorNotifications = schemas.DoctorNotifications;

var WastedOrgans = schemas.WastedOrgans;


var googleMapsClient = require('@google/maps').createClient({
  key: mapsKey,
  Promise: Promise
});

var waitlistSchema = new Schema({
    dateAdded: {type: Date, required: true},
    priority : {type: Number, required: true}
});

var calculateAge = function(dob) //time object
{
    var ageDifMs = Date.now() - Date.parse(dob);
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
        // waitlist = mongoose.model('heart_waitlists', waitlistSchema);
        waitlist = schemas.Heart_Waitlist;
    }
    else if (recipient.organType == "Liver")
    {
        //waitlist = mongoose.model('liver_waitlists', waitlistSchema);
        waitlist = schemas.Liver_Waitlist;

    }
    else if (recipient.organType == "Lung")
    {
        //waitlist = mongoose.model('lung_waitlists', waitlistSchema);
        waitlist = schemas.Lung_Waitlist;

    }
    else if (recipient.organType == "Pancreas")
    {
        //waitlist = mongoose.model('pancreas_waitlists', waitlistSchema);
        waitlist = schemas.Pancreas_Waitlist;

    }
    else if (recipient.organType == "Kidney")
    {
        //waitlist = mongoose.model('kidney_waitlists', waitlistSchema);
        waitlist = schemas.Kidney_Waitlist;

    }

    var priority = calculatePriority(recipient);

    var targetWaitlist = new waitlist({"_id": recipient._id, "dateAdded" : recipient.dateAdded, "priority" : priority});

    return targetWaitlist.save().then(function(){return waitlist});
};

var getOrganTimeScore = function(donor) {
    console.log("Determining donor organ age compatability");
    var preservationTimes = {
        "Kidney" : 36,
        "Pancreas": 18,
        "Liver": 12,
        "Heart": 6,
        "Lungs": 6
        };
    var diffMs = (Date.now() - donor.dateAdded);
    var diffHours = diffMs/(60*60*1000);
    var hoursLeft = preservationTimes[donor.organType] - diffHours;
    var percentageLeft = hoursLeft/preservationTimes[donor.organType];

    if (percentageLeft <= 0)
    {
        return 0;
    }
    else
    {
        console.log("Organ expire time score: " + (percentageLeft * 15));
        return (percentageLeft * 15); // max 15
    }
};


var deleteDonorUpdateWastedCollection = function(donor){
    var today = new Date();

    WastedOrgans.findOne({"_id": new Date(today.getFullYear(), today.getMonth(), today.getDate(), 0, 0, 0)})
                .then(function(date)
                {
                    if (date == null)
                    {
                        var wastedDoc = new WastedOrgans({
                            _id: new Date(today.getFullYear(), today.getMonth(), today.getDate(), 0, 0 ,0),
                            organs: {
                                heart: 0,
                                kidney: 0,
                                liver: 0,
                                lung: 0,
                                pancreas: 0
                            }
                        });
                        return wastedDoc.save();
                    }

                }).then(function(update){
                    console.log("Updating wasted organ collection");
                    if (donor.organType == "Heart")
                    {
                        return WastedOrgans.update({"_id": new Date(today.getFullYear(), today.getMonth(), today.getDate(), 0, 0, 0)},
                            {$inc : {"organs.heart": 1}});
                    }
                    else if (donor.organType == "Kidney")
                    {
                        return WastedOrgans.update({"_id": new Date(today.getFullYear(), today.getMonth(), today.getDate(), 0, 0, 0)},
                            {$inc : {"organs.kidney": 1}});
                    }
                    else if (donor.organType == "Pancreas")
                    {
                        return WastedOrgans.update({"_id": new Date(today.getFullYear(), today.getMonth(), today.getDate(), 0, 0, 0)},
                            {$inc : {"organs.pancreas": 1}});
                    }
                    else if (donor.organType == "Lung")
                    {
                        return WastedOrgans.update({"_id": new Date(today.getFullYear(), today.getMonth(), today.getDate(), 0, 0, 0)},
                            {$inc : {"organs.lung": 1}});
                    }
                    else if (donor.organType == "Liver")
                    {
                        return WastedOrgans.update({"_id": new Date(today.getFullYear(), today.getMonth(), today.getDate(), 0, 0, 0)},
                            {$inc : {"organs.liver": 1}});
                    }
                }).then(function(update){
                    console.log(update);
                    return Donor.findOneAndRemove({"_id" : ObjectId(donor._id)})
                }).then(function(update){
                    console.log("Expired donor deleted");
                });
};

var getMatchingScore = function(donor, recipient) {
    return new Promise(function(resolve, reject){
        var scoreDetails = {};
        var zeroScore = {totalScore : 0};
        var score = 0;

        // organ age check
        //

        var organTimeScore = getOrganTimeScore(donor);
        scoreDetails.expireScore = organTimeScore;

        if (organTimeScore == 0)
        {
            //kick donor off the list
            resolve(zeroScore); // next candidate
            deleteDonorUpdateWastedCollection(donor);
            return 0;
        }


        score += organTimeScore;

        console.log("Comparing organs");
        if (donor.organType !== recipient.organType)
        {
            console.log("Organ doesn't match");
            resolve(zeroScore);
            return score; //0
        }

        // region hard check
        //
        if (donor.region != recipient.region)
        {
            console.log("Region doesn't match");
            resolve(zeroScore);
            return score; // 0
        }

        // blood type hard check
        //
        console.log("Comparing blood types");   
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
                console.log("Incompatible blood type");
                resolve(zeroScore);
                return score; // 0
            }
        }

        // hla type check
        //
        console.log("Comparing HLA Types");
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
            return (Math.pow(matches,2));
        }

        var HLAscore = getHLAscore();
        if (HLAscore == 0)
        {
            console.log("Zero HLA match");
            resolve(zeroScore);
            return score; //0
        }
        else
        {
            console.log("HLA score: " + HLAscore);
            scoreDetails.HLAscore = HLAscore;
            score += HLAscore;
        }


        //organ size check
        //
        console.log("Determining organ size match +- 15%")
        var getOrganSizeScore = function(){
            var difference = (Math.abs(recipient.organSize - donor.organSize));
            var percentDiff = (difference/recipient.organSize);

            if (percentDiff < .15)
            {
                console.log("Organ size score: " + (15 - (percentDiff * 100)));
                scoreDetails.sizeScore = (15 - (percentDiff * 100));
                return (15 - (percentDiff * 100)); //max score is 15
            }
            else
            {
                console.log("Organ sizes differ by more than 15%");
                return 0;
            }
        };

        var organSizeScore = getOrganSizeScore();
        score += organSizeScore;

        // pediatric bonus check
        //
        console.log("Determining pediatric status of patients");
        var recipientAge = calculateAge(recipient.dob);
        var donorAge = calculateAge(donor.dob);

        console.log("Recipient age : " + recipientAge + " Donor age : " + donorAge);

        if (recipientAge <= 18 && donorAge <= 18)
        {
            console.log("Adding pediatric bonus: 10");
            scoreDetails.pediatricBonus = 10;
            score += 10;
        }
        else
        {
            scoreDetails.pediatricBonus = 0;
        }

        // check kidney living status
        //

        if (recipient.organType == "Kidney" && !donor.deceased)
        {
            console.log("Adding living donor kidney bonus: 9");
            scoreDetails.kidneyBonus = 9;
            score += 9;
        }
        else
        {
            scoreDetails.kidneyBonus = 0;
        }

        var donorHospitalAddress = "";
        var recipientHospitalAddress = "";
        var avgHeliSpeed = 240000; // m/h

        console.log("Computing distance score");
        Doctor.findOne({"patients": ObjectId(recipient._id)})
            .catch(function(err)
            {
                console.log(err);
            })
            .then(function(doctor){
                if (doctor)
                {
                    console.log("Found recipient in doctors list");
                    //console.log(doctor);
                    scoreDetails.doctor = doctor._id;
                    var recipientDoctor = {};
                    recipientDoctor.id = doctor._id;

                    return Hospital.findOne({"doctors": {"_id" : ObjectId(recipientDoctor.id)}}).then(function(hospital) {return hospital;});
                }
            }).catch(function(err){
                console.log(err);
            }).then(function(hospital){
                recipientHospitalAddress = hospital.address;

                return Doctor.findOne({"patients": ObjectId(donor._id)}).then(function(doctor) {return doctor;})
            }).catch(function(err){
                console.log(err);
            }).then(function(doctor){
                console.log("Found donor in doctors list");

                var donorDoctor = {};
                donorDoctor.id = doctor._id;

                return Hospital.findOne({"doctors": {"_id" : ObjectId(donorDoctor.id)}}).then(function(hospital) {return hospital;});
            }).catch(function(err){
                console.log(err);
            }).then(function(hospital){
                donorHospitalAddress = hospital.address;
                return googleMapsClient.distanceMatrix({
                    origins: recipientHospitalAddress.street + " " + recipientHospitalAddress.zip,
                    destinations: donorHospitalAddress.street + " " + donorHospitalAddress.zip,
                        }).asPromise();
            }).then(function(response){
                var travelScore = 0;
                //console.log(response.json.rows[0].elements[0].distance.value);
                var distanceMeters = response.json.rows[0].elements[0].distance.value;
                var travelHours = distanceMeters/avgHeliSpeed;
                var diffMs = (Date.now() - donor.dateAdded); //donor organ expire time left
                var organHoursLeft = diffMs/(60*60*1000);

                var travelDifference =  organHoursLeft - travelHours;

                if (travelDifference > 0)
                {
                    travelScore = (travelDifference/organHoursLeft)*15;
                }

                scoreDetails.travelScore = travelScore;
                score += travelScore;
                scoreDetails.totalScore = score;
                scoreDetails.recipient = recipient._id;
                scoreDetails.donor = donor._id;
                //res.json(response);
                console.log("Distance score: " + travelScore);
        
                resolve(scoreDetails);

            });


    });

	
};

var generateMatchforDonor = function(donor) {
    var doner = donor;
    var waitlist = {};
    if (donor.organType == "Heart")
    {
        // waitlist = mongoose.model('heart_waitlists', waitlistSchema);
        waitlist = schemas.Heart_Waitlist;
    }
    else if (donor.organType == "Liver")
    {
        //waitlist = mongoose.model('liver_waitlists', waitlistSchema);
        waitlist = schemas.Liver_Waitlist;
    }
    else if (donor.organType == "Lung")
    {
        //waitlist = mongoose.model('lung_waitlists', waitlistSchema);
        waitlist = schemas.Lung_Waitlist;
    }
    else if (donor.organType == "Pancreas")
    {
        //waitlist = mongoose.model('pancreas_waitlists', waitlistSchema);
        waitlist = schemas.Heart_Waitlist;
    }
    else if (donor.organType == "Kidney")
    {
        //waitlist = mongoose.model('kidney_waitlists', waitlistSchema);
        waitlist = schemas.Heart_Waitlist;
    }
    waitlist.find().sort({"priority" : -1}).exec(function(err, sortedList){
        console.log(sortedList);
        var matchScore = 0;
        scorePromises = [];
        var recipientID;
        for (i = 0; i < sortedList.length; i++)
        {
            recipientID = sortedList[i]._id;
            Recipient.findOne({"_id": recipientID})
                .then(function(recipient){
                    if (recipient)
                    {
                        var scorePromise = new getMatchingScore(donor, recipient);
                        scorePromises.push(scorePromise);
                    }
                });
        }
        Promise.all(scorePromises).then(function(scoresArray){
            notifyRecipientDoctor(scoresArray);
        });
    });
};


var notifyRecipientDoctor = function(scoresArray) {
    var scoreCompare = function(a,b){
      return b.totalScore - a.totalScore; 
    };

    var sortedScoresArray = scoresArray.sort(scoreCompare);

    var winner = sortedScoresArray[0];

    var organType = winner.organType;


    if (winner && winner.totalScore > 60)
    {
        DoctorNotifications.findOne({"_id": ObjectId(winner.doctor)})
            .then(function(notification){
                if (!notification)
                {
                    console.log("Notifiying Doctor of donor match");
                    var newDoctorNotification = new DoctorNotifications({"_id": ObjectId(winner.doctor), "createdAt" : new Date(),
                    "donor": ObjectId(winner.donor), "recipient" : ObjectId(winner.recipient), scores : {"HLAscore": winner.HLAscore,
                    "sizeScore": winner.sizeScore, "travelScore": winner.travelScore, "expireScore": winner.expireScore, "totalScore": winner.totalScore,
                    "kidneyBonus" : winner.kidneyBonus, "pediatricBonus" :winner.pediatricBonus}});

                    newDoctorNotification.save(function(err, doc){
                        if (err) console.log(err);
                        console.log(doc);
                    });
                }
            });
    }



    if (winner && winner.totalScore > 60)
    {
        console.log("Notifiying Doctor of donor match");
        var newDoctorNotification = new DoctorNotifications({"_id": ObjectId(winner.doctor), "createdAt" : new Date(), "expiresAt" : new Date(Date.now() + 3600*1000),
        "donor": ObjectId(winner.donor), "recipient" : ObjectId(winner.recipient), scores : {"HLAscore": winner.HLAscore,
        "sizeScore": winner.sizeScore, "travelScore": winner.travelScore, "expireScore": winner.expireScore, "totalScore": winner.totalScore,
        "kidneyBonus" : winner.kidneyBonus, "pediatricBonus" :winner.pediatricBonus}});

        newDoctorNotification.save(function(err, doc){
            if (err) console.log(err);
            console.log(doc);
    });
    }
};

var generateMatchforRecipient = function(recipient) {
    Donor.find()
        .then(function(donorCollection){
            var donorCollection = donorCollection;
            var scorePromises = [];
            

            for (var i = 0; i < donorCollection.length; i++)
            {
                console.log("Matching recip against donor: ", donorCollection[i]);
                
                var scorePromise = new getMatchingScore(donorCollection[i], recipient);
                scorePromises.push(scorePromise);
            }

            Promise.all(scorePromises).then(function(scoresArray){
                notifyRecipientDoctor(scoresArray);
            });
        });

};

exports.generateMatchforDonor = generateMatchforDonor;
exports.generateMatchforRecipient = generateMatchforRecipient;
exports.addRecipientToWaitlist = addRecipientToWaitlist;
exports.generateMatchforDonor = generateMatchforDonor;
exports.getMatchingScore = getMatchingScore;
exports.getOrganTimeScore = getOrganTimeScore;
exports.deleteDonorUpdateWastedCollection = deleteDonorUpdateWastedCollection;