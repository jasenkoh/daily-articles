Meteor.methods({
  updateUserArticles: function() {
    Meteor.users.update({_id: this.userId}, { $set: { 'articles': getArticlesByUserCategories() }});
  }
});


var readArticlesFromReddit = function(category) {
  var articleIds = [];
  var response = HTTP.get(category.referral_url);
  
  var articles = _.chain(response.data.data.children)
    .filter(function(article) { return !article.data.is_self; })
    .sortBy(function(article) { return article.data.ups * -1; })
    .value();

  _.each(articles, function(article) {
  var existingArticle = Articles.find({referral_id: article.data.id}).fetch();

  if (existingArticle._id === undefined) {
      var articleId = Articles.insert({
        title: article.data.title,
        source: 'Reddit',
        url: article.data.url,
        score: article.data.ups,
        createdAt: new Date().getTime(),
        category: category,
        referral_id: article.data.id
      }, function(error, result) {
        if (error) {
          throw new Meteor.Error(500, 'There was an error processing request');
        };
      });

      articleIds.push(articleId);
    }
  });

  return articleIds;
}

var getArticlesByUserCategories = function() {
  var categories = Categories.find({_id: { $in: Meteor.user().categories }}).fetch();
  var availableArticles = [];
  var date = new Date();
  date.setHours(0,0,0,0);

  _.each(categories, function(category) {
    var articles = Articles.find({ createdAt: { $gte: date }, 'category.name': category.name }).fetch();

    if (articles.length === 0) {
      fetchArticlesSync = Meteor.wrapAsync(readArticlesFromReddit);

      var resp = fetchArticlesSync(category);
      _.each(resp, function(id) { availableArticles.push({_id: id, seen: false}); });
    } else {
      _.each(articles, function(article) { availableArticles.push({_id: article._id, seen: false}); });
    }
  });

  return availableArticles;
}
