import box from "../box"

export default box(function as(key, value) {
    return {
        [key]: value
    }
})
