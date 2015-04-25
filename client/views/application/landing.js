Template.appLanding.onRendered(function(){
  if (Meteor.userId() && Meteor.user().articles === undefined) {
    Meteor.call('updateUserArticles', function (error, result) {
      if (error) {
        alert('error');
        console.log(error);
      }
    });
  }
});
