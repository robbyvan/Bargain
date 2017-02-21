var app = angular.module('adminApp', ['ngRoute']);

app.factory('AuthService', function($http){
  var factory = {};
  factory.adminLogin = function(){
    $http.get('/api/ensureAuth').then(function(response){
      console.log(response.data);
      let auth = response.data.authenticated;
      if (!auth){
        window.location.href = '#!/login';
      }else{
        $scope.username = response.data.username;
        if (DataShareService.currentUser === undefined){
          DataShareService.currentUser = response.data.username;
        }
      }
      return auth;
    });
  }
  return factory;
});

app.controller('reqItemController', ['$scope', '$http', '$routeParams', '$route', '$location', function($scope, $http, $routeParams, $route, $location){

  console.log('reqItemController loaded.');

  $scope.adminItemInit = function(){
    let logged = AuthService.adminLogin();
    if (loaded){
      $scope.getAdminItems();
    }
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
      // console.log('data get at: ' + Date.now());
      console.log($scope.currentItem);
    });
  }

  $scope.removeOnly = function(id){
    console.log('decline clicked. id: ' + id );
    $http.delete('/api/admin_items/' + id).then(function(response){
      //can't use $index to locate the deleted row, it will cause bug.
      for (let i = 0; i < $scope.adminItems.length; ++i){
        let obj = $scope.adminItems[i];
        if (obj['_id'] === id){
          $scope.adminItems.splice(i, 1);
        }
      }
      //no need to update scope from response.data
      console.log('removed.');
    });
  }

  $scope.addThenRemove = function(id){
    console.log('accept clicked.');
    //get item detail
    $http.get('/api/admin_items/' + id).then(function(response){
      let currentItem = response.data;
      console.log(currentItem);
      //post to item collection
      $http.post('/api/items', currentItem).then(function(response){
        console.log('added to mall.');
        $http.delete('/api/admin_items/' + id).then(function(response){

          for (let i = 0; i < $scope.adminItems.length; ++i){
            let obj = $scope.adminItems[i];
            if (obj['_id'] === id){
              $scope.adminItems.splice(i, 1);
            }
          }

        });//end DELETE

      });//end POST

    });//end GET
  }

}]);