Meteor.publish('articles', function() {
  var articleIds = _.pluck(UserArticles.find({ userId: this.userId, dismissed: false }).fetch(), 'articleId');
  return Articles.find({_id: { $in: articleIds}})
});

Meteor.publish('userArticles', function() {
  return UserArticles.find({ userId: this.userId, dismissed: false });
});

Meteor.publish('categories', function() {
  return Categories.find();
});
