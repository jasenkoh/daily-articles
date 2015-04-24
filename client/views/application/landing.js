Template.appLanding.onRendered(function(){
  if (Meteor.userId() && Meteor.user().articles === undefined) {
    Meteor.call('bootstrapArticles', Meteor.user(), function (error, result) {
      if (error) {
        alert('error');
        console.log(error);
      }
    });
  }
});