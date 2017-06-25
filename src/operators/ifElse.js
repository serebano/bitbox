import curry from "../curry"

export default curry(function ifElse(condition, onTrue, onFalse) {
    return curry(function _ifElse() {
        return condition.apply(this, arguments) ? onTrue.apply(this, arguments) : onFalse.apply(this, arguments)
    }, Math.max(condition.length, onTrue.length, onFalse.length))
})
