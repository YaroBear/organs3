module.exports.donors = [
	{
		ssn : "799-99-4567",
		name : "Mark Hanes",
		status : "deceased",
		matching_info: {
			organs : [
				{
					heart : {
						size : 7.55
					}
				},
				{
					kidney : {
						size : 12.00
					}
				},
				{
					lungs : {
						volume : 10.50
					}
				}
			]},
		health: {
			sex: "male",
			height: 150.00,
			dob: d,
			blood_type: "B",
			HLA_class: 5,
			weight: 80.04
		}
	},
	{
		ssn : "648-32-5698",
		name : "Donna Marin",
		status : "living",
		matching_info: {
			organs : [
				{
					kidney : {
						size : 11.00
					}
				}
			]},
		health: {
			sex: "female",
			height: 144.00,
			dob: "06/07/1984",
			blood_type: "AB",
			HLA_class: 3,
			weight: 75.04
		}
	}
];

module.exports.recipients = [
	{
		ssn : "555-22-111",
		name : "Bob Smith",
		matching_info: {
			organs : [
				{
					heart : {
						urgency : 10,
						size : 12.00
					}
				}
			]},

		health: {
			sex: "male",
			height: 150.00,
			dob: "01/02/1980",
			blood_type: "O",
			HLA_class: 1,
			weight: 68.04
		}
	},
	{
		ssn : "678-24-9080",
		name : "John Strong",
		matching_info: { 
			organs : [
				{
					kidney : {
						urgency : 8,
						size : 7.50
					}
				}
			]},
		health: {
			sex: "male",
			height: 152.40,
			dob: "07/06/1989",
			blood_type: "",
			HLA_class: 5,
			weight: 75.32
		}
	},
	{
		ssn : "699-76-9330",
		name : "Jane Polaski",
		matching_info: { 
			organs : [
				{
					lungs : {
						urgency : 9,
						volume : 6.00
					}
				}
			]},
		health: {
			sex: "female",
			height: 149.12,
			dob: "11/1/1997",
			blood_type: "A",
			HLA_class: 1,
			weight: 65.30
		}
	}
];

module.exports.doctors = [
	{
		ssn : "123-45-6789",
		name : "Jerry Estep",
		patients : []
	},
	{
		ssn : "123-45-6780",
		name : "Arvind Bhimaraj",
		patients : []
	},
	{
		ssn : "123-45-6781",
		name : "Myung Park",
		patients : []
	}
];

module.exports.hospitals = [
	{
		name : "Houston Methodist Hospital",
		address : {
			street : "6565 Fannin Street",
			city : "Houston",
			state : "TX",
			zip : "77030",
			region : 4
		},
		phone : "713-394-6000",
		procedures : ["heart", "kidney", "lung", "liver", "pancreas"],
		doctors : []
	},
	{
		name : "CHI St.Luke's Health Baylor College of Medicine Medical Center",
		address : {
			street : "6624 Fannin Street",
			city : "Houston",
			state : "TX",
			zip : "77030",
			region : 4
		},
		phone : "713-785-8537",
		procedures : ["heart", "kidney", "lung", "liver"],
		doctors : [],
	},
	{
		name : "Michael E. DeBakey VA Medical Center",
		address : {
			street : "2002 Holcombe Blvd",
			city : "Houston",
			state : "TX",
			zip : "77030",
			region : 4
		},
		phone : "800-553-2278",
		procedures : ["kidney", "liver"],
		doctors : [],
	}

];
