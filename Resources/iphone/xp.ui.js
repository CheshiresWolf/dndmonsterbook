var NavigationWindow;

exports.createNavigationWindow = function(args) {
    var navWin = Ti.UI.iOS.createNavigationWindow(args);
    args && args.id && (Alloy.Globals[args.id] = navWin);
    return navWin;
};

exports.createWindow = function(args) {
    return Ti.UI.createWindow(args);
};

exports.createTextArea = function(args) {
    var $textArea = Ti.UI.createTextArea(args);
    if (args.hintText) {
        $textArea.originalColor = $textArea.color || "#000";
        $textArea.value || $textArea.applyProperties({
            value: $textArea.hintText,
            color: "#ccc"
        });
        $textArea.addEventListener("focus", function(e) {
            e.source.value == e.source.hintText && e.source.applyProperties({
                value: "",
                color: e.source.originalColor
            });
        });
        $textArea.addEventListener("blur", function(e) {
            e.source.value || e.source.applyProperties({
                value: e.source.hintText,
                color: "#ccc"
            });
        });
    }
    return $textArea;
};

exports.createLabel = function(args) {
    if (true && args.html) {
        var html = args.html;
        delete args.text;
        delete args.html;
        var label = Ti.UI.createLabel(args);
        var ref = label;
        var html2as = require("nl.fokkezb.html2as");
        html2as(html, function(err, attr) {
            err ? console.error(err) : ref.attributedString = attr;
            ref = null;
        });
        return label;
    }
    return Ti.UI.createLabel(args);
};

var isAndroid = "android" == Ti.Platform.osname;

exports.createTextField = function(args) {
    if (isAndroid) {
        var view = Ti.UI.createTextField(args);
        view.addEventListener("focus", function focusFix(e) {
            e.source.blur();
            e.source.removeEventListener("focus", focusFix);
        });
        return view;
    }
    return Ti.UI.createTextField(args);
};