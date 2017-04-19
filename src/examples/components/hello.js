/** @jsx h */

function Hello({ nameChanged, value }, h) {
    return (
        <form>
            <h2>Hello {value}</h2>
            <input onInput={nameChanged} value={value} />
        </form>
    )
}

Hello.map = function({ state, signals }) {
    return {
        value: state.name(name => name || "World"),
        nameChanged: signals.nameChanged
    }
}

export default Hello
