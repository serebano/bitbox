const native = WeakMap.prototype;

const getters = ["has", "get"];
const all = ["set", "delete"].concat(getters);

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

    target.set = function(key, value) {
        if (this.get(key) !== value) {
            queueObservers(this, key, path);
        }
        return native.set.apply(this, arguments);
    };

    target.delete = function(key) {
        if (this.has(key)) {
            queueObservers(this, key, path);
        }
        return native.delete.apply(this, arguments);
    };

    return target;
};
