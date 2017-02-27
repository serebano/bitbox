import Tag from '../Tag'

export class State extends Tag {

    constructor(keys, values) {
        super("state", keys, values)
    }

    get(context) {
        if (context.state && context.state.get)
            return context.state.get(this.path(context))

        return Tag.extract(context, this.path(context, true))
    }

    set(context, value, done) {
        if (context.state && context.state.set)
            return context.state.set(this.path(context), value)

        Tag.resolve(context, value, (resolved) => {
            const path = this.path(context, true)

            Tag.update(context, path, resolved)
            done && done(path, resolved)
        })
    }
}

state.create = function create(context, changes) {
    const target = context.state

    return {
        has: (path) => !!Tag.extract(target, path),
        get: (path) => {
            console.log(`state.get`, path)
            return Tag.extract(target, path)
        },
        set: (path, value, done) => {
            console.log(`state.set`, path, value)
            
            const op = Tag.update(target, path, value)

            if (changes && changes.emit)
                changes.emit(`state.${path}`)

            return op
        }
    }
}

export default function state(keys, ...values) {
    return new State(keys, values)
}
