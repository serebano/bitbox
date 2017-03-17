import Model from "../Model";
// models
import Providers from "../models/providers";
import Listeners from "../models/listeners";
import Modules from "../models/modules";
import Signals from "../models/signals";
import State from "../models/state";

export default Model.create(
    {
        providers: Providers,
        listeners: Listeners,
        signals: Signals,
        modules: Modules,
        state: State
    },
    {
        run(path, action, props) {
            action(Object.assign({}, this, { props }));
        }
    }
);
