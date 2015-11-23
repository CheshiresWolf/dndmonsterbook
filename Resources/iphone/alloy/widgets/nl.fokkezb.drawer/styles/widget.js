function WPATH(s) {
    var index = s.lastIndexOf("/");
    var path = -1 === index ? "nl.fokkezb.drawer/" + s : s.substring(0, index) + "/nl.fokkezb.drawer/" + s.substring(index + 1);
    return path;
}

module.exports = [ {
    isApi: true,
    priority: 1000.0003,
    key: "Window",
    style: {
        backgroundColor: "#fff"
    }
}, {
    isClass: true,
    priority: 10000.0004,
    key: "white",
    style: {
        color: "#fff"
    }
}, {
    isClass: true,
    priority: 10000.0005,
    key: "black",
    style: {
        color: "#000"
    }
}, {
    isClass: true,
    priority: 10000.0006,
    key: "bg_white",
    style: {
        backgroundColor: "#fff"
    }
}, {
    isClass: true,
    priority: 10000.0007,
    key: "bg_black",
    style: {
        backgroundColor: "#000"
    }
}, {
    isId: true,
    priority: 100101.0001,
    key: "drawer",
    style: {
        openDrawerGestureMode: "OPEN_MODE_ALL",
        closeDrawerGestureMode: "CLOSE_MODE_ALL",
        animationMode: "ANIMATION_PARALLAX_FACTOR_5",
        leftDrawerWidth: 256
    }
} ];