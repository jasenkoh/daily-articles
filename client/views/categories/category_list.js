Template.categoryList.helpers({
	categories: function () {
		return Meteor.user().profile.categories;
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
				console.log(error);
			}
		});
	}
});