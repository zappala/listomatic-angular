App.ApplicationController = Ember.Controller.extend({
    loggedIn: false,

    setup: function() {
	if (localStorage['token']) {
	    $.ajaxPrefilter(function( options, oriOptions, jqXHR ) {
 		jqXHR.setRequestHeader("Authorization", localStorage['token']);
 	    });
	    this.set('loggedIn',true);
	    this.transitionToRoute('/list/');
	}
	    
    },
    reset: function() {
	this.set('loggedIn',false);
    }
});

