import curry from "../curry"

export default curry((key, target) => target[key])
