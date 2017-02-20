import Tag from '../Tag'

export default Tag.template('state', {
    get(target, path) {
        if (typeof target === "function")
            return target(path)

        return Tag.extract(target, path)
    },
    set(target, path, value) {
        if (typeof target.set === "function")
            return target.set(path, value)

        const keys = path.split(".")
        const key = keys.pop()

        const object = Tag.extract(target, keys.join("."))
        if (typeof value === "undefined")
            delete object[key]
        else
            object[key] = value

        return object[key]
    }
})
