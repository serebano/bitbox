import * as tags from ".";
import * as components from "../views";

function compose(factory) {
    const name = factory.name;
    const { props, view, type = "react" } = factory({ ...tags, name });

    view.displayName = name;

    return components[type](props, view);
}

export default compose;
