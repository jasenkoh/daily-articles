LAYOUT = 'appLayout';
ARTICLES = 'articleList';
LOADING = 'appLoading';

if (Meteor.isClient) {
  // Show the loading screen on desktop
  Router.onBeforeAction('loading');
}

Router.configure({
  layoutTemplate: LAYOUT,

  loadingTemplate: LOADING,

  waitOn: function() {
    return [
        Meteor.subscribe('articles'),
        Meteor.subscribe('categories')
    ];
  }
});

Router.route('/', { name: ARTICLES });