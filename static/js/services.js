var listomaticServices = angular.module('listomaticServices', []);


listomaticServices.factory('AuthService', function ($http, Session) {
  var authService = {};
 
  authService.login = function (credentials) {
    return $http
	  .post('/users/login', credentials)
	  .then(function (res) {
	      alert(res.data.token);
              Session.create(res.data.name, res.data.token);
	      return "Harry";
	  });
  };
 
  authService.isAuthenticated = function () {
    return !!Session.userId;
  };
 
  authService.isAuthorized = function (authorizedRoles) {
    if (!angular.isArray(authorizedRoles)) {
      authorizedRoles = [authorizedRoles];
    }
    return (authService.isAuthenticated() &&
      authorizedRoles.indexOf(Session.userRole) !== -1);
  };
 
  return authService;
})


listomaticServices.service('Session', function () {
  this.create = function (name, token) {
    this.name = name;
    this.token = token;
  };
  this.destroy = function () {
    this.name = null;
    this.token = null;
  };
  return this;
})
