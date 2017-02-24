import Tag from '../Tag'

const {cache} = Tag

class Github extends Tag {}

function github(keys, ...values) {
	return new Github('github', {
		get(context) {
            const path = this.path(context)
			return window.fetch("https://api.github.com/"+path.split(".").join("/"))
                .then(r=>r.json())
                .then(result => {
                    cache.set(this.type, path, result)
                    return result
                })
		}
	}, keys, values)
}

export default github
