App.LoginController = Ember.Controller.extend({
    needs: 'application',

    registerFailed: false,
    loginFailed: false,
    isProcessing: false,

    reset: function() {
	this.setProperties({
	    username: "",
	    password: "",
	    registerFailed: ""
	});
    },
    logout: function() {
	this.reset();
	this.transitionToRoute("/");
    },
    actions: {
	register: function() {
	    var router = this.get('target');
	    var form = this.getProperties('registerName','registerUsername', 'registerPassword');
	    data = {'name':form['registerName'],'username':form['registerUsername'],
		'password':form['registerPassword']};
	    var self = this;
	    self.set('registerFailed',false);
	    $.post('/users/register', data, function(response) {
		self.get('controllers.application').set('loggedIn',true);
		localStorage['token'] = response.token;
		$.ajaxPrefilter(function( options, oriOptions, jqXHR ) {
	     	    jqXHR.setRequestHeader("Authorization", response.token);
 		});
		self.transitionToRoute('/list/');
	    }).fail(function() {
		self.set('registerFailed',true);
	    });
	},

	login: function() {
	    var router = this.get('target');
	    var data = this.getProperties('username', 'password');
	    var self = this;
	    self.set('loginFailed',false);
	    $.post('/users/login', data, function(response) {
		self.get('controllers.application').set('loggedIn',true);
		$.ajaxPrefilter(function( options, oriOptions, jqXHR ) {
 		    jqXHR.setRequestHeader("Authorization", response.token);
 		});
		localStorage['token'] = response.token;
		self.transitionToRoute('/list/');
	    }).fail(function() {
		self.set('loginFailed',true);
	    });
	}
    }
});
