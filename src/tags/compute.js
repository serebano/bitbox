import Tag from '../Tag'
import * as tags from '.'

function compute(args) {
    if (arguments.length === 1) {
        if (args instanceof Tag) return args
        if (Array.isArray(args)) return compute.array(args)
        if (typeof args === "function") return compute(args(tags))
        if (typeof args === "object") return compute.object(args)
    }

	return compute.array(Array.from(arguments))
}

compute.array = function(array) {
	return new Tag('compute.array', {
        compute(context) {
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
        },
        resolve(context) {
            return this.handlers.compute.call(this, context)
        },
        string() {
            return `${this.type}([ ${ this.values.map(value => `${value}`).join(", ") } ])`
        }
    }, [ ...array.keys() ], array.map(ensure))
}

compute.object = function(object) {
    const keys = Object.keys(object)
	const values = keys.map(key => ensure(object[key]))

	return new Tag('compute.object', {
        resolve(context) {
            return this.keys.reduce((obj, key, idx) => {
                const value = this.values[idx]

                obj[key] = (value instanceof Tag)
                    ? value.get(context)
                    : typeof value === "function"
                        ? value(context)
                        : value

                return obj
            }, {})
        },
        string() {
            return `${this.type}({ ${this.keys.map((key, idx) => `${key}: ${this.values[idx]}`).join(", ")} })`
        }
    }, keys, values)
}

function ensure(arg) {
    if (arg instanceof Tag) return arg
    if (Array.isArray(arg)) return compute.array(arg)
    if (typeof arg === "object") return compute.object(arg)

    return arg
}

compute.type = ensure
compute.types = ['array', 'object']

export default compute
