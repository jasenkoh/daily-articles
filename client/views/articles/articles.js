Template.articleList.helpers({
  articles: function () {
    var ids = _.chain(Meteor.user().articles)
    .filter(function(article){ return !article.seen; })
    .pluck('_id')
    .value();
    
    return Articles.find({_id: {$in: ids }}, {sort: { score: -1 }}).fetch();
  },
  categories: function() {
    return Categories.find({ active: true }).fetch();
  }
});

Template.articleList.events({
  'click .visit-article': function(e) {
    var url = this.url;
    Meteor.call('seeArticle',this._id, function(err, res){
      if (err) {
        alert('damn it :/');
      }
    });
  },
  'click .update-list': function(e) {
    getArticles();
  },
  'click .dismiss-all': function(e) {
    e.preventDefault();
    Meteor.call('seeAllArticles', this.name, function(err, res){
      if (err) {
        alert('damn it :/');
      }
    });
  }
});

Template.articleList.onRendered(function() {
  $('.panel-collapse').first().addClass('in');

  if (Meteor.userId() && Articles.find().count() === 0) {
    getArticles();
  }
});

var getArticles = function() {
  Session.set('loading', true);

  var start = new Date().getTime();
  Meteor.call('getFreshArticles', function (error, result) {
    if (error) {
      alert('error');
      console.log(error);
      Session.set('loading', false);
    } else {
      Meteor.call('feedUserWithArticles', function(error, result) {
        if (error) {
          alert('error feeding user with articles');
          console.log(error);
        } else {
          var end = new Date().getTime();
          var time = end - start;
          console.log('Get articles execution time: ' + (time / 1000) + ' seconds');
          Session.set('loading', false);
        }
      });
    }
  });  
};

Handlebars.registerHelper('countItems', function(category) {
  var count = _.where(Meteor.user().articles, { categoryName: category, seen: false }).length;
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