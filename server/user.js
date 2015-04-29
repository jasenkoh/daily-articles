Meteor.publish('userData', function(){
  return Meteor.users.find({_id: this.userId});
});

Accounts.onCreateUser(function(options, user) {
  if(!options.profile) {
    options.profile = {}
  } else {
    user.profile = options.profile;    
  }
  
  user.articles = [];

  return user;
});