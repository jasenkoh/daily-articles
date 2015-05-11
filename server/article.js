Meteor.methods({
  getFreshArticles: function(category) {
    if (category) {
      getArticleForCategory(category);
    } else {
      getArticlesForUserCategories()
    }

    return true;
  },
  seeArticle: function(articleId) {
    Meteor.users.update({ _id: this.userId, 'articles._id': articleId }, {$set: {'articles.$.seen': true}});
  },
  feedUserWithArticles: function(categoryName) {
    if (categoryName) {
      addUserArticle(categoryName);
    } else {
      categories = Categories.find({ userId: Meteor.userId(), active: true }).fetch();
      _.each(categories, function(cat) {
        addUserArticle(cat.name);
      });
    }

    return true;
  },
  seeAllArticles: function(category) {
    _.each(Meteor.user().articles, function(article) {
      if (article.categoryName === category) {
        Meteor.call('seeArticle', article._id, function(err, res) {
          if (err) {
            throw new Meteor.Error(500, 'There was an error processing request: ' + error);
          }
        });
      }
    });
  }
});

var getArticlesForUserCategories = function() {
  var result, categories;

  categories = Categories.find({ userId: Meteor.userId(), active: true }).fetch();

  fetchArticlesSync = Meteor.wrapAsync(readArticlesFromReddit);
  
  _.each(categories, function(category) {
    var start = new Date().getTime();

    result = fetchArticlesSync(category);

    var end = new Date().getTime();
    var time = end - start;
    console.log('Read articles from reddit time execution: ' + (time / 1000) + 
      ' seconds for category: ' + category.name);

    saveFreshArticles(result, category);
  });
}

var getArticleForCategory = function(category) {
  fetchArticlesSync = Meteor.wrapAsync(readArticlesFromReddit);
  result = fetchArticlesSync(category);

  saveFreshArticles(result, category);
}

var addUserArticle = function(categoryName) {
  var date = new Date();
  date.setHours(0,0,0,0);

  articles = Articles.find({ createdAt: {$gte: date}, 'category.name': categoryName}).fetch();

  _.each(articles, function(article) {
    if (_.isEmpty(_.where(Meteor.user().articles, {_id: article._id}))) {
      Meteor.users.update({ _id: Meteor.userId() },
      {
        $push: {
          articles: {_id: article._id, seen: false, categoryName: categoryName}
        }
      });
    }
  });
}

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
      var url = article.data.url
      try {
        if (url.match(MatchEx.Url())) {
          Articles.insert({
            title: article.data.title,
            source: 'Reddit',
            url: url,
            score: article.data.ups,
            createdAt: new Date().getTime(),
            category: category,
            referral_id: article.data.id
          });
        }
      } catch(err) {
        console.log('There was an error processing request: ' + err);
      }
    } else {
      Articles.update({_id: existingArticle._id}, {$set: {score: article.data.ups}});
    }
  });
}