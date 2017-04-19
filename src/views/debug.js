function Debug(observer, h) {
    return h(
        "div",
        null,
        observer.run(true),
        h(
            "pre",
            {
                style: {
                    fontSize: 12,
                    padding: 8,
                    margin: 0,
                    color: `#555`,
                    background: `#f4f4f4`,
                    borderTop: `1px solid #aaa`
                }
            },
            JSON.stringify(
                {
                    changed: observer.changed,
                    changes: observer.changes.map(path => path.join("."))
                    //paths: observer.paths.map(path => path.join("."))
                },
                null,
                2
            )
        )
    )
}

export default Debug
