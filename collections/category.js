Meteor.methods({
  updateUserCategory: function (categoryAttributes) {
    categoryOperation = {};
    
    categoryOperation['$set'] = {
      active: categoryAttributes.active
    }

    Categories.update({ _id: categoryAttributes.id }, categoryOperation);
  },
  addCategory: function(categoryAttributes) {
    return Categories.insert(categoryAttributes);
  }
});