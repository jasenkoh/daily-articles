LAYOUT = 'appLayout';
LOADING = 'appLoading';

LANDING = 'appLanding';

if (Meteor.isClient) {
  // Show the loading screen on desktop
  Router.onBeforeAction(function (pause) {
    if (!this.ready()) {
      this.render(LOADING);
      pause(); // otherwise the action will just render the main template.
    } else {
      this.render(LANDING);
    }
  });
}

Router.configure({
  layoutTemplate: LAYOUT,

  loadingTemplate: LOADING,

  waitOn: function() {
    return [
        Meteor.subscribe('articles'),
        Meteor.subscribe('categories'),
        Meteor.subscribe('userData')
    ];
  }
});

Router.route('/', { name: LANDING });