Meteor.methods({
	updateCategory: function (categoryAttributes) {
		Meteor.users.update(
			{ _id: Meteor.user()._id, "profile.categories._id": categoryAttributes.id }, 
			{ $set: {"profile.categories.$.active" : categoryAttributes.active}});
	}
});