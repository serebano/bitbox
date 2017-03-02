import Tag from '../Tag'

class Props extends Tag {

    constructor(keys, values) {
        super("props", keys, values)
    }

    // static get(context, path) {
    //     return Tag.extract(context, path)
    // }
    //
    // get(context) {
    //     return Tag.extract(context, this.path(context, true))
    // }

    set(context, value) {
        return Tag.resolve(context, value).then(resolved => {
            const path = this.path(context, true)

            Tag.update(context, path, resolved)
            //console.log(`set`, path, this.type, context, value)

            return context[this.type]
        })
    }

    call(context, method, ...args) {
        if (!context[this.type])
            throw new Error(`Invalid ${this.type} in context`)

        if (!method)
            return context[this.type]

        if (method === "set")
            return this.set(context, ...args)
    }
}

function props(keys, ...values) {
    return new Props(keys, values)
}

export default props
