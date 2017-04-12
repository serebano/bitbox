const native = Map.prototype;
const masterKey = Symbol("Map master key");

const getters = ["has", "get"];
const iterators = ["forEach", "keys", "values", "entries", Symbol.iterator];
const all = ["set", "delete", "clear"].concat(getters, iterators);

export default (target, path, registerObserver, queueObservers) => {
    target.$raw = {};

    for (let method of all) {
        target.$raw[method] = function() {
            native[method].apply(target, arguments);
        };
    }

    for (let getter of getters) {
        target[getter] = function(key) {
            registerObserver(this, key, path);
            return native[getter].apply(this, arguments);
        };
    }

    for (let iterator of iterators) {
        target[iterator] = function() {
            registerObserver(this, masterKey, path);
            return native[iterator].apply(this, arguments);
        };
    }

    target.set = function(key, value) {
        if (this.get(key) !== value) {
            queueObservers(this, key, path);
            queueObservers(this, masterKey, path);
        }
        return native.set.apply(this, arguments);
    };

    target.delete = function(key) {
        if (this.has(key)) {
            queueObservers(this, key, path);
            queueObservers(this, masterKey, path);
        }
        return native.delete.apply(this, arguments);
    };

    target.clear = function() {
        if (this.size) {
            queueObservers(this, masterKey, path);
        }
        return native.clear.apply(this, arguments);
    };

    return target;
};
