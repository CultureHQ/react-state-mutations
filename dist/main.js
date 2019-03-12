"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.combineMutations = exports.useCycle = exports.usePrepend = exports.useMap = exports.useFilter = exports.useConcat = exports.useAppend = exports.prepend = exports.mutate = exports.map = exports.filter = exports.direct = exports.cycle = exports.concat = exports.append = exports.prependState = exports.mutateState = exports.mapState = exports.filterState = exports.directState = exports.cycleState = exports.concatState = exports.appendState = exports.useToggle = exports.useIncrement = exports.useDecrement = exports.toggle = exports.increment = exports.decrement = exports.toggleState = exports.incrementState = exports.decrementState = exports.makeArgumentHook = exports.makeArgumentMutation = exports.makeStandaloneHook = exports.makeStandaloneMutation = void 0;

var _react = require("react");

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; var ownKeys = Object.keys(source); if (typeof Object.getOwnPropertySymbols === 'function') { ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) { return Object.getOwnPropertyDescriptor(source, sym).enumerable; })); } ownKeys.forEach(function (key) { _defineProperty(target, key, source[key]); }); } return target; }

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance"); }

function _iterableToArray(iter) { if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } }

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance"); }

function _iterableToArrayLimit(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

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

var makeStandaloneHook = function makeStandaloneHook(apply, defaultValue) {
  return function () {
    var initialValue = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : defaultValue;

    var _useState = (0, _react.useState)(initialValue),
        _useState2 = _slicedToArray(_useState, 2),
        value = _useState2[0],
        setValue = _useState2[1];

    var onMutate = (0, _react.useCallback)(function () {
      return setValue(apply);
    }, [setValue]);
    return [value, onMutate];
  };
};

exports.makeStandaloneHook = makeStandaloneHook;

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

var makeArgumentHook = function makeArgumentHook(apply, defaultValue) {
  return function () {
    var initialValue = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : defaultValue;

    var _useState3 = (0, _react.useState)(initialValue),
        _useState4 = _slicedToArray(_useState3, 2),
        value = _useState4[0],
        setValue = _useState4[1];

    var onMutate = (0, _react.useCallback)(function (object) {
      return setValue(apply(object));
    }, [setValue]);
    return [value, onMutate];
  };
};

exports.makeArgumentHook = makeArgumentHook;

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
var useDecrement = makeStandaloneHook(decrementState, 0);
exports.useDecrement = useDecrement;
var useIncrement = makeStandaloneHook(incrementState, 0);
exports.useIncrement = useIncrement;
var useToggle = makeStandaloneHook(toggleState, true);
exports.useToggle = useToggle;

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
var useAppend = makeArgumentHook(appendState, []);
exports.useAppend = useAppend;
var useConcat = makeArgumentHook(concatState, []);
exports.useConcat = useConcat;
var useFilter = makeArgumentHook(filterState, []);
exports.useFilter = useFilter;
var useMap = makeArgumentHook(mapState, []);
exports.useMap = useMap;
var usePrepend = makeArgumentHook(prependState, []);
exports.usePrepend = usePrepend;

var useCycle = function useCycle(object) {
  var _useState5 = (0, _react.useState)(object[0]),
      _useState6 = _slicedToArray(_useState5, 2),
      value = _useState6[0],
      setValue = _useState6[1];

  var cycleValue = (0, _react.useCallback)(cycleState(object), [object]);
  var onCycle = (0, _react.useCallback)(function () {
    return setValue(cycleValue);
  }, [cycleValue]);
  return [value, onCycle];
};

exports.useCycle = useCycle;

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
