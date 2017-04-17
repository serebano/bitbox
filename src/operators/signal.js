function signal(chain) {
    const fn = props => signal.run("signal", chain, props);

    fn.displayName = `signal(${chain})`;
    fn.resolve = false;

    return fn;
}

export default signal;
