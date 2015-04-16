Template.categoryList.helpers({
	categories: function () {
		var categories = Categories.find({}).fetch();
		var userCategories = Meteor.user().profile.categories;

		_.each(categories, function(category) {
			_.each(userCategories, function(userCategory) {
				if (category._id === userCategory) {
				    _.extend(category, {
				        active: true	
				    });
				};
			});
		});

		return categories;
	}
});

Template.categoryList.events({
	'click .category-item': function (e) {
		this.active = !this.active;
		var categoryAttributes = {
			active: this.active,
			id: this._id
		}
		Meteor.call('updateCategory', categoryAttributes, function (error, result) {
			if (error) {
				alert('error');
				console.log(error);
			}
		});
	}
});