import Tag from '../Tag'

class Github extends Tag {
	get(context) {
		const path = this.path(context)
		const keys = path.split(".")

		if (!context.state.get(`_github_cache`))
			context.state.set(`_github_cache`, {})

		const cachedPath = `_github_cache.${keys.join("_")}`
		const cached = context.state.get(cachedPath)
		if (cached && (Date.now() - cached.timestamp) < 36000)
			return cached.value

		return window.fetch("https://api.github.com/"+keys.join("/"))
			.then(res => res.json())
			.then(value => {
				context.state.set(cachedPath, {
					value,
					timestamp: Date.now()
				})

				return value
			})
			.catch(e => console.log('github-catch', e))
	}
}

function github(keys, ...values) {
	return new Github('github', keys, values)
}

export default github
