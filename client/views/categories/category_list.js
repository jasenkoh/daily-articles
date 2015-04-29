Template.categoryList.helpers({
  categories: function () {
    var categories = Categories.find({}).fetch();
    var userCategories = Meteor.user().categories;

    _.each(categories, function(category) {
      _.each(userCategories, function(userCategory) {
        if (category._id === userCategory) {
          _.extend(category, {
              active: true  
          });
        };
      });
    });

    return categories;
  }
});

Template.categoryList.events({
  'click .category-item': function (e) {
    Session.set('loading', true);

    this.active = !this.active;
    var categoryAttributes = {
      active: this.active,
      id: this._id
    }
    
    Meteor.call('updateUserCategory', categoryAttributes, function (error, result) {
      if (error) {
        alert('error');
        console.log(error);
        Session.set('loading', false);
      } else {
        Session.set('loading', false);
      }
    });
  },
  'click .add-category': function(e) {
    Session.set('loading', true);
    var subreddit = $('#category-name').val();
    if (subreddit.slice(0, 2) === 'r/') {
      categoryAttributes = {
        name: subreddit.slice(2),
        referral_url: 'http://www.reddit.com/r/' + subreddit.slice(2) + '.json?sort=hot&limit=50'
      }

      Meteor.call('addCategory', categoryAttributes, function(err, res) {
        if (err) {
          alert('error adding category');
          console.log(err);
          Session.set('loading', false);
        } else {
          $('#category-name').val('');
          $('.input-group').removeClass('has-error');

          category = {
            id: res,
            active: true
          };

          Meteor.call('updateUserCategory', category, function(err, res) {
            if (err) {
              alert('Error updating user category');
              console.log(err);
            } else {
              Meteor.call('getFreshArticles', Categories.findOne({ _id: categoryAttributes.id }), 
                function(err, res) {
                if (err) {
                  alert('Error getting fresh articles');
                  console.log(err);
                } else {
                  Meteor.call('feedUserWithArticles', categoryAttributes.name, function(err, res) {
                    if (err) {
                      alert('Error');
                      console.log(err)
                      Session.set('loading', false);
                    } else {
                      Session.set('loading', false);
                    }
                  });                  
                }
              });
            }
          });
        }
      });
    } else {
      $('.input-group').addClass('has-error');
      Session.set('loading', false);
    }
  }
});