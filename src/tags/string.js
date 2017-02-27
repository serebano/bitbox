import Tag from '../Tag'

export class StringTag extends Tag {

	constructor(keys, values) {
		super("string", keys, values)
	}

	get(context) {
		return this.path(context)
	}
}

function string(keys, ...values) {
	return new StringTag(keys, values)
}

export default string
