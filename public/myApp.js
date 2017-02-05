var myApp = angular.module('myApp', ['ngRoute']);

myApp.config(function($routeProvider){
  $routeProvider
  .when('/', {
    controller: 'UserController',
    templateUrl: 'views/commodity.html'
  })
  .when('/register', {
    controller: 'UserController',
    templateUrl: 'views/register.html'
  })
  .when('/login', {
    controller: 'UserController',
    templateUrl: 'views/login.html'
  })
  .otherwise({
    redirectTo: '/'
  });

});
