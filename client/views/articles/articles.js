Template.articleList.helpers({
  articles: function () {
    var ids = _.chain(Meteor.user().articles).filter(function(article){ return !article.seen; }).pluck('_id').value();
    
    return Articles.find({_id: {$in: ids }}, {sort: { createdAt: -1 }}).fetch();
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
      } else {
        Session.set('loading', false);
      };
    })
  }
});
