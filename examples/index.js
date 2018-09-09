import * as React from 'react'
import { render } from 'react-dom'
import { Model, State, Propose, Render, View } from '../src/index.js'

const root = document.getElementById('root')

Model('app', { schema: {
  todos: [
    { id: 0, description: 'write example', done: true }
  ],
}})

const modelsToListState = models => {
  return {
    pending: models.app.todos.filter(t => !t.done),
    done: models.app.todos.filter(t => t.done),
  }
}

const listState = State(modelsToListState)

const update = id => e => Propose('app')(proposeNewDescription(id, e.target.value))
const updateStatus = (id) => e => {
  console.log({
    done: e.target.value
  })
  Propose('app')(proposeNewStatus(id, e.target.value))
}

const proposeNewDescription = (id, description) => ({todos}) => ({
  name: 'update',
  key: `todos[${id}]`,
  value: { description },
})

const proposeNewStatus = (id, done) => ({
  name: 'update',
  key: `todos[${id}]`,
  value: { done: done === "true" ? false : true },
})

const proposeNewTodo = description => ({todos}) => ({
  name: 'append',
  value: { todos: [...todos, { description, done: false, id: todos.length }] },
})

const Todo = View(({ todo: { description, id, done } }) =>
  <div>
    <li><input type='checkbox' value={done} checked={done} onChange={updateStatus(id)}/> <input type='text' value={description} onChange={update(id)}/></li>
  </div>
)

const App = listState((props) => {
  return (
    <div>
      {/* Hi, we have {state.size} total todos. */}
      Pending:
      <ul>
        {
          props.state.pending.map((t, i) => <Todo key={i} todo={t}/>)
        }
      </ul>
      Done:
      <ul>
        {
          props.state.done.map((t, i) => <Todo key={i} todo={t}/>)
        }
      </ul>

      <input type='text' onKeyPress={e => { if(e.key === 'Enter') Propose('app')(proposeNewTodo(e.target.value)) }}/>
    </div>
  )
})


Render(App, root)
