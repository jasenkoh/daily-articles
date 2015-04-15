Accounts.onCreateUser(function(options, user) {
	if(!options.profile) {
       options.profile = {}
    }

	if (options.profile)
    	user.profile = options.profile;

    var categories = Categories.find({}).fetch();

    _.each(categories,function(data) {
	    _.extend(data, {
	        active: false
	    });
	});

    user.profile.categories = categories;

  	return user;
});