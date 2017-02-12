var app = angular.module('adminApp', ['ngRoute']);

app.controller('ItemController', ['$scope', '$http', '$routeParams', '$location', function($scope, $http, $routeParams, $location){

  $scope.adminItemInit = function(){
    $scope.getAdminItems();
  }

  $scope.getAdminItems = function(){
    $http.get('/api/admin_items').then(function(response){
      $scope.adminItems = response.data;
      console.log($scope.adminItems);
    });
  }

  $scope.addAdminItem = function(){
    
  }

}]);