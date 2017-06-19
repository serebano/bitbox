export default curryN(2, function rearg(newOrder, fn) {
    var l = newOrder.length
    return ofArity(l, function() {
        var args = []
        for (var i = 0; i < l; ++i) {
            args[newOrder[i]] = arguments[i]
        }
        return fn.apply(undefined, args)
    })
})

const flip = rearg([1, 0])
