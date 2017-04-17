import { Component } from "react";
import PropTypes from "prop-types";

class Container extends Component {
    static propTypes = {
        store: PropTypes.object.isRequired,
        children: PropTypes.node.isRequired
    };
    static childContextTypes = {
        store: PropTypes.object.isRequired
    };

    getChildContext() {
        return {
            store: this.props.store
        };
    }
    render() {
        return this.props.children;
    }
}

export default Container;
