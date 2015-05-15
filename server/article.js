Meteor.methods({
  getFreshArticles: function(category) {
    if (category) {
      getArticleForCategory(category);
    } else {
      getArticlesForCategories()
    }

    return true;
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
    _.each(UserArticles.find().fetch(), function(userArticle) {
      if (userArticle.article.categoryName === category) {
        UserArticles.update({ _id: userArticle._id },  {$set: { dismissed: true}});
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
  var articles, userArticles, userId, date;

  date = new Date();
  date.setHours(0,0,0,0);
  date.setDate(date.getDate() - 5 );

  articles = Articles.find({ createdAt: { $gte: date }, 'category.name': category.name}).fetch();

  userArticles = user !== undefined ? 
    UserArticles.find({ userId: user._id }).fetch() : 
    UserArticles.find({ userId: Meteor.userId() }).fetch();

  userId = user !== undefined ? user._id : Meteor.userId();

  _.each(articles, function(article) {
    if (_.isEmpty(_.where(userArticles, {articleId: article._id})) && article.score > 5) {
      UserArticles.insert({
        userId: userId,
        article: article,
        articleId: article._id,
        seen: false,
        dismissed: false,
        createdAt: new Date().getTime()
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