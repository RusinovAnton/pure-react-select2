'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Select = undefined;

var _jsx = function () { var REACT_ELEMENT_TYPE = typeof Symbol === "function" && Symbol.for && Symbol.for("react.element") || 0xeac7; return function createRawReactElement(type, props, key, children) { var defaultProps = type && type.defaultProps; var childrenLength = arguments.length - 3; if (!props && childrenLength !== 0) { props = {}; } if (props && defaultProps) { for (var propName in defaultProps) { if (props[propName] === void 0) { props[propName] = defaultProps[propName]; } } } else if (!props) { props = defaultProps || {}; } if (childrenLength === 1) { props.children = children; } else if (childrenLength > 1) { var childArray = Array(childrenLength); for (var i = 0; i < childrenLength; i++) { childArray[i] = arguments[i + 3]; } props.children = childArray; } return { $$typeof: REACT_ELEMENT_TYPE, type: type, key: key === undefined ? null : '' + key, ref: null, props: props, _owner: null }; }; }();

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _classnames = require('classnames');

var _classnames2 = _interopRequireDefault(_classnames);

var _debounce = require('lodash/debounce');

var _debounce2 = _interopRequireDefault(_debounce);

var _isEqual = require('lodash/isEqual');

var _isEqual2 = _interopRequireDefault(_isEqual);

var _isFunction = require('lodash/isFunction');

var _isFunction2 = _interopRequireDefault(_isFunction);

var _isNil = require('lodash/isNil');

var _isNil2 = _interopRequireDefault(_isNil);

var _keys = require('lodash/keys');

var _keys2 = _interopRequireDefault(_keys);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _reactClickOutside = require('react-click-outside');

var _reactClickOutside2 = _interopRequireDefault(_reactClickOutside);

var _qs = require('qs');

var _qs2 = _interopRequireDefault(_qs);

var _uniqueId = require('lodash/uniqueId');

var _uniqueId2 = _interopRequireDefault(_uniqueId);

var _fetch = require('../utils/fetch');

var _fetch2 = _interopRequireDefault(_fetch);

var _makeString = require('../utils/makeString');

var _makeString2 = _interopRequireDefault(_makeString);

var _selectPropTypes = require('../utils/selectPropTypes');

var _selectPropTypes2 = _interopRequireDefault(_selectPropTypes);

var _consts = require('../consts');

var _SelectError = require('./SelectError');

var _SelectError2 = _interopRequireDefault(_SelectError);

var _SelectOptionsList = require('./SelectOptionsList');

var _SelectOptionsList2 = _interopRequireDefault(_SelectOptionsList);

var _SelectSearchInput = require('./SelectSearchInput');

var _SelectSearchInput2 = _interopRequireDefault(_SelectSearchInput);

var _SelectSelection = require('./SelectSelection');

var _SelectSelection2 = _interopRequireDefault(_SelectSelection);

var _SelectStatus = require('./SelectStatus');

var _SelectStatus2 = _interopRequireDefault(_SelectStatus);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

// TODO: styles
// TODO: multiselect
// TODO: label
// TODO: optgroups
// TODO: make separate modules for simple, fetch once, fetch on search, multiselect etc
var Select = exports.Select = function (_Component) {
  _inherits(Select, _Component);

  _createClass(Select, [{
    key: 'clear',
    value: function clear() {
      this._onClearSelection();
    }
  }, {
    key: 'selectNode',
    get: function get() {
      return this.refs.selectContainer;
    }

    // @fixme: getChildrenTextContent function is not perfect tbh

  }, {
    key: 'value',
    get: function get() {
      var selectedOption = this.state.selectedOption;


      return selectedOption ? selectedOption.id : null;
    }
  }, {
    key: 'options',
    get: function get() {
      return this.state.options;
    }
  }]);

  function Select(props, context) {
    _classCallCheck(this, Select);

    var _this = _possibleConstructorReturn(this, (Select.__proto__ || Object.getPrototypeOf(Select)).call(this, props, context)); // eslint-disable-line consistent-return


    _initialiseProps.call(_this);

    var onArrowUp = _this._setHighlightedOption.bind(null, -1);
    var onArrowDown = _this._setHighlightedOption.bind(null, 1);

    _this.KEY_FUNCTIONS = {
      ArrowUp: onArrowUp,
      38: onArrowUp,
      ArrowDown: onArrowDown,
      40: onArrowDown,
      Enter: _this._selectHighlighted,
      13: _this._selectHighlighted,
      ' ': _this._selectHighlighted, // 'Space' key
      32: _this._selectHighlighted, // 'Space' key
      Escape: _this._closeDropdown,
      27: _this._closeDropdown
    };
    _this.state = {};

    var children = props.children,
        disabled = props.disabled,
        error = props.error,
        options = props.options,
        request = props.request;


    if (request && typeof request.endpoint !== 'string') {
      throw new Error('Request endpoint must be a string.');
    }

    /**
     * @var {boolean} does select need to send request for options on searchTermChange
     */
    var requestSearch = request && !request.once;

    if (requestSearch) {
      var requestDelay = request && request.delay ? request.delay : 500;

      _this._requestOptions = (0, _debounce2.default)(_this._request, requestDelay);
    } else {
      _this._requestOptions = _this._request;
    }

    /**
     * @type {{
         *  dropdownOpened: boolean,
         *  error: string|boolean,
         *  highlighted: {id, index},
         *  isPending: boolean,
         *  options: array,
         *  requestSearch: boolean
         *  searchTerm: string,
         *  value: string,
         * }}
     */
    _this.state = Object.assign(Select.initialState(), {
      disabled: disabled,
      error: error,
      options: _this._setOptions(options, children),
      requestSearch: requestSearch,
      value: _this._setValue()
    });

    _this.language = _this._composeLanguageObject();
    return _this;
  }

  _createClass(Select, [{
    key: 'componentWillReceiveProps',
    value: function componentWillReceiveProps(newProps) {
      var _this2 = this;

      var disabled = newProps.disabled,
          error = newProps.error,
          options = newProps.options,
          children = newProps.children,
          value = newProps.value;

      var isValueValid = this._isValidValue(value);

      if (isValueValid && typeof newProps.onSelect === 'undefined' && typeof this.props.onSelect === 'undefined') {
        /* eslint-disable */
        console.warn('Warning: You\'re setting value for Select component throught props\n                but not passing onSelect callback which can lead to unforeseen consequences(bugs).\n                Please consider using onSelect callback or defaultValue instead of value');
        /* eslint-enable */
      }

      if (disabled) {
        this._closeDropdown();
      }

      this.setState(function (state) {
        var newValue = state.value;

        if (isValueValid) {
          newValue = (0, _makeString2.default)(value);
        }

        return {
          disabled: disabled,
          options: _this2._setOptions(options, children),
          value: newValue,
          error: !(0, _isNil2.default)(error) ? error : state.error
        };
      });
    }

    /**
     * Close SelectDropdown on click outside using 'react-click-outside' library
     */


    /**
     * Handle keyboard controls
     * @param {object} event
     */


    /**
     * Setting selected value
     * @param {object} option - option object from data array
     */


    /**
     * Handle option selection via user click
     * @param {number} id - options id
     */

    /**
     * Set next highlighted option via 'ArrowUp' or 'ArrowDown' key
     * @param {number} direction (can be -1 or 1)
     */


    /**
     * Select current highlighted option
     */
    // @fixme: selects invalid option when options list filtered by searchTerm

  }, {
    key: 'render',
    value: function render() {
      var _props = this.props,
          width = _props.layout.width,
          placeholder = _props.placeholder;
      var _state = this.state,
          disabled = _state.disabled,
          dropdownOpened = _state.dropdownOpened,
          error = _state.error,
          value = _state.value;

      var selectedOption = this._getOptionById(value);

      return _react2.default.createElement(
        'span',
        { ref: 'selectContainer',
          className: this._getSelectContainerClassName(),
          style: { width: width },
          disabled: disabled,
          tabIndex: '1',
          role: 'combobox',
          onClick: this._onContainerClick,
          onKeyDown: this._onContainerKeyDown },
        _react2.default.createElement(_SelectSelection2.default, {
          clearable: this._isClearable(),
          onClearSelection: this._onClearSelection,
          placeholder: placeholder,
          selection: selectedOption && selectedOption.text
        }),
        dropdownOpened ? this._renderSelectDropdown() : _jsx(_SelectError2.default, {
          error: error
        })
      );
    }
  }]);

  return Select;
}(_react.Component);

Select.defaultProps = {
  allowClear: false,
  disabled: false,
  layout: {
    dropdownHorizontalPosition: 'left',
    dropdownVerticalPosition: 'below',
    width: '245px'
  },
  name: (0, _uniqueId2.default)('reactSelect_'),
  options: null,
  search: {
    minimumResults: 20,
    minLength: 3
  }
};

Select.initialState = function () {
  return {
    disabled: false,
    dropdownOpened: false,
    error: null,
    highlighted: null,
    isPending: false,
    options: [],
    requestSearch: false,
    searchTerm: '',
    value: null
  };
};

Select.getChildrenTextContent = function (element) {
  if (typeof element === 'string') {
    return element;
  }

  return Select.getChildrenTextContent(_react.Children.toArray(element)[0].props.children);
};

Select.makeHighlightedObject = function (index, options) {
  return { id: options[index].id, index: index };
};

var _initialiseProps = function _initialiseProps() {
  var _this3 = this;

  this.shouldComponentUpdate = function (_ref, nextState) {
    var error = _ref.error,
        disabled = _ref.disabled,
        value = _ref.value,
        children = _ref.children;
    return error !== _this3.props.error || disabled !== _this3.props.disabled || value !== _this3.state.value || !(0, _isEqual2.default)(children, _this3.props.children) || !(0, _isEqual2.default)(nextState, _this3.state);
  };

  this.componentDidMount = function () {
    var _props2 = _this3.props,
        autoFocus = _props2.autoFocus,
        request = _props2.request;


    if (autoFocus) _this3._focusContainer();
    if (request && request.once) _this3._requestOptions();
  };

  this.componentWillUnmount = function () {
    if (_this3.state.requestSearch) {
      _this3._requestOptions.cancel();
    }
  };

  this.handleClickOutside = function () {
    _this3._closeDropdown();
  };

  this._isValidValue = function (value) {
    var options = _this3.state.options;

    var isValid = false;

    if (typeof value === 'undefined') {
      isValid = false;
    } else if (value === null) {
      isValid = true;
    } else if (options && options.length) {
      isValid = options.some(function (_ref2) {
        var id = _ref2.id;
        return id === String(value);
      });
    }

    return isValid;
  };

  this._composeLanguageObject = function () {
    var _props3 = _this3.props,
        language = _props3.language,
        search = _props3.search;

    var minLength = search && search.minLength || 3;

    var lang = Object.assign({}, _consts.DEFAULT_LANG, language);

    lang.minLength = lang.minLength.replace(/\$\{minLength\}/, minLength);

    return lang;
  };

  this._hasResponseDataFormatter = function () {
    var request = _this3.props.request;

    // Caching result of calculation of isFunction

    if (typeof _this3.hasResponseDataFormatter === 'undefined') {
      _this3.hasResponseDataFormatter = request && (0, _isFunction2.default)(request.responseDataFormatter);
    }

    return _this3.hasResponseDataFormatter;
  };

  this._hasSearchTermChangeCallback = function () {
    var onSearchTermChange = _this3.props.onSearchTermChange;


    if (typeof _this3.hasSearchTermChangeCallback === 'undefined') {
      _this3.hasSearchTermChangeCallback = onSearchTermChange && (0, _isFunction2.default)(onSearchTermChange);
    }

    return _this3.hasSearchTermChangeCallback;
  };

  this._request = function (searchTerm) {
    var _props$request = _this3.props.request,
        ajaxClient = _props$request.ajaxClient,
        endpoint = _props$request.endpoint,
        params = _props$request.params,
        responseDataFormatter = _props$request.responseDataFormatter,
        termQuery = _props$request.termQuery;


    function composeFetchPath(endpoint) {
      var params = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
      var _ref3 = arguments[2];
      var searchTerm = _ref3.searchTerm,
          termQuery = _ref3.termQuery;

      var fetchPath = void 0;
      var fetchParams = Object.assign({}, params);

      if (searchTerm) {
        if (!termQuery) throw new Error('Provide request.termQuery prop');
        fetchParams = Object.assign(fetchParams, _defineProperty({}, termQuery, searchTerm));
      }

      if ((0, _keys2.default)(fetchParams)) {
        fetchPath = _path2.default.join(endpoint, '?' + _qs2.default.stringify(fetchParams));
      }

      return fetchPath;
    }

    var fetchClient = ajaxClient || _fetch2.default;
    var fetchPath = composeFetchPath(endpoint, params, { searchTerm: searchTerm, termQuery: termQuery });

    _this3.setState({
      error: _this3.props.error || null,
      isPending: true
    });

    fetchClient(fetchPath).then(function (data) {
      var options = data;
      if (_this3._hasResponseDataFormatter()) {
        options = data.map(responseDataFormatter);
      }

      _this3.setState({
        options: _this3._setOptions(options),
        isPending: false
      });
    }).catch(function (error) {
      _this3.setState({
        error: error.message || true,
        isPending: false
      });
    });
  };

  this._openDropdown = function () {
    _this3.setState({ dropdownOpened: true });
  };

  this._closeDropdown = function () {
    _this3.setState({
      dropdownOpened: false,
      highlighted: null
    });
  };

  this._focusContainer = function () {
    var x = window.scrollX;
    var y = window.scrollY;

    window.scrollTo(x, y);
    if (_this3.refs.selectContainer) {
      _this3.refs.selectContainer.focus();
    }
  };

  this._setValue = function () {
    var _props4 = _this3.props,
        value = _props4.value,
        defaultValue = _props4.defaultValue;


    if (value === null) {
      return null;
    }

    return (0, _makeString2.default)(value || defaultValue);
  };

  this._makeOption = function (id, text) {
    if (!((typeof id === 'string' || typeof id === 'number') && (typeof text === 'string' || typeof text === 'number'))) {
      throw new Error('Options array is not formatted properly, option object must have "id" and "text"');
    }

    return { id: String(id), text: text };
  };

  this._setOptions = function (options, children) {
    var stateOptions = _this3.state.options || [];

    if (Array.isArray(options) && options.length) {
      stateOptions = options.map(function (_ref4) {
        var id = _ref4.id,
            text = _ref4.text;
        return _this3._makeOption(id, text);
      });
    } else if (_react.Children.count(children)) {
      stateOptions = _react.Children.toArray(children).filter(function (_ref5) {
        var type = _ref5.type;
        return type === 'option';
      }).map(function (_ref6) {
        var _ref6$props = _ref6.props,
            text = _ref6$props.children,
            id = _ref6$props.value;
        return _this3._makeOption(id, text);
      });
    }

    return stateOptions;
  };

  this._getOptionById = function (value) {
    var options = _this3.state.options;


    if (options && options.length) {
      return options.find(function (_ref7) {
        var id = _ref7.id;
        return id === value;
      }); // eslint-disable-line eqeqeq
    }

    return null;
  };

  this._onContainerClick = function () {
    if (_this3.state.disabled) {
      return;
    }

    if (_this3.state.dropdownOpened) {
      _this3._closeDropdown();
    } else {
      _this3._openDropdown();
    }
  };

  this._onContainerKeyDown = function (event) {
    if (_this3.props.disabled) return;

    var key = event.key || event.keyCode;
    if (!_this3.KEY_FUNCTIONS[key]) return;

    event.preventDefault();
    // Handle key click
    _this3.KEY_FUNCTIONS[key]();
  };

  this._onClearSelection = function () {
    // Dont clear when disabled && dont fire extra event when value is already cleared
    if (!_this3.state.disabled && _this3.state.value !== null) {
      _this3._onSelect(null);
    }
  };

  this._onSelect = function (option) {
    var _props5 = _this3.props,
        name = _props5.name,
        onSelect = _props5.onSelect;
    // Setup structure of selection event

    var value = option ? option.id : null;
    var selectionEvent = {
      type: 'select',
      target: {
        name: name,
        option: option,
        value: value
      }
    };

    _this3.setState({ value: value }, function () {
      if ((0, _isFunction2.default)(onSelect)) {
        onSelect(selectionEvent);
      }
    });

    _this3._closeDropdown();
    _this3._focusContainer();
  };

  this._onSelectOption = function (id) {
    // Get selected option and pass it into onSelect method for further processing
    var selectedOption = _this3._getOptionById(id);

    _this3._onSelect(selectedOption);
  };

  this._hasHighlighted = function () {
    var highlighted = _this3.state.highlighted;


    return !!highlighted && typeof highlighted.index !== 'undefined';
  };

  this._setHighlightedOption = function (direction) {
    _this3.setState(function (_ref8) {
      var disabled = _ref8.disabled,
          highlighted = _ref8.highlighted,
          dropdownOpened = _ref8.dropdownOpened;

      var options = _this3._getOptionsList();

      // do nothing if disabled or there are no options
      if (disabled || !options || !options.length) return;

      var optionsLength = options.length - 1;
      var hasHighlighted = _this3._hasHighlighted();
      var nextHighlighted = hasHighlighted ? highlighted.index + direction : 0;
      var highlightIndex = void 0;

      // TODO: scroll SelectDropdown block to show highlighted item when overflows
      // If dropdown not opened or there is no highlighted item yet
      if (!dropdownOpened || !hasHighlighted
      // highlight first option after click 'ArrowDown' on the last one
      || nextHighlighted > optionsLength) {
        highlightIndex = 0;
      } else if (nextHighlighted < 0) {
        // Highlight last option after click 'ArrowUp' on the first one
        highlightIndex = optionsLength;
      } else {
        // Highlight next option
        highlightIndex = nextHighlighted;
      }

      return { // eslint-disable-line consistent-return
        dropdownOpened: true,
        highlighted: Select.makeHighlightedObject(highlightIndex, options)
      };
    });
  };

  this._selectHighlighted = function () {
    var _state2 = _this3.state,
        options = _state2.options,
        highlighted = _state2.highlighted,
        dropdownOpened = _state2.dropdownOpened;

    // If dropdown not opened or there is no highlighted item yet

    if (!dropdownOpened || !_this3._hasHighlighted()) {
      // Open dropdown and hightlight first item
      _this3.setState({
        dropdownOpened: true,
        highlighted: Select.makeHighlightedObject(0, _this3._getOptionsList())
      });
    } else {
      // Select highlighted item
      _this3._onSelect(options.find(function (_ref9) {
        var id = _ref9.id;
        return id === highlighted.id;
      }));
    }
  };

  this._getSelectContainerClassName = function () {
    var _props6 = _this3.props,
        className = _props6.className,
        disabled = _props6.disabled,
        _props6$layout = _props6.layout,
        dropdownHorizontalPosition = _props6$layout.dropdownHorizontalPosition,
        dropdownVerticalPosition = _props6$layout.dropdownVerticalPosition,
        error = _props6.error;
    var _state3 = _this3.state,
        dropdownOpened = _state3.dropdownOpened,
        isPending = _state3.isPending,
        value = _state3.value;


    return (0, _classnames2.default)('PureReactSelect__container ' + (className || ''), {
      'PureReactSelect--above': dropdownVerticalPosition === 'above',
      'PureReactSelect--below': dropdownVerticalPosition !== 'above',
      'PureReactSelect--disabled': disabled,
      'PureReactSelect--error': error,
      'PureReactSelect--left': dropdownHorizontalPosition !== 'right',
      'PureReactSelect--open': dropdownOpened,
      'PureReactSelect--pending': isPending,
      'PureReactSelect--right': dropdownHorizontalPosition === 'right',
      'PureReactSelect--selected': !(0, _isNil2.default)(value)
    });
  };

  this._isClearable = function () {
    var allowClear = _this3.props.allowClear;
    var value = _this3.state.value;


    return allowClear && !(0, _isNil2.default)(value);
  };

  this._getOptionsList = function () {
    var _state4 = _this3.state,
        options = _state4.options,
        searchTerm = _state4.searchTerm;

    var optionsList = options || [];

    if (searchTerm && optionsList.length) {
      (function () {
        var searchRegExp = new RegExp(searchTerm, 'gi');

        optionsList = options.filter(function (_ref10) {
          var text = _ref10.text;
          return searchRegExp.test(text);
        });
      })();
    }

    return optionsList;
  };

  this._onSearchTermChange = function (e) {
    var term = e.target.value;
    var _props7 = _this3.props,
        _props7$search$minLen = _props7.search.minLength,
        minLength = _props7$search$minLen === undefined ? 3 : _props7$search$minLen,
        onSearchTermChange = _props7.onSearchTermChange;
    var requestSearch = _this3.state.requestSearch;

    // If size of text is increases
    // const isTextIncreasing = term && (!stateSearchTerm || term.length > stateSearchTerm.length)

    var searchTerm = term || '';

    // if callback were passed in props
    if (_this3._hasSearchTermChangeCallback()) {
      onSearchTermChange(e);
    }

    // If requestSearch enabled
    if (searchTerm && searchTerm.length >= minLength && requestSearch) {
      _this3._requestOptions(searchTerm);
    }

    _this3.setState({ searchTerm: searchTerm });
  };

  this._renderSelectDropdown = function () {
    var _props8 = _this3.props,
        search = _props8.search,
        optionRenderer = _props8.optionRenderer;
    var _state5 = _this3.state,
        highlighted = _state5.highlighted,
        isPending = _state5.isPending,
        options = _state5.options,
        requestSearch = _state5.requestSearch,
        searchTerm = _state5.searchTerm,
        value = _state5.value;

    var showSearch = requestSearch || search.minimumResults <= options.length;

    return _jsx('span', {
      className: 'PureReactSelect__dropdown'
    }, void 0, showSearch && _jsx(_SelectSearchInput2.default, {
      value: searchTerm,
      onKeyDown: _this3._onContainerKeyDown,
      onChange: _this3._onSearchTermChange
    }), _react2.default.createElement(_SelectStatus2.default, { isPending: isPending, language: _this3.language || {} }), !!options.length && _react2.default.createElement(_SelectOptionsList2.default, {
      highlighted: highlighted && highlighted.id,
      onSelect: _this3._onSelectOption,
      optionRenderer: optionRenderer,
      options: _this3._getOptionsList(),
      value: value
    }));
  };
};

exports.default = (0, _reactClickOutside2.default)(Select);