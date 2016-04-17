var CHControllers = angular.module('CHControllers', []);



CHControllers.controller('DuesController', ['$scope', '$http', '$window', function($scope, $http, $window) {
  $scope.day = "";


}]);

CHControllers.controller('TodosController', ['$scope', '$http', '$window', function($scope, $http, $window) {


}]);

CHControllers.controller('SettingsController', ['$scope' , '$window' , function($scope, $window) {
  $scope.url = $window.sessionStorage.baseurl;

  $scope.setUrl = function(){
    $window.sessionStorage.baseurl = $scope.url;
    $scope.displayText = "URL set";

  };

}]);
