var statistics = angular.module("statistics", [])
    .controller("statisticsController", ["$scope", "$http", function statisticsController($scope, $http) {
        $scope.generateChart = function(report) {
            // console.log(report);
            var start_date = report["startDate"];
            var end_date = report["endDate"];
            var reportType = report["name"];
            var graphType = report["type"];
            var organ = report["organ"];
            // console.log(start_date);
            if (start_date != undefined || end_date != undefined) {
                if (reportType == "donors") {
                    // '/api/donors/waitlist/:organ/:start_date?/:end_date?'
                    // $http.get();
                    $http({
                        method: "GET",
                        url: '/api/donors/waitlist/' + organ + "/" + start_date + "/" + end_date

                    }).then(function(res) {
                        console.log(res.data);
                        var x1 = [];
                        var y1 = [];
                        var text1 = [];
                        for (var d in res.data) {
                            for (var i in res.data[d]["matching_info"]["organs"]) {
                                // console.log(res.data[d][i]);

                                if (res.data[d]["matching_info"]["organs"][i]["name"] == "heart") {
                                    x1.push(res.data[d]["created_on"]);
                                    y1.push(res.data[d]["matching_info"]["organs"][i]["name"]["measurement"]);
                                }
                            }
                            text1.push(res.data[d]["name"] + " - " + res.data[d]["status"]);
                        }
                        var trace1 = {
                            x: x1,
                            y: y1,
                            mode: 'markers',
                            type: 'scatter',
                            name: 'Heart',
                            text: text1,
                            marker: { size: 12 }
                        };

                        var x2 = [];
                        var y2 = [];
                        var text2 = [];
                        for (var d in res.data) {
                            for (var i in res.data[d]["matching_info"]["organs"]) {
                                // console.log(res.data[d][i]);

                                if (res.data[d]["matching_info"]["organs"][i]["name"] == "kidney") {
                                    x2.push(res.data[d]["created_on"]);
                                    y2.push(res.data[d]["matching_info"]["organs"][i]["name"]["measurement"]);
                                }
                            }
                            text2.push(res.data[d]["name"] + " - " + res.data[d]["status"]);
                        }
                        var trace2 = {
                            x: x2,
                            y: y2,
                            mode: 'markers',
                            type: 'scatter',
                            name: 'Kidney',
                            text: text2,
                            marker: { size: 12 }
                        };

                        var x3 = [];
                        var y3 = [];
                        var text3 = [];
                        for (var d in res.data) {
                            for (var i in res.data[d]["matching_info"]["organs"]) {
                                // console.log(res.data[d][i]);

                                if (res.data[d]["matching_info"]["organs"][i]["name"] == "lungs") {
                                    x3.push(res.data[d]["created_on"]);
                                    y3.push(res.data[d]["matching_info"]["organs"][i]["measurement"]);
                                }
                            }
                            text3.push(res.data[d]["name"] + " - " + res.data[d]["status"]);
                        }

                        var trace3 = {
                            x: x3,
                            y: y3,
                            mode: 'markers',
                            type: 'scatter',
                            name: 'Lungs',
                            text: text3,
                            marker: { size: 12 }
                        };

                        var data = [trace1, trace2, trace3];

                        console.log(data);
                        Plotly.newPlot('plot', data);






                    });
                }

            } else {
                if (reportType == "donors") {
                    // '/api/donors/waitlist/:organ/:start_date?/:end_date?'
                    // $http.get();
                    $http({
                        method: "GET",
                        url: '/api/donors/waitlist/' + organ

                    }).then(function(res) {
                        console.log(res.data);
                        var x1 = [];
                        var y1 = [];
                        var text1 = [];
                        for (var d in res.data) {
                            for (var i in res.data[d]["matching_info"]["organs"]) {
                                // console.log(res.data[d][i]);

                                if (res.data[d]["matching_info"]["organs"][i]["name"] == "heart") {
                                    x1.push(res.data[d]["created_on"]);
                                    y1.push(res.data[d]["matching_info"]["organs"][i]["name"]["measurement"]);
                                }
                            }
                            text1.push(res.data[d]["name"] + " - " + res.data[d]["status"]);
                        }
                        var trace1 = {
                            x: x1,
                            y: y1,
                            mode: 'markers',
                            type: 'scatter',
                            name: 'Heart',
                            text: text1,
                            marker: { size: 12 }
                        };

                        var x2 = [];
                        var y2 = [];
                        var text2 = [];
                        for (var d in res.data) {
                            for (var i in res.data[d]["matching_info"]["organs"]) {
                                // console.log(res.data[d][i]);

                                if (res.data[d]["matching_info"]["organs"][i]["name"] == "kidney") {
                                    x2.push(res.data[d]["created_on"]);
                                    y2.push(res.data[d]["matching_info"]["organs"][i]["name"]["measurement"]);
                                }
                            }
                            text2.push(res.data[d]["name"] + " - " + res.data[d]["status"]);
                        }
                        var trace2 = {
                            x: x2,
                            y: y2,
                            mode: 'markers',
                            type: 'scatter',
                            name: 'Kidney',
                            text: text2,
                            marker: { size: 12 }
                        };

                        var x3 = [];
                        var y3 = [];
                        var text3 = [];
                        for (var d in res.data) {
                            for (var i in res.data[d]["matching_info"]["organs"]) {
                                // console.log(res.data[d][i]);

                                if (res.data[d]["matching_info"]["organs"][i]["name"] == "lungs") {
                                    x3.push(res.data[d]["created_on"]);
                                    y3.push(res.data[d]["matching_info"]["organs"][i]["measurement"]);
                                }
                            }
                            text3.push(res.data[d]["name"] + " - " + res.data[d]["status"]);
                        }

                        var trace3 = {
                            x: x3,
                            y: y3,
                            mode: 'markers',
                            type: 'scatter',
                            name: 'Lungs',
                            text: text3,
                            marker: { size: 12 }
                        };

                        var data = [trace1, trace2, trace3];

                        console.log(data);
                        Plotly.newPlot('plot', data);



                    });
                }
            }



        }
    }]);