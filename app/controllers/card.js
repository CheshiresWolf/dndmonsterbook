var DEBUG = true;

var keysList = [
	"name",
	//"alignment",
	"size",
	//"type",
	"armor",
	"hp",
    //"speed",
    "str",
    "dex",
    "con",
    "inteligence",
    "wis",
    "cha",
    // "Saving_Throws",
    // "Skills",
    // "Condition_Immunities",
    // "Senses",
    // "Languages",
    "Challenge",
    // "Traits",
    // "ACTIONS",
    // "LEGENDARY ACTIONS",
    // "REGIONAL EFFECTS",
    "id",
    "lvl",
    "ac"
];

function isInList(attr) {
	for (var i = 0; i < keysList.length; i++) {
		if (attr == keysList[i]) {
			return true;
		}
	}

	return false;
}

var modelName = null;
var currentModel = null;
var FavoritesList = null;
$.init = function(model, list) {
	modelName = model.get("name");
	$.name.text = modelName;

	currentModel = model;
	FavoritesList = list;

	var starTrigger = (FavoritesList.findByName(modelName) != null);
	//Ti.App.Properties.getBool(modelName, false);
	if (starTrigger) {
		$.star.backgroundImage = "/images/MainWin/star_on.png";
	}

	$.challenge.text = model.get("Challenge");

	$.armorclass.text = model.get("armor").replace("Armor Class", "AC :");
	$.hitpoints.text = model.get("hp").replace("Hit Points", "Hp :");;

	$.statValues_str.text = model.get("str");
	$.statValues_dex.text = model.get("dex");
	$.statValues_con.text = model.get("con");
	$.statValues_int.text = model.get("inteligence");
	$.statValues_wis.text = model.get("wis");
	$.statValues_cha.text = model.get("cha");

	if (DEBUG) Ti.API.debug("card | init | model.get('cha') : " + model.get("cha"));
	
	model.set({"speed" : model.get("speed").replace("Speed ", "")});

	for (var attr in model.attributes) {
		if (!isInList(attr)) {
			$.anotherBox.add(Ti.UI.createLabel({
				text : attr,
				font : {
			        fontSize : '8pt',
					fontFamily : "Deutsch-Gothic"
				},
				color : "black"
			}));

			$.anotherBox.add(Ti.UI.createLabel({
				text : model.get(attr),
				font : {
			        fontSize : '8pt',
					fontFamily : 'HelveticaNeue-CondensedBold'
				},
				color : "black",
				textAlign : "left"
			}));
		}
	}
};

if (Ti.Platform.osname == "android") {
	$.cardWindow.addEventListener('open', function(e) {
	    $.cardWindow.activity.actionBar.hide();
	});
} else {
	var backButton = Ti.UI.createButton({
		top : 0,
		left : 0,
		width : 50,
		height : 50,
		backgroundImage : "images/MainWin/vax_back.png"
	});
	backButton.addEventListener("click", function() {
		$.cardWindow.close();
	});

	$.topBox.add(backButton);
}

function setFavourite() {
	var starTrigger = (FavoritesList.findByName(modelName) != null);

	if (DEBUG) Ti.API.debug("card | setFavourite | starTrigger : ", starTrigger);

	$.star.backgroundImage = "/images/MainWin/star_" + (starTrigger ? "off" : "on") + ".png";
	
	//Ti.App.Properties.setBool(modelName, !starTrigger);

	if (starTrigger) {
		FavoritesList.remove(currentModel);
	} else {
		FavoritesList.add(currentModel);
	}
}