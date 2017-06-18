import box from "../box"
import create from "../curry/create"

function partial(concat) {
    return box(function(fn, args) {
        return create(Math.max(0, fn.length - args.length), function() {
            return fn.apply(this, concat(args, arguments))
        })
    })
}

export default partial
