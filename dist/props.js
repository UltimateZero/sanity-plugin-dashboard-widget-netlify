"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.props$ = void 0;

var _rxjs = require("rxjs");

var _reactPropsStream = require("react-props-stream");

var _operators = require("rxjs/operators");

var _deploy = require("./datastores/deploy");

var _reducers = require("./reducers");

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function _iterableToArrayLimit(arr, i) { if (typeof Symbol === "undefined" || !(Symbol.iterator in Object(arr))) return; var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

var noop = () => undefined;

var INITIAL_PROPS = {
  title: 'Netlify sites',
  sites: [],
  personalToken: '',
  isLoading: true,
  onDeploy: noop
}; // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types

var props$ = options => {
  var configuredSites = (options.sites || []).map(site => ({
    id: site.apiId,
    name: site.name,
    title: site.title,
    buildHookId: site.buildHookId,
    url: site.url || site.name && "https://".concat(site.name, ".netlify.app/"),
    adminUrl: site.name && "https://app.netlify.com/sites/".concat(site.name),
    personalToken: site.personalToken || options.personalToken
  }));

  var _createEventHandler = (0, _reactPropsStream.createEventHandler)(),
      _createEventHandler2 = _slicedToArray(_createEventHandler, 2),
      onDeploy$ = _createEventHandler2[0],
      onDeploy = _createEventHandler2[1];

  var setSitesAction$ = (0, _rxjs.of)(configuredSites).pipe((0, _operators.map)(sites => ({
    type: 'setSites',
    sites
  })));
  var deployAction$ = onDeploy$.pipe((0, _operators.map)(site => ({
    type: 'deploy/started',
    site
  })));
  var deployResult$ = onDeploy$.pipe((0, _operators.switchMap)(site => (0, _deploy.deploy)(site)));
  var deployCompletedAction$ = deployResult$.pipe((0, _operators.map)(result => _objectSpread({
    type: 'deploy/completed'
  }, result), (0, _operators.catchError)(error => (0, _rxjs.of)({
    type: 'deploy/failed',
    error
  }))));
  (0, _rxjs.merge)(setSitesAction$, deployAction$, deployCompletedAction$).pipe(_reducers.stateReducer$).subscribe();
  return (0, _rxjs.of)(configuredSites).pipe((0, _operators.map)(sites => ({
    sites,
    title: options.title || INITIAL_PROPS.title,
    description: options.description,
    personalToken: options.personalToken,
    isLoading: false,
    onDeploy
  })), (0, _operators.startWith)(INITIAL_PROPS));
};

exports.props$ = props$;
//# sourceMappingURL=props.js.map