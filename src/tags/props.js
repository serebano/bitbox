import Tag from '../Tag'

class Props extends Tag {}

function props(keys, ...values) {
    return new Props('props', {
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

export default props
