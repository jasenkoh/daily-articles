readArticlesFromReddit = function(category, cb) {
  try {
    var articleIds, response, articles;
    articleIds = [];
    response = HTTP.get(category.referral_url);
    
    articles = _.chain(response.data.data.children)
      .filter(function(article) { return !article.data.is_self; })
      .sortBy(function(article) { return article.data.ups * -1; })
      .value();

    cb && cb(null, articles);
  } catch(e) {
    console.log(e);
    throw new Meteor.Error(e.statusCode, e.response.content);
  }
}