Template.articleList.helpers({
  articles: function () {
    var ids = _.chain(Meteor.user().articles).filter(function(article){ return !article.seen; }).pluck('_id').value();
    
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
    Session.set('loading', true);
    Meteor.call('getFreshArticles',function(err, resp) {
      if (err) {
        alert('Error');
        console.log(err)
        Session.set('loading', false);
      } else {
        Session.set('loading', false);
      };
    });
  }
});

Template.articleList.onRendered(function() {
  $('.panel-collapse').first().addClass('in');
});
