import * as handlers from './handlers'

function createTags() {
	return Object.keys(handlers).reduce((tags, key) => {
		const Factory = handlers[key]
		const template = Factory(tags)
		tags[template.name] = template
		return tags
	}, {
		path: {
			set(key, path) {
				return this[key] = String(path)
			},
			get(key) {
				return this[key]
			}
		}
	})
}

const tags = createTags()
const { props, state, signal, module, string, compute, path } = tags


export default tags
export { props, state, signal, module, string, compute, path }
