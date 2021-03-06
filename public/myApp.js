var myApp = angular.module('myApp', ['ngRoute']);

myApp.config(function($routeProvider){
  $routeProvider
  .when('/register', {
    controller: 'UserController',
    templateUrl: 'views/register.html'
  })
  .when('/login', {
    controller: 'UserController',
    templateUrl: 'views/login.html'
  })
  .when('/', {
    controller: 'homepageController',
    templateUrl: 'views/commodity.html'
  })
  .when('/items', {
    controller: 'homepageController',
    templateUrl: 'views/commodity.html'
  })
  .when('/items/add', {
    controller: 'homepageController',
    templateUrl: 'views/add_item.html'
  })
  .when('/items/edit/:id', {
    controller: 'homepageController',
    templateUrl: 'views/edit_item.html'
  })
  .when('/details/:id', {
    controller: 'detailController',
    templateUrl: 'views/item_detail.html'
  })
  .when('/cart', {
    controller: 'cartController',
    templateUrl: 'views/cart.html'
  })
  .otherwise({
    redirectTo: '/'
  });
});
