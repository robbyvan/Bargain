var myApp = angular.module('myApp', ['ngRoute']);

myApp.config(function($routeProvider){
  $routeProvider.when('/', {
    controller: 'UserController',
    templateUrl: 'views/register.html'
  })
  .otherwise({
    redirectTo: '/'
  });

});
