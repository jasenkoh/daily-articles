if (Categories.find().count() === 0) {
	Categories.insert({ 
		name: "Programming", 
		referral_url: "http://www.reddit.com/r/programming.json?sort=hot&limit=50"
	});

	Categories.insert({ 
		name: "Web Development", 
		referral_url: "http://www.reddit.com/r/webdev.json?sort=hot&limit=50"
	});

	Categories.insert({ 
		name: "Rails", 
		referral_url: "http://www.reddit.com/r/rails.json?sort=hot&limit=50"
	});
};