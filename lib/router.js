LAYOUT = 'layout';
ARTICLES = 'articleList';

Router.configure({
	layoutTemplate: LAYOUT
});

Router.route('/', { name: ARTICLES });