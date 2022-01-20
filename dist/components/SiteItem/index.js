"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = exports.COMMIT_PULL_INTERVAL = exports.IMAGE_PULL_INTERVAL = void 0;

var _react = _interopRequireWildcard(require("react"));

var _ui = require("@sanity/ui");

var _Links = _interopRequireDefault(require("./Links"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function _getRequireWildcardCache() { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function _iterableToArrayLimit(arr, i) { if (typeof Symbol === "undefined" || !(Symbol.iterator in Object(arr))) return; var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

var IMAGE_PULL_INTERVAL = 10000;
exports.IMAGE_PULL_INTERVAL = IMAGE_PULL_INTERVAL;
var COMMIT_PULL_INTERVAL = 60000;
exports.COMMIT_PULL_INTERVAL = COMMIT_PULL_INTERVAL;

var getCommit = (siteId, personalToken) => {
  var commitResult = {
    commitRef: '',
    updatedAt: ''
  };
  if (!personalToken) return new Promise(resolve => resolve(commitResult));
  var url = "https://api.netlify.com/api/v1/sites/".concat(siteId, "/deploys");
  var headers = {
    authorization: "Bearer ".concat(personalToken)
  };
  return fetch(url, {
    method: 'get',
    headers
  }).then(resp => {
    return resp.json().then(json => {
      var latestCommit = json.find(deploy => !!deploy.commit_ref);
      var latestDeploy = json[0];
      var timestamp = new Date(latestDeploy.updated_at);
      commitResult = {
        commitRef: latestCommit.commit_ref.substr(0, 7),
        updatedAt: timestamp.toLocaleString()
      };
      return commitResult;
    });
  });
};

var getImageUrl = siteId => {
  var baseUrl = "https://api.netlify.com/api/v1/badges/".concat(siteId, "/deploy-status");
  var time = new Date().getTime();
  return "".concat(baseUrl, "?").concat(time);
};

var useBadgeImage = siteId => {
  var _useState = (0, _react.useState)(() => getImageUrl(siteId)),
      _useState2 = _slicedToArray(_useState, 2),
      src = _useState2[0],
      setSrc = _useState2[1];

  var update = (0, _react.useCallback)(() => setSrc(getImageUrl(siteId)), [siteId]);
  (0, _react.useEffect)(() => {
    var interval = window.setInterval(update, IMAGE_PULL_INTERVAL);
    return () => window.clearInterval(interval);
  }, [update]);
  return [src, update];
};

var useCommit = (siteId, personalToken) => {
  if (!personalToken) return [];

  var _useState3 = (0, _react.useState)({
    commitRef: '',
    updatedAt: ''
  }),
      _useState4 = _slicedToArray(_useState3, 2),
      commit = _useState4[0],
      setCommit = _useState4[1];

  var update = (0, _react.useCallback)( /*#__PURE__*/_asyncToGenerator(function* () {
    return getCommit(siteId, personalToken).then(resp => {
      if (!resp.commitRef) return;
      setCommit(resp);
    });
  }), [siteId, personalToken]);
  (0, _react.useEffect)(() => {
    var interval = window.setInterval(update, COMMIT_PULL_INTERVAL);
    return () => window.clearInterval(interval);
  }, [update]);
  return [commit, update];
};

var useDeploy = (site, onDeploy, updateBadge, updateCommit) => {
  var timeoutRef = (0, _react.useRef)(-1);
  (0, _react.useEffect)(() => () => window.clearTimeout(timeoutRef.current), []);
  var timeoutCommitRef = (0, _react.useRef)(-1);
  (0, _react.useEffect)(() => () => window.clearTimeout(timeoutCommitRef.current), []);
  return (0, _react.useCallback)(() => {
    onDeploy(site);
    timeoutRef.current = window.setTimeout(() => {
      updateBadge();
      updateCommit();
    }, 1000);
  }, [site, onDeploy, updateBadge, updateCommit]);
};

var SiteItem = props => {
  var _useState5 = (0, _react.useState)(false),
      _useState6 = _slicedToArray(_useState5, 2),
      hasBadgeError = _useState6[0],
      setHasBadgeError = _useState6[1];

  var site = props.site,
      onDeploy = props.onDeploy,
      personalToken = props.personalToken;
  var id = site.id,
      name = site.name,
      title = site.title,
      url = site.url,
      adminUrl = site.adminUrl,
      buildHookId = site.buildHookId;

  var _useBadgeImage = useBadgeImage(id),
      _useBadgeImage2 = _slicedToArray(_useBadgeImage, 2),
      badge = _useBadgeImage2[0],
      updateBadge = _useBadgeImage2[1];

  var _useCommit = useCommit(id, personalToken),
      _useCommit2 = _slicedToArray(_useCommit, 2),
      commit = _useCommit2[0],
      updateCommit = _useCommit2[1];

  var handleDeploy = useDeploy(site, onDeploy, updateBadge, updateCommit);

  var handleBadgeError = () => {
    setHasBadgeError(true);
  };

  (0, _react.useEffect)(() => {
    var fetchCommit = /*#__PURE__*/function () {
      var _ref2 = _asyncToGenerator(function* () {
        return updateCommit();
      });

      return function fetchCommit() {
        return _ref2.apply(this, arguments);
      };
    }();

    fetchCommit();
  }, [updateCommit]);
  return /*#__PURE__*/_react.default.createElement(_ui.Flex, {
    as: "li"
  }, /*#__PURE__*/_react.default.createElement(_ui.Box, {
    flex: 1,
    paddingY: 2,
    paddingX: 3
  }, /*#__PURE__*/_react.default.createElement(_ui.Stack, {
    space: 3
  }, /*#__PURE__*/_react.default.createElement(_ui.Text, {
    as: "h4"
  }, title || name, /*#__PURE__*/_react.default.createElement(_Links.default, {
    url: url,
    adminUrl: adminUrl
  })), commit.commitRef ? /*#__PURE__*/_react.default.createElement(_react.default.Fragment, null, /*#__PURE__*/_react.default.createElement(_ui.Text, {
    as: "span"
  }, "\xA0Commit: ", /*#__PURE__*/_react.default.createElement("strong", null, commit.commitRef)), /*#__PURE__*/_react.default.createElement(_ui.Text, {
    as: "span"
  }, "\xA0Last deploy was on (", commit.updatedAt, ")")) : null, /*#__PURE__*/_react.default.createElement(_ui.Flex, {
    justify: "flex-start"
  }, !hasBadgeError && /*#__PURE__*/_react.default.createElement("img", {
    src: badge,
    onError: handleBadgeError,
    alt: "Badge"
  }), hasBadgeError && /*#__PURE__*/_react.default.createElement(_ui.Card, {
    tone: "critical",
    radius: 2,
    padding: 2
  }, /*#__PURE__*/_react.default.createElement(_ui.Label, {
    size: 0,
    muted: true
  }, "Failed to load badge"))))), buildHookId ? /*#__PURE__*/_react.default.createElement(_ui.Box, {
    paddingY: 2,
    paddingX: 3
  }, /*#__PURE__*/_react.default.createElement(_ui.Button, {
    mode: "ghost",
    onClick: handleDeploy,
    text: "Deploy"
  })) : null);
};

var _default = SiteItem;
exports.default = _default;
//# sourceMappingURL=index.js.map