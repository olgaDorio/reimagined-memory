import { transform, isEqual, isArray, isObject } from 'lodash'

const compare = (object, base) => {
  const changes = (object, base) => {
    return transform(object, (result, value, key) => {
      if (!isEqual(value, base[key])) {
        result[key] = (isObject(value) && isObject(base[key])) ? changes(value, base[key]) : value;
      }
    });
  }
  return changes(object, base);
}

const objectAsString = (object, string = '') => {
  const key = Object.keys(object)[0];
  const string2 = string + '.' + key;

  if (isObject(object[key]) && !isArray(object[key])) {
    return objectAsString(object[key], string2)
  } else {
    return string2
  }
}

export {
  objectAsString,
  compare,
}
