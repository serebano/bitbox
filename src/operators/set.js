export default function set(target, value) {
    return (context) => target.set(context, value)
}
