Template.categoryList.helpers({
  categories: function () {
    return Categories.find({}).fetch();
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
        referral_url: 'http://www.reddit.com/r/' + subreddit.slice(2) + '.json?sort=hot&limit=50',
        userId: Meteor.userId(),
        active: true
      }

      Meteor.call('addCategory', categoryAttributes, function(err, res) {
        if (err) {
          alert('error adding category');
          console.log(err);
          Session.set('loading', false);
        } else {
          $('#category-name').val('');
          $('.input-group').removeClass('has-error');

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
    } else {
      $('.input-group').addClass('has-error');
      Session.set('loading', false);
    }
  }
});