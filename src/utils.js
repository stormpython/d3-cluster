function isArray(o) {
  return Array.isArray(o);
}

function isPlainObject(o) {
  return !isArray(o) && typeof o === 'object';
}

function isEqualArray(target, source) {
  return target.every(function (o, i) {
    if (isPlainObject(o)) {
      return isEqualObject(o, source[i]);
    }
    if (isArray(o)) {
      return isEqualArray(o, source[i]);
    }
    return o === source[i];
  });
}

function isEqualObject(target, source) {
  return Object.keys(target).every(function (key) {
    return target[key] === source[key];
  });
}

function isEqual(target, source) {
  if (isArray(target) && isArray(source)) {
    return isEqualArray(target, source);
  }

  if (isPlainObject(target) && isPlainObject(source)) {
    return isEqualObject(target, source);
  }

  return target === source;
}

function cloneArray(source) {
  var target = [];

  source.forEach(function (o) {
    if (typeof o === 'object') {
      if (isArray(o)) {
        target.push(cloneArray(o));
      } else {
        target.push(Object.assign({}, o));
      }
    } else {
      target.push(o);
    }
  });

  return target;
}

function cloneDeep(source) {
  if (isArray(source)) {
    return cloneArray(source);
  }

  if (isPlainObject(source)) {
    return Object.assign({}, source);
  }

  return source;
}

export { cloneDeep, isArray, isPlainObject, isEqual };
