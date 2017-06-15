import box from "../box"

export default box(function constant(value) {
    return () => value
})
