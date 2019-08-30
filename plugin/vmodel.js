const _ = require('lodash');


const reg = /[.[\]]/g;

function isValue(value) {
  const type = typeof value;
  return type === 'number' || type === 'string' || type === 'boolean';
}

function getFullKeys(keyStr) {
  const keys = keyStr.split(reg).filter(i => i.length > 0);

  if (keys.length < 1) throw 'v-model的属性为空字符串';

  let fullKeyStr = keyStr;
  let inScopedKeyStr = keyStr;

  if (keys[0] !== 'this') {
    keys.unshift('this');
    fullKeyStr = 'this.' + keyStr;
  } else {
    inScopedKeyStr = keyStr.substr(keyStr[4] === '.' ? 5 : 4);
  }

  return {
    keys,
    fullKeyStr,
    inScopedKeyStr,
  };
}

function handleSetVModelEvent(inScopedKeyStr, event) {
  let value = null;

  switch (typeof event) {
    case 'boolean':
    case 'number':
    case 'string':
      value = event;
      break;
    case 'object':
      if (event === null) {
        console.error(`没有从event中解析到有效的值 v-model="${inScopedKeyStr}" event==null`);
        return;
      }
      if (event.target) {
        value = event.target.value;
      } else {
        if (!isValue(event.value)) {
          console.error(`没有从event中解析到有效的值 v-model="${inScopedKeyStr}"`);
          return;
        }
        value = event.value;
      }
      break;
    default:
      console.error(`没有从event中解析到有效的值 v-model="${inScopedKeyStr}"`);
      return;
  }

  return _.set(this, inScopedKeyStr, value);
}

exports.getVModelValue = function getVModelValue(scope, keyStr) {
  return _.get(scope, keyStr);
};

exports.createVModelEventHandler = function createVModelEventHandler(scope, keyStr) {
  const { keys, inScopedKeyStr } = getFullKeys(keyStr);
  const eventHandlerName = '_handler_' + keys.join('_');

  if (!scope[eventHandlerName]) {
    scope[eventHandlerName] = handleSetVModelEvent.bind(scope, inScopedKeyStr);
  }

  return scope[eventHandlerName];
};
