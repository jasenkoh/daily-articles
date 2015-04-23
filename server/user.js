Accounts.onCreateUser(function(options, user) {
  if(!options.profile) {
      options.profile = {}
    }

  if (options.profile)
      user.profile = options.profile;

    var categories = Categories.find({}).fetch();

    user.profile.categories = getCategories(categories);
    bootstrapArticles(categories, user._id);

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

    _.each(data,function(category) {
      categories.push(category._id);
  });

  return categories;
};

var bootstrapArticles = function(data, userId) {
  check(userId, String);
  
  _.each(data, function(category) {
    Meteor.call('fetchArticles', category, function(error, result) {
      _.each(result, function(article) {
        Articles.insert({
          title: article.data.title,
          source: 'Reddit',
          url: article.data.url,
          score: article.data.ups,
          createdAt: new Date().getTime(),
          category: category,
          referral_id: article.data.id,
          userId: userId
        });
      });
    });
  });
};