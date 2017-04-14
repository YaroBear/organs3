var admin = angular.module('admin', [])
	.controller("adminController", ["$scope", "$http", "$window", function adminController($scope, $http, $window, $q, $log){

		var token = localStorage.getItem("token");

		$scope.adminName = localStorage.getItem("user");
		var admin_id = localStorage.getItem("mongo_id");
		$scope.defaultView = true;
		$scope.addHospitalPanel = false;
		$scope.manageHospitalsPanel = false;
		$scope.adminStatsPanel = false;
		$scope.statsPanel = false;



		$scope.addHospitalView = function()
		{
			$scope.defaultView = false;
			$scope.addHospitalPanel = true;
			$scope.manageHospitalsPanel = false;
			$scope.adminStatsPanel = false;
			$scope.statsPanel = false;

		}


		$scope.manageHospitalsView = function()
		{
			$scope.defaultView = false;
			$scope.addHospitalPanel = false;
			$scope.manageHospitalsPanel = true;
			$scope.adminStatsPanel = false;
			$scope.statsPanel = false;
		}


		$http({
			method: "GET",
			url : '/admin/api/hospital-info/' + admin_id,
			headers: {"x-access-token": token}
		}).success(function(serverResponse){
			$scope.hospital_info = serverResponse.hospital;
		}).error(function(err){
			console.log("Error:", err);
		});


		$scope.viewHome = function() {
			$scope.defaultView = true;
			$scope.addHospitalPanel = false;
			$scope.manageHospitalsPanel = false;
			$scope.adminStatsPanel = false;
			$scope.statsPanel = false;
		};

		$scope.adminStatsView = function() {
			$scope.defaultView = false;
			$scope.addHospitalPanel = false;
			$scope.manageHospitalsPanel = false;
			$scope.adminStatsPanel = true;
			$scope.statsPanel = false;
		};

		$scope.statsView = function() {
			$scope.defaultView = false;
			$scope.addHospitalPanel = false;
			$scope.manageHospitalsPanel = false;
			$scope.adminStatsPanel = false;
			$scope.statsPanel = true;
		};

		//$scope.addHospital = function()
		// $scope.gotoaddHospital = function()
		// {
		// 	$window.location.href = "/admin/addHospital" + "?token=" + token;
		// }

		// $scope.gotomanageHospitals = function()
		// {
		// 	$window.location.href = "/admin/manageHospitals" + "?token=" + token;
		// }
		
		$scope.logout = function() {
			localStorage.setItem('token', '');
			$window.location.href = "/";
		};

	



		//add hospital controller
		$scope.formData = {};

		//$scope.showForm = true; //default to show form on page load

		$scope.addedAlert = false; //Success message is changed to true if form is filled out correctly


		$scope.formData.region = "1"; //sets a default so the state field is starts expanded


		$scope.regions = {1: ['CT', 'ME', 'MA', 'NH', 'RI', ' EAST VT'],
		 2: ['DE', 'DC', 'MD', 'NJ', 'PA', 'WV', 'NORTHERN VIRGINIA'],
		  3: ['AL', 'AR', 'FL', 'GA', 'LA', 'MS', 'PR'],
		   4: ['OK', 'TX'],
		    5: ['AZ', 'CA', 'NV', 'NM', 'UT'],
		     6 : ['AK', 'HI', 'ID', 'MT', 'OR', 'WA'],
		      7: ['IL', 'MN', 'ND', 'SD', 'WI'],
		       8 : ['CO', 'IA', 'KS', 'MO', 'NE', 'WY'],
		        9 : ['NY', 'WESTERN VT'],
		         10 : ['IN', 'MI', 'OH'],
		          11: ['KY', 'NC', 'SC', 'TN', 'VA']};


		$scope.regionDescriptors = [        

		"Region 1: Connecticut, Maine, Massachusetts, New Hampshire, Rhode Island, Eastern Vermont",
		"Region 2: Delaware, District of Columbia, Maryland, New Jersey, Pennsylvania, West Virginia, Northern Virginia",
		"Region 3: Alabama, Arkansas, Florida, Georgia, Louisiana, Mississippi, Puerto Rico",
		"Region 4: Oklahoma, Texas",
		"Region 5: Arizona, California, Nevada, New Mexico, Utah",
		"Region 6: Alaska, Hawaii, Idaho, Montana, Oregon, Washington",
		"Region 7: Illinois, Minnesota, North Dakota, South Dakota, Wisconsin",
		"Region 8: Colorado, Iowa, Kansas, Missouri, Nebraska, Wyoming",
		"Region 9: New York, Western Vermont",
		"Region 10: Indiana, Michigan, Ohio",
		"Region 11: Kentucky, North Carolina, South Carolina, Tennessee, Virginia"

		]; 


		$scope.addHospital = function() {
		//console.log($scope.formData.region);

		var token = localStorage.getItem("token");

		$http({
			method : 'POST',
			url : '/admin/api/hospitals',
			headers: {"x-access-token": token},
			data: $scope.formData
		})
			.success(function(serverResponse) {


			$scope.showForm = false;
			$scope.addedAlert = true;


			setTimeout(function(){
					$window.location.href = "/admin/home?token=" + token;
			},2000);

				

		})
			.error(function(serverResponse) {
				console.log("Error: ", serverResponse);

				// reset error code messages

				$scope.nameError = "";
				$scope.streetError = "";
				$scope.cityError = "";
				$scope.stateError = "";
				$scope.zipError = "";
				$scope.phoneNumberError = "";
				$scope.regionError = "";
				$scope.phoneNumberError = "";


				if (serverResponse.errors.validationError)
				{
					var errors = serverResponse.errors.validationError.errors;

					if (errors.name)
					{
						$scope.nameError = errors.name.message;
					}
					if (errors["address.street"])
					{
						$scope.streetError = errors["address.street"].message;
					}
					if (errors["address.state"])
					{
						$scope.stateError = errors["address.state"].message;
					}
					if (errors["address.city"])
					{
						$scope.cityError = errors["address.city"].message;
					}
					if (errors["address.zip"])
					{
						$scope.zipError = errors["address.zip"].message;
					}
					if (errors["address.region"])
					{
						$scope.regionError = errors["address.region"].message;
					}
					if (errors.phone)
					{
						$scope.phoneNumberError = errors.phone.message;
					}
				}
				if (serverResponse.errors.HospitalExists)
				{
					$scope.nameError = serverResponse.errors.HospitalExists;
				}

			});
		};



		//manage hospitals controller
		$scope.addedAlert = false; //Success message is changed to true if form is filled out correctly

		$scope.enableMove = function (hosp)
		{
			hosp.movedoc = true;

		}
		$scope.doMove = function (hosp)
		{
			$scope.moveData = {};
			$scope.moveData.docid = hosp.docid;
			$scope.moveData.destHosp = hosp.destHosp;
			$scope.moveData.oldHosp = hosp._id;
			console.log("moveData: ", $scope.moveData);

			if ("undefined" === typeof $scope.moveData.docid)
			{
				//error occured
				console.log("Doctor undefined");
				console.log($scope.moveData.docid);
			}
			else if ("undefined" === typeof $scope.moveData.destHosp) 
			{
				//error occured
				console.log("Destination Hospital undefined");
				console.log(scope.moveData.destHosp);
			}
			else if ("undefined" === typeof $scope.moveData.oldHosp)
			{
				//error occured
				console.log("Old Hospital undefined");
				console.log($scope.moveData.oldHost);
			}

			else
			{
				$http({
				method : 'POST',
				url : '/admin/api/hospital/moveDoctors',
				headers: {"x-access-token": token},
				data: $scope.moveData
				})
				.success(function(serverResponse) {
					//alert("Doctor Moved Successfully")
					console.log("Doctor Moved Successfully");
				})
				.error(function(serverResponse) {
					console.log("Error: ", serverResponse);
				});
			}


			hosp.movedoc = false;
		}
		$scope.cancel = function (hosp)
		{
			$scope.moveData = {};
			hosp.movedoc = false;
		}

		$scope.deletePrompt = function (hosp)
		{
			//console.log(hosp.name);
			if (hosp.doctors.length != 0)
			{
				alert("Doctors exist in this hospital, fire or transfer them before removing the hospital");
			}
			else
			{
				hosp.delete = true;
			}
		}
		$scope.dontDelete = function (hosp)
		{
			hosp.delete = false;
		}
		$scope.confirmDelete = function (hosp)
		{

			$scope.formData.id = hosp._id;
			$http({
				method : 'POST',
				url : '/admin/api/deletehospital',
				headers: {"x-access-token": token},
				data: $scope.formData
				})
			.success(function(serverResponse) {
				$scope.showForm = false;
				$scope.addedAlert = true;
			})
			.error(function(serverResponse) {
				console.log("Error: ", serverResponse);
			});
		
			alert(hosp.name + " has been deleted!");
			$scope.loadHospList();
		}

		$scope.loadHospList = function ()
		{
			$scope.hospitals = "";

			$http({
				method: 'GET',
				url: '/admin/api/hospitals',
				headers: {"x-access-token": token}
			}).then(function successCallback(response) {
			    // this callback will be called asynchronously
			    // when the response is available
			    //console.log(response.data[0].address.street);
			    $scope.hospitals = response.data;
			    console.log($scope.hospitals[0]);
				for (var hospital in $scope.hospitals)
			    {
			    	console.log("doing hospital: " , hospital.name);
			    	for (doc in hospital.doctors)
			    	{
				    	hospital.doctorslen = doc.length;
				    	console.log("set ", hospital.name , " to " , hospital.doctorslen, " when it was ", doc.length);
			    		
			    	}
			    }
			}, function errorCallback(response) {
			    // called asynchronously if an error occurs
			    // or server returns response with an error status.
			    console.log(response);
			});
		}
		$scope.loadHospList();





		//admin stats
		$scope.generateAdminReport = function(report) {
        var token = localStorage.getItem("token");


        $scope.name = report.name + " report";
        console.log(name);
        $http({
            method: "GET",
            headers: { "x-access-token": token },
            url: '/admin/api/collection/stats/' + report.name
        }).success(function(res) {
            //console.log(res);
            $scope.tableVals = res;
        });

    	}


    	//chart stats
    	$scope.generateChart = function(report) {
        var token = localStorage.getItem("token");
        var start_date = report["startDate"];
        var end_date = report["endDate"];
        var reportType = report["name"];
        var graphType = report["type"];
        var organ = report["organ"];



        if (start_date != undefined || end_date != undefined) {
            start_date = new Date(start_date).toISOString();
            end_date = new Date(end_date).toISOString();

			console.log(reportType);

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
            if (reportType == "recipients_WL") {

                $http({
                    method: "GET",
                    headers: { "x-access-token": token },
                    url: '/doctor/api/recipents/waitlist/' + organ + "/" + start_date + "/" + end_date

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
            if (reportType == "recipients_WL") {
                $scope.recipents = RecipentsService;
                $http({
                    method: "GET",
                    headers: { "x-access-token": token },
                    url: '/doctor/api/recipents/waitlist/' + organ

                }).then(function(res) {
                    $scope.recipents.data = res.data;

                    var xaxis = [];
                    var yaxis = [];
                    var text_hover = [];

                    for (var x in $scope.recipents.data) {
                        xaxis.push($scope.recipents.data[x].dateAdded);
                        yaxis.push($scope.recipents.data[x].priority);

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
                    var title = "Total number on wait list: " + $scope.recipents.data.length;
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