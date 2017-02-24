export default function set(target, value) {
    return (context) => context.set(target, value)
}
