function signal(chain) {
    const fn = props => signal.run(chain, props);
    fn.displayName = `signal(${chain})`;

    return fn;
}

export default signal;
