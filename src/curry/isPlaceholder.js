export default function _isPlaceholder(a) {
    return a != null && a["@@functional/placeholder"] === true
}
