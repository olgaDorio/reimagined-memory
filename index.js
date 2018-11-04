const equal = (obj1, obj2) => {
  return JSON.stringify(obj1) === JSON.stringify(obj2);
}

const clone = (object) => {
  return JSON.parse(JSON.stringify(object));
};

let PREV_STATE;

const watch = ({state}, callback) => {
  if (!PREV_STATE) {
    PREV_STATE = clone(state);
    return;
  }

  if (!equal(PREV_STATE, state)) {
    callback(clone(state), clone(PREV_STATE))
    PREV_STATE = clone(state);
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

  setInterval(() => { watch(storeObj, update); }, 100)

  return storeObj;
};

export default createInstance;
