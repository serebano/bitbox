function createStore(state) {

	function get(tag, props = {}) {
		return tag.get({
			state,
			props
		})
	}

	function run(action, props = {}) {
		action({
			state,
			props
		})
	}

	return {run,get}
}

export default createStore
