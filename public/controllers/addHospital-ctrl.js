var addHospital = angular.module('addHospital', [])
	.controller("hospitalController", ["$scope", "$http", "$window", function hospitalController($scope, $http, $window){
		$scope.formData = {};

		$scope.showForm = true; //default to show form on page load

		$scope.addedAlert = false; //Success message is changed to true if form is filled out correctly




		$scope.formData.region = "1"; //sets a default so the state field is starts expanded
 
 		var token = localStorage.getItem("token");




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

		//from julian
		$scope.gotoaddHospital = function()
		{
			$window.location.href = "/admin/addHospital" + "?token=" + token;
		}
		$scope.gotomanageHospitals = function()
		{
			$window.location.href = "/admin/manageHospitals" + "?token=" + token;
		}



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
	}]);

