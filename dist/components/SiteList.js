"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = SiteList;

var _react = _interopRequireDefault(require("react"));

var _SiteItem = _interopRequireDefault(require("./SiteItem"));

var _ui = require("@sanity/ui");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function SiteList(props) {
  var isLoading = props.isLoading,
      onDeploy = props.onDeploy,
      sites = props.sites,
      personalToken = props.personalToken;

  if (isLoading) {
    return /*#__PURE__*/_react.default.createElement(_ui.Card, {
      padding: 4
    }, /*#__PURE__*/_react.default.createElement(_ui.Flex, {
      direction: "column",
      justify: "center",
      align: "center"
    }, /*#__PURE__*/_react.default.createElement(_ui.Spinner, {
      muted: true
    }), /*#__PURE__*/_react.default.createElement(_ui.Box, {
      marginTop: 3
    }, /*#__PURE__*/_react.default.createElement(_ui.Text, {
      muted: true
    }, "Loading sites\u2026"))));
  }

  if (!sites || sites && sites.length === 0) {
    return /*#__PURE__*/_react.default.createElement(_ui.Card, {
      tone: "critical",
      padding: 3
    }, /*#__PURE__*/_react.default.createElement(_ui.Text, null, "No sites are defined in the widget options. Please check your config."));
  }

  return /*#__PURE__*/_react.default.createElement(_ui.Box, {
    paddingY: 2
  }, /*#__PURE__*/_react.default.createElement(_ui.Stack, {
    as: "ul",
    space: 2
  }, sites.map((site, index) => {
    return /*#__PURE__*/_react.default.createElement(_SiteItem.default, {
      onDeploy: onDeploy,
      site: site,
      personalToken: personalToken || site.personalToken,
      key: "site-".concat(index)
    });
  })));
}
//# sourceMappingURL=SiteList.js.map