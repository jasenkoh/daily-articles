Meteor.methods({
  updateCategory: function (categoryAttributes) {
    operator = categoryAttributes.active ? '$addToSet' : '$pull';
    categoryOperation = {};
    
    categoryOperation[operator] = {
      categories: categoryAttributes.id
    };

    Meteor.users.update({_id: Meteor.user()._id}, categoryOperation);
  },
  addCategory: function(categoryAttributes) {
    Categories.insert(categoryAttributes, function(err, res) {
      categoryAttributes.id = res;
      categoryAttributes.active = true;

      Meteor.call('updateCategory', categoryAttributes, function(err, res) {
        if (err) {
          alert('Error updating user category');
          console.log(err);
        } else{
          return res;
        };
      })
    });
  }
});