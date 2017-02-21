import tag from '../Tag'

function compute(args) {
    if (arguments.length === 1) {
        if (args instanceof tag)
            return args

        if (typeof args === "function")
            return compute(tag.compose(args))

        if (Array.isArray(args))
            return compute.array(args)

        if (typeof args === "object")
		    return compute.object(args)
    }

	return compute.array(Array.from(arguments))
}

compute.array = function computeArray(array) {
	return new tag('compute.array', {
        resolve(context) {
            return this.values.reduce((result, value, index) => {
                if (typeof value === "function")
                    return index === (this.values.length - 1)
                        ? value(...result)
                        : [ value(...result) ]

                if (value instanceof tag)
                    result.push(value.get(context))
                else
                    result.push(value)

                return result
            }, [])
        },
        string() {
            const args = this.values.map((value, idx) => `${value}`).join(",\n")
            return `${this.type}([\n${args}\n])`
        }
    }, undefined, array.map(ensure))
}

compute.object = function computeObject(object) {
    const keys = Object.keys(object)
	const values = keys.map(key => ensure(object[key]))

	return new tag('compute.object', {
        resolve(context) {
            return this.keys.reduce((obj, key, idx) => {
                const value = this.values[idx]

                obj[key] = (value instanceof tag)
                    ? value.get(context)
                    : value

                return obj
            }, {})
        },
        string() {
            const args = this.keys.map((key, idx) => `${key}: ${this.values[idx]}`).join(",\n")

            return `${this.type}({\n${args}\n})`
        }
    }, keys, values)
}

function ensure(arg) {
    if (arg instanceof tag)
        return arg

    if (Array.isArray(arg))
        return compute.array(arg)

    if (typeof arg === "object")
        return compute.object(arg)

    return arg
}

compute.types = ['array', 'object']

export default tag.template(compute)
