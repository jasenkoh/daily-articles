Template.appLanding.onRendered(function() {
  Session.set('loading', false);
  if (Meteor.userId() && Meteor.user().articles === undefined) {
    Session.set('loading', true);
    Meteor.call('getFreshArticles', function (error, result) {
      if (error) {
        alert('error');
        console.log(error);
        Session.set('loading', false);
      } else {
        Session.set('loading', false);
      }
    });
  }
});
