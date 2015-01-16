App.ListController = Ember.ArrayController.extend({
  actions: {
      createItem: function() {
	  // Get the todo title set by the text field
	  var title = this.get('newTitle');
	  if (!title.trim()) { return; }

	  // Create the new Todo model
	  var item = this.store.createRecord('item', {
              title: title,
              isCompleted: false
	  });

	  // Clear the text field
	  this.set('newTitle', '');

	  // Save the new model
	  item.save();
      },
      clearCompleted: function() {
	  var completed = this.filterBy('completed', true);
	  completed.invoke('deleteRecord');
	  completed.invoke('save');
      },
  },
    remaining: function() {
	return this.filterBy('completed', false).get('length');
    }.property('@each.completed'),

    inflection: function() {
	var remaining = this.get('remaining');
	return remaining === 1 ? 'item' : 'items';
    }.property('remaining'),

    hasCompleted: function() {
	return this.get('completed') > 0;
    }.property('completed'),

    completed: function() {
	return this.filterBy('completed', true).get('length');
    }.property('@each.completed'),
});
