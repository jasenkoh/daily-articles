Meteor.methods({
  updateUserArticles: function() {
    var userArticles = getArticlesByUserCategories();
    Meteor.users.update({_id: this.userId}, { $set: { 'articles': userArticles }});

    return userArticles;
  },
  getFreshArticles: function() {
    var result, categories;
    articles = [];
    categories = Categories.find({_id: { $in: Meteor.user().categories }}).fetch();

    fetchArticlesSync = Meteor.wrapAsync(readArticlesFromReddit);
    
    _.each(categories, function(category) {
      result = fetchArticlesSync(category);

      saveFreshArticles(result, category);
    });

    return true;
  },
  seeArticle: function(articleId) {
    Meteor.users.update({_id: this.userId, "articles._id": articleId}, {$set: {'articles.$.seen': true}});
  }
});

var readArticlesFromReddit = function(category, cb) {
  var articleIds, response, articles;
  articleIds = [];
  response = HTTP.get(category.referral_url);
  
  articles = _.chain(response.data.data.children)
    .filter(function(article) { return !article.data.is_self; })
    .sortBy(function(article) { return article.data.ups * -1; })
    .value();

  cb && cb(null, articles);
}

var saveFreshArticles = function(articles, category) {
  _.each(articles, function(article) {
  var existingArticle = Articles.findOne({referral_id: article.data.id});

  if (!existingArticle) {
    url = article.data.url.split(' ')
      Articles.insert({
        title: article.data.title,
        source: 'Reddit',
        url: url[0],
        score: article.data.ups,
        createdAt: new Date().getTime(),
        category: category,
        referral_id: article.data.id
      }, function(error, result) {
        if (error) {
          throw new Meteor.Error(500, 'There was an error processing request: ' + error);
        } else {
          Meteor.users.update({ _id: Meteor.userId() }, {$push: {'articles': {'_id': result, 'seen': false}}});
        };
      });
    } else {
      Articles.update({_id: existingArticle._id}, {$set: {score: article.data.ups}});
    }
  });
}

var getArticlesByUserCategories = function() {
  var categories = Categories.find({_id: { $in: Meteor.user().categories }}).fetch();
  var availableArticles = [];
  var date = new Date();
  date.setHours(0,0,0,0);

  _.each(categories, function(category) {
    var articles = Articles.find({ createdAt: { $gte: date }, 'category.name': category.name }).fetch();

    _.each(articles, function(article) { availableArticles.push({_id: article._id, seen: false}); });
  });

  return availableArticles;
}
