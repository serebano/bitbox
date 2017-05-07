const native = WeakSet.prototype

const getters = ["has"]
const all = ["add", "delete"].concat(getters)

export default (target, path, registerObserver, queueObservers) => {
    target.$raw = {}

    for (let method of all) {
        target.$raw[method] = function() {
            native[method].apply(target, arguments)
        }
    }

    for (let getter of getters) {
        target[getter] = function(value) {
            registerObserver(this, value, path)
            return native[getter].apply(this, arguments)
        }
    }

    target.add = function(value) {
        if (!this.has(value)) {
            queueObservers(this, value, path)
        }
        return native.add.apply(this, arguments)
    }

    target.delete = function(value) {
        if (this.has(value)) {
            queueObservers(this, value, path)
        }
        return native.delete.apply(this, arguments)
    }

    return target
}
