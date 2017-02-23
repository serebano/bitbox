import Tag from '../Tag'

export default function Props(tags) {
    return function props(keys, ...values) {
        return new Tag('props', {
            get(context) {
                const path = this.path(context)
                return this.extract(context, path)
            },
            set(context, value) {
                const path = this.path(context)
                const root = path.split(".")
                const key = root.pop()
                if (!root.length)
                    context.props[key] = value
                else
                    this.extract(context, keys)[key] = value

                return true
            }
        }, keys, values)
    }
}
