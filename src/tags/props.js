import Tag from '../Tag'

props.Tag = class PropsTag extends Tag {

    constructor(keys, values) {
        super("props")
        this.keys = keys
        this.values = values
    }

    get(context) {
        const path = this.path(context)
        return this.extract(context, path)
    }

    set(context, value) {
        return this.resolve(context, value, (resolved) => {
            const path = this.path(context)

            return this.update(context, path, resolved)
        })
    }
}

function props(keys, ...values) {
    return new props.Tag(keys, values)
}

export default props
