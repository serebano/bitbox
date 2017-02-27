import React from 'react'
import component from '../../Component'
import { state, signal, props, github } from '../../tags'

const Foo = component({
    repo: github`repos.serebano.${props`repo`}`,
    count: state`count`,
    color: state`color`,
    inc: signal`increaseClicked`,
    counts: state`counts.counts.${state`counts.counter`}`,
    clicked: signal`counts.countClicked`,
    keys: Object.keys,
    abc: [1,2,3]
}, function Foo(props) {
    return (
        <div>
            <pre>{JSON.stringify(props, null, 4)}</pre>
        </div>
    )
})

export default component({
    count: state`count`,
    increaseClicked: signal`increaseClicked`,
    decreaseClicked: signal`decreaseClicked`,
},
  function App ({count, increaseClicked, decreaseClicked}) {
    return (
      <div>
          <Foo repo="tag" />
        <button
          onClick={() => increaseClicked()}
        > + </button>
        {count}
        <button
          onClick={() => decreaseClicked()}
        > - </button>
      </div>
    )
  }
)
