/** @jsx h */

export default function Debug({ observer }, h) {
    if (!observer) return <span />
    return (
        <code>
            changed({observer.changed}) [{observer.changes.map(path => path.join(".")).join(", ")}]
        </code>
    )
}
