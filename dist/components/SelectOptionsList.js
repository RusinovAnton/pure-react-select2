'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _classnames = require('classnames');

var _classnames2 = _interopRequireDefault(_classnames);

var _isFunction = require('lodash/isFunction');

var _isFunction2 = _interopRequireDefault(_isFunction);

var _hasValue = require('../utils/hasValue');

var _hasValue2 = _interopRequireDefault(_hasValue);

var _events = require('../utils/events');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var SelectOptionsList = function SelectOptionsList(_ref) {
  var highlighted = _ref.highlighted,
      value = _ref.value,
      optionRenderer = _ref.optionRenderer,
      _ref$options = _ref.options,
      options = _ref$options === undefined ? [] : _ref$options,
      onSelect = _ref.onSelect;

  var optionsList = options.map(function (_ref2, i) {
    var id = _ref2.id,
        text = _ref2.text,
        isHidden = _ref2.isHidden;

    var optionText = text;

    if ((0, _isFunction2.default)(optionRenderer)) {
      optionText = optionRenderer({ id: id, text: text, isHidden: isHidden });
    } else if (isHidden) {
      return null;
    }

    var isSelected = (0, _hasValue2.default)(value) && value === id;
    var optionClassName = (0, _classnames2.default)('PureReactSelect__option', {
      'PureReactSelect__option--selected': isSelected,
      'PureReactSelect__option--highlighted': i === highlighted
    });

    var onOptionSelect = isSelected ? null : onSelect.bind(null, id);

    return _react2.default.createElement(
      'li',
      { key: id,
        'data-id': id,
        className: optionClassName,
        onClick: (0, _events.stopPropagation)(onOptionSelect) },
      optionText
    );
  });

  return _react2.default.createElement(
    'ul',
    { className: 'PureReactSelect__options-list' },
    optionsList
  );
};

SelectOptionsList.propTypes = {
  highlighted: _react.PropTypes.number,
  onSelect: _react.PropTypes.func.isRequired,
  options: _react.PropTypes.array.isRequired,
  value: _react.PropTypes.string
};

exports.default = SelectOptionsList;