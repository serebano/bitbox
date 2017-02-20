import Tag from '../Tag'

export default Tag.template('string', {
	resolve(context) {
		return this.path(context)
	}
})
