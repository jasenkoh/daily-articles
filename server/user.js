Accounts.onCreateUser(function(options, user) {
	if(!options.profile) {
       options.profile = {}
    }

	if (options.profile)
    	user.profile = options.profile;

    var categories = Categories.find({}).fetch();

    user.profile.categories = getCategories(categories);
    user.profile.articles = getArticles(categories);

  	return user;
});

Meteor.methods({
	updateCategory: function (categoryAttributes) {
		if (!categoryAttributes.active) {
			Meteor.users.update({ _id: Meteor.user()._id }, 
				{ $pull: {"profile.categories" : categoryAttributes.id}});
		} else {
			Meteor.users.update({ _id: Meteor.user()._id }, 
				{ $push: {"profile.categories" : categoryAttributes.id}});
		};
	}
});

var getCategories = function(data) {
    var categories = [];

    _.each(data.find({}).fetch(),function(category) {
	    categories.push(category._id);
	});

	return categories;
};

var getArticles = function(data) {
	var articles = [];
	_.each(data, function(category) {
		// Meteor.call('fetchArticles', category, function(error, result) {

		// });
	})

	return articles;
};