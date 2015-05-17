Meteor.methods({
  updateUserCategory: function (categoryAttributes) {
    categoryOperation = {};
    
    categoryOperation['$set'] = {
      'categories.$.active': categoryAttributes.active
    }
    
    Meteor.users.update({ _id: this.userId, 'categories._id': categoryAttributes._id }, categoryOperation);
  },
  addCategory: function(categoryAttributes) {
    var category, id, articles;

    category = Categories.findOne({name: categoryAttributes.name});

    if (!category) {
      if (validateSubreddit(categoryAttributes).length === 0) {
        throw new Meteor.Error(400, 'Subreddit not found');
      }
    }

    id = category !== undefined ? category._id : Categories.insert(categoryAttributes)

    _.extend(categoryAttributes, {
      _id: id
    });

    if (_.where(Meteor.user().categories,{ name: categoryAttributes.name }).length === 0) {
      Meteor.call('addUserCategory', categoryAttributes, function(err,res) {
        if (err) {
          console.log('Error adding user category: ' + err);
          throw new Meteor.Error( 500, 'Error adding user category');
        } else {
          return res;
        }
      });
    }
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

var validateSubreddit = function(category) {
  var result;
  validateSubredditSync = Meteor.wrapAsync(readArticlesFromReddit);
  result = validateSubredditSync(category);

  return result;
}