var CHControllers = angular.module('CHControllers', ['ngCookies']);



CHControllers.controller('DuesController', ['$scope', '$http', '$window', 'StudentUsers', 'Courses', '$cookieStore', 'PersonalTasks', function($scope, $http, $window, StudentUsers, Courses, $cookieStore, PersonalTasks) {
  $window.sessionStorage.baseurl = 'http://localhost:4000'
  var role = $cookieStore.get("role");
  var id = $cookieStore.get("id");
  console.log(id);
  console.log(role);
  $scope.data = {
    selectedOption: {}
  }
  //get user info
  if (role !== "student") {
    alert("Access Forbidden!");
  }
  else {
    StudentUsers.get(id).success(function(jsonData, statusCode) {
      console.log('The request for user was successful', statusCode);
      $scope.user = jsonData.data;
      //get upcomming dues
      //user's course list as options
      $scope.data.availableOptions = $scope.user.courseList;
    })
    .error(function(jsonData, statusCode) {
      alert("Can not find User!");
      console.log('find student user failed', statusCode);
    });
  }
  //$scope.day = "";

  $scope.name = "";
  $scope.description = "";
  $scope.deadline = "";


  //add new personal task
  $scope.addPTask =  function(formValid) {
    if (formValid) {
      var task = {"courseid": $scope.data.selectedOption.courseid,
                  "courseName": $scope.data.selectedOption.courseName,
                  "name": $scope.name,
                  "description": $scope.description,
                  "dueDate": $scope.deadline,
                  "timespent": 0};
      $scope.user.personalTaskList.push(task);
      StudentUsers.put($scope.user).success(function(jsonData, statusCode) {
        console.log("update user's personal tasks successful", statusCode);
          alert("Your personal task was added successfully!")
          $scope.data.selectedOption = {};
          $scope.name = "";
          $scope.description = "",
          $scope.deadline = "",
          $('#add-task').foundation('close');        
      })
      .error(function(jsonData, statusCode) {
        console.log("update user failed", statusCode);
      });
    }
  }



}]);

CHControllers.controller('TodosController', ['$scope', '$http', '$window', function($scope, $http, $window) {


}]);


CHControllers.controller('AddDropController', ['$scope', '$http', '$window', 'StudentUsers', 'Courses', '$cookieStore', function($scope, $http, $window, StudentUsers, Courses, $cookieStore) {
  $window.sessionStorage.baseurl = 'http://localhost:4000'
  var role = $cookieStore.get("role");
  var id = $cookieStore.get("id");
  console.log(id);
  console.log(role);
  //get user info
  if (role !== "student") {
    alert("Access Forbidden!");
  }
  else {
    StudentUsers.get(id).success(function(jsonData, statusCode) {
      console.log('The request for user was successful', statusCode);
      $scope.user = jsonData.data;
    })
    .error(function(jsonData, statusCode) {
      alert("Can not find User!");
      console.log('find student user failed', statusCode);
    });
  }

  //get all course list as options
  $scope.data = {
    selectedOption: {}
  }
  Courses.get().success(function(jsonData, statusCode) {
    console.log('The request for courses was successful', statusCode);
    $scope.data.availableOptions = jsonData.data;
    console.log(jsonData.data);
  })
  .error(function(jsonData, statusCode) {
    console.log('failed to load courses', statusCode);
  });
  //add course to a user and update
  $scope.addCourse = function() {
    console.log($scope.data.selectedOption);
    //check if valid course chosen
    if ($scope.data.selectedOption._id) {
      //check if already registered
      var registered = false;
      for(var i = 0; i < $scope.user.courseList.length; i++) {
        if ($scope.data.selectedOption._id === $scope.user.courseList[i].courseid) {
          registered = true;
          break;
        }
      }
      if (registered) {
        alert("You have already Registered!");
      }
      //add to user's courseList and courseTaskList
      else {
        $scope.user.courseList.push({"courseid": $scope.data.selectedOption._id, "courseName": $scope.data.selectedOption.name});
        var courseTasks = [];
        for(var i = 0; i < $scope.data.selectedOption.courseTaskList.length; i++) {
          courseTasks.push({"courseid": $scope.data.selectedOption._id, "courseTaskid": $scope.data.selectedOption.courseTaskList[i], "timespent": 0})
        }
        $scope.user.courseTaskList.concat(courseTasks);
        StudentUsers.put($scope.user).success(function(jsonData, statusCode) {
          console.log('The request for adding class was successful', statusCode);
        })
        .error(function(jsonData, statusCode) {
          console.log('The request for adding class failed', statusCode);
        });
      }
    }
    else {
      alert("Please Choose a Course!");
    }
  }

  //drop course
  $scope.dropCourse = function(cid) {
    //remove from user's courseList
    for(var i = 0; i < $scope.user.courseList.length; i++) {
      if ($scope.user.courseList[i].courseid === cid) {
        $scope.user.courseList.splice(i, 1);
        break;
      }
    }
    //remove from user's courseTaskList
    for(var i = 0; i < $scope.user.courseTaskList.length; i++) {
      if ($scope.user.courseTaskList[i].courseid === cid) {
        $scope.user.courseTaskList.splice(i, 1);
        i--;
      }
    }
    //remove from user's personalTaskList
    for(var i = 0; i < $scope.user.personalTaskList.length; i++) {
      if ($scope.user.personalTaskList[i].courseid === cid) {
        $scope.user.personalTaskList.splice(i, 1);
        i--;
      }
    }

    StudentUsers.put($scope.user).success(function(jsonData, statusCode) {
      console.log('The request for drop class was successful', statusCode);
    })
    .error(function(jsonData, statusCode) {
      console.log('The request for drop class failed', statusCode);
    });
  }

//time stat to be implemented!

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

var LSControllers = angular.module('LSControllers', ['ngCookies']);

LSControllers.controller('SignupController', ['$scope', '$http', '$window', 'StudentUsers', 'InstructorUsers', '$cookieStore', function($scope, $http, $window, StudentUsers, InstructorUsers, $cookieStore) {
  $window.sessionStorage.baseurl = 'http://localhost:4000'
  $scope.role = true;
  $scope.email = '';
  $scope.name = '';
  $scope.password = '';
  //add a new user
  $scope.addUser = function(formValid) {
    if (formValid) {
      var user = {"email": $scope.email, "name": $scope.name, "password": $scope.password};
      if ($scope.role) {
        //creat new student user
        console.log("before post");
        StudentUsers.post(user).success(function(jsonData, statusCode) {
          console.log('The request for adding a student user was successful', statusCode);
        })
        .error(function(jsonData, statusCode) {
          alert("This email already exists!");
          console.log('add student user failed', statusCode);
        });
      }
      else {
        //creat new instructor user
        InstructorUsers.post(user).success(function(jsonData, statusCode) {
          console.log('The request for adding a instructor user was successful', statusCode);
        })
        .error(function(jsonData, statusCode) {
          alert("This email already exists!");
          console.log('add instructor user failed', statusCode);
        });
      }

    }
  };

}]);

LSControllers.controller('LoginController', ['$scope', '$http', '$window', 'StudentUsers', 'InstructorUsers', '$cookieStore', function($scope, $http, $window, StudentUsers, InstructorUsers, $cookieStore) {
  $window.sessionStorage.baseurl = 'http://localhost:4000'
  $scope.role = true;
  $scope.email = '';
  $scope.password = '';

  $scope.Login = function(formValid) {
    if (formValid) {
      if ($scope.role) {
        //find student user
        console.log($scope.email);

        StudentUsers.get({where: {"email": $scope.email}}).success(function(jsonData, statusCode) {
          console.log('The request for finding a student user was successful', statusCode);
          console.log(jsonData);
          console.log(jsonData.data);
          if (jsonData.data.length === 0) {
            alert("This user is not Registered!");
          }
          else {
            var user = jsonData.data[0];
            if (user.password === $scope.password) {
              $cookieStore.put('role', 'student');
              $cookieStore.put('id', user._id);
              console.log($cookieStore.get("id"));
              alert("Log in success!");
            }
            else {
              alert("Wrong Password!");
            }
          }
        })
        .error(function(jsonData, statusCode) {
          console.log('find student user failed', statusCode);
        });
      }
      else {
        //find instructor user
        InstructorUsers.post(user).success(function(jsonData, statusCode) {
          console.log('The request for finding a instructor user was successful', statusCode);
          if (jsonData.data.length === 0) {
            alert("This user is not Registered!");
          }
          else {
            var user = jsonData.data[0];
            if (user.password === $scope.password) {
              $cookieStore.put('role', 'instructor');
              $cookieStore.put('id', user._id);
              alert("Log in success!");              
            }
            else {
              alert("Wrong Password!");
            }
          }
        })
        .error(function(jsonData, statusCode) {
          console.log('find instructor user failed', statusCode);
          $scope.message = jsonData.message;
        });
      }

    }
  };


}]);
