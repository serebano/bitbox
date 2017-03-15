import React from "react";

function ComposeDemo({ state, props }) {
    return {
        props: {
            name: state`name`,
            count: state`count`,
            color: props`color`
        },
        view(props) {
            return <pre>{JSON.stringify(props, null, 4)}</pre>;
        }
    };
}

export default ComposeDemo;
