import Tag from '../../Tag'
import * as tags from '../'
import array from './array'
import object from './object'

function compute(args) {
    if (arguments.length === 1) {
        if (args instanceof Tag) return args
        if (Array.isArray(args)) return compute.array(args)
        if (typeof args === "function") return compute(args(tags))
        if (typeof args === "object") return compute.object(args)
    }

	return compute.array(Array.from(arguments))
}

compute.array = array
compute.object = object

export default compute
