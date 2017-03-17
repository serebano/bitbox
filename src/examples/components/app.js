/** @jsx h */
import Name from "./name";
import Count from "./count";

function App(props, h) {
    return (
        <div>
            <Name />
            <Count />
        </div>
    );
}
App.connect = {};

export default App;
