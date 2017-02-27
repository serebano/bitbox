import Tag from '../Tag'

export class State extends Tag {

    constructor(keys, values) {
        super("state", keys, values)
    }

    get(context) {
        return Tag.extract(context, this.path(context, true))
    }

    set(context, value, done) {
        Tag.resolve(context, value, (resolved) => {
            const path = this.path(context, true)
            //console.log(`state-set`, {path,context})
            Tag.update(context, path, resolved)

            done && done(path, resolved)
        })
    }
}

export default function state(keys, ...values) {
    return new State(keys, values)
}
