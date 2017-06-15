import box from "../box"

export default box(function assign(object, target) {
    return Object.assign(target, object)
})
