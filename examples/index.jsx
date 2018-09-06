import * as React from 'react'
import { Model, State, Propose } from '../src/index.js'
import { render } from 'react-dom'

const root = document.getElementById('root')

const appModel = Model('app', { schema: {
  todos: [
    { description: 'Write example.', done: true },
    { description: 'Write another example.', done: false },
  ],
}})

const state = State(models => {
  return {
    pending: models.app.todos.filter(t => !t.done),
    done: models.app.todos.filter(t => t.done),
    size: models.app.todos.length,
  }
})

const App = state(({ state }) => {
  console.log(state)
  return (
    <div>
      Hi, we have {state.size} total todos.
      Pending:
      <ul>
        {
          state.pending.map((t, i) => <li key={i}>{t.description}</li>)
        }
      </ul>
      Done:
      <ul>
        {
          state.done.map((t, i) => <li key={i}>{t.description}</li>)
        }
      </ul>
    </div>
  )
})


render(<App />, root)
