ga('send', 'pageview', 'landing');

Template.appLanding.helpers({
  hasCategories: function() {
    return Categories.find().count() > 0;
  }
});