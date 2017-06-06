import curry2 from "../curry/curry.2"

export default curry2(function prop(key, target) {
    return target[key]
})
