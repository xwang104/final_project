var CHControllers = angular.module('CHControllers', ['ngCookies']);



CHControllers.controller('DuesController', ['$scope', '$http', '$window', 'StudentUsers', 'Courses', '$cookieStore', function($scope, $http, $window, StudentUsers, Courses, $cookieStore) {
  $window.sessionStorage.baseurl = 'http://localhost:4000'
  var role = $cookieStore.get("role");
  var id = $cookieStore.get("id");
  console.log(id);
  console.log(role);
  $scope.data = {
    selectedOption: {}
  }
  $scope.courseTasks = [];
  $scope.allTasks = []
  $scope.upcommingDuesDic = {};
  $scope.upcommingDuesArr = [];

  function makeUpcommingDues() {
      console.log($scope.courseTasks.length);
      $scope.allTasks = []
      $scope.upcommingDuesDic = {};
      $scope.upcommingDuesArr = [];
      //combine all course tasks and personal tasks
      $scope.allTasks = $scope.user.personalTaskList.concat($scope.courseTasks);
      //console.log($scope.allTasks);
      for(var i = 0; i < $scope.allTasks.length; i++) {
        var datetime = $scope.allTasks[i].dueDate;
        console.log(datetime);
        var date = datetime.substring(0, 10);
        //console.log(date);
        if ($scope.upcommingDuesDic.hasOwnProperty(date)) {
          $scope.upcommingDuesDic[date].push($scope.allTasks[i]);
        }
        else {
          $scope.upcommingDuesDic[date] = [$scope.allTasks[i]];
        }
      }
      //console.log("dictionary" + JSON.stringify($scope.upcommingDuesDic));
      for (var key in $scope.upcommingDuesDic) {
        $scope.upcommingDuesArr.push({"date": key, "dues": $scope.upcommingDuesDic[key]})
      }
      //console.log(JSON.stringify($scope.upcommingDuesArr));
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
        //get course tasks from each registered course
      for(var i = 0; i < $scope.user.courseList.length; i++) {
        Courses.get($scope.user.courseList[i].courseid).success(function(jsonData, statusCode) {
          console.log('Get course success', statusCode);
          //console.log(jsonData.data);
          $scope.courseTasks = $scope.courseTasks.concat(jsonData.data.courseTaskList);
          makeUpcommingDues();
          //console.log($scope.courseTasks);
        })
      }
      
      //user's course list as options
      $scope.data.availableOptions = $scope.user.courseList;

      //make color dic for courses
      $scope.courseColorList = [];
      for (var i = 0; i < $scope.user.courseList.length; i ++) {
        $scope.courseColorList[$scope.user.courseList[i].courseid] = "course_" + i;
      }


    })
    .error(function(jsonData, statusCode) {
      alert("Can not find User!");
      console.log('find student user failed', statusCode);
    });
  }
  $scope.selected = "";

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
                  "dueDate": $scope.deadline.toISOString(),
                  "timespent": 0};
      $scope.user.personalTaskList.push(task);

      StudentUsers.put($scope.user).success(function(jsonData, statusCode) {
        console.log("update user's personal tasks successful", statusCode);
          alert("Your personal task was added successfully!")
          //update upcommingdues
          makeUpcommingDues();
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

  var now = new Date();
  $scope.now = now.toISOString();

}]);

CHControllers.controller('TodosController', ['$scope', '$http', '$window', 'StudentUsers', 'Courses', '$cookieStore', function($scope, $http, $window, StudentUsers, Courses, $cookieStore) {
  $window.sessionStorage.baseurl = 'http://localhost:4000'
  var role = $cookieStore.get("role");
  var id = $cookieStore.get("id");
  console.log(id);
  console.log(role);
  $scope.data = {
    selectedOption: {}
  }
  $scope.todoArr = []
  $scope.todoDic = {};
  function maketodoDic() {
    $scope.todoDic = {};
    for(var i = 0; i < $scope.todoArr.length; i++) {
      if ($scope.todoDic.hasOwnProperty($scope.todoArr[i].start.substring(0, 10))) {
          $scope.todoDic[$scope.todoArr[i].start.substring(0, 10)].push($scope.todoArr[i]);
      }
      else {
          $scope.todoDic[$scope.todoArr[i].start.substring(0, 10)] = [$scope.todoArr[i]];
      }
    }
  }


  $scope.data_1 = {
    selectedOption: {}
  }

  $scope.courseTasks = [];
  $scope.personalTaskid = [];
  $scope.allTasks = []
  $scope.upcommingDuesDic = {};
  $scope.upcommingDuesArr = [];

  function makeUpcommingDues() {
      $scope.allTasks = []
      $scope.upcommingDuesDic = {};
      $scope.upcommingDuesArr = [];
      for(var i = 0; i < $scope.user.personalTaskList.length; i++) {
        $scope.personalTaskid.push($scope.user.personalTaskList[i]._id);
      }
      //combine all course tasks and personal tasks
      $scope.allTasks = $scope.user.personalTaskList.concat($scope.courseTasks);
      for(var i = 0; i < $scope.allTasks.length; i++) {
        var datetime = $scope.allTasks[i].dueDate;
        console.log(datetime);
        var date = datetime.substring(0, 10);
        //console.log(date);
        if ($scope.upcommingDuesDic.hasOwnProperty(date)) {
          $scope.upcommingDuesDic[date].push($scope.allTasks[i]);
        }
        else {
          $scope.upcommingDuesDic[date] = [$scope.allTasks[i]];
        }
      }
      //console.log(JSON.stringify($scope.upcommingDuesDic));
      for (var key in $scope.upcommingDuesDic) {
        $scope.upcommingDuesArr.push({"date": key, "dues": $scope.upcommingDuesDic[key]})
      }
      //console.log(JSON.stringify($scope.upcommingDuesArr));

      //make color dic for courses
      $scope.courseColorList = [];
      for (var i = 0; i < $scope.user.courseList.length; i ++) {
        $scope.courseColorList[$scope.user.courseList[i].courseid] = "course_" + i;
      }
  }

  $scope.showTodo = function() {
    $('#all-todo').css("background", "#31859b");
    $('#all-due').css("background", '#a5a5a5');
    $('#todos').show();
    $('#dues').hide();
  };

  $scope.showDue = function() {
    $('#all-due').css("background", "#31859b");
    $('#all-todo').css("background", '#a5a5a5');
    $('#dues').show();
    $('#todos').hide();
  }

  //get user info
  if (role !== "student") {
    alert("Access Forbidden!");
  }
  else {
    StudentUsers.get(id).success(function(jsonData, statusCode) {
      console.log('The request for user was successful', statusCode);
      $scope.user = jsonData.data;
      $scope.todoArr = $scope.user.todoList;
      maketodoDic();
      //get course tasks from each registered course prepare for add todo
      $scope.courseTasks = [];
      for(var i = 0; i < $scope.user.courseList.length; i++) {
        Courses.get($scope.user.courseList[i].courseid).success(function(jsonData, statusCode) {
          console.log('Get course success', statusCode);
          $scope.courseTasks = $scope.courseTasks.concat(jsonData.data.courseTaskList);
          makeUpcommingDues();
          //combine all course tasks and personal tasks
          $scope.data.availableOptions = []
          $scope.allTasks = $scope.user.personalTaskList.concat($scope.courseTasks);
          //prepare select options
          for(var i = 0; i < $scope.allTasks.length; i++) {
            $scope.data.availableOptions.push($scope.allTasks[i]);
            $scope.data.availableOptions[i]["taskname"] = $scope.allTasks[i].courseName + " " + $scope.allTasks[i].name;
          }
        })
      }

      //user's course list as options
      $scope.data_1.availableOptions = $scope.user.courseList;
    })
    .error(function(jsonData, statusCode) {
      alert("Can not find User!");
      console.log('find student user failed', statusCode);
    });
  }
  $scope.description = "";
  $scope.start = "";
  $scope.end = ""; 

  //add new todo to user
  $scope.addTodo =  function(formValid) {
    if (formValid && $scope.start < $scope.end) {
      var todo = {"courseid": $scope.data.selectedOption.courseid,
                  "courseName": $scope.data.selectedOption.courseName,
                  "taskid":$scope.data.selectedOption._id,
                  "taskName": $scope.data.selectedOption.taskname,
                  "description": $scope.description,
                  "start": $scope.start.toISOString(),
                  "end": $scope.end.toISOString()};
      $scope.user.todoList.push(todo);
      StudentUsers.put($scope.user).success(function(jsonData, statusCode) {
          console.log("update user's todo successful", statusCode);
          alert("Your new To Do was added successfully!")
          if ($scope.todoDic.hasOwnProperty(todo.start.substring(0, 10))) {
              $scope.todoDic[todo.start.substring(0, 10)].push(todo);
          }
          else {
              $scope.todoDic[todo.start.substring(0, 10)] = [todo];
          }
          $scope.data.selectedOption = {};
          $scope.description = "",
          $scope.start = "",
          $scope.end = "",
          $('#add-todo').foundation('close');        
      })
      .error(function(jsonData, statusCode) {
        console.log("update user failed", statusCode);
      });
    }
    else {
      alert("Invalid Time Span!");
    }
  }


  $scope.name = "";
  $scope.task_description = "";
  $scope.deadline = "";


  //add new personal task
  $scope.addPTask =  function(formValid) {
    if (formValid) {
      var task = {"courseid": $scope.data_1.selectedOption.courseid,
                  "courseName": $scope.data_1.selectedOption.courseName,
                  "name": $scope.name,
                  "description": $scope.task_description,
                  "dueDate": $scope.deadline.toISOString(),
                  "timespent": 0};
      $scope.user.personalTaskList.push(task);

      StudentUsers.put($scope.user).success(function(jsonData, statusCode) {
        console.log("update user's personal tasks successful", statusCode);
          alert("Your personal task was added successfully!")
          //update upcommingdues
          makeUpcommingDues();
          $scope.data_1.selectedOption = {};
          $scope.name = "";
          $scope.task_description = "",
          $scope.deadline = "",
          $('#add-task').foundation('close');        
      })
      .error(function(jsonData, statusCode) {
        console.log("update user failed", statusCode);
      });
    }
  }

  $scope.deleteTodo = function(id) {
    for(var i = 0; i < $scope.user.todoList.length; i++) {
      if ($scope.user.todoList[i]._id === id) {
        $scope.user.todoList.splice(i, 1);
        StudentUsers.put($scope.user).success(function(jsonData, statusCode) {
          console.log($scope.user.todoList);
          console.log("delete todo success", statusCode);
          $scope.todoArr = $scope.user.todoList;
          maketodoDic();
        })
        .error(function(jsonData, statusCode) {
          console.log("delete doto failed", statusCode);
        });
        break;
      }
    }
  }

  $scope.deleteTask = function(id) {
    for(var i = 0; i < $scope.user.personalTaskList.length; i++) {
      if ($scope.user.personalTaskList[i]._id === id) {
        $scope.user.personalTaskList.splice(i, 1);
        StudentUsers.put($scope.user).success(function(jsonData, statusCode) {
          console.log($scope.user.todoList);
          console.log("delete task success", statusCode);
          $scope.todoArr = $scope.user.todoList;
          makeUpcommingDues();
        })
        .error(function(jsonData, statusCode) {
          console.log("delete task failed", statusCode);
        });
        break;
      }
    }
  }
  var now = new Date();
  $scope.now = now.toISOString();

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
      
      //make color dic for courses
      $scope.courseColorList = [];
      for (var i = 0; i < $scope.user.courseList.length; i ++) {
        $scope.courseColorList[$scope.user.courseList[i].courseid] = "course_" + i;
      }
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
    if ($scope.user.courseList.length === 6) {
      alert("You are OverLoad!");
      return;
    }
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
        //var courseTasks = [];
        for(var i = 0; i < $scope.data.selectedOption.courseTaskList.length; i++) {
          $scope.user.courseTaskList.push({"courseid": $scope.data.selectedOption._id, "courseTaskid": $scope.data.selectedOption.courseTaskList[i]._id, "timespent": 0})
        }
        //console.log($scope.data.selectedOption.courseTaskList);
        console.log($scope.user.courseTaskList);
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

    //remove from user's todoList
    for(var i = 0; i < $scope.user.todoList.length; i++) {
      if ($scope.user.todoList[i].courseid === cid) {
        $scope.user.todoList.splice(i, 1);
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
