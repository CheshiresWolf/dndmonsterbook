var DEBUG = true;

function FavoritesList() {
	var self = this;

	self.collection = null;

	self.save = function() {
		if (DEBUG) Ti.API.debug("FavoritesList | self.save | self.collection.length : ", self.collection.length);
	
		Titanium.App.Properties.setString("favoriteCollection", JSON.stringify( self.collection.toJSON() ) );
	};

	self.load = function() {
		return JSON.parse(Titanium.App.Properties.getString("favoriteCollection", "[]"));
	};

	self.add = function(model) {
		if (DEBUG) Ti.API.debug("FavoriteList | add");

		self.collection.add(model);
		self.save();
	};

	self.remove = function(model) {
		if (DEBUG) Ti.API.debug("FavoriteList | remove");

		self.collection.remove(model);
		self.save();
	};

	self.clean = function() {
		self.collection.reset();
		self.save();
	};

	self.refresh = function(array) {
		self.collection.reset(self.load());

		if (DEBUG) Ti.API.debug("FavoritesList | refresh | self.collection.length : ", self.collection.length);
	};

	self.findByName = function(name) {
		if (DEBUG) Ti.API.debug("FavoritesList | self.findByName | name : ", name);

		var res = self.collection.where({"name" : name});

		//if (DEBUG) Ti.API.debug("FavoritesList | self.findByName | res : ", res.toJSON());

		if (res.length > 0) {
			return res;//.at(0);
		} else {
			return null;
		}
	};

	self.findById = function(id) {
		var res = self.collection.where({"id" : id});

		//if (DEBUG) Ti.API.debug("FavoritesList | self.findById | res : ", res.toJSON());

		if (res.length > 0) {
			return res;//.at(0);
		} else {
			return null;
		}
	};

	(function init() {
		self.collection = Alloy.createCollection("FavouriteMonster");
	})();

	return self;
}

module.exports = new FavoritesList();