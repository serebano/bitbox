import { compute } from "../tags";

function connect(target, listener) {
    return context => {
        const tag = compute(target);
        const connection = context.listeners.connect(tag.paths(context), function Listener(c) {
            connection.update(tag.paths(context));
            listener(tag.get(context));
        });

        return connection;
    };
}

export default connect;
