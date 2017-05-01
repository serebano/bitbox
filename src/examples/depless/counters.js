/** @jsx h */
import Counter from "./counter"
import Debug from "./debug"

export default [
    function({ props, state, observer }) {
        return {
            color: props.color,
            counters: state(state => state.counters || (state.counters = [])),
            add: state.counters(counters => () =>
                counters.push({
                    count: 0
                })),
            observer
        }
    },
    function Counters(props, h) {
        return (
            <section>
                <h1 style={{ color: props.color }}>Counters</h1>
                <button onClick={props.add}>Add Counter</button>
                <div>
                    {props.counters.map((counter, id) => <Counter id={id} key={id} />)}
                </div>
                <Debug observer={props.observer} />
            </section>
        )
    }
]
