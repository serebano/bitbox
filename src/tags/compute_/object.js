import Tag from '../../Tag'
import {ComputeArray} from './array'

export class ComputeObject extends Tag {

    hasPath = false

    constructor(object) {
        super('compute.object', Object.keys(object), Object.values(object).map(value => {
            if (Array.isArray(value))
                return new ComputeArray(value)
            return value
        }))
    }

    add(key, value) {
        this.keys.push(key)
        this.values.push(Array.isArray(value) ? new ComputeArray(value) : value)

        return this
    }

    get(context) {
        return this.keys.reduce((obj, key, idx) => {
            const value = this.values[idx]

            obj[key] = (value instanceof Tag)
                ? value.get(context)
                : typeof value === "function"
                    ? value(obj)
                    : value

            return obj
        }, {})
    }

    toString() {
        return `${this.type}({ ${this.keys.map((key, idx) => `${key}: ${this.values[idx]}`).join(", ")} })`
    }
}

export default (object) => new ComputeObject(object)
