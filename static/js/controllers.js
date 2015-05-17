// Create a module for the controllers.
var listomaticControllers = angular.module('listomaticControllers', []);

// The application controller contains the state for the current user that
// is logged in.
listomaticControllers.controller('ApplicationController', function ($scope, $rootScope, Session) {
	$rootScope.loggedIn = false;
	$rootScope.currentUser = null;
	if (Session.loggedIn()) {
		$rootScope.loggedIn = true;
		$rootScope.currentUser = Session.getName();
	}
	console.log("loggedin",$rootScope.loggedIn);

    // logout
    $scope.logout = function () {
    	console.log('calling logout');
    	AuthService.logout().then(function (name) {
	        // update current user state
	        $scope.destroy();
	        // redirect to the home page of the app
	        $location.path("/");
	    }, function () {
	    });
    };

});


// The login controller handles registering, login, and logout of the
// application. This controller uses the AuthService to do each of these
// functions, then adjusts state and redirects to the new URL.
listomaticControllers.controller('LoginController', function ($scope, $location, $rootScope, Session, AuthService) {
    // setup credentials for the login form
    $scope.credentials = {
    	username: '',
    	password: ''
    };

    $scope.save = function(name) {
    	$rootScope.currentUser = name;
    	$rootScope.loggedIn = true;
    };
    $scope.destroy = function() {
    	$rootScope.currentUser = null;
    	$rootScope.loggedIn = false;
    };
    // register
    $scope.register = function (credentials) {
    	if (Session.loggedIn()) {
    		console.log("logged in already");
    		$location.path("/list");
    		return;
    	}
    	AuthService.register(credentials).then(function (name) {
	        // update current user state
	        $scope.save(name);
	        // redirect to the main page of the app
	        $location.path("/list");
	    }, function () {
	    	$scope.destroy();
	    });
    };
    // login
    $scope.login = function (credentials) {
    	if (Session.loggedIn()) {
    		console.log("logged in already");
    		$location.path("/list");
    		return;
    	}
    	AuthService.login(credentials).then(function (name) {
	        // update current user state
	        $scope.save(name);
	        // redirect to the main page of the app
	        $location.path("/list");
	    }, function () {
	    	$scope.destroy();
	    });
    };
    // logout
    $scope.logout = function () {
    	console.log('calling logout');
    	AuthService.logout().then(function (name) {
	        // update current user state
	        $scope.destroy();
	        // redirect to the home page of the app
	        $location.path("/");
	    }, function () {
	    });
    };
});


// The list controller handles manipulation of the todo list.  This
// controller uses the ListService to add, remove, and edit items in
// the list.
listomaticControllers.controller('ListController', function ($scope, $location, $routeParams, $filter, ListService) {
    // local model for the list
    $scope.list = [];
    var list = $scope.list;
    // initialize list by asking the server for the list and then copying
    // to our state
    ListService.get().then(function(res) {
    	angular.copy(res.data.items,$scope.list);
    });
    // data for a new item
    $scope.newItem = '';

    // detect when the list changes and update the scope for the number
    // of items remaining and the number completed
    $scope.$watch('list', function () {
    	$scope.remaining = $filter('filter')(list, { completed: false }).length;
    	$scope.completed = list.length - $scope.remaining;
    }, true);

    // monitor the current route for changes and adjust the filter accordingly
    $scope.$on('$routeChangeSuccess', function () {
    	var status = $scope.status = $routeParams.status || '';
    	$scope.statusFilter = (status === 'active') ?
    	{ completed: false } : (status === 'completed') ?
    	{ completed: true } : null;
    });

    // add an item to the list
    $scope.addItem = function () {
    	var item = {
    		title: $scope.newItem.trim(),
    	};

    	if (!item.title) {
    		return;
    	}
	    // this variable disables adding another item until we are
	    // done adding this one
	    $scope.saving = true;

	    // call the REST API to add the item, and when done add the item 
	    // to the local model
	    ListService.add(item).then(function (item) {
	    	$scope.list.push(item);
	    	$scope.newItem = '';
	    	$scope.saving = false;
	    }, function() {
	    	Scope.destroy();
	    	$location.path("/");
	    });
	};

    // begin to edit an item in the list, called when double clicked
    $scope.editItem = function (item) {
    	$scope.editedItem = item;
	    // clone the original item to restore it on demand.
	    $scope.originalItem = angular.extend({}, item);
	};

    // save the edits to an item
    $scope.saveEdits = function (item, event) {
    	if ($scope.reverted) {
	        // Item edits were reverted-- don't save.
	        $scope.reverted = null;
	        return;
	    }

	    item.title = item.title.trim();

	    if (item.title === $scope.originalItem.title) {
	    	$scope.editedItem = null;
	    	return;
	    }

	    if (item.title != "") {
	        // update title
	        ListService.update(item).then(function success() {
	        	$scope.editedItem = null;
	        }, function error() {
	        	item.title = $scope.originalItem.title
	        	$scope.editedItem = null;
	        	Scope.destroy();
	        	$location.path("/");
	        });
	    } else {
	        // delete item
	        ListService.delete(item).then(function success() {
	        	$scope.list.splice($scope.list.indexOf(item), 1);
	        	$scope.editedItem = null;
	        }, function error() {
	        	$scope.editedItem = null;
	        	Scope.destroy();
	        	$location.path("/");
	        });
	    }
	};

	$scope.revertEdits = function (item) {
		list[list.indexOf(list)] = $scope.originalItem;
		$scope.editedItem = null;
		$scope.originalItem = null;
		$scope.reverted = true;
	};

	$scope.removeItem = function (item) {
		ListService.delete(item).then(function success() {
			$scope.list.splice($scope.list.indexOf(item), 1);
		}, function error() {
			Scope.destroy();
			$location.path("/");
		});
	};

	$scope.toggleCompleted = function (item, completed) {
		if (angular.isDefined(completed)) {
			item.completed = completed;
		}
		ListService.update(item).then(function success() {
		}, function error() {
			item.completed = !item.completed;
			Scope.destroy();
			$location.path("/");
		});
	};

	$scope.clearCompletedItems = function () {
		// get list of completed items
		var completed = $filter('filter')($scope.list, { completed: true });
		// loop through list of completed items and delete each one
		completed.forEach(function(item) {
			ListService.delete(item).then(function success() {
				$scope.list.splice($scope.list.indexOf(item), 1);
			}, function error() {
				Scope.destroy();
				$location.path("/");
			});
		});
	};

	$scope.markAll = function (completed) {
		items.forEach(function (item) {
			if (item.completed !== completed) {
				$scope.toggleCompleted(item, completed);
			}
		});
	};
});
