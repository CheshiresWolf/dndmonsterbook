function FavoritesList() {
    var self = this;
    self.collection = null;
    self.save = function() {
        DEBUG && Ti.API.debug("FavoritesList | self.save | self.collection.length : ", self.collection.length);
        Titanium.App.Properties.setString("favoriteCollection", JSON.stringify(self.collection.toJSON()));
    };
    self.load = function() {
        return JSON.parse(Titanium.App.Properties.getString("favoriteCollection", "[]"));
    };
    self.add = function(model) {
        DEBUG && Ti.API.debug("FavoriteList | add");
        self.collection.add(model);
        self.save();
    };
    self.remove = function(model) {
        DEBUG && Ti.API.debug("FavoriteList | remove");
        self.collection.remove(model);
        self.save();
    };
    self.clean = function() {
        var length = self.collection.length;
        self.collection.reset();
        self.save();
        return length;
    };
    self.refresh = function() {
        self.collection.reset(self.load());
        DEBUG && Ti.API.debug("FavoritesList | refresh | self.collection.length : ", self.collection.length);
    };
    self.findByName = function(name) {
        DEBUG && Ti.API.debug("FavoritesList | self.findByName | name : ", name);
        var res = self.collection.where({
            name: name
        });
        return res.length > 0 ? res : null;
    };
    self.findById = function(id) {
        var res = self.collection.where({
            id: id
        });
        return res.length > 0 ? res : null;
    };
    !function() {
        self.collection = Alloy.createCollection("FavouriteMonster");
    }();
    return self;
}

var DEBUG = true;

module.exports = new FavoritesList();