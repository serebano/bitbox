import curry from "./curry"

export default curry(function(newOrder, fn) {
    var l = newOrder.length
    return arity(l, function() {
        var args = []
        for (var i = 0; i < l; ++i) {
            args[newOrder[i]] = arguments[i]
        }
        return fn.apply(undefined, args)
    })
})

//const flip = rearg([1, 0])
