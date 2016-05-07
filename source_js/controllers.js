var CHControllers = angular.module('CHControllers', ['ngCookies']);

var url = 'http://tarekc53.cs.illinois.edu:4000'
 

CHControllers.controller('DuesController', ['$scope', '$http', '$window', 'StudentUsers', 'Courses', '$cookieStore', '$state', function($scope, $http, $window, StudentUsers, Courses, $cookieStore, $state) {
  $window.sessionStorage.baseurl = url;
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

CHControllers.controller('TodosController', ['$scope', '$http', '$window', 'StudentUsers', 'Courses', '$cookieStore', '$state', function($scope, $http, $window, StudentUsers, Courses, $cookieStore, $state) {
  $window.sessionStorage.baseurl = url;
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


CHControllers.controller('AddDropController', ['$scope', '$http', '$window', 'StudentUsers', 'Courses', '$cookieStore', '$state', function($scope, $http, $window, StudentUsers, Courses, $cookieStore, $state) {
  $window.sessionStorage.baseurl = url;
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

CHControllers.controller('InstructorController', 
  ['$scope', '$http', '$window', '$cookieStore', 
   'InstructorUsers', 'Courses', '$state',
  function($scope, $http, $window, $cookieStore, 
           InstructorUsers, Courses, $state) {
    //google.charts.load('current', {'packages':['corechart']});
    google.charts.setOnLoadCallback(drawChart);
    $scope.totalTime = 0;
    function drawChart() {
        
      if ($scope.currentCourse && $scope.currentCourse.courseTaskList) {
        var items = [['Task', 'Average Hours Spent']];
        var cnt = 1;
        for (var task in $scope.currentCourse.courseTaskList) {
          items.push(['MP' + cnt, task.averageTimeSpent]);
          cnt = cnt + 1;
          $scope.totalTime += task.averageTimeSpent;
        }
        if ($scope.totalTime > 0){
          var data = google.visualization.arrayToDataTable(items);

          var options = {
            title: 'MP Efforts'
          };
          var chart = new google.visualization.PieChart(document.getElementById('piechart'));

          chart.draw(data, options);
        }
      }
    }



    $(window).resize(function(){
      drawChart();
    });

    var instructorId = $cookieStore.get('id');
    $scope.instructorName = $cookieStore.get('name');

    var updateCourses = function (instructorId) {
      Courses.get({where: {"instructorid": instructorId}})
        .success(function(jsonData, statusCode) {
          $scope.courseList = jsonData.data;
          console.log(JSON.stringify(jsonData.data)); 
          if ($scope.courseList.length > 0) {
            $scope.currentCourse = $scope.courseList[0];
          } else {
            $scope.currentCourse = undefined;
          }
        })
        .error(function(jsonData, statusCode) {
          alert('ERROR' + JSON.stringify(jsonData)); 
        }) 
    }

    updateCourses(instructorId);
    $scope.signout = function() {
      $cookieStore.remove('role');
      $cookieStore.remove('id');
      $cookieStore.remove('name');
      $cookieStore.remove('couseList');
      $state.go('login');
    }



    $scope.coursePanel = 'add';

    $scope.openEditTask = function(taskIndex) {
      $scope.taskPanel='edit';
      $scope.currentTaskIndex=taskIndex;
    }

    $scope.openAddCourse = function() {
      $scope.coursePanel = 'add';
    }

    $scope.showCourse = function(course) {
      $scope.currentCourse = course;
    }

    $scope.addCourse = function(formValid) {
      if (formValid) {
        var course = {"name": $scope.courseName, 
                      "homepage": $scope.courseHomepage,
                      "description": $scope.courseDescription,
                      "instructorid": instructorId,
                      "instructorName": $scope.instructorName,
                      "courseTaskList": [],
                      "studentList": []}

        Courses.post(course).success(function(jsonData, statusCode) {
            alert(JSON.stringify(jsonData));
            console.log('course successfully added');
            $scope.courseList.push(course);
            $scope.currentCourse = jsonData.data;
          })
          .error(function(jsonData, statusCode) {
            console.log('course add error');
          });
      } else {
        alert("invalid course information");
      }
    }

    $scope.editCourse = function(formValid) {
      if (formValid) {
        $scope.currentCourse.name = $scope.courseName;
        $scope.currentCourse.homepage = $scope.courseHomepage;
        $scope.currentCourse.description = $scope.courseDescription;

        Courses.put($scope.currentCourse)
          .success(function(jsonData, statusCose) {
            console.log("course updated");  
          })
          .error(function(jsonData, statusCode) {
            alert("updating course failed");
          })
      }
    }

    $scope.addTask = function(formValid) {
      if (formValid) {
        var task = {'courseid': $scope.currentCourse._id,
                    'courseName': $scope.currentCourse.name,
                    'name': $scope.taskName,
                    'description': $scope.taskDescription,
                    'dueDate': $scope.taskDeadline,
                    'averageTimeSpent': 0}
        if (!$scope.currentCourse.courseTaskList)
          $scope.currentCourse.courseTaskList = []
        $scope.currentCourse.courseTaskList.push(task);
        Courses.put($scope.currentCourse)
          .success(function(jsonData, statusCose) {
            console.log("task added");  
          })
          .error(function(jsonData, statusCode) {
            alert("add task failed");
          })
          
      }
    }

    $scope.editTask = function(index, formValid) {
      alert('edittask!! ' + formValid);
      if (formValid) {
        var task = $scope.currentCourse.courseTaskList[index];
        task.name = $scope.taskName;
        task.description = $scope.taskDescription;
        task.dueDate = $scope.taskDeadline;
        $scope.currentCourse.courseTaskList[index] = task;
        Courses.put($scope.currentCourse)
          .success(function(jsonData, statusCose) {
            console.log("task updated");  
          })
          .error(function(jsonData, statusCode) {
            alert("update task failed");
          })
      }
    }

    $scope.deleteCourse = function() {
      if ($scope.currentCourse) {
        Courses.delete($scope.currentCourse._id)
          .success(function(jsonData, statusCode) {
            console.log('course deleted');
            updateCourses(instructorId);
          })
          .error(function(jsonData, statusCode) {
            alert('delete course error');
          }) 
      }
    }

    $scope.deleteTask = function(taskIndex) {
      $scope.currentCourse.courseTaskList.splice(taskIndex, 1);
      Courses.put($scope.currentCourse)
        .success(function(jsonData, statusCode) {
          console.log("task added");  
        })
        .error(function(jsonData, statusCode) {
          alert("delete task failed");
        })

    }

}]);


CHControllers.controller('CourseController', 
  ['$scope', '$http', '$window','$stateParams', 'Courses', '$state',
  function($scope, $http, $window, $stateParams, Courses, $state) {
    $window.sessionStorage.baseurl = url;
    var id = $stateParams.id;

    Courses.get(id)
      .success(function(jsonData, statusCode) {
        $scope.currentCourse = jsonData.data;
      })
      .error(function(jsonData, statusCode) {
        alert("get course error: " + id);
      })

    $scope.signout = function() {
      $cookieStore.remove('role');
      $cookieStore.remove('id');
      $cookieStore.remove('name');
      $cookieStore.remove('couseList');
      $state.go('login');
    }




    /*
    //google.charts.load('current', {'packages':['corechart']});
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
    */

}]);

CHControllers.controller('SettingsController', ['$scope' , '$window', function($scope, $window) {
  $scope.url = $window.sessionStorage.baseurl;

  $scope.setUrl = function(){
    $window.sessionStorage.baseurl = $scope.url;
    $scope.displayText = "URL set";

  };

}]);



CHControllers.controller('SignoutController', 
  ['$scope' , '$window' , '$state', '$cookieStore', 
  function($scope, $window, $state, $cookieStore) {
  $scope.url = $window.sessionStorage.baseurl;

    $scope.signout = function() {
      $cookieStore.remove('role');
      $cookieStore.remove('id');
      $cookieStore.remove('name');
      $cookieStore.remove('couseList');
      $state.go('login');
    }


}]);

//var LSControllers = angular.module('LSControllers', ['ngCookies']);

CHControllers.controller('LoginController', ['$scope', '$http', '$window', 'StudentUsers', 'InstructorUsers', '$cookieStore', '$state', function($scope, $http, $window, StudentUsers, InstructorUsers, $cookieStore, $state) {

  // switch panels
  $scope.showPanel = 'slogan';

  $scope.showLogin = function () {
    $('#logo').animate({paddingTop:"2.2em"}, 200);
    $scope.showPanel = 'login';
  }

  $scope.showSignup = function () {
    $('#logo').animate({paddingTop:"1.8em"}, 200);
    $scope.showPanel = 'signup';
  }

  $scope.showSlogan = function () {
    $('#logo').animate({paddingTop:"2.5em"});
    $scope.showPanel = 'slogan';
  }


  //add a new user
  $window.sessionStorage.baseurl = url;
  $scope.role = true;
  $scope.email = '';
  $scope.name = '';
  $scope.password = '';

  $scope.addUser = function(formValid) {
    if (formValid) {
      var user = {"email": $scope.email, "name": $scope.name, "password": $scope.password};
      if ($scope.role) {
        //creat new student user
        console.log("before post");
        StudentUsers.post(user).success(function(jsonData, statusCode) {
          console.log('The request for adding a student user was successful', statusCode);
          $scope.showSlogan();
        })
        .error(function(jsonData, statusCode) {
          alert("This email already exists!");
          console.log('add student user failed', statusCode);
        });
      }
      else {
        //creat new instructor/course user
        user['courseList'] = [];
        InstructorUsers.post(user).success(function(jsonData, statusCode) {
          console.log('The request for adding a instructor user was successful', statusCode);
          $scope.showSlogan();
        })
        .error(function(jsonData, statusCode) {
          alert("This email already exists!");
          console.log('add instructor user failed', statusCode);
        });
      }

    }
  };

  $scope.login = function(formValid) {
    if (formValid) {
      if ($scope.role) {
        //find student user
        console.log($scope.email);

        var user = {'username': $scope.email,
                    'password': $scope.password}

        $http.post(url + "/api/studentlogin", user)
             .success(function (data, status) {
                alert('login succeed:' + JSON.stringify(data) );
                $cookieStore.put('role', 'student');
                $cookieStore.put('id', data._id);
                console.log($cookieStore.get("id"));
                $state.go('student.dues');
             })
             .error(function (data) {
                 alert('login failed');
                 $state.go('login');
             })
/*
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
              $state.go('student.dues');
            }
            else {
              alert("Wrong Password!");
            }
          }
        })
        .error(function(jsonData, statusCode) {
          console.log('find student user failed', statusCode);
        });
       */
      }
      else {
        //find instructor user
        var user = {'username': $scope.email,
                    'password': $scope.password}

        $http.post(url + "/api/instructorlogin", user)
             .success(function (data, status) {
                $cookieStore.put('role', 'instructor');
                $cookieStore.put('id', data._id);
                $cookieStore.put('name', data.name);
                $cookieStore.put('courseList', data.courseList);
                alert("Log in success!" +  $state.current);              
                $state.go('instructor.main');
             })
             .error(function (data) {
                 alert('login failed');
                 $state.go('login');
             })

/*
        InstructorUsers.get({where: {"email": $scope.email}})
        .success(function(jsonData, statusCode) {
          console.log('The request for finding a instructor user was successful', statusCode);
          if (jsonData.data.length === 0) {
            alert("This user is not Registered!");
          }
          else {
            var user = jsonData.data[0];
            if (user.password === $scope.password) {
              $cookieStore.put('role', 'instructor');
              $cookieStore.put('id', user._id);
              $cookieStore.put('name', user.name);
              $cookieStore.put('courseList', user.courseList);
              alert("Log in success!" +  $state.current);              
              $state.go('instructor.main');
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
*/

      }

    }
  };


}]);
