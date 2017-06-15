import box from "../box"

export default box(function toArray(value) {
    return Array.from(value)
})
