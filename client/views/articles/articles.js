Template.articleList.helpers({
  articles: function () {
    var ids = _.chain(Meteor.user().articles)
    .filter(function(article){ return !article.seen; })
    .pluck('_id')
    .value();
    
    return Articles.find({_id: {$in: ids }}, {sort: { score: -1 }}).fetch();
  },
  categories: function() {
    return Categories.find({_id: {$in: Meteor.user().categories }}).fetch();
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
          Session.set('loading', false);
        }
      });
    }
  });  
}