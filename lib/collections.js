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
    max: 512,
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
  }
});

Schema.User = new SimpleSchema({
  emails: {
      type: [Object],
      // this must be optional if you also use other login services like facebook,
      // but if you use only accounts-password, then it can be required
      optional: true
  },
  services: {
      type: Object,
      optional: true,
      blackbox: true
  },
  'emails.$.address': {
      type: String,
      regEx: SimpleSchema.RegEx.Email
  },
  'services.$.password': {
    type: String,
    min: 6,
  },
  createdAt: {
      type: Date
  },
  profile: {
      type: Object
  },
  articles: {
      type: [Object],
      optional: true
  },
  'articles.$._id': {
    type: String
  },
  'articles.$.seen': {
    type: Boolean
  },
  categories: {
      type: [String],
      optional: true
  }
});

Meteor.users.attachSchema(Schema.User);
Articles.attachSchema(Schema.Article);
Categories.attachSchema(Schema.Category);