var app = angular.module('courseHelper', ['ui.router','ngRoute', 'CHControllers', 'CHServices', 'CHDirectives']);

app.config(['$urlRouterProvider', '$stateProvider', function ($urlRouterProvider, $stateProvider) {
  $urlRouterProvider.otherwise("/dues");

  $stateProvider
    .state('dues', {
      url: "/dues",
        views: {
            'header': {
                templateUrl: 'partials/studentheader.html'
            },
            'content': {
                templateUrl: 'partials/dues.html',
                controller: 'DuesController'
            }
        },
    })
    .state('todos', {
      url: "/todos",
        views: {
            'header': {
                templateUrl: 'partials/studentheader.html'
            },
            'content': {
                templateUrl: 'partials/todos.html',
                controller: 'TodosController'
            }
        },
    })
    .state('adddrop', {
      url: "/adddrop",
        views: {
            'header': {
                templateUrl: 'partials/studentheader.html'
            },
            'content': {
                templateUrl: 'partials/adddrop.html',
                controller: 'AddDropController'
            }
        },
    })
    .state('course', {
      url: "/course",
        views: {
            'header': {
                templateUrl: 'partials/courseheader.html'
            },
            'content': {
                templateUrl: 'partials/course.html',
                controller: 'CourseController'
            }
        },
      
    });
}]);



app.run(function($rootScope) {
    $rootScope.$on('$viewContentLoaded', function () {
        $(document).foundation();
    });
});