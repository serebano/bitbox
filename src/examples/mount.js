function mount(store, component, props, children) {
    return View => {
        window.component = component;
        window.store = store;

        console.info("mount", component.name, { View, component, store, props, children });

        return View.createElement(
            View.Container,
            { store },
            View.createElement(component, props, children)
        );
    };
}

export default mount;
