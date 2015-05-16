Template.articleList.helpers({
  articles: function () {
    return UserArticles.find().fetch();
  },
  categories: function() {
    return _.filter(Meteor.user().categories, function(category) { return category.active; });
  }
});

Template.articleList.events({
  'click .dismiss-article': function(e) {
    e.preventDefault();
    UserArticles.update({ _id: this._id }, {$set: { dismissed: true}});
  },
  'click .visit-article': function(e) {
    UserArticles.update({ _id: this._id }, {$set: { seen: true}});
  },
  'click .update-list': function(e) {
    e.preventDefault();
    getArticles();
  },
  'click .dismiss-all': function(e) {
    e.preventDefault();
    Meteor.call('dismissAllArticles', this.name, function(err, res) {
      if (err) {
        console.log(err);
        throw new Meteor.Error( 500, 'There was an error processing your request');
      }
    });
  }
});

Template.articleList.onRendered(function() {
  $('.panel-collapse').first().addClass('in');
});

var getArticles = function() {
  Session.set('loading', true);
  
  Meteor.call('feedUserWithArticles', function(error, result) {
    if (error) {
      console.log(err);
      throw new Meteor.Error( 500, 'There was an error processing your request');
    } else {
      Session.set('loading', false);
    }
  });
};

Handlebars.registerHelper('countItems', function(category) {
  var count = UserArticles.find({ 'article.category.name': category }).fetch().length;
  
  var message;
  if (count === 0) {
    message = 'Nothing to read, please update list or come back later.';
  } else if(count === 1) {
    message = count + ' item to read!';
  } else {
    message = count + ' items to read!';
  };

  return message;
});