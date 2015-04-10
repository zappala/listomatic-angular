// Create the app as a module, with a list of additional modules it
// depends on.
var listomaticApp = angular.module('listomaticApp', [
  'ngRoute',
  'listomaticControllers',
  'listomaticServices',
]);

// Setup routing for the app. Each route contains a template and a
// controller.
listomaticApp.config(['$routeProvider',
  function($routeProvider) {
    $routeProvider.
      when('/', {
        templateUrl: 'partials/home.html',
        controller: 'ApplicationController'
      }).
      when('/register', {
        templateUrl: 'partials/register.html',
        controller: 'LoginController'
      }).
      when('/login', {
        templateUrl: 'partials/login.html',
        controller: 'LoginController'
      }).
      when('/logout', {
        templateUrl: 'partials/home.html',
        controller: 'LoginController'
      }).
      when('/list', {
        templateUrl: 'partials/list.html',
        controller: 'ListController'
      }).
      when('/list/:status', {
        templateUrl: 'partials/list.html',
        controller: 'ListController'
      }).
      otherwise({
        redirectTo: '/'
      });
  }]);
