var listomaticServices = angular.module('listomaticServices', []);


listomaticServices.factory('AuthService', function ($http, Session, $rootScope) {
  var user = {}
  var authService = {};

  authService.login = function (credentials) {
    return $http
    .post('/api/users/login', credentials)
    .then(function (res) {
      Session.create(res.data.name, res.data.token);
      return res.data.name;
    });
  };

  authService.register = function (credentials) {
    return $http
    .post('/api/users/register', credentials)
    .then(function(res) {
      Session.create(res.data.name, res.data.token);
      return res.data.name;
    });
  };

  authService.logout = function () {
    return $http
    .post('/api/users/logout', {headers: {'Authorization':Session.token}})
    .then(function (res) {
      Session.destroy();
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
});


listomaticServices.service('Session', function () {
  this.loggedIn = function() {
    return !!localStorage.token;
  };

  this.getToken = function() {
    return localStorage.token;
  };

  this.getName = function() {
    return localStorage.name;
  };

  this.create = function (name, token) {
    localStorage.token = token;
    localStorage.name = name;
  };

  this.destroy = function () {
    delete localStorage.token;
    delete localStorage.name;
  };

  return this;
});

listomaticServices.factory('ListService', function ($http, $location, Session) {
  var listService = {};

  listService.get = function () {
    return $http
    .get('/api/items', {headers: {'Authorization':Session.getToken()}})
    .success(function (data,status,headers,config) {
      return data;
    });
  };

  listService.add = function (item) {
    return $http
    .post('/api/items', {item:item}, {headers: {'Authorization':Session.getToken()}})
    .then(function (res) {
      return res.data.item;
    });

  };

  listService.update = function(item) {
    return $http
    .put('/api/items/' + item.id, {item:item}, {headers: {'Authorization':Session.getToken()}})
    .then(function(res) {
     return res.data.item;
   });
  };

  listService.delete = function(item) {
    return $http
    .delete('/api/items/' + item.id, {headers: {'Authorization':Session.getToken()}})
    .then(function(res) {
     return 0;
   });
  };

  return listService;
});
