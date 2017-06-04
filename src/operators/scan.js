import curry from "../curry"

/**
 *  var numbers = [1, 2, 3, 4];
 *  var factorials = R.scan(R.multiply, 1, numbers); //=> [1, 1, 2, 6, 24]
 *  @symb R.scan(f, a, [b, c]) = [a, f(a, b), f(f(a, b), c)]
 */

export default curry(function scan(fn, acc, list) {
    let idx = 0
    let len = list.length
    let result = [acc]

    while (idx < len) {
        acc = fn(acc, list[idx])
        result[idx + 1] = acc
        idx += 1
    }

    return result
})
