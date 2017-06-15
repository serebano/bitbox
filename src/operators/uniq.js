import box from "../box"

export default box(function uniq(list) {
    return Array.from(new Set(list))
})
