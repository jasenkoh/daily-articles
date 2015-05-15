Meteor.publish('userArticles', function() {
  return UserArticles.find({ userId: this.userId, dismissed: false });
});

Meteor.publish('categories', function() {
  return Categories.find();
});