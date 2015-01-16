App.RegisterController = Ember.Controller.extend(Ember.ControllerMixin, {
    needs: 'application',

    reset: function() {
	this.setProperties({
	    username: "",
	    password: "",
	    registerFailed: ""
	});
    },
    
    register: function() {
	var router = this.get('target');
	var data = this.getProperties('username', 'password')
	var user = this.get('model');
	var self = this;
	self.set('registerFailed',false);
	$.post('http://localhost:5000/users/register', data, function(response) {
	    self.get('controllers.application').set('loggedIn',true);
	    //App.set('token', response.token);
	    Ember.$.ajaxPrefilter(function( options, oriOptions, jqXHR ) {
 		jqXHR.setRequestHeader("Authorization", response.token);
 	    });
	    self.transitionTo('list');
	}).fail(function() {
	    self.set('registerFailed',true);
	});
    }
});
