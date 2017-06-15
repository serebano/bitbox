import box from "../box"

export default box(function identical(a, b) {
    // SameValue algorithm
    if (a === b) {
        // Steps 1-5, 7-10
        // Steps 6.b-6.e: +0 != -0
        return a !== 0 || 1 / a === 1 / b
    } else {
        // Step 6.a: NaN == NaN
        return a !== a && b !== b
    }
})
