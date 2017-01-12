'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _classnames = require('classnames');

var _classnames2 = _interopRequireDefault(_classnames);

var _fetch = require('../utils/fetch');

var _fetch2 = _interopRequireDefault(_fetch);

var _hasValue = require('../utils/hasValue');

var _hasValue2 = _interopRequireDefault(_hasValue);

var _isEqual = require('lodash/isEqual');

var _isEqual2 = _interopRequireDefault(_isEqual);

var _isFunction = require('lodash/isFunction');

var _isFunction2 = _interopRequireDefault(_isFunction);

var _keys = require('lodash/keys');

var _keys2 = _interopRequireDefault(_keys);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _reactClickOutside = require('react-click-outside');

var _reactClickOutside2 = _interopRequireDefault(_reactClickOutside);

var _qs = require('qs');

var _qs2 = _interopRequireDefault(_qs);

var _throttle = require('lodash/throttle');

var _throttle2 = _interopRequireDefault(_throttle);

var _uniqueId = require('lodash/uniqueId');

var _uniqueId2 = _interopRequireDefault(_uniqueId);

var _selectPropTypes = require('../utils/selectPropTypes');

var _events = require('../utils/events');

var _SelectDropdown = require('./SelectDropdown');

var _SelectDropdown2 = _interopRequireDefault(_SelectDropdown);

var _SelectError = require('./SelectError');

var _SelectError2 = _interopRequireDefault(_SelectError);

var _SelectSelection = require('./SelectSelection');

var _SelectSelection2 = _interopRequireDefault(_SelectSelection);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

// TODO: styles
// TODO: request
// TODO: multiselect
// TODO: label
// TODO: optgroups
// TODO: lang module
var Select = function (_Component) {
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

        _this.state = {};

        var children = props.children,
            defaultValue = props.defaultValue,
            error = props.error,
            options = props.options,
            request = props.request,
            value = props.value;


        var requestDelay = request && request.delay ? request.delay : 3000;

        /**
         * @type {{
         *   dropdownOpened: boolean,
         *   highlight: *,
         *   isPending: boolean,
         *   options: array,
         *   searchShow: boolean,
         *   value: *,
         * }}
         */
        _this.state = Object.assign(Select.initialState(), {
            error: error,
            options: _this._setOptions(options, children),
            requestSearch: request && !request.once,
            value: value || defaultValue
        });

        _this._requestOptions = (0, _throttle2.default)(_this._request, requestDelay, { trailing: false });
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

            var isValueDefined = typeof value !== 'undefined';

            if (isValueDefined && typeof newProps.onSelect === 'undefined' && typeof this.props.onSelect === 'undefined') {
                /* eslint-disable */
                console.error('Warning: You\'re setting value for Select component throught props\n                but not passing onSelect callback which can lead to unforeseen consequences(bugs).\n                Please consider using onSelect callback or defaultValue instead of value');
                /* eslint-enable */
            }

            if (disabled) {
                this._closeDropdown();
            }

            this.setState(function (state) {
                var newValue = state.value;

                if (isValueDefined) {
                    newValue = value === null ? null : String(value);
                }

                return {
                    disabled: disabled,
                    options: _this2._setOptions(options, children),
                    value: newValue,
                    error: (0, _hasValue2.default)(error) ? error : state.error
                };
            });
        }

        /**
         * Close SelectDropdown on click outside using 'react-click-outside' library
         */


        /**
         * Returns option object from options array by given index
         * @param {number} index
         * @return {object} <option>
         * @private
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

    }, {
        key: 'render',
        value: function render() {
            var _props = this.props,
                disabled = _props.disabled,
                error = _props.error,
                lang = _props.lang,
                width = _props.layout.width,
                placeholder = _props.placeholder,
                search = _props.search;
            var _state = this.state,
                dropdownOpened = _state.dropdownOpened,
                highlighted = _state.highlighted,
                requestSearch = _state.requestSearch,
                isPending = _state.isPending,
                options = _state.options,
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
                    onClearSelection: (0, _events.stopPropagation)(this._onClearSelection),
                    placeholder: placeholder,
                    selection: selectedOption && selectedOption.text
                }),
                dropdownOpened ? _react2.default.createElement(_SelectDropdown2.default, {
                    highlighted: highlighted,
                    lang: lang,
                    isPending: isPending,
                    requestSearch: requestSearch,
                    onSearch: requestSearch ? this._onSearchTermChange : null,
                    onSelect: this._onSelectOption,
                    options: options,
                    search: search,
                    value: value
                }) : _react2.default.createElement(_SelectError2.default, { error: error })
            );
        }
    }]);

    return Select;
}(_react.Component);

Select.propTypes = {
    /**
     * Whether allow user to clear select or not
     */
    allowClear: _react.PropTypes.bool,
    /**
     * Whether to focus itself on mount
     */
    autoFocus: _react.PropTypes.bool,
    defaultValue: _selectPropTypes.selectPropTypes.optionId,
    disabled: _react.PropTypes.bool,
    /**
     * You can provide error message to display or just boolean to highlight select container with error styles
     */
    error: _react.PropTypes.oneOfType([_react.PropTypes.bool, _react.PropTypes.string]),
    lang: _react.PropTypes.object,
    layout: _react.PropTypes.shape({
        width: _react.PropTypes.string,
        /**
         * Defines whether SelectDropdown should be opened above or below the container.
         * default: 'below'
         */
        // TODO: define position automatically depends on SelectContainer position in the viewport
        dropdownVerticalPosition: _react.PropTypes.oneOf(['above', 'below']),
        dropdownHorizontalPosition: _react.PropTypes.oneOf(['left', 'right'])
    }),
    name: _react.PropTypes.string,
    /**
     * Provide needed options to fetch data from server by term query
     */
    /**
     * Array of option items
     */
    options: _react.PropTypes.arrayOf(_react.PropTypes.shape({
        id: _selectPropTypes.selectPropTypes.optionId.isRequired,
        text: _selectPropTypes.selectPropTypes.selection.isRequired
    })),
    // TODO: validate request object
    request: _react.PropTypes.shape({
        delay: _react.PropTypes.number, // default 3000
        endpoint: _react.PropTypes.string.isRequired,
        once: _react.PropTypes.bool,
        params: _react.PropTypes.object,
        ajaxClient: _react.PropTypes.func,
        // function that creates standart shaped object { id: number|string, text: string|element } from response data
        responseDataFormatter: _react.PropTypes.func,
        termQuery: _react.PropTypes.string
    }),
    onSelect: _react.PropTypes.func,
    placeholder: _react.PropTypes.oneOfType([_react.PropTypes.string, _react.PropTypes.element]),
    search: _react.PropTypes.shape({
        minimumResults: _react.PropTypes.number,
        onSearchTermChange: _react.PropTypes.func
    }),
    /**
     * Value can be set by providing option id
     */
    value: _selectPropTypes.selectPropTypes.optionId
};
Select.defaultProps = {
    allowClear: false,
    disabled: false,
    lang: {},
    layout: {
        dropdownHorizontalPosition: 'left',
        dropdownVerticalPosition: 'below',
        width: '245px'
    },
    name: (0, _uniqueId2.default)('reactSelect_'),
    options: null,
    search: {
        minimumResults: 20
    }
};

Select.initialState = function () {
    return {
        dropdownOpened: false,
        error: null,
        highlighted: null,
        isPending: false,
        options: [],
        searchShow: false,
        value: null
    };
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

    this.handleClickOutside = function () {
        _this3._closeDropdown();
    };

    this._hasResponseDataFormatter = function () {
        if (!(0, _hasValue2.default)(_this3.hasResponseDataFormatter)) {
            _this3.hasResponseDataFormatter = (0, _isFunction2.default)(_this3.props.request.responseDataFormatter);
        }

        return _this3.hasResponseDataFormatter;
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
            var _ref2 = arguments[2];
            var searchTerm = _ref2.searchTerm,
                termQuery = _ref2.termQuery;

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

    this._setOptions = function (options, children) {
        var stateOptions = _this3.state.options || [];

        if (Array.isArray(options) && options.length) {
            stateOptions = options.map(function (_ref3) {
                var id = _ref3.id,
                    text = _ref3.text;

                if (typeof id === 'undefined' || typeof text === 'undefined') {
                    throw new Error('options array is not formatted properly, option object must have "id" and "text"');
                }

                return {
                    id: String(id),
                    text: text
                };
            });
        } else if (_react.Children.count(children)) {
            stateOptions = _react.Children.toArray(children).filter(function (_ref4) {
                var type = _ref4.type;
                return type === 'option';
            }).map(function (_ref5) {
                var _ref5$props = _ref5.props,
                    text = _ref5$props.children,
                    id = _ref5$props.value;
                return { id: String(id), text: text };
            });
        }

        return stateOptions;
    };

    this._getOptionByIndex = function (index) {
        var options = _this3.state.options;


        if (index > options.length || index < 0) {
            throw new Error('Invalid index provided');
        }

        return options[index];
    };

    this._getOptionById = function (value) {
        var options = _this3.state.options;


        if (options && options.length) {
            return options.find(function (_ref6) {
                var id = _ref6.id;
                return id === value;
            }); // eslint-disable-line eqeqeq
        }

        return null;
    };

    this._onContainerClick = function () {
        _this3.setState(function (state) {
            var dropdownOpened = state.dropdownOpened,
                disabled = state.disabled;


            return disabled ? state : { dropdownOpened: !dropdownOpened };
        });
    };

    this._onContainerKeyDown = function (event) {
        if (_this3.props.disabled) return;

        var KEY_FUNTIONS = {
            ArrowUp: _this3._setHighlightedOption.bind(null, -1),
            ArrowDown: _this3._setHighlightedOption.bind(null, 1),
            Enter: _this3._selectHighlighted,
            ' ': _this3._selectHighlighted, // 'Space' key
            Escape: _this3._closeDropdown
        };

        var key = event.key;


        if (!KEY_FUNTIONS[key]) return;

        event.preventDefault();
        // Handle key click
        KEY_FUNTIONS[key]();
    };

    this._onClearSelection = function () {
        // Dont clear when disabled, dont fire extra event when value is already cleared
        if (!_this3.state.disabled && _this3.state.value !== null) {
            _this3._onSelect(null);
        }
    };

    this._onSearchTermChange = function (term) {}
    // TODO: request options from server
    // const { request } = this.props
    ;

    this._onSelect = function (option) {
        var _props3 = _this3.props,
            name = _props3.name,
            onSelect = _props3.onSelect;
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

    this._setHighlightedOption = function (direction) {
        var _state2 = _this3.state,
            options = _state2.options,
            disabled = _state2.disabled,
            highlighted = _state2.highlighted,
            dropdownOpened = _state2.dropdownOpened;

        // do nothing if disabled or there are no options

        if (disabled || !options || !options.length) return;

        var optionsLength = options.length - 1;
        var nextHighlighted = highlighted !== null ? highlighted + direction : 0;

        // TODO: scroll SelectDropdown block to show highlighted item when overflows
        // If dropdown not opened or there is no highlighted item yet
        if (!dropdownOpened || highlighted === null
        // highlight first option after click 'ArrowDown' on the last one
        || nextHighlighted > optionsLength) {
            _this3.setState({ highlighted: 0, dropdownOpened: true });
        } else if (nextHighlighted < 0) {
            // Highlight last option after click 'ArrowUp' on the first one
            _this3.setState({ highlighted: optionsLength });
        } else {
            // Highlight next option
            _this3.setState({ highlighted: nextHighlighted });
        }
    };

    this._selectHighlighted = function () {
        var _state3 = _this3.state,
            options = _state3.options,
            highlighted = _state3.highlighted,
            dropdownOpened = _state3.dropdownOpened;

        // If dropdown not opened or there is no highlighted item yet

        if (!dropdownOpened || highlighted === null) {
            // Open dropdown and hightlight first item
            _this3.setState({
                dropdownOpened: true,
                highlighted: 0
            });
        } else {
            // Select highlighted item
            _this3._onSelect(options[highlighted]);
        }
    };

    this._getSelectContainerClassName = function () {
        var _props4 = _this3.props,
            className = _props4.className,
            disabled = _props4.disabled,
            _props4$layout = _props4.layout,
            dropdownHorizontalPosition = _props4$layout.dropdownHorizontalPosition,
            dropdownVerticalPosition = _props4$layout.dropdownVerticalPosition,
            error = _props4.error;
        var _state4 = _this3.state,
            dropdownOpened = _state4.dropdownOpened,
            isPending = _state4.isPending,
            value = _state4.value;


        return (0, _classnames2.default)('pure-react-select__container ' + (className || ''), {
            'pure-react-select__container--above': dropdownVerticalPosition === 'above',
            'pure-react-select__container--below': dropdownVerticalPosition !== 'above',
            'pure-react-select__container--disabled': disabled,
            'pure-react-select__container--error': error,
            'pure-react-select__container--left': dropdownHorizontalPosition !== 'right',
            'pure-react-select__container--open': dropdownOpened,
            'pure-react-select__container--pending': isPending,
            'pure-react-select__container--right': dropdownHorizontalPosition === 'right',
            'pure-react-select__container--selected': (0, _hasValue2.default)(value)
        });
    };

    this._isClearable = function () {
        var allowClear = _this3.props.allowClear;
        var value = _this3.state.value;


        return allowClear && (0, _hasValue2.default)(value);
    };
};

exports.default = (0, _reactClickOutside2.default)(Select);