Meteor.methods({
  updateCategory: function (categoryAttributes) {
    if (!categoryAttributes.active) {
      Meteor.users.update({ _id: Meteor.user()._id }, 
        { $pull: {"categories": categoryAttributes.id}});
    } else {
      Meteor.users.update({ _id: Meteor.user()._id }, 
        { $push: {"categories": categoryAttributes.id}});
    }
  }
});