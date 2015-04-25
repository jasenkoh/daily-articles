Meteor.methods({
  updateCategory: function (categoryAttributes) {
  	operator = categoryAttributes.active ? '$addToSet' : '$pull';
  	categoryOperation = {};
  	
  	categoryOperation[operator] = {
  		categories: categoryAttributes.id
  	};

  	Meteor.users.update({_id: Meteor.user()._id}, categoryOperation);
  }
});