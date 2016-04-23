var CHControllers = angular.module('CHControllers', []);



CHControllers.controller('DuesController', ['$scope', '$http', '$window', function($scope, $http, $window) {
  $scope.day = "";


}]);

CHControllers.controller('TodosController', ['$scope', '$http', '$window', function($scope, $http, $window) {


}]);

CHControllers.controller('CourseController', ['$scope', '$http', '$window', function($scope, $http, $window) {
    google.charts.load('current', {'packages':['corechart']});
    google.charts.setOnLoadCallback(drawChart);
    function drawChart() {
        var data = google.visualization.arrayToDataTable([
          ['Task', 'Hours per Day'],
          ['Work',     11],
          ['Eat',      2],
          ['Commute',  2],
          ['Watch TV', 2],
          ['Sleep',    7]
        ]);

        var options = {
          title: 'My Daily Activities'
        };
        var chart = new google.visualization.PieChart(document.getElementById('piechart'));

        chart.draw(data, options);
    }

    $(window).resize(function(){
      drawChart();
    });

}]);

CHControllers.controller('SettingsController', ['$scope' , '$window' , function($scope, $window) {
  $scope.url = $window.sessionStorage.baseurl;

  $scope.setUrl = function(){
    $window.sessionStorage.baseurl = $scope.url;
    $scope.displayText = "URL set";

  };

}]);
