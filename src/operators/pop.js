export default (target) => {
    return ({ model }) => {
        model(target).pop()
    }
}
