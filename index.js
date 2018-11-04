import { isEqual, cloneDeep } from 'lodash';
import { compare, objectAsString } from './utils.js';

let PREV_STATE;
const subscriptions = [];

const watch = ({ state }, defaultCallback) => {
  if (!PREV_STATE) {
    PREV_STATE = cloneDeep(state);
    return;
  }

  const curr = cloneDeep(state);
  const prev = cloneDeep(PREV_STATE);

  const changedState = compare(prev, curr);
  const diffs = Object.keys(changedState);

  if (!changedState || !Object.keys(changedState).length) {
    return;
  }

  defaultCallback(curr, prev)

  const diffentObject = compare(prev, curr);

  if (!subscriptions.length) {
    return;
  }

  diffs.forEach((diff) => {
    const string = objectAsString(changedState);

    const matched = subscriptions.filter(({ property }) => (
      property === string || property === string.replace(/./, '')
    ));

    matched.forEach((subscription) => {
      subscription.callback(curr, prev);
    });
  });

  PREV_STATE = curr;
};

const createInstance = (originalObject, update = () => {}) => {
  const storeObj = cloneDeep(originalObject);

  if (!storeObj.state) {
    throw new Error('property `state` is absent');
  }

  if (!storeObj.actions) {
    throw new Error('property `actions` is absent');
  }

  if (typeof storeObj.actions !== 'object') {
    throw new Error('Property `actions` is not an object');
  }

  if (!Object.keys(storeObj.actions).length) {
    throw new Error('object `actions` has zero properties');
  }

  if (typeof update !== 'function') {
    throw new Error('Second argument must be a function')
  }

  storeObj.dispatch = (method, payload) => {
    if (!originalObject.actions[method]) throw new Error(`Action called ${method} is undefined`);
    originalObject.actions[method](storeObj.state, payload);
  }

  storeObj.subscribe = (property, callback, immediate=false) => {
    if (!property) {
      throw new Error('Missing property')
    }

    if (!callback) {
      throw new Error('Missing callback');
    }

    subscriptions.push({
      property,
      callback,
    });

    if (immediate) {
      callback(storeObj.state)
    }
  }

  setInterval(() => { watch(storeObj, update); }, 100)

  delete storeObj.actions;
  return storeObj;
};

if (typeof window !== undefined) {
  window.createInstance = createInstance;
}

export default createInstance;
