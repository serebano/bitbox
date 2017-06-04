import curry from "../curry"

export default curry((key, target) => key in target)
