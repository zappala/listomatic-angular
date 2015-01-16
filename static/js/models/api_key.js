// Ember.Object instead of DS.Model because this will never persist to or query the server
App.ApiKey = Ember.Object.extend({
  access_token: '',
  user: null
});
