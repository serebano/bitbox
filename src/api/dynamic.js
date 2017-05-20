export function foo(box, obj) {
    return box(obj) //(Object.keys)
}

export function bar(box) {
    return box({
        name: String(box),
        count: 0,
        get keys() {
            return box(Object.keys)(this)
        },
        get foo2() {
            return foo(box, {
                a: 1,
                b: box.xxx({ xxx: [1, 2, 3] })
            })
        },
        inc() {
            return this.count++
        }
    })
}
