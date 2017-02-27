import Tag from '../Tag'

class Props extends Tag {

    constructor(keys, values) {
        super("props", keys, values)
    }

    static get(context, path) {
        return Tag.extract(context, path)
    }

    get(context) {
        return Tag.extract(context, this.path(context, true))
    }

    set(context, value) {
        return Tag.resolve(context, value, (resolved) => {
            const path = this.path(context, true)

            return Tag.update(context, path, resolved)
        })
    }
}

function props(keys, ...values) {
    return new Props(keys, values)
}

export default props
