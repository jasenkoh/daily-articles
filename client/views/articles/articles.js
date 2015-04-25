Template.articleList.helpers({
  articles: function () {
    var ids = _.chain(Meteor.user().articles).filter(function(article){ return !article.seen; }).pluck('_id').value();
    
    return Articles.find({_id: {$in: ids }}).fetch();
  },
  articlesReady: function() {
    return Articles.find().count() > 0;
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
    Meteor.call('bootstrapArticles',function(err, resp) {
      if (err) {
        alert('Error');
        console.log(err)
      } else{
        console.log(resp);
      };
    })
  }
});
