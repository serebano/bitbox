/** @jsx h */
import { is } from "../../utils";
import { stringify } from "../../bits";
import { root } from "../app";

export default function Keys(props, h) {
    return (
        <div style={{ background: "#ddd", padding: 6 }}>
            <code
                style={{ color: "#555", background: "#fff", padding: "4px 8px", borderRadius: 2 }}
            >
                {props.string}
            </code>
            <div style={{ fontFamily: "Helvetica Neue", paddingTop: "12px" }}>
                <b>bitbox(</b>
                {Keys.keys({ keys: props.keys }, h)}
                <b>)</b>
            </div>
        </div>
    );
}

Keys.keys = (props, h) => (
    <span>
        {props.keys.map((key, idx) => {
            return (
                <code
                    key={idx}
                    style={{
                        display: "inline-block",
                        fontSize: 14, // - props.keys.length / idx + "px",
                        opacity: 1 - idx * 0.1
                    }}
                >
                    <small
                        style={{
                            opacity: 0.8,
                            margin: "2px 4px",
                            color: "#c00",
                            fontWeight: "bold",
                            background: "#fff",
                            display: "inline-block",
                            borderRadius: 2,
                            fontSize: 6,
                            padding: "0",
                            height: 40,
                            marginBottom: -40
                        }}
                    >
                        {idx}
                    </small>
                    {is.function(key)
                        ? <span style={{ margin: "0 3px", fontWeight: "bold" }}>
                              ({key.displayName || key.name || String(key)})
                          </span>
                        : is.object(key)
                              ? <pre>{stringify(key)}</pre>
                              : is.array(key)
                                    ? <span
                                          style={{
                                              background: "#fff",
                                              boxShadow: "0 0 3px #aaa",
                                              borderRadius: "2px"
                                          }}
                                      >
                                          [{Keys.keys({ keys: key }, h)}]
                                      </span>
                                    : String(key)}
                </code>
            );
        })}
    </span>
);

Keys.map = {
    keys: root.debug.keys,
    string: root.debug.string
};
