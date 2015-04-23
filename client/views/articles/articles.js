Template.articleList.helpers({
  articles: function () {
    return Articles.find({}).fetch();
  }
});