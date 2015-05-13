Template.articleList.helpers({
  articles: function () {
    var ids = _.chain(Meteor.user().articles)
    .filter(function(article){ return !article.dismissed; })
    .pluck('_id')
    .value();
    
    var articles = Articles.find({_id: {$in: ids }}, {sort: { score: -1 }}).fetch();

    var start = new Date().getTime();

    _.each(articles, function(article) {
      _.each(Meteor.user().articles, function(userArticle) {
        if (article._id === userArticle._id) {
          _.extend(article, {
            seen: userArticle.seen
          })
        };
      });
    });

    return articles;
  },
  categories: function() {
    return _.filter(Meteor.user().categories, function(category) { return category.active; });
  }
});

Template.articleList.events({
  'click .dismiss-article': function(e) {
    e.preventDefault();
    Meteor.call('dismissArticle',this._id, function(err, res) {
      if (err) {
        console.log(err);
        throw new Meteor.Error( 500, 'There was an error processing your request');
      }
    });
  },
  'click .visit-article': function(e) {
    Meteor.call('seeArticle',this._id, function(err, res) {
      if (err) {
        console.log(err);
        throw new Meteor.Error( 500, 'There was an error processing your request');
      }
    });
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
  var start = new Date().getTime();

  Meteor.call('feedUserWithArticles', function(error, result) {
    if (error) {
      console.log(err);
      throw new Meteor.Error( 500, 'There was an error processing your request');
    } else {
      var end = new Date().getTime();
      var time = end - start;
      console.log('Get articles execution time: ' + (time / 1000) + ' seconds');
      Session.set('loading', false);
    }
  });
};

Handlebars.registerHelper('countItems', function(category) {
  var count = _.where(Meteor.user().articles, { categoryName: category, dismissed: false }).length;
  var message;
  if (count === 0) {
    message = 'Nothing to read, please update list';
  } else if(count === 1) {
    message = count + ' item to read!';
  } else {
    message = count + ' items to read!';
  };

  return message;
});