UserArticles.allow({
	update: function (userId, doc) { return ownsDocument(userId, doc);},
	remove: function (userId, doc) { return ownsDocument(userId, doc);}
});