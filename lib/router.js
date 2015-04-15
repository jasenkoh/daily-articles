LAYOUT = 'layout';
ARTICLES = 'articleList';

Router.configure({
	layoutTemplate: LAYOUT,
	waitOn: function() {
		return [
	      Meteor.subscribe('articles'),
	      Meteor.subscribe('categories')
	    ];
	}
});

Router.route('/', { name: ARTICLES });