Meteor.methods({
  bootstrapArticles: function(user) {
    var userCategories = user.categories;
    var categories = Categories.find({_id: {$in: userCategories }}).fetch();

    var date = new Date();
    date.setHours(0,0,0,0);

      var newArticles = [];
      
    _.each(categories, function(category) {
      var articles = Articles.find({ createdAt: { $gte: date }, 'category.name': category.name }).fetch();

      if (articles.length === 0) {
        fetchArticlesSync = Meteor.wrapAsync(fetchArticles);

        var resp = fetchArticlesSync(category);
        _.each(resp, function(id) { newArticles.push({_id: id, seen: false}); });
      } else {
        _.each(articles, function(article) { newArticles.push({_id: article._id, seen: false}); });
      }

      Meteor.users.update({_id: Meteor.user()._id}, {$set: { 'articles': newArticles }});
    });
  }
});


var fetchArticles = function(category) {
  var articleIds = [];
  var response = Meteor.http.call('GET', category.referral_url);
  
  var articles = _.chain(response.data.data.children)
    .filter(function(article) { return !article.data.is_self; })
    .sortBy(function(article) { return article.data.ups * -1; })
    .first(10)
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
