import React from 'react'
import Component from '../../Component'

const Foo = Component(
    function({ github, state, signal, props }) {
        return {
            //repo: github`repos.serebano.${props`repo`}`,
            count: state`count`,
            color: state`color`,
            inc: signal`increaseClicked`,
            counts: state`counts.counts.${state`counts.counter`}`,
            clicked: signal`counts.countClicked`,
            keys: Object.keys,
            abc: [1,2,3]
        }
    },
    function Foo(props) {
        return (
            <div>
                <pre>{JSON.stringify(props, null, 4)}</pre>
            </div>
        )
    }
)

export default Component(
    function({ state, signal }) {
        return {
            count: state`count`,
            increaseClicked: signal`increaseClicked`,
            decreaseClicked: signal`decreaseClicked`,
        }
    },
    function App({ count, increaseClicked, decreaseClicked }) {
        return (
          <div>
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
              <Foo repo="tag" />
          </div>
        )
    }
)
