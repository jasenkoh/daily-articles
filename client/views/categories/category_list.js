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

    var subreddit = $('#category-name').val().replace(/ /g,'');
    if (subreddit !== "") {
      categoryAttributes = {
        name: subreddit,
        referral_url: 'http://www.reddit.com/r/' + subreddit + '.json?sort=hot&limit=50',
        userId: Meteor.userId(),
        active: true
      }

      Meteor.call('addCategory', categoryAttributes, function(error) {
        if (error) {
          Session.set('loading', false);
          if (error.error === 500) {
            alert('Something went wrong, please try again');
          } else {
            $('.input-group').addClass('has-error');
            $('#category-name').val('');
            alert(error.reason) 
          }

          console.log(error);
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