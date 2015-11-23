function guid() {
    function s4() {
        return Math.floor(65536 * (1 + Math.random())).toString(16).substring(1);
    }
    return s4() + s4() + "-" + s4() + "-" + s4() + "-" + s4() + "-" + s4() + s4() + s4();
}

function isEmpty(obj) {
    if (void 0 != obj) for (var key in obj) return false;
    return true;
}

function requireJSON(path, filename) {
    var res = [];
    var f = Ti.Filesystem.getFile(path, filename);
    DEBUG && Ti.API.debug("alloy | requireJSON | nativePath : ", f.nativePath);
    if (f.exists()) {
        DEBUG && Ti.API.debug("alloy | requireJSON | trying to parse file");
        var text = f.read().text;
        try {
            res = JSON.parse(text);
        } catch (e) {
            DEBUG && Ti.API.debug("alloy | requireJSON | parse error : ", e);
        }
    }
    return res;
}

var Alloy = require("alloy"), _ = Alloy._, Backbone = Alloy.Backbone;

var DEBUG = true;

Alloy.Globals.jsonArray = requireJSON(Ti.Filesystem.getResourcesDirectory(), "monsterList.json");

Alloy.Globals.filter = function(params) {
    function filterByParams(item, index) {
        if (res.length >= params.limit) return;
        if (index < params.offset) return;
        if (isEmpty(params.where)) res.push(item); else {
            var buf = false;
            for (var key in params.where) buf = void 0 != item[key] && item[key] == params.where[key];
            buf && res.push(item);
        }
    }
    var res = [];
    Alloy.Globals.jsonArray.forEach(filterByParams);
    return res;
};

Alloy.Globals.getByName = function(name) {
    for (var i = 0; i < Alloy.Globals.jsonArray.length; i++) if (Alloy.Globals.jsonArray[i].name == name) return Alloy.Globals.jsonArray[i];
    return null;
};

Alloy.Globals.getById = function(id) {
    for (var i = 0; i < Alloy.Globals.jsonArray.length; i++) if (Alloy.Globals.jsonArray[i].id == id) return Alloy.Globals.jsonArray[i];
    return null;
};

Alloy.Globals.setByName = function(name, data) {
    for (var i = 0; i < Alloy.Globals.jsonArray.length; i++) if (Alloy.Globals.jsonArray[i].name == name) {
        Alloy.Globals.jsonArray[i] = data;
        return;
    }
};

Alloy.Globals.loadJSON = function() {
    return requireJSON(Ti.Filesystem.getApplicationDataDirectory(), "favorite.json");
};

Alloy.Globals.saveJSON = function(collection) {
    var file = Titanium.Filesystem.getFile(Ti.Filesystem.getApplicationDataDirectory(), "favorite.json");
    file.write(JSON.stringify(collection.toJSON()));
};

Alloy.Globals.loadFavorite = function() {
    var raw = Titanium.App.Properties.getString("favoriteCollection", "[]");
    return JSON.parse(raw);
};

Alloy.Globals.saveFavorite = function(collection) {
    Titanium.App.Properties.setString("favoriteCollection", JSON.stringify(collection.toJSON()));
};

Alloy.createController("index");