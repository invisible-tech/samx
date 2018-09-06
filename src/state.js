'use strict'

import debug from 'debug'
import { compose, flow } from 'lodash/fp'
import { reaction, toJS } from 'mobx'
import { observer } from 'mobx-react'
import { getModels } from './store'

const d = debug('mobx-sam:State')

/**
 * A State factory that returns a Represent function that's used to bind viewing
 * components to the the Model -> State chain.
 * Can receive and pass actions as well
 *
 * @param {function} fn  Pure function that takes models as argument and outputs
 *                       a state representation.
 * @param {function} nap Pure function that takes state as argument.
 * @returns {function}
 * @example
 * const userState = State(({ models, actions }) => ({
 *   name: `${models.user.lastName.toUpperCase()}, ${models.user.firstName}`,
 *   older: models.user.age >= 18,
 * }))
 */
export const State = (fn, nap) => {
  d(`New State registered.`)

  // Set up the NAP as an observable of the State.
  // The NAP is then called everytime a model update impacts this State.
  // NAPs need to call Actions in order to mutate the model.
  if (nap) reaction(() => fn(getModels()), models => nap(models))

  // This observe function takes a render function as an argument and returns the
  // observer View function of the State.
  const observe = component => observer(props => {
    const state = fn(getModels())
    return component(Object.assign({}, props, { state }))
  })

  return observe
}
