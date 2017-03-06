import Tag from '../../Tag'
import {ensure} from './utils'

export class ComputeArray extends Tag {

    hasPath = false

    constructor(array) {
        super('compute.array', [ ...array.keys() ], array.map(ensure))
    }

    get(context) {
        return this.values.reduce((result, value, index) => {
            if (typeof value === "function")
                return index === (this.values.length - 1)
                    ? value(...result)
                    : [ value(...result) ]

            if (value instanceof Tag)
                result.push(value.get(context))
            else
                result.push(value)

            return result
        }, [])
    }

    toString() {
        return `${this.type}([ ${ this.values.map(value => `${value}`).join(", ") } ])`
    }
}

export default (...array) => new ComputeArray(array)
