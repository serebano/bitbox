import signals from "./signals"

export default {
    state: {
        name: "Demo",
        count: 0,
        counters: {
            foo: 1,
            bar: 2,
            baz: 3
        },
        selected: "foo",
        title: "Demo",
        index: 0,
        enabled: true,
        nativeSet: new Set(["One", "Two"]),
        timers: {
            one: { value: 0 },
            abc: { value: 200 },
            xxx: { value: 100 }
        },
        items: ["Item #1", "Item #2"],
        id: "one"
    },
    signals
}
