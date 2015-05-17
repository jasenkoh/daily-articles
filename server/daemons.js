var fetchArticles = function() {
  var start = new Date().getTime();

  Meteor.call('getFreshArticles', function (error, result) {
    if (error) {
      console.log('Error getting articles from reddit: ' + error);
    } else {     
      var end = new Date().getTime();
      var time = end - start;

      console.log('Read articles from reddit time execution: ' + (time / 1000));
    }
  });
};

var feedUsers = function() {
  var start = new Date().getTime();

  Meteor.call('feedUsersWithArticles', function (error, result) {
    if (error) {
      console.log('Error feeding users with articles: ' + error);
    } else {     
      var end = new Date().getTime();
      var time = end - start;

      console.log('Feeding users with articles time execution: ' + (time / 1000));
    }
  });  
}

SyncedCron.add({
  name: 'Get fresh articles',
  schedule: function(parser) {
    return parser.text('every 4 hours');
  },
  job: function() {
    fetchArticles();
  }
});

SyncedCron.add({
  name: 'Feed users with articles',
  schedule: function(parser) {
    return parser.text('every 3 hours');
  },
  job: function() {
    feedUsers();
  }
});

SyncedCron.add({
  name: 'Keep site alive',
  schedule: function(parser) {
    return parser.text('every 10 mins');
  },
  job: function() {
    HTTP.get('http://daily-articles.meteor.com');
  }
})

SyncedCron.start();