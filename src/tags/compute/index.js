import Tag from '../../Tag'
import * as tags from '../'
import array, {ComputeArray} from './array'
import object, {ComputeObject} from './object'

function compute(args) {
    if (!arguments.length)
        throw new Error(`Missing targets`)

    if (arguments.length === 1) {
        if (args instanceof Tag) return args
        if (typeof args === "function") return compute(args(tags))
        if (Array.isArray(args)) return new ComputeArray(args)
        if (typeof args === "object") return new ComputeObject(args)
    }

	return new ComputeArray(Array.from(arguments))
}

compute.array = array
compute.object = object

export default compute
