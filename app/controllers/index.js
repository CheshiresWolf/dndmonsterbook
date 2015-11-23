var ListViewBinder = require("ListViewBinder");

var args = arguments[0] || {};

var DEBUG = true;

var FavoritesList = require("FavoritesList");
// var FavoritesListClass = require("FavoritesList");
// var FavoritesList = new FavoritesListClass();

var defaultFilter = {
	where : {},
	limit : 10
};

$.collection = Alloy.createCollection("Monster");
$.binder = new ListViewBinder({
    listview    : $.listView,
    section     : $.defaultListSection,
    collection  : $.collection
});
$.binder.bind();

$.collection.initialize(defaultFilter);
$.collection.reload();

if (DEBUG) Ti.API.debug("index | FavoritesList.collection.length : ", FavoritesList.collection.length);
$.favoriteBinder = new ListViewBinder({
    listview    : $.favoriteListView,
    section     : $.favoriteListSection,
    collection  : FavoritesList.collection//$.favoriteCollection
});
$.favoriteBinder.bind();
FavoritesList.refresh();

function showMenu() {
	Alloy.Globals.drawer.toggleLeftWindow();
}

function listClick(e) {
	var model = $.collection.at(e.itemIndex);
	
	if (DEBUG) Ti.API.debug("MainWin | listClick | model : ", JSON.stringify(model.toJSON(), null, 4));

	var card = Alloy.createController("card");
	card.init(model, FavoritesList);
	card.getView().open();
}

function favoriteListClick(e) {
	var model = FavoritesList.collection.at(e.itemIndex);
	
	if (DEBUG) Ti.API.debug("MainWin | favoriteListClick | model : ", JSON.stringify(model.toJSON(), null, 4));

	var card = Alloy.createController("card");
	card.init(model, FavoritesList);
	card.getView().open();
}

function chooseAll(e) {
	$.listView.show();
	$.filterView.hide();
	$.favoriteListView.hide();

	changeButtonsImage(e.source.id);
}

function chooseFilter(e) {
	$.listView.hide();
	$.filterView.show();
	$.favoriteListView.hide();

	$.collection.count({
    	where : defaultFilter.where
    }, function(err, count) {
		$.searchResults.text = count + " matches";
	});

	changeButtonsImage(e.source.id);
}

function chooseFavorite(e) {
	$.listView.hide();
	$.filterView.hide();
	$.favoriteListView.show();

	changeButtonsImage(e.source.id);
}

var buttonNames = [
	{id : "listButton",      image : "lb"},
	{id : "filterButton",    image : "lf"},
	{id : "favouriteButton", image : "ls"}
];
function changeButtonsImage(id) {
	buttonNames.forEach(function(e) {
		$[e.id].backgroundImage = "/images/MainWin/" + e.image + "_" + ( e.id == id ? "on" : "off" ) + ".png"; 
	});
}

function filterAC() {
	var opts = {
		options : ["all"]
	};

	for (var i = 5; i <= 25; i++) {
		opts.options.push(i);
	}

	var dialog = Ti.UI.createOptionDialog(opts);
    dialog.addEventListener("click", function(e) {
    	var index = (e.index < 0) ? 0 : e.index;

        if (index == 0) {
        	delete defaultFilter.where["ac"];
        } else {
        	defaultFilter.where["ac"] = opts.options[index];
        }

        $.searchAC.title = "AC : " + opts.options[index];

        $.collection.count({
        	where : defaultFilter.where
        }, function(err, count) {
			$.searchResults.text = count + " matches";
		});
    });

    dialog.show();
}

function filterChallenge() {
	var opts = {
		options : ["all", "1/8", "1/4", "1/2"]
	};

	for (var i = 0; i <= 21; i++) {
		opts.options.push(i);
	}

	var dialog = Ti.UI.createOptionDialog(opts);
    dialog.addEventListener("click", function(e) {
		var index = (e.index < 0) ? 0 : e.index;

        if (index == 0) {
        	delete defaultFilter.where["lvl"];
        } else {
        	defaultFilter.where["lvl"] = opts.options[index];
        }

        $.searchChallenge.title = "Challenge : " + opts.options[index];

        $.collection.count({
        	where : defaultFilter.where
        }, function(err, count) {
			$.searchResults.text = count + " matches";
		});
    });

    dialog.show();
}

function filterAligment() {
	var opts = {
		options : [
			"all",
			"unaligned",
			"lawful good",
			"neutral good",
			"chaotic good",
			"lawful neutral",
			"neutral neutral",
			"chaotic neutral",
			"lawful evil",
			"neutral evil",
			"chaotic evil"
		]
	};

	var dialog = Ti.UI.createOptionDialog(opts);
    dialog.addEventListener("click", function(e) {
    	var index = (e.index < 0) ? 0 : e.index;
		
        if (index == 0) {
        	delete defaultFilter.where["alignment"];
        } else {
        	defaultFilter.where["alignment"] = opts.options[index];
        }

        $.searchAligment.title = "Aligment : " + opts.options[index];

        $.collection.count({
        	where : defaultFilter.where
        }, function(err, count) {
			$.searchResults.text = count + " matches";
		});
    });

    dialog.show();
}

function filterType() {
	var opts = {
		options : [
			"all",
			"aberration",
			"beast",
			"construct",
			"dragon",
			"elemental",
			"giant",
			"humanoid",
			"ooze",
			"monstrosity",
			"celestial",
			"fey",
			"fiend",
			"plant",
			"undead"
		]
	};

	var dialog = Ti.UI.createOptionDialog(opts);
    dialog.addEventListener("click", function(e) {
    	var index = (e.index < 0) ? 0 : e.index;
		
        if (index == 0) {
        	delete defaultFilter.where["type"];
        } else {
        	defaultFilter.where["type"] = opts.options[index];
        }

        $.searchType.title = "Type : " + opts.options[index];

        $.collection.count({
        	where : defaultFilter.where
        }, function(err, count) {
			$.searchResults.text = count + " matches";
		});
    });

    dialog.show();
}

function applyFilter() {
	$.collection.initialize(defaultFilter);
	$.collection.reload();

	chooseAll({source : {id : "listButton"}});
}

function resetFilter() {
	$.collection.count({
    	where : defaultFilter.where
    }, function(err, count) {
		$.searchResults.text = count + " matches";
	});

	defaultFilter = {where : {}, limit : 10};

	$.searchAC.title        = "AC : all";
	$.searchChallenge.title = "Challenge : all";
	$.searchAligment.title  = "Aligment : all";
	$.searchType.title      = "Type : all";

	applyFilter();
}

if (Ti.Platform.osname == "android") {
	$.index.addEventListener('open', function(e) {
	    $.index.activity.actionBar.hide();
	});
}

$.index.open();