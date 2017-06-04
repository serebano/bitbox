import curry from "../curry"

export default curry(function ifElse(condition, onTrue, onFalse) {
    return curry.to(Math.max(condition.length, onTrue.length, onFalse.length), function _ifElse() {
        return condition.apply(this, arguments) ? onTrue.apply(this, arguments) : onFalse.apply(this, arguments)
    })
})
