"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.combineMutations = exports.toggle = exports.prepend = exports.mutate = exports.map = exports.increment = exports.filter = exports.direct = exports.decrement = exports.cycle = exports.concat = exports.append = exports.makeCallbackMutation = exports.makeArgumentMutation = exports.makeStandaloneMutation = void 0;

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; var ownKeys = Object.keys(source); if (typeof Object.getOwnPropertySymbols === 'function') { ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) { return Object.getOwnPropertyDescriptor(source, sym).enumerable; })); } ownKeys.forEach(function (key) { _defineProperty(target, key, source[key]); }); } return target; }

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance"); }

function _iterableToArray(iter) { if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var makeStandaloneMutation = function makeStandaloneMutation(apply) {
  return function (field) {
    var mutation = function mutation(state) {
      return _defineProperty({}, field, apply(state[field]));
    };

    mutation.standalone = true;
    return mutation;
  };
};

exports.makeStandaloneMutation = makeStandaloneMutation;

var makeArgumentMutation = function makeArgumentMutation(apply) {
  return function (field) {
    return function (object) {
      return function (state) {
        return _defineProperty({}, field, apply(state[field], object));
      };
    };
  };
};

exports.makeArgumentMutation = makeArgumentMutation;

var makeCallbackMutation = function makeCallbackMutation(name) {
  return makeArgumentMutation(function (value, callback) {
    return value[name](callback);
  });
};

exports.makeCallbackMutation = makeCallbackMutation;
var append = makeArgumentMutation(function (value, object) {
  return _toConsumableArray(value).concat([object]);
});
exports.append = append;
var concat = makeArgumentMutation(function (value, object) {
  return _toConsumableArray(value).concat(_toConsumableArray(object));
});
exports.concat = concat;
var cycle = makeArgumentMutation(function (value, object) {
  return object[(object.indexOf(value) + 1) % object.length];
});
exports.cycle = cycle;
var decrement = makeStandaloneMutation(function (value) {
  return value - 1;
});
exports.decrement = decrement;
var direct = makeArgumentMutation(function (value, object) {
  return object;
});
exports.direct = direct;
var filter = makeCallbackMutation("filter");
exports.filter = filter;
var increment = makeStandaloneMutation(function (value) {
  return value + 1;
});
exports.increment = increment;
var map = makeCallbackMutation("map");
exports.map = map;
var mutate = makeArgumentMutation(function (value, object) {
  return _objectSpread({}, value, object);
});
exports.mutate = mutate;
var prepend = makeArgumentMutation(function (value, object) {
  return [object].concat(_toConsumableArray(value));
});
exports.prepend = prepend;
var toggle = makeStandaloneMutation(function (value) {
  return !value;
});
exports.toggle = toggle;

var combineMutations = function combineMutations() {
  for (var _len = arguments.length, mutations = new Array(_len), _key = 0; _key < _len; _key++) {
    mutations[_key] = arguments[_key];
  }

  var normalized = mutations.map(function (mutation) {
    if (typeof mutation === "function") {
      return mutation;
    }

    var directMutation = function directMutation() {
      return mutation;
    };

    directMutation.standalone = true;
    return directMutation;
  });

  if (normalized.some(function (mutation) {
    return !mutation.standalone;
  })) {
    return function () {
      for (var _len2 = arguments.length, args = new Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
        args[_key2] = arguments[_key2];
      }

      return function (state) {
        var argIndex = -1;
        return normalized.reduce(function (nextState, mutation) {
          if (mutation.standalone) {
            return _objectSpread({}, nextState, mutation(nextState));
          }

          argIndex += 1;
          return _objectSpread({}, nextState, mutation(args[argIndex])(nextState));
        }, state);
      };
    };
  }

  return function (state) {
    return normalized.reduce(function (nextState, mutation) {
      return _objectSpread({}, nextState, mutation(nextState));
    }, state);
  };
};

exports.combineMutations = combineMutations;
