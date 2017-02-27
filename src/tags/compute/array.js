import Tag from '../../Tag'
import {ensure} from './utils'

export class ComputeArray extends Tag {
    constructor(array) {
        super('compute.array')
        this.keys = [...array.keys()]
        this.values = array.map(ensure)
    }
	resolve(context) {
		return Promise.all(this.values.map(value => Tag.resolve(context, value)))
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

export default (array) => new ComputeArray(array)
