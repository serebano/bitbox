import React from 'react'
import Component from '../../Component'

const Foo = Component(
    ({ state, signal, props }) => {
        return {
            count: state`count`,
            color: state`color`,
            inc: signal`increaseClicked`,
            counts: state`counts.counts.${state`counts.counter`}`,
            clicked: signal`counts.countClicked`,
            //keys: Object.keys,
            //abc: [1,2,3]
        }
    },
    function Foo(props) {
        return (
            <div>
                <pre>{JSON.stringify(props, null, 4)}</pre>
                <button onClick={() => props.clicked()}>Click</button>
            </div>
        )
    }
)

export default Component(
    ({ state, signal }) => {
        return {
            name: state`name`,
            count: state`count`,
            increaseClicked: signal`increaseClicked`,
            decreaseClicked: signal`decreaseClicked`,
        }
    },
    function App({ name, count, increaseClicked, decreaseClicked }) {
        return (
          <div>
              <h2>{name}</h2>
            <button
              onClick={() => increaseClicked({
                  by: 10
              })}> + </button>
            {count}
            <button
              onClick={() => decreaseClicked({
                  delay: 1000,
                  by: 3
              })}> - </button>
          <hr />
          <Foo />
          </div>
        )
    }
)
