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
    resolve(context, changes) {
        // if (changes) {
        //     const toResolve = changes.map(i => {
        //         return {
        //             type: i.path.shift(),
        //             path: i.path.join(".")
        //         }
        //     })
        //     console.log(`toResolve`, toResolve)
        // }
        const resolved = Promise.all(this.values.map(value => Tag.resolve(context, value, changes)))

        return resolved.then(values => {
            return this.keys.reduce((obj, key, index) => {
                obj[key] = typeof values[index] === "function" && !(this.values[index] instanceof Tag)
                    ? values[index](obj)
                    : values[index]

                return obj
            }, {})
        })
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
