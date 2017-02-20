import Tag from '../Tag'

export default function observe(type, fn) {
    return Tag.template(type, {
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

            fn(path, value)

            return (object[key] = value)
        }
    })
}
