export default {
    name: "demo store",
    title: "bitbox app",
    count: 0,
    counters: {
        foo: 1,
        bar: 2,
        baz: 3
    },
    selected: "foo",
    index: 0,
    enabled: true,
    nativeSet: new Set(["One", "Two"]),
    timers: {
        one: { value: 0 },
        abc: { value: 200 },
        xxx: { value: 100 },
        yyy: { value: 300 }
    },
    items: ["Item #1", "Item #2"],
    id: "one"
}
