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
    
    if (DataShareService.currentUser === undefined){
      DataShareService.currentUser = $scope.user.username;
    }

    $http.post('/api/login', $scope.user).then(function(response){
      console.log('submit success!');
      window.location.href = '#!/';      
      console.log('You are logged in!');
      console.log($scope.username);
    });
  }

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
        if (DataShareService.currentUser === undefined){
          DataShareService.currentUser = response.data.username;
        }
      }
    });
  }

  DataShareService.ensureAuthenticated = $scope.ensureAuthenticated;

  $scope.userLogout = function(){
    $http.get('/api/logout').then(function(response){
      window.location.href = '#!/login';
      console.log('You are logged out!');
    });
  }

  $scope.getItems = function(){
    $http.get('/api/items').then(function(response){
      $scope.items = response.data;
      console.log($scope.items);
    });
  }

  $scope.addItem = function(){
    $scope.newItem.vendor = DataShareService.currentUser;
    console.log(DataShareService.currentUser);
    $http.post('/api/items', $scope.newItem).then(function(response){
      window.location.href = "#!/";
    });
  }

  $scope.homepageInit = function(){
    // DataShareService.ensureAuthenticated();
    $scope.ensureAuthenticated();
    $scope.getItems();
    console.log($scope.items);
  }

}]);

myApp.controller('detailController', ['$scope', '$http', '$routeParams', '$location', 'DataShareService', function($scope, $http, $routeParams, $location, DataShareService){

  console.log('detailController loaded.');

  $scope.detailInit = function(){
    $scope.getItem();
  }

  $scope.getItem = function(){
    var id = $routeParams.id;
    console.log(id);
    $http.get('/api/item/' + id).then(function(response){
      $scope.item = response.data;
      console.log($scope.item);
    });
  }

  $scope.addToCart = function(){
    console.log('clicked.');
    var addItem =  {
      itemId: $scope.item._id,
      demand: 1
    };

    $http.post('/api/cart/add', addItem).then(function(response){
      console.log('added!');
      console.log(response);
      var buyNum = response.data.orders.length;
      console.log("Now " + buyNum + " item(s) in your cart.");
    });

  }

}]);

myApp.controller('cartController', ['$scope', '$http', '$routeParams', '$location', 'DataShareService', function($scope, $http, $routeParams, $location, DataShareService){

  console.log('cartController loaded.');

  $scope.cartInit = function(){
    $scope.getBuyList();
  }

  $scope.getBuyList = function(){
    var userId = DataShareService.currentUser;
    $http.get('/api/cart' + userId, function(response){
      $scope.buys = response.data;
    });
  }

  // $scope.updateDemand = function()

}] );