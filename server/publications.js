Meteor.publish('articles', function() {
  return Articles.find({ userId: this.userId });
});

Meteor.publish('categories', function() {
  return Categories.find();
});