Meteor.methods({
  getFreshArticles: function(category) {
    if (category) {
      getArticleForCategory(category);
    } else {
      getArticlesForCategories()
    }

    return true;
  },
  seeArticle: function(articleId) {
    Meteor.users.update({ _id: this.userId, 'articles._id': articleId }, {$set: {'articles.$.seen': true}});
  },
  dismissArticle: function(articleId) {
    Meteor.users.update({ _id: this.userId, 'articles._id': articleId }, {$set: {'articles.$.dismissed': true}});
  },
  feedUserWithArticles: function(categoryName, user) {
    if (categoryName) {
      addUserArticle(Categories.findOne({name: categoryName}), user);
    } else {
      categories = _.filter(Meteor.user().categories, function(category) { return category.active; });

      _.each(categories, function(category) {
        addUserArticle(Categories.findOne({name: category.name}), user);
      });
    }

    return true;
  },
  feedUsersWithArticles: function() {
    categories = Categories.find().fetch();

    _.each(Meteor.users.find().fetch(), function(user) {
      _.each(user.categories, function(category) {
        Meteor.call('feedUserWithArticles', category.name, user, function (error, result) {
          if (error) {
            console.log('Error while feeding users with articles: '+ error);
          }
        });
      });
    });
  },
  dismissAllArticles: function(category) {
    _.each(Meteor.user().articles, function(article) {
      if (article.categoryName === category) {
        Meteor.call('dismissArticle', article._id, function(err, res) {
          if (err) {
            throw new Meteor.Error(500, 'There was an error processing request: ' + error);
          }
        });
      }
    });
  }
});

var getArticlesForCategories = function() {
  var result, categories;

  categories = Categories.find().fetch();

  fetchArticlesSync = Meteor.wrapAsync(readArticlesFromReddit);
  
  _.each(categories, function(category) {
    result = fetchArticlesSync(category);

    saveFreshArticles(result, category);
  });
}

var getArticleForCategory = function(category) {
  fetchArticlesSync = Meteor.wrapAsync(readArticlesFromReddit);
  result = fetchArticlesSync(category);

  saveFreshArticles(result, category);
}

var addUserArticle = function(category, user) {
  var articles, userArticles, userId;

  articles = Articles.find({'category.name': category.name}).fetch();
  userArticles = user !== undefined ? user.articles : Meteor.user().articles;
  userId = user !== undefined ? user._id : Meteor.userId();

  _.each(articles, function(article) {
    if (_.isEmpty(_.where(userArticles, {_id: article._id})) && article.score > 5) {
      Meteor.users.update({ _id: userId},
      {
        $push: {
          articles: {_id: article._id, seen: false, categoryName: category.name, dismissed: false}
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