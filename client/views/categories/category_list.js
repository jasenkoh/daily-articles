Template.categoryList.helpers({
  categories: function () {
    return Meteor.user().categories;
  }
});

Template.categoryList.events({
  'click .category-item': function (e) {
    Session.set('loading', true);

    this.active = !this.active;
    var categoryAttributes = {
      active: this.active,
      _id: this._id
    }
    
    Meteor.call('updateUserCategory', categoryAttributes, function (error, result) {
      if (error) {
        console.log(err);
        throw new Meteor.Error( 500, 'There was an error processing your request');
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

          Meteor.call('feedUserWithArticles', categoryAttributes.name, function(err, res) {
            if (err) {
              console.log(err);
              throw new Meteor.Error( 500, 'There was an error processing your request');
              Session.set('loading', false);
            } else {
             Session.set('loading', false);
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