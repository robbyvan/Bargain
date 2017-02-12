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

  $scope.getAdminItemById = function(id){
      $http.get('/api/admin_items/' + id).then(function(response){
      $scope.currentItem = response.data;
      console.log('data get at: ' + Date.now());
      console.log($scope.currentItem);
    });
  }

  $scope.addToMall = function(word){
    console.log(word);
    // $http.post('api/items', $scope.currentItem).then(function(response){
    //   console.log('added.');
    //   if (callback !== undefined){
    //     callback();
    //   }
    // });
  }

  $scope.removeAdminItem = function(id){
    console.log('id is: ' + id);
    $http.delete('/api/admin_items/' + id).then(function(response){
      $scope.adminItems = response.data;
      console.log('removed.');
    });
  }

  $scope.addThenRemove = function(id){
    // $scope.removeAdminItem(id)
    $scope.getAdminItemById(id).then($scope.addToMall('excuted or not?'));
  }
  

}]);