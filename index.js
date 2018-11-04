import compare from './compare.js';

const equal = (obj1, obj2) => {
  return JSON.stringify(obj1) === JSON.stringify(obj2);
}

const clone = (object) => {
  return JSON.parse(JSON.stringify(object));
};

let PREV_STATE;
const subscriptions = [];

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

    if (subscriptions.length) {
      diffs.forEach((diff) => {
        const subscription = subscriptions.find(s => s.property === diff);

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

  storeObj.subscribe = (property, callback) => {
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
  }

  setInterval(() => { watch(storeObj, update); }, 100)

  return storeObj;
};

if (typeof window !== undefined) {
  window.createInstance = createInstance;
}

export default createInstance;
