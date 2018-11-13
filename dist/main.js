"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.combineMutations = exports.prepend = exports.mutate = exports.map = exports.filter = exports.direct = exports.cycle = exports.concat = exports.append = exports.prependState = exports.mutateState = exports.mapState = exports.filterState = exports.directState = exports.cycleState = exports.concatState = exports.appendState = exports.toggle = exports.increment = exports.decrement = exports.toggleState = exports.incrementState = exports.decrementState = exports.makeArgumentMutation = exports.makeStandaloneMutation = void 0;

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
      var mutation = apply(object);
      return function (state) {
        return _defineProperty({}, field, mutation(state[field]));
      };
    };
  };
};

exports.makeArgumentMutation = makeArgumentMutation;

var decrementState = function decrementState(value) {
  return value - 1;
};

exports.decrementState = decrementState;

var incrementState = function incrementState(value) {
  return value + 1;
};

exports.incrementState = incrementState;

var toggleState = function toggleState(value) {
  return !value;
};

exports.toggleState = toggleState;
var decrement = makeStandaloneMutation(decrementState);
exports.decrement = decrement;
var increment = makeStandaloneMutation(incrementState);
exports.increment = increment;
var toggle = makeStandaloneMutation(toggleState);
exports.toggle = toggle;

var appendState = function appendState(object) {
  return function (value) {
    return _toConsumableArray(value).concat([object]);
  };
};

exports.appendState = appendState;

var concatState = function concatState(object) {
  return function (value) {
    return _toConsumableArray(value).concat(_toConsumableArray(object));
  };
};

exports.concatState = concatState;

var cycleState = function cycleState(object) {
  return function (value) {
    return object[(object.indexOf(value) + 1) % object.length];
  };
};

exports.cycleState = cycleState;

var directState = function directState(object) {
  return function () {
    return object;
  };
};

exports.directState = directState;

var filterState = function filterState(callback) {
  return function (value) {
    return value.filter(callback);
  };
};

exports.filterState = filterState;

var mapState = function mapState(callback) {
  return function (value) {
    return value.map(callback);
  };
};

exports.mapState = mapState;

var mutateState = function mutateState(object) {
  return function (value) {
    return _objectSpread({}, value, object);
  };
};

exports.mutateState = mutateState;

var prependState = function prependState(object) {
  return function (value) {
    return [object].concat(_toConsumableArray(value));
  };
};

exports.prependState = prependState;
var append = makeArgumentMutation(appendState);
exports.append = append;
var concat = makeArgumentMutation(concatState);
exports.concat = concat;
var cycle = makeArgumentMutation(cycleState);
exports.cycle = cycle;
var direct = makeArgumentMutation(directState);
exports.direct = direct;
var filter = makeArgumentMutation(filterState);
exports.filter = filter;
var map = makeArgumentMutation(mapState);
exports.map = map;
var mutate = makeArgumentMutation(mutateState);
exports.mutate = mutate;
var prepend = makeArgumentMutation(prependState);
exports.prepend = prepend;

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
