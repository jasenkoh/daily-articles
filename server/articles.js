Meteor.methods({
	fetchArticles: function(category) {
		this.unblock();
		var response = Meteor.http.call('GET', category.referral_url)
		
		var articles = response.data.data.children;

		return _.chain(articles)
				.sortBy(function(article) { return article.data.ups * -1; })
				.first(10)
				.value();
	}
});