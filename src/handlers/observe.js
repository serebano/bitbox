import Tag from '../Tag'

export default function observe(type, fn) {
    return Tag.template(type, {
        get(target, path) {
            return Tag.extract(target, path)
        },
        set(target, path, value) {
            const keys = path.split(".")
            const key = keys.pop()
            const object = Tag.extract(target, keys.join("."))
            fn(path, value)

            return (object[key] = value)
        }
    })
}
