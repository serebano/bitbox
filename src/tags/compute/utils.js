import Tag from '../../Tag'
import ComputeArray from './array'
import ComputeObject from './object'

export function ensure(arg) {
    if (arg instanceof Tag) 
		return arg

    if (Array.isArray(arg))
		return new ComputeArray(arg)

	if (typeof arg === "object")
		return new ComputeObject(arg)

    return arg
}
