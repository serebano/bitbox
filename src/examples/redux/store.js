import Store from "../../stores/redux";
import { state, props, compute } from "../../tags";
import { set, inc, dec } from "../../operators";

const store = Store(
    {
        state: {
            name: "Redux like",
            count: 0
        },
        signals: {
            increment: inc(state`count`, props`by`),
            decrement: dec(state`count`, props`by`)
        }
    },
    {
        devtools: {
            remoteDebugger: "localhost:8585" //192.168.0.46
        }
    }
);

// store.dispatch(inc(state`count`, props`count`), {
//     count: 1000
// });

export default store;
