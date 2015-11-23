var args = arguments[0] || {};

var FavoritesList = require("FavoritesList");

function search() {

}

function favoriteReset() {
	$.resetText.text = FavoritesList.clean() + " records was removed.";

	setTimeout(function() {
		$.resetText.text = "";
	}, 1500);
}