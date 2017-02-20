import Tag from '../Tag'

export default Tag.template('state', {
    get(context, path) {
        const target = this.target(context)

        if (typeof target === "function")
            return target(path)

        return this.extract(context, path)
    },
    set(context, path, value) {
        const target = this.target(context)

        if (typeof target.set === "function")
            return target.set(path, value)

        const keys = path.split(".")
        const key = keys.pop()
        const object = this.extract(context, keys)

        return object[key] = value
    }
})
