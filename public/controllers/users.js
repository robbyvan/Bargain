var myApp = angular.module('myApp');

myApp.controller('UserController', ['$scope', '$http', '$routeParams', '$location', function($scope, $http, $routeParams, $location){

  console.log("UserController Loaded.");

  $scope.getUsers = function(){
    $http.get('/api/users').then(function(response){
      $scope.users = response.data;
    });
  }

  $scope.createUser = function(){
    $http.post('/api/register', $scope.user).then(function(response){
      console.log('submit success!');
      console.log('errors are: ');
      for (errInfo in response.data){
        console.log(response.data[errInfo].msg);
      }
      // window.location.href = "#!/movies";
    });
  }

}]);