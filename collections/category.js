Meteor.methods({
  updateUserCategory: function (categoryAttributes) {
    categoryOperation = {};
    
    categoryOperation['$set'] = {
      'categories.$.active': categoryAttributes.active
    }
    
    Meteor.users.update({ _id: this.userId, 'categories._id': categoryAttributes._id }, categoryOperation);
  },
  addCategory: function(categoryAttributes) {
    var category, id;

    category = Categories.findOne({name: categoryAttributes.name});

    id = category !== undefined ? category._id : Categories.insert(categoryAttributes)

    _.extend(categoryAttributes, {
      _id: id
    });

    Meteor.call('addUserCategory', categoryAttributes, function(err,res) {
      if (err) {
        console.log('Error adding user category: ' + err);
        throw new Meteor.Error( 500, 'Error adding user category');
      } else {
        return res;
      }
    })
  },
  addUserCategory: function(category) {
    categoryOperation = {};

    categoryOperation['$push'] = {
      categories: {
        name: category.name,
        _id: category._id,
        active: true
      }
    }

    return Meteor.users.update({ _id: this.userId }, categoryOperation);
  }
});