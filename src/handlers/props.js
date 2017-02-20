import Tag from '../Tag'

export default Tag.template('props', {
    get(target, path) {
        return Tag.extract(target, path)
    },
    set(target, path, value) {
        const keys = path.split(".")
        const key = keys.pop()
        const object = Tag.extract(target, keys.join("."))

        return typeof value === "undefined"
            ? (delete object[key])
            : (object[key] = value)
    }
})
