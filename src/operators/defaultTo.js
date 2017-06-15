import box from "../box"

export default box(function defaultTo(d, v) {
    return v == null || v !== v ? d : v
})
