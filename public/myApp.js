var myApp = angular.module('myApp', ['ngRoute']);

myApp.config(function($routeProvider){
  $routeProvider.when('/', {
    controller: 'UserController',
    templateUrl: 'views/login.html'
  })
  .otherwise({
    redirectTo: '/'
  });

});
