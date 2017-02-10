var myApp = angular.module('myApp');

myApp.service('DataShareService', function(){
  
});


myApp.controller('UserController', ['$scope', '$http', '$routeParams', '$location', 'DataShareService', function($scope, $http, $routeParams, $location, DataShareService){

  console.log("UserController Loaded.");

  $scope.getUsers = function(){
    $http.get('/api/users').then(function(response){
      $scope.users = response.data;
    });
  }

  $scope.createUser = function(){
    $http.post('/api/register', $scope.user).then(function(response){
      console.log('submit success!');

      var count = (response.data.length === undefined)? 0 : response.data.length;
      console.log('have ' + count + ' error(s)');
      if (count > 0){
        for (errInfo in response.data){
         console.log(response.data[errInfo].msg);
        }
      }

    });
  }

  $scope.userLogin = function(){
    //added
    DataShareService.currentUser = $scope.user.username;

    $http.post('/api/login', $scope.user).then(function(response){
      console.log('submit success!');
      window.location.href = '#!/';      
      console.log('You are logged in!');
      console.log($scope.username);
    });
  }

  // $scope.userLogout = function(){
  //   $http.get('/api/logout').then(function(response){
  //     window.location.href = '#!/login';
  //     console.log('You are logged out!');
  //   });
  // }

}]);

myApp.controller('homepageController', ['$scope', '$http', '$routeParams', '$location', 'DataShareService', function($scope, $http, $routeParams, $location, DataShareService){

  console.log('homepageController Loaded.');

  $scope.ensureAuthenticated = function(){
    $http.get('/api/ensureAuth').then(function(response){
      console.log(response.data);
      var auth = response.data.authenticated;
      if (!auth){
        window.location.href = '#!/login';
      }else{
        $scope.username = response.data.username;
        DataShareService.currentUser = response.data.username;
      }
    });
  }

  $scope.getItems = function(){
    $http.get('/api/items').then(function(response){
      $scope.items = response.data;
    });
  }

  $scope.userLogout = function(){
    $http.get('/api/logout').then(function(response){
      window.location.href = '#!/login';
      console.log('You are logged out!');
    });
  }

  $scope.homepageInit = function(){
    $scope.ensureAuthenticated();
    $scope.getItems();
    console.log($scope.items);
  }

}]);