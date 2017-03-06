function Changes(changes = []) {
	if (changes instanceof Changes) {
		return changes
	}

	changes.__proto__ = Changes.prototype

	return changes
}

Changes.prototype = new Array
Changes.prototype.last = function last() {
	return this[this.length - 1]
}
Changes.prototype.flush = function flush() {
	return this.splice(0, this.length)
}
Changes.prototype.push = function push(change) {
	const index = Array.prototype.push.call(this, {
		path: change.path,
		method: change.method,
		forceChildPathUpdates: change.forceChildPathUpdates
	})

	debug(change, index)

	return change
}

function debug(e, index) {
	const type = e.path.slice().shift()
	const args = ["%c'"+(e.path.slice(1).join(".")||".")+"'%c"].concat(e.args).map(arg => {
		if (typeof arg === "function") return (arg.displayName || arg.name) || String(arg)
		if (typeof arg === "object") return JSON.stringify(arg)
		return String(arg)
	}).join(", ")
	if (e.action)
		console.log(`[${index}] ${e.action.name}`, e.action)
	console.log(`[${index}/${Boolean(e.forceChildPathUpdates)}] %c${type}%c.%c${e.method}%c(${args}%c)`, `color:#e5c07b`, `color:#abb2bf`, `color:#61afef`, `color:#abb2bf`, `color:#98c379`, `color:#5c6370`, 'color:#abb2bf')

}

export default Changes
