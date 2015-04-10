/*global angular */

/**
 * Directive that places focus on the element it is applied to when the
 * expression it binds to evaluates to true
 */

angular.module('listomaticApp',[])
.directive('itemFocus', function itemFocus($timeout) {
    'use strict';
    return function (scope, elem, attrs) {
	scope.$watch(attrs.itemFocus, function (newVal) {
	    if (newVal) {
		$timeout(function () {
		    elem[0].focus();
		}, 0, false);
	    }
	});
    };
});

angular.module('listomaticApp',[])
.directive('itemEscape', function () {
    'use strict';
    var ESCAPE_KEY = 27;
    return function (scope, elem, attrs) {
	elem.bind('keydown', function (event) {
	    if (event.keyCode === ESCAPE_KEY) {
		scope.$apply(attrs.itemEscape);
	    }
	});
    };
});
