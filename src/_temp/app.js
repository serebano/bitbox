import { bit, box, run } from "./bitbox";

function App(object) {
    const app = bit(object);

    run.context = app;

    return app;
}

export default App;
