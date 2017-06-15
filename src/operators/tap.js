import box from "../box"

export default box(function tap(fn, target) {
    fn(target)
    return target
})
