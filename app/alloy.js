// The contents of this file will be executed before any of
// your view controllers are ever executed, including the index.
// You have access to all functionality on the `Alloy` namespace.
//
// This is a great place to do any initialization for your app
// or create any global variables/functions that you'd like to
// make available throughout your app. You can easily make things
// accessible globally by attaching them to the `Alloy.Globals`
// object. For example:
//
// Alloy.Globals.someGlobalFunction = function(){};

var DEBUG = true;
 
function guid() {

	function s4() {
	    return Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);
	}

	return s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4() + s4() + s4();
}

function isEmpty(obj) {
	if (obj != undefined) {
		for (var key in obj) {
			return false;
		}
	}

	return true;
}

function requireJSON(path, filename) {
    var res = [];

    var f = Ti.Filesystem.getFile(path, filename);
    if (DEBUG) Ti.API.debug("alloy | requireJSON | nativePath : ", f.nativePath); 

    if (f.exists()) {
        if (DEBUG) Ti.API.debug("alloy | requireJSON | trying to parse file");

        var text = f.read().text;

        try {
            res = JSON.parse(text);
        } catch(e) {
            if (DEBUG) Ti.API.debug("alloy | requireJSON | parse error : ", e);
        }
    }

    return res;
}

Alloy.Globals.jsonArray = requireJSON(Ti.Filesystem.getResourcesDirectory(), "monsterList.json");
//Alloy.Globals.favoriteArray = requireJSON("monsterList.json");

Alloy.Globals.filter = function(params) {
	var res = [];

	function filterByParams(item, index, arr) {
		if (res.length >= params.limit) return;

		if (index < params.offset) return;

		if (isEmpty(params.where)) {
			res.push(item);
		} else {
			var buf = false;

			for (var key in params.where) {
				if (item[key] != undefined) {
					if (typeof(params.where[key]) == "String") {
						buf = (item[key] == params.where[key]);
					} else {
						if (params.where[key].like != undefined) {
							var expr = new RegExp(params.where[key].like, 'i');

							buf = ((item[key]).search(expr) != -1);
						}
					}
				}
			}

			if (buf) res.push(item);
		}
	}

	Alloy.Globals.jsonArray.forEach(filterByParams);

	return res;
};

Alloy.Globals.getByName = function(name) {
	for (var i = 0; i < Alloy.Globals.jsonArray.length; i++) {
		if (Alloy.Globals.jsonArray[i].name == name) {
			return Alloy.Globals.jsonArray[i];
		}
	}

	return null;
};

Alloy.Globals.getById = function(id) {
	for (var i = 0; i < Alloy.Globals.jsonArray.length; i++) {
		if (Alloy.Globals.jsonArray[i].id == id) {
			return Alloy.Globals.jsonArray[i];
		}
	}

	return null;
};

Alloy.Globals.setByName = function(name, data) {
	for (var i = 0; i < Alloy.Globals.jsonArray.length; i++) {
		if (Alloy.Globals.jsonArray[i].name == name) {
			Alloy.Globals.jsonArray[i] = data;
			return;
		}
	}
};

Alloy.Globals.loadJSON = function(name) {
	return requireJSON(Ti.Filesystem.getApplicationDataDirectory(), "favorite.json");
}

Alloy.Globals.saveJSON = function(collection) {
	var file = Titanium.Filesystem.getFile(Ti.Filesystem.getApplicationDataDirectory(), "favorite.json");
	/*
	if (!file.exists()) {		
		file.createFile();
	}
	*/
    file.write( JSON.stringify( collection.toJSON() ) );
}

Alloy.Globals.loadFavorite = function() {
	var raw = Titanium.App.Properties.getString("favoriteCollection", "[]");
	return JSON.parse(raw);
}

Alloy.Globals.saveFavorite = function(collection) {
	Titanium.App.Properties.setString("favoriteCollection", JSON.stringify( collection.toJSON() ) );
}