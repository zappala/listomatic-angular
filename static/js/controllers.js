var listomaticControllers = angular.module('listomaticControllers', []);

listomaticControllers.controller('ApplicationController', function ($scope,
								    AuthService) {
  $scope.currentUser = null;
  $scope.isAuthorized = AuthService.isAuthorized;
 
  $scope.setCurrentUser = function (name) {
    $scope.currentUser = name;
  };
})

listomaticControllers.controller('LoginController', function ($scope, $rootScope, AUTH_EVENTS, AuthService) {
  $scope.credentials = {
    username: '',
    password: ''
  };
  $scope.login = function (credentials) {
    AuthService.login(credentials).then(function (name) {
	alert(name);
      $rootScope.$broadcast(AUTH_EVENTS.loginSuccess);
      $scope.setCurrentUser(name);
    }, function () {
      $rootScope.$broadcast(AUTH_EVENTS.loginFailed);
    });
  };
});
