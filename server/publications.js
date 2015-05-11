  Meteor.publish('articles', function() {
  return Articles.find();
});

Meteor.publish('categories', function() {
  return Categories.find({userId: this.userId});
});