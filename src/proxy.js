function proxy(target = {}) {
    const handler = new Proxy(
        {},
        {
            get(target, trapName, receiver) {
                // Return the handler method named trapName
                return function(...args) {
                    // Slice away target object in args[0]
                    console.log(trapName, args.slice(1));
                    // Forward the operation
                    return Reflect[trapName](...args);
                };
            }
        }
    );

    return new Proxy(target, handler);
}

export default proxy;
