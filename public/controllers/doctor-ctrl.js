var doctor = angular.module('doctor', [])

.controller("doctorController", ["$scope", "$http", "$window", function doctorController($scope, $http, $window) {

    var token = localStorage.getItem("token");


    var matchedRecipient;
    var matchedDonor;
    var matchedOrgan;


    $scope.doctorName = localStorage.getItem("user");
    var doctor_id = localStorage.getItem("mongo_id");
    $scope.defaultView = true;
    $scope.patientView = false;
    $scope.donorsPanel = false;
    $scope.recipientsPanel = false;
    $scope.matchFound = false;
    $scope.statsPanel = false;

    $scope.addDonorsPanel = false;
    $scope.addRecipientsPanel = false;

    $scope.addDonorView = function() {
        //$window.location.href = "/doctor/addDonor" + "?token=" + token;
        $scope.defaultView = false;
        $scope.addDonorsPanel = true;
        $scope.addRecipientsPanel = false;
        $scope.patientView = false;
        $scope.statsPanel = false;
    }
    $scope.addRecipientView = function() {
        //$window.location.href = "/doctor/addRecipient" + "?token=" + token;
        $scope.defaultView = false;
        $scope.addRecipientsPanel = true;
        $scope.addDonorsPanel = false;
        $scope.patientView = false;
        $scope.statsPanel = false;
    }
    $scope.statsView = function() {
        $scope.defaultView = false;
        $scope.addRecipientsPanel = false;
        $scope.addDonorsPanel = false;
        $scope.patientView = false;
        $scope.statsPanel = true;
    };

    $http({
        method: "GET",
        url: '/doctor/api/hospital-info/' + doctor_id,
        headers: { "x-access-token": token }
    }).success(function(serverResponse) {
        console.log(serverResponse);
        $scope.hospital_info = serverResponse.hospital;
    }).error(function(err) {
        console.log("Error:", err);
    });

    $http({
        method: "GET",
        url: '/doctor/api/doctor-notification/' + doctor_id,
        headers: { "x-access-token": token }
    }).success(function(serverResponse) {
        console.log(serverResponse);

        if (serverResponse.hasNotification) {
            $scope.matchFound = true;
            $scope.score_info = serverResponse.notification.scores;
            $scope.createdAt = new Date(Date.parse(serverResponse.notification.createdAt));
            var request = {};
            request.recipient_id = serverResponse.notification.recipient;
            request.donor_id = serverResponse.notification.donor;
            matchedDonor = serverResponse.notification.donor;
            matchedRecipient = serverResponse.notification.recipient;
            $http({
                method: "POST",
                url: '/doctor/api/view-recipient-donor-info/',
                headers: { "x-access-token": token },
                data: JSON.stringify(request)
            }).success(function(serverResponse) {
                console.log(serverResponse);
                $scope.recipient_info = serverResponse.response.recipient;
                $scope.donor_info = serverResponse.response.donor;
                matchedOrgan = serverResponse.response.recipient.organType;
            }).error(function(err) {
                console.log("Error:", err);
            });

            console.log(serverResponse);
        }

    }).error(function(err) {
        console.log("Error:", err);
    });

    $scope.viewHome = function() {
        $scope.defaultView = true;
        $scope.patientView = false;
        $scope.addDonorsPanel = false;
        $scope.addRecipientsPanel = false;
        $scope.statsPanel = false;
    };


    $scope.viewPatients = function() {
        $scope.defaultView = false;
        $scope.addDonorsPanel = false;
        $scope.addRecipientsPanel = false;
        $scope.patientView = true;
        $scope.statsPanel = false;
        $scope.donorPatients = "";

        $http({
                method: 'GET',
                url: '/doctor/api/view-patients/' + doctor_id,
                headers: { "x-access-token": token },
            })
            .success(function(serverResponse) {
                console.log(serverResponse);

                $scope.donorPatients = serverResponse.patients.donorPatients;
                $scope.recipientPatients = serverResponse.patients.recipientPatients;
            })
            .error(function(serverResponse) {

            });

    };

    $scope.decideMatch = function(choice) {
        var data = {};
        data.choice = choice;
        data.recipientId = matchedRecipient;
        data.donorId = matchedDonor;
        data.organType = matchedOrgan;
        data.doctorId = localStorage.getItem("mongo_id");
        $http({
            method: "POST",
            url: '/doctor/api/respond-to-match/',
            headers: { "x-access-token": token },
            data: data
        }).success(function(serverResponse) {
            console.log(serverResponse);
        }).error(function(err) {
            console.log("Error:", err);
        });
    };

    $scope.viewDonors = function() {
        $scope.donorsPanel = true;
        $scope.recipientsPanel = false;
        $scope.addDonorsPanel = false;
        $scope.addRecipientsPanel = false;
        $scope.statsPanel = false;
    };

    $scope.viewRecipients = function() {
        $scope.donorsPanel = false;
        $scope.recipientsPanel = true;
        $scope.addDonorsPanel = false;
        $scope.addRecipientsPanel = false;
        $scope.statsPanel = false;
    };

    $scope.logout = function() {
        localStorage.setItem('token', '');
        $window.location.href = "/";
    };









    $scope.formData = {};

    $scope.showForm = true; //default to show form on page load

    $scope.donorAddedAlert = false; //Success message is changed to true if form is filled out correctly

    $scope.ssnError;


    $scope.states = ['AL', 'AK', 'AZ', 'AR', 'CA', 'CO', 'CT', 'DE', 'DC',
        'FL', 'GA', 'HI', 'ID', 'IL', 'IN', 'IA', 'KS', 'KY', 'LA', 'ME',
        'MD', 'MA', 'MI', 'MN', 'MS', 'MO', 'MT', 'NE', 'NV', 'NH', 'NJ',
        'NM', 'NY', 'NC', 'ND', 'OH', 'OK', 'OR', 'PA', 'RI', 'SC', 'SD',
        'TN', 'TX', 'UT', 'VT', 'VA', 'WA', 'WV', 'WI', 'WY'
    ];
    $scope.organTypes = ['Heart', 'Liver', 'Lung', 'Pancreas', 'Kidney'];
    $scope.bloodTypes = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];
    $scope.deceasedTypes = ['Yes', 'No'];
    $scope.sexes = ['F', 'M'];
    $scope.urgencies = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10'];


    $scope.formData.doctor_id = localStorage.getItem("mongo_id");
    $scope.addDonor = function() {
        //console.log($scope.formData.selectedRegion);
        var token = localStorage.getItem("token");

        $http({
                method: 'POST',
                url: '/doctor/api/donors',
                headers: { "x-access-token": token },
                data: $scope.formData
            }).success(function(serverResponse) {
                //$scope.formData = {}; //clear form

                console.log(serverResponse);
                $scope.showForm = false;
                $scope.donorAddedAlert = true;

                setTimeout(function() {
                    $window.location.href = "/doctor/home?token=" + token;
                    //$scope.defaultView = true;
                    // $scope.patientView = false;
                    // $scope.addDonorsPanel = false;
                    //$scope.addDonorsPanel = false;
                }, 2000);


            })
            .error(function(err) {
                console.log("Error: ", err);

                // reset error code messages
                $scope.donorFirstNameError = "";
                $scope.donorLastNameError = "";
                $scope.donorssnError = "";
                $scope.donorStreetError = "";
                $scope.donorCityError = "";
                $scope.donorStateError = "";
                $scope.donorZipError = "";

                $scope.donorOrganTypeError = "";
                $scope.donorSexError = "";
                $scope.donorHeightError = "";
                $scope.donorWeightError = "";
                $scope.donorBloodTypeError = "";
                $scope.donorHLAError = "";
                $scope.donorOrganSizeError = "";
                $scope.donorDeceasedError = "";
                $scope.donorPhoneNumberError = "";
                $scope.donordobError = "";

                if (err.errors.validationError) {
                    var errors = err.errors.validationError.errors;

                    if (errors["name.firstName"]) {
                        $scope.donorFirstNameError = errors["name.firstName"].message;
                    }
                    if (errors["name.lastName"]) {
                        $scope.donorLastNameError = errors["name.lastName"].message;
                    }
                    if (errors.ssn) {
                        $scope.donorssnError = errors.ssn.message;
                    }
                    if (errors["address.street"]) {
                        $scope.donorStreetError = errors["address.street"].message;
                    }
                    if (errors["address.city"]) {
                        $scope.donorCityError = errors["address.city"].message;
                    }
                    if (errors["address.state"]) {
                        $scope.donorStateError = errors["address.state"].message;
                    }

                    if (errors["address.zip"]) {
                        $scope.donorZipError = errors["address.zip"].message;
                    }

                    if (errors.phoneNumber) {
                        $scope.donorPhoneNumberError = errors.phoneNumber.message;
                    }

                    if (errors.organType) {
                        $scope.donorOrganTypeError = errors.organType.message;
                    }
                    if (errors.sex) {
                        $scope.donorSexError = errors.sex.message;
                    }


                    if (errors.height) {
                        $scope.donorHeightError = errors.height.message;
                    }
                    if (errors.weight) {
                        $scope.donorWeightError = errors.weight.message;
                    }
                    if (errors.bloodType) {
                        $scope.donorBloodTypeError = errors.bloodType.message;
                    }
                    if (errors.HLAType) {
                        $scope.donorHLATypeError = errors.HLAType.message;
                    }
                    if (errors.organSize) {
                        $scope.donorOrganSizeError = errors.organSize.message;
                    }
                    if (errors.deceased) {
                        $scope.donorDeceasedError = errors.deceased.message;
                    }
                    if (errors.dob) {
                        $scope.donordobError = errors.dob.message;
                    }
                }

                if (err.errors.ssnExists) {
                    $scope.donorssnError = err.errors.ssnExists;
                }

            });
    };



    $scope.recipientAddedAlert = false; //Success message is changed to true if form is filled out correctly

    $scope.formData.doctor_id = localStorage.getItem("mongo_id");
    $scope.addRecipient = function() {
        //console.log($scope.formData.selectedRegion);
        var token = localStorage.getItem("token");

        $http({
                method: 'POST',
                url: '/doctor/api/recipients',
                headers: { "x-access-token": token },
                data: $scope.formData
            }).success(function(serverResponse) {
                //$scope.formData = {}; //clear form

                console.log(serverResponse);
                $scope.showForm = false;
                $scope.recipientAddedAlert = true;

                setTimeout(function() {
                    $window.location.href = "/doctor/home?token=" + token;
                    //$scope.defaultView = true;
                    // $scope.patientView = false;
                    // $scope.addDonorsPanel = false;
                    //$scope.addRecipientsPanel = false;
                }, 2000);


            })
            .error(function(err) {
                console.log("Error: ", err);

                // reset error code messages

                $scope.recipientFirstNameError = "";
                $scope.recipientLastNameError = "";
                $scope.recipientssnError = "";
                $scope.recipientStreetError = "";
                $scope.recipientCityError = "";
                $scope.recipientStateError = "";
                $scope.recipientZipError = "";

                $scope.recipientOrganTypeError = "";
                $scope.recipientSexError = "";
                $scope.recipientHeightError = "";
                $scope.recipientWeightError = "";
                $scope.recipientBloodTypeError = "";
                $scope.recipientHLATypeError = "";
                $scope.recipientOrganSizeError = "";
                $scope.recipientUrgencyError = "";
                $scope.recipientPhoneNumberError = "";
                $scope.recipientdobError = "";

                if (err.errors.validationError) {
                    var errors = err.errors.validationError.errors;

                    if (errors["name.firstName"]) {
                        $scope.recipientFirstNameError = errors["name.firstName"].message;
                    }
                    if (errors["name.lastName"]) {
                        $scope.recipientLastNameError = errors["name.lastName"].message;
                    }
                    if (errors.ssn) {
                        $scope.recipientssnError = errors.ssn.message;
                    }
                    if (errors["address.street"]) {
                        $scope.recipientStreetError = errors["address.street"].message;
                    }
                    if (errors["address.city"]) {
                        $scope.recipientCityError = errors["address.city"].message;
                    }
                    if (errors["address.state"]) {
                        $scope.recipientStateError = errors["address.state"].message;
                    }

                    if (errors["address.zip"]) {
                        $scope.recipientZipError = errors["address.zip"].message;
                    }

                    if (errors.phoneNumber) {
                        $scope.recipientPhoneNumberError = errors.phoneNumber.message;
                    }

                    if (errors.organType) {
                        $scope.recipientOrganTypeError = errors.organType.message;
                    }
                    if (errors.sex) {
                        $scope.recipientSexError = errors.sex.message;
                    }


                    if (errors.height) {
                        $scope.recipientHeightError = errors.height.message;
                    }
                    if (errors.weight) {
                        $scope.recipientWeightError = errors.weight.message;
                    }
                    if (errors.bloodType) {
                        $scope.recipientBloodTypeError = errors.bloodType.message;
                    }
                    if (errors.HLAType) {
                        $scope.recipientHLATypeError = errors.HLAType.message;
                    }
                    if (errors.organSize) {
                        $scope.recipientOrganSizeError = errors.organSize.message;
                    }
                    if (errors.urgency) {
                        $scope.recipientUrgencyError = errors.urgency.message;
                    }
                    if (errors.dob) {
                        $scope.recipientdobError = errors.dob.message;
                    }
                }

                if (err.errors.ssnExists) {
                    $scope.recipientssnError = err.errors.ssnExists;
                }

            });
    };










    //chart stats





    //chart stats
    $scope.generateChart = function(report) {
        var token = localStorage.getItem("token");
        var start_date = report["startDate"];
        var end_date = report["endDate"];
        var reportType = report["name"];
        var graphType = report["type"];
        var organ = report["organ"];
        console.log(reportType);

        if (start_date != undefined || end_date != undefined) {
            start_date = new Date(start_date).toISOString();
            end_date = new Date(end_date).toISOString();
            if (reportType == "donors") {
                $http({
                    method: "GET",
                    headers: { "x-access-token": token },
                    url: '/doctor/api/donors/waitlist/' + organ + "/" + start_date + "/" + end_date

                }).then(function(res) {
                    var x1 = [];
                    var y1 = [];
                    var text1 = [];
                    var data = [];
                    var xaxis = []
                    var yaxis = [];
                    for (var d in res.data) {

                        var name = "";

                        name = res.data[d]["organType"]
                        xaxis.push(res.data[d]["dateAdded"]);
                        yaxis.push(res.data[d]["organSize"]);

                        text1.push(" Deceased: " + res.data[d]["deceased"]);
                    }
                    var trace1 = {
                        x: xaxis,
                        y: yaxis,
                        mode: 'markers',
                        type: 'scatter',
                        name: organType,
                        text: text1,
                        marker: { size: 12 }
                    };
                    var title = "Total number on donor list in date range: " + res.data.length;

                    var layout = {
                        xaxis: {
                            title: 'Date Added to Wait list'

                        },
                        yaxis: {
                            title: 'Organ Size'

                        },
                        title: title
                    };

                    var data = [trace1];
                    if (xaxis.length > 0 && yaxis.length > 0)
                        Plotly.newPlot('plot', data, layout);





                });
            }
            if (reportType == "recipients") {

                $http({
                    method: "GET",
                    headers: { "x-access-token": token },
                    url: '/doctor/api/recipients/waitlist/' + organ + "/" + start_date + "/" + end_date

                }).then(function(res) {
                    console.log(res);
                    $scope.recipents = res.data;

                    var xaxis = [];
                    var yaxis = [];
                    var text_hover = [];

                    for (var x in $scope.recipents) {
                        xaxis.push($scope.recipents[x].dateAdded);
                        yaxis.push($scope.recipents[x].priority);

                    }



                    var trace = {
                        x: xaxis,
                        y: yaxis,
                        mode: 'markers',
                        type: 'scatter',
                        name: organ,
                        text: text_hover,
                        marker: { size: 12 }
                    };
                    var data = [trace];
                    var title = "Total number on wait list in given date range: " + $scope.recipents.length;

                    var layout = {
                        xaxis: {
                            title: 'Date Added to Wait list'

                        },
                        yaxis: {
                            title: 'Priortity Score'

                        },
                        title: title
                    };
                    if (xaxis.length > 0 && yaxis.length > 0)
                        Plotly.newPlot('plot', data, layout);

                });

            }
            if (reportType == "people_matched") {
                $http({
                    method: "GET",
                    headers: { "x-access-token": token },
                    url: '/doctor/api/matches/' + organ + "/" + start_date + "/" + end_date

                }).then(function(res) {
                    var data = res.data;
                    var xaxis = [];
                    var yaxis = [];
                    var text_hover = [];
                    for (var x in data) {
                        var organName = organ.toLowerCase();
                        xaxis.push(data[x]._id);
                        yaxis.push(data[x].organs[organName]);


                    }
                    var trace1 = {
                        x: xaxis,
                        y: yaxis,
                        mode: 'markers',
                        type: 'scatter',
                        name: organ,
                        marker: { size: 12 }
                    };
                    var title = "Total number of matched people in date range for " + organ + ": " + data.length;

                    var layout = {
                        xaxis: {
                            title: 'Date Matches'

                        },
                        yaxis: {
                            title: 'Organ Count'

                        },
                        title: title
                    };

                    var data = [trace1];
                    if (xaxis.length > 0 && yaxis.length > 0)
                        Plotly.newPlot('plot', data, layout);
                });
            }
            if (reportType == "wasted_organs") {
                $http({
                    method: "GET",
                    headers: { "x-access-token": token },
                    url: '/doctor/api/wasted_organs/' + organ + "/" + start_date + "/" + end_date

                }).then(function(res) {
                    var data = res.data;
                    var xaxis = [];
                    var yaxis = [];
                    var text_hover = [];
                    for (var x in data) {
                        var organName = organ.toLowerCase();
                        xaxis.push(data[x]._id);
                        yaxis.push(data[x].organs[organName]);


                    }
                    var trace1 = {
                        x: xaxis,
                        y: yaxis,
                        mode: 'markers',
                        type: 'scatter',
                        name: organ,
                        marker: { size: 12 }
                    };
                    var title = "Total number of wasted " + organ + "s in date range: " + data.length;

                    var layout = {
                        xaxis: {
                            title: 'Date Matches'

                        },
                        yaxis: {
                            title: 'Organ Count'

                        },
                        title: title
                    };

                    var data = [trace1];
                    if (xaxis.length > 0 && yaxis.length > 0)
                        Plotly.newPlot('plot', data, layout);
                });
            }
        } else {
            if (reportType == "donors") {

                $http({
                    method: "GET",
                    headers: { "x-access-token": token },
                    url: '/doctor/api/donors/waitlist/' + organ

                }).then(function(res) {
                    var x1 = [];
                    var y1 = [];
                    var text1 = [];
                    var data = [];
                    for (var d in res.data) {

                        var name = "";

                        name = res.data[d]["organType"]
                        x1.push(res.data[d]["dateAdded"]);
                        y1.push(res.data[d]["organSize"]);

                        text1.push("Deceased: " + res.data[d]["deceased"]);
                    }
                    var title = "Total number on Donor List: " + res.data.length;

                    var layout = {
                        xaxis: {
                            title: 'Date Added to Donor list'

                        },
                        yaxis: {
                            title: 'Organ Size'

                        },
                        title: title
                    };
                    var trace1 = {
                        x: x1,
                        y: y1,
                        mode: 'markers',
                        type: 'scatter',
                        name: organ,
                        text: text1,
                        marker: { size: 12 }
                    };
                    var data = [trace1];
                    Plotly.newPlot('plot', data, layout);

                });
            }
            if (reportType == "recipients") {
                $http({
                    method: "GET",
                    headers: { "x-access-token": token },
                    url: '/doctor/api/recipients/waitlist/' + organ

                }).then(function(res) {
                    $scope.recipents = res.data;

                    var xaxis = [];
                    var yaxis = [];
                    var text_hover = [];

                    for (var x in $scope.recipents) {
                        xaxis.push($scope.recipents[x].dateAdded);
                        yaxis.push($scope.recipents[x].priority);

                    }



                    var trace = {
                        x: xaxis,
                        y: yaxis,
                        mode: 'markers',
                        type: 'scatter',
                        name: organ,
                        text: text_hover,
                        marker: { size: 12 }
                    };
                    var title = "Total number on wait list: " + $scope.recipents.length;
                    var layout = {
                        xaxis: {
                            title: 'Date Added to Wait list'

                        },
                        yaxis: {
                            title: 'Priortity Score'

                        },
                        title: title
                    };
                    var data = [trace];

                    if (xaxis.length > 0 && yaxis.length > 0)
                        Plotly.newPlot('plot', data, layout);

                });

            }
            if (reportType == 'people_matched') {

                $http({
                    method: "GET",
                    headers: { "x-access-token": token },
                    url: '/doctor/api/matches/' + organ

                }).then(function(res) {
                    var data = res.data;

                    var xaxis = [];
                    var yaxis = [];
                    var text_hover = [];
                    for (var x in data) {
                        var organName = organ.toLowerCase();

                        xaxis.push(data[x]._id);
                        yaxis.push(data[x].organs[organName]);


                    }
                    var trace1 = {
                        x: xaxis,
                        y: yaxis,
                        mode: 'markers',
                        type: 'scatter',
                        name: organ,
                        marker: { size: 12 }
                    };
                    var title = "Total number of matches for " + organ + ": " + data.length;

                    var layout = {
                        xaxis: {
                            title: 'Date Matched'

                        },
                        yaxis: {
                            title: 'Organ Count'

                        },
                        title: title
                    };

                    var data = [trace1];
                    if (xaxis.length > 0 && yaxis.length > 0)
                        Plotly.newPlot('plot', data, layout);
                });


            }
            if (reportType == 'wasted_organs') {

                $http({
                    method: "GET",
                    headers: { "x-access-token": token },
                    url: '/doctor/api/wasted_organs/' + organ

                }).then(function(res) {
                    var data = res.data;

                    var xaxis = [];
                    var yaxis = [];
                    var text_hover = [];
                    for (var x in data) {
                        var organName = organ.toLowerCase();

                        xaxis.push(data[x]._id);
                        yaxis.push(data[x].organs[organName]);


                    }
                    var trace1 = {
                        x: xaxis,
                        y: yaxis,
                        mode: 'markers',
                        type: 'scatter',
                        name: organ,
                        marker: { size: 12 }
                    };
                    var title = "Total number of wasted " + organ + "s: " + data.length;

                    var layout = {
                        xaxis: {
                            title: 'Date Matched'

                        },
                        yaxis: {
                            title: 'Organ Count'

                        },
                        title: title
                    };

                    var data = [trace1];
                    if (xaxis.length > 0 && yaxis.length > 0)
                        Plotly.newPlot('plot', data, layout);
                });


            }

        }

    }



}]);