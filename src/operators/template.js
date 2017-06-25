import curry from "../curry"

function tag(strings) {
    const keys = Array.prototype.slice.call(arguments, 1)

    function t(...values) {
        var dict = values[values.length - 1] || {}
        var result = [strings[0]]
        keys.forEach(function(key, i) {
            var value = Number.isInteger(key) ? values[key] : dict[key]
            result.push(value, strings[i + 1])
        })
        return result.join("")
    }
    t.displayName = `tag\`${strings}\``
    return curry(t, 1)
}

export default curry(tag, 1)
