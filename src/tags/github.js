import Tag from '../Tag'

class Github extends Tag {
	get(context) {
		const path = this.path(context)

		return window.fetch("https://api.github.com/"+path.split(".").join("/"))
			.then(r=>r.json())
			.catch(e => console.log('github-catch', e))
	}
}

function github(keys, ...values) {
	return new Github('github', keys, values)
}

export default github
