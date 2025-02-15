"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _react = _interopRequireDefault(require("react"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Link = props => {
  var url = props.url,
      children = props.children;
  return /*#__PURE__*/_react.default.createElement("span", null, /*#__PURE__*/_react.default.createElement("a", {
    href: url,
    target: "_blank"
  }, children));
};

var Links = props => {
  var url = props.url,
      adminUrl = props.adminUrl;

  if (url && adminUrl) {
    return /*#__PURE__*/_react.default.createElement("span", null, "(", /*#__PURE__*/_react.default.createElement(Link, {
      url: url
    }, "view"), ", ", /*#__PURE__*/_react.default.createElement(Link, {
      url: adminUrl
    }, "admin"), ")");
  }

  if (url) {
    return /*#__PURE__*/_react.default.createElement(Link, {
      url: url
    }, "(view)");
  }

  if (adminUrl) {
    return /*#__PURE__*/_react.default.createElement(Link, {
      url: adminUrl
    }, "(admin)");
  }

  return null;
};

var _default = Links;
exports.default = _default;
//# sourceMappingURL=Links.js.map