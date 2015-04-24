Meteor.publish('articles', function() {
  var date = new Date();
  date.setHours(0,0,0,0);
  
  return Articles.find({ createdAt: {$gte: date}});
});

Meteor.publish('categories', function() {
  return Categories.find();
});