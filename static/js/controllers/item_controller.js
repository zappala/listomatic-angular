App.ItemController = Ember.ObjectController.extend({
    actions: {
	editItem: function() {
	    this.set('isEditing', true);
	},
	acceptChanges: function() {
	    this.set('isEditing', false);

	    if (Ember.isEmpty(this.get('model.title'))) {
		this.send('removeitem');
	    } else {
		this.get('model').save();
	    }
	},
	removeItem: function() {
	    var item = this.get('model');
	    item.deleteRecord();
	    item.save();
  }
    },

    isEditing: false,
    isCompleted: function(key, value){
	var model = this.get('model');

	if (value === undefined) {
	    // property being used as a getter
	    return model.get('isCompleted');
	} else {
	    // property being used as a setter
	    model.set('isCompleted', value);
	    model.save();
	    return value;
	}
    }.property('model.isCompleted')
});