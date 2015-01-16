App.IndexController = Ember.Controller.extend({
    reset: function() {
	this.setProperties({
	    loggedIn: true,
	});
    }
});

