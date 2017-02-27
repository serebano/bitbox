import Tag from '../../Tag'
import {ComputeArray} from './array'

export class ComputeObject extends Tag {
    constructor(object) {
        super('compute.object')

        this.keys = Object.keys(object)
        this.values = Object.values(object).map(value => {
            if (Array.isArray(value))
                return new ComputeArray(value)
            return value
        })
    }
    resolve(context) {
        const resolved = Promise.all(this.values.map(value => {
            return Tag.resolve(context, value)
        }))

        return resolved.then(values => this.keys.reduce((obj, key, index) => {
            obj[key] = typeof values[index] === "function"
                ? values[index](obj)
                : values[index]

            return obj
        }, {}))
    }
    get(context) {
        return this.keys.reduce((obj, key, idx) => {
            const value = this.values[idx]

            obj[key] = (value instanceof Tag)
                ? value.get(context)
                : typeof value === "function"
                    ? value(context)
                    : value

            return obj
        }, {})
    }
    toString() {
        return `${this.type}({ ${this.keys.map((key, idx) => `${key}: ${this.values[idx]}`).join(", ")} })`
    }
}

export default (object) => new ComputeObject(object)
