import compare from './compare.js';
import { isArray, isObject } from 'lodash';

const equal = (obj1, obj2) => {
  return JSON.stringify(obj1) === JSON.stringify(obj2);
}

const clone = (object) => {
  return JSON.parse(JSON.stringify(object));
};

let PREV_STATE;
const subscriptions = [];

const getChangedProperties = (object, string='') => {
  const key = Object.keys(object)[0];
  const string2 = string + '.' + key;

  if (isObject(object[key]) && !isArray(object[key])) {
    return getChangedProperties(object[key], string2)
  } else {
    return string2
  }
}

const watch = ({state}, callback) => {
  if (!PREV_STATE) {
    PREV_STATE = clone(state);
    return;
  }

  const prev = clone(PREV_STATE)
  const curr = clone(state)

  const diffs = Object.keys(compare(prev, curr));

  if (diffs.length) {
    callback(curr, prev)

    console.log('Debug:', diffs);
    console.log(compare(prev, curr))

    const diffentObject = compare(prev, curr);

    // const keys = Object.keysdifferentObject.

    if (subscriptions.length) {
      diffs.forEach((diff) => {
        const string = getChangedProperties(diffentObject);
        const subscription = subscriptions.find(s => s.property === string);
        console.log('ive been looking for', string)

        if (!subscription) return;

        subscription.callback(curr, prev);
      })
    }

    PREV_STATE = curr;
  }
};

const createInstance = (storeObj, update) => {
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

  if (!update) {
    throw new Error('you have not passed second argument')
  }

  storeObj.dispatch = (method, payload) => {
    if (!storeObj.actions[method]) throw new Error(`Action called ${method} is undefined`);
    storeObj.actions[method](storeObj.state, payload);
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

  return storeObj;
};

if (typeof window !== undefined) {
  window.createInstance = createInstance;
}

export default createInstance;
