var statistics = angular.module("statistics", []);
statistics.factory("RecipentsService", ["$q", "$http", "$rootScope", "$timeout", function($q, $http, $rootScope) {

    var RecipentsService = {
        getUsers: function(organ, token) {
            var defer = $q.defer();
            return $http({
                method: "GET",
                headers: { "x-access-token": token },
                url: '/doctor/api/recipents/waitlist/' + organ

            }).then(function(res) {
                var x = new Array();
                for (var d in res.data) {

                    $http({
                        method: "GET",
                        headers: { "x-access-token": token },

                        url: '/doctor/api/recipentsByID/' + res.data[d]._id

                    }).then(function(response) {
                        if (response.data != null) {
                            response.data.priority = res.data[d].priority;
                            x.push(response.data);
                        }

                    });


                }
                setTimeout(function() {
                    output = x
                    defer.resolve(output);
                }, 500);
                return defer.promise;

            });
        },
        getUsersByDate: function(organ, start_date, end_date, token) {
            var defer = $q.defer();
            return $http({
                method: "GET",
                headers: { "x-access-token": token },
                url: '/doctor/api/recipents/waitlist/' + organ + "/" + start_date + "/" + end_date

            }).then(function(res) {
                var x = new Array();
                for (var d in res.data) {

                    $http({
                        method: "GET",
                        headers: { "x-access-token": token },
                        url: '/doctor/api/recipentsByID/' + res.data[d]._id

                    }).then(function(response) {
                        if (response.data != null) {
                            response.data.priority = res.data[d].priority;
                            x.push(response.data);
                        }

                    });


                }
                setTimeout(function() {
                    output = x
                    defer.resolve(output);
                }, 500);
                return defer.promise;

            });
        }

    };
    return RecipentsService;
}])

statistics.controller("statisticsController", function statisticsController($scope, $q, $http, $log, RecipentsService) {

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
                $scope.recipents = RecipentsService;

                $q.when($scope.recipents.getUsersByDate(organ, start_date, end_date, token).then(function(data) {
                    $scope.recipents.data = data;

                    var xaxis = [];
                    var yaxis = [];
                    var text_hover = [];

                    for (var x in data) {
                        xaxis.push(data[x].dateAdded);
                        yaxis.push(data[x].priority);
                        text_hover.push(data[x].urgency);

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
                    var title = "Total number on wait list in date range: " + data.length;

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

                }));

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
                $q.when($scope.recipents.getUsers(organ, token).then(function(data) {
                    $scope.recipents.data = data;

                    var xaxis = [];
                    var yaxis = [];
                    var text_hover = [];

                    for (var x in data) {
                        xaxis.push(data[x].dateAdded);
                        yaxis.push(data[x].priority);
                        text_hover.push(data[x].urgency);

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
                    var title = "Total number on wait list: " + data.length;
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

                }));

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
});