import React from 'react'
import component from '../../Component'
import { state, signal } from '../../tags'

export default component({
    count: state`count`,
    increaseClicked: signal`increaseClicked`,
    decreaseClicked: signal`decreaseClicked`,
},
  function App ({count, increaseClicked, decreaseClicked}) {
    return (
      <div>
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
