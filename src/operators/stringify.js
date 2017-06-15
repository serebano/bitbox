import box from "../box"

export default box(function stringify(target) {
    return JSON.stringify(target, null, 4)
})
