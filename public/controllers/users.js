var myApp = angular.module('myApp');

myApp.service('DataShareService', function(){
});

myApp.factory('AuthService', function($http){
  var factory = {};
  factory.checkLogin = function(){
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
      }else{
        window.location.href = '#!/login';
        console.log('you have registered.');
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

myApp.controller('homepageController', ['$scope', '$http', '$routeParams', '$location', 'DataShareService', 'AuthService', function($scope, $http, $routeParams, $location, DataShareService, AuthService){

  console.log('homepageController Loaded.');


  AuthService.checkLogin();
  // $scope.ensureAuthenticated = function(){
  //   $http.get('/api/ensureAuth').then(function(response){
  //     console.log(response.data);
  //     var auth = response.data.authenticated;
  //     if (!auth){
  //       window.location.href = '#!/login';
  //     }else{
  //       $scope.username = response.data.username;
  //       if (DataShareService.currentUser === undefined){
  //         DataShareService.currentUser = response.data.username;
  //       }
  //     }
  //   });
  // }

  // DataShareService.ensureAuthenticated = $scope.ensureAuthenticated;

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
    $http.post('/api/admin_items', $scope.newItem).then(function(response){
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
      // $scope.maxRange = $scope.item.offer;
      // console.log('max: ' + $scope.maxRange);
      console.log($scope.item);
    });
  }

  $scope.addToCart = function(){
    console.log('clicked.');

    $http.get('/api/cart').then(function(response){
      var cartMap = {};
      var goods = response.data[0].orders;

      for (var i = 0; i < goods.length; ++i){
        cartMap[goods[i].item_id._id] = goods[i].demand;
      }

      console.log('here');
      console.log(cartMap);

      if (cartMap.hasOwnProperty($scope.item._id) === true){
        console.log('This item is already in your cart.');
      }else{
        var addItem =  {
          itemId: $scope.item._id,
          demand: $scope.demand
        };
        $http.post('/api/cart/add', addItem).then(function(response){
          console.log('added!');
          console.log(response);
          var buyNum = response.data.orders.length;
          console.log("Now " + buyNum + " item(s) in your cart.");
        });
      }
      
    });
  }

}]);

myApp.controller('cartController', ['$scope', '$http', '$routeParams', '$location', 'DataShareService', 'AuthService', function($scope, $http, $routeParams, $location, DataShareService, AuthService){

  console.log('cartController loaded.');

  $scope.cartInit = function(){
    let logged = AuthService.checkLogin();
    if (logged){
      console.log('logged');
      $scope.getBuyList();
      $scope.username = DataShareService.currentUser;
    }
  }

  $scope.getBuyList = function(){

    $http.get('/api/cart').then(function(response){
      console.log('here');
      $scope.buys = response.data[0].orders;
      $scope.calculateCart();
    });
  }

  //Need an extra window to edit item quantity and update total amount.

  $scope.calculateCart = function(){
    $scope.buyNum = $scope.buys.length;
    if ($scope.buyNum === 0){
        $scope.message = 'Your cart is empty.';
      }else{
        let count = 0;
        let goods = $scope.buys;
        // console.log(goods);
        for (let i = 0; i < goods.length; ++i){
          count += goods[i].item_id.price * goods[i].demand;
        }
        $scope.message = 'Total: $ ' + count;
      }
      // console.log($scope.buyNum);
  }

  $scope.removeFromCart = function(itemId, cartId){
    console.log("remove: " + itemId);
    let data = {itemId: itemId};
    $http.put('/api/cart/remove', data).then(function(response){
      console.log('removed.');
      console.log(response);
      console.log($scope.buys);
      for (let i = 0; i < $scope.buys.length; ++i){
        let obj = $scope.buys[i];
        // console.log(obj);
        // console.log(obj["_id"]);
        // console.log(cartId);
        // console.log(i);
        if (obj['_id'] === cartId){
          $scope.buys.splice(i, 1);
          $scope.calculateCart();
          break;
        }
      }

    });
  }

}]);