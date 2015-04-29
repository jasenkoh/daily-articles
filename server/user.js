Meteor.publish('userData', function(){
  return Meteor.users.find({_id: this.userId});
});

Accounts.onCreateUser(function(options, user) {
  if(!options.profile) {
    options.profile = {}
  } else {
    user.profile = options.profile;    
  }

  var categories = [];

  _.each(Categories.find({}).fetch(), function(category) { categories.push(category._id); });

  user.categories = categories.slice(0, 3);
  user.articles = [];

  return user;
});