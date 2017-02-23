import Tag from '../Tag'

export default function Observe(tags, type) {
    return function o(keys, ...values) {
        return new Tag(type, {
            get(context) {
                const path = this.path(context)
                return this.extract(context, path)
            },
            set(context, value) {
                const path = this.path(context)
                const keys = path.split(".")
                const key = keys.pop()

                if (!key)
                    context[this.type] = value
                else
                    this.extract(context, keys)[key] = value

                tags[type].observer && tags[type].observer(this, path, value)

                return true
            }
        }, keys, values)
    }
}
