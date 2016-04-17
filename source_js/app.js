var app = angular.module('courseHelper', ['ngRoute', 'CHControllers', 'CHServices', 'CHDirectives']);

app.config(['$routeProvider', function($routeProvider) {
  $routeProvider.
    when('/dues', {
    templateUrl: 'partials/dues.html',
    controller: 'DuesController'
  }).
  when('/todos', {
    templateUrl: 'partials/todos.html',
    controller: 'TodosController'
  }).
  when('/stats', {
    templateUrl: 'partials/stats.html',
    controller: 'StatsController'
  }).
  when('/adddrop', {
    templateUrl: 'partials/adddrop.html',
    controller: 'AddDropController'
  }).
  otherwise({
    redirectTo: '/dues'
  });
}]);

app.run(function($rootScope) {
    $rootScope.$on('$viewContentLoaded', function () {
        $(document).foundation();
    });
});