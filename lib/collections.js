Articles = new Meteor.Collection('articles');
Categories = new Meteor.Collection('categories');

var Schema = {};

Schema.Category = new SimpleSchema({
  name: {   
    type: String,
    max: 100,
    label: 'name',
  },
  referral_url: {
    type: String,
        regEx: SimpleSchema.RegEx.Url,
    label: 'URL to external articles resource'
  }
});

Schema.Article = new SimpleSchema({
  title: {
    type: String,
    max: 200,
    label: 'Title',
  },
  source: {
    type: String,
    max: 200,
    label: 'Source',
  },
  url: {
    type: String,
        regEx: SimpleSchema.RegEx.Url,
    label: 'URL',
  },
  score: {
    type: Number,
    min: 0,
    label: 'Article score'
  },
  createdAt: {
    type: Date,
    denyUpdate: true
  },
  category: {
    type: Schema.Category
  },
  referral_id: {
    type: String,
      unique: true
  },
  userId: {
    type: String,
    label: 'User id'
  }
});

Articles.attachSchema(Schema.Article);
Categories.attachSchema(Schema.Category);

Articles.allow({
  insert: function (doc) { return true },
  update: function (doc) { return true },
  remove: function (doc) { return true }
});