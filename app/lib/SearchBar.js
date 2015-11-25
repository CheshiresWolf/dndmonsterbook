var DEBUG = true;

function SearchBar() {
	var self = this;

	self.options = null;

	self.blur = function() {
		if (self.options == null) return;

		self.options.textField.hide();
		self.options.textField.blur();
	};

	self.focus = function() {
		if (self.options == null) return;

		self.options.textField.show();
		self.options.textField.focus();
	};

	self.reset = function() {
		if (self.options == null) return;

		self.options.textField.value = "";
		self.blur();
	};

	self.init = function(initOpts) {
		if (initOpts.textField == undefined || initOpts.button == undefined || initOpts.callback == undefined) {
			Ti.API.debug("SearchBar | error : not all options specified. (textField, button, callback)");
			return;
		}

		self.options = initOpts;
		/*
		var holder = Ti.UI.createLabel({
			top : 0,
			left : 0,
			width : "100%",
			height : "100%",
			font : {
		        fontSize : "10pt",
			},
			color : "gray",
			textAlign : "center",
			text : "Enter name"
		});
		holder.addEventListener("click", function() {

		});
		*/
	
		self.options.button.addEventListener("click", clickListener);
	
		self.options.textField.addEventListener("change", changeListener);
		//self.options.textField.addEventListener("blur",   self.blur);//blurListener);
	};

	function clickListener() {
		var mark = self.options.textField.visible;

		if (mark) {
			self.reset();
		} else {
			self.focus();
		}
	}

	var lastValue = "";
	function changeListener(e) {
		if (e.source.value != lastValue) {
			lastValue = e.source.value;

			self.options.callback(lastValue);
		}
	}

	function blurListener() {

	}

	return self;
}

module.exports = new SearchBar();