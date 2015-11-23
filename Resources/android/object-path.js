!function(root, factory) {
    "use strict";
    "object" == typeof module && "object" == typeof module.exports ? module.exports = factory() : "function" == typeof define && define.amd ? define([], factory) : root.objectPath = factory();
}(this, function() {
    "use strict";
    function isEmpty(value) {
        if (!value) return true;
        if (isArray(value) && 0 === value.length) return true;
        for (var i in value) if (_hasOwnProperty.call(value, i)) return false;
        return true;
    }
    function toString(type) {
        return toStr.call(type);
    }
    function isNumber(value) {
        return "number" == typeof value || "[object Number]" === toString(value);
    }
    function isString(obj) {
        return "string" == typeof obj || "[object String]" === toString(obj);
    }
    function isObject(obj) {
        return "object" == typeof obj && "[object Object]" === toString(obj);
    }
    function isArray(obj) {
        return "object" == typeof obj && "number" == typeof obj.length && "[object Array]" === toString(obj);
    }
    function isBoolean(obj) {
        return "boolean" == typeof obj || "[object Boolean]" === toString(obj);
    }
    function getKey(key) {
        var intKey = parseInt(key);
        if (intKey.toString() === key) return intKey;
        return key;
    }
    function set(obj, path, value, doNotReplace) {
        isNumber(path) && (path = [ path ]);
        if (isEmpty(path)) return obj;
        if (isString(path)) return set(obj, path.split(".").map(getKey), value, doNotReplace);
        var currentPath = path[0];
        if (1 === path.length) {
            var oldVal = obj[currentPath];
            void 0 !== oldVal && doNotReplace || (obj[currentPath] = value);
            return oldVal;
        }
        void 0 === obj[currentPath] && (obj[currentPath] = isNumber(path[1]) ? [] : {});
        return set(obj[currentPath], path.slice(1), value, doNotReplace);
    }
    function del(obj, path) {
        isNumber(path) && (path = [ path ]);
        if (isEmpty(obj)) return void 0;
        if (isEmpty(path)) return obj;
        if (isString(path)) return del(obj, path.split("."));
        var currentPath = getKey(path[0]);
        var oldVal = obj[currentPath];
        if (1 === path.length) void 0 !== oldVal && (isArray(obj) ? obj.splice(currentPath, 1) : delete obj[currentPath]); else if (void 0 !== obj[currentPath]) return del(obj[currentPath], path.slice(1));
        return obj;
    }
    var toStr = Object.prototype.toString, _hasOwnProperty = Object.prototype.hasOwnProperty;
    var objectPath = function(obj) {
        return Object.keys(objectPath).reduce(function(proxy, prop) {
            "function" == typeof objectPath[prop] && (proxy[prop] = objectPath[prop].bind(objectPath, obj));
            return proxy;
        }, {});
    };
    objectPath.has = function(obj, path) {
        if (isEmpty(obj)) return false;
        isNumber(path) ? path = [ path ] : isString(path) && (path = path.split("."));
        if (isEmpty(path) || 0 === path.length) return false;
        for (var i = 0; i < path.length; i++) {
            var j = path[i];
            if (!isObject(obj) && !isArray(obj) || !_hasOwnProperty.call(obj, j)) return false;
            obj = obj[j];
        }
        return true;
    };
    objectPath.ensureExists = function(obj, path, value) {
        return set(obj, path, value, true);
    };
    objectPath.set = function(obj, path, value, doNotReplace) {
        return set(obj, path, value, doNotReplace);
    };
    objectPath.insert = function(obj, path, value, at) {
        var arr = objectPath.get(obj, path);
        at = ~~at;
        if (!isArray(arr)) {
            arr = [];
            objectPath.set(obj, path, arr);
        }
        arr.splice(at, 0, value);
    };
    objectPath.empty = function(obj, path) {
        if (isEmpty(path)) return obj;
        if (isEmpty(obj)) return void 0;
        var value, i;
        if (!(value = objectPath.get(obj, path))) return obj;
        if (isString(value)) return objectPath.set(obj, path, "");
        if (isBoolean(value)) return objectPath.set(obj, path, false);
        if (isNumber(value)) return objectPath.set(obj, path, 0);
        if (isArray(value)) value.length = 0; else {
            if (!isObject(value)) return objectPath.set(obj, path, null);
            for (i in value) _hasOwnProperty.call(value, i) && delete value[i];
        }
    };
    objectPath.push = function(obj, path) {
        var arr = objectPath.get(obj, path);
        if (!isArray(arr)) {
            arr = [];
            objectPath.set(obj, path, arr);
        }
        arr.push.apply(arr, Array.prototype.slice.call(arguments, 2));
    };
    objectPath.coalesce = function(obj, paths, defaultValue) {
        var value;
        for (var i = 0, len = paths.length; len > i; i++) if (void 0 !== (value = objectPath.get(obj, paths[i]))) return value;
        return defaultValue;
    };
    objectPath.get = function(obj, path, defaultValue) {
        isNumber(path) && (path = [ path ]);
        if (isEmpty(path)) return obj;
        if (isEmpty(obj)) return defaultValue;
        if (isString(path)) return objectPath.get(obj, path.split("."), defaultValue);
        var currentPath = getKey(path[0]);
        if (1 === path.length) {
            if (void 0 === obj[currentPath]) return defaultValue;
            return obj[currentPath];
        }
        return objectPath.get(obj[currentPath], path.slice(1), defaultValue);
    };
    objectPath.del = function(obj, path) {
        return del(obj, path);
    };
    return objectPath;
});