import React, { Component, PropTypes } from 'react'

import throttle from 'lodash/throttle'
import fetchJson from '../utils/fetch'
import isFunction from 'lodash/isFunction'
import isEqual from 'lodash/isEqual'

import SelectSearchInput from './SelectSearchInput'
import SelectOptionsList from './SelectOptionsList'


const cachedResponseData = {}

class SelectFetchDropdown extends Component {

    static propTypes = {
        data: PropTypes.array,
        dropdownOpened: PropTypes.bool,
        highlighted: PropTypes.number,
        onContainerKeyDown: PropTypes.func,
        onGettingData: PropTypes.func,
        onSelect: PropTypes.func,
        request: PropTypes.object,
        value: PropTypes.any,
    }

    static contextTypes = {
        lang: PropTypes.object
    }

    constructor() {
        super(...arguments)

        const { request: { delay, endpoint } } = this.props

        if (typeof endpoint !== 'string') {
            throw new Error('Expected endpoint to be string.')
        }

        if (typeof delay !== 'undefined' && typeof delay !== 'number') {
            throw new Error('Expected request delay to be in ms')
        }


        this.state = this.getInitState()
        this.fetchRequest = throttle(this.fetchOptionsData, delay || 300, { trailing: false })
    }

    getInitState = () => ({ status: this.context.lang.minLength })

    componentDidMount = () => {
        const { request: { endpoint, once, params }, onGettingData } = this.props

        if (!once) return
        // cache once request data
        const cachedData = cachedResponseData[endpoint]

        if (cachedData && isEqual(cachedData.params, params)) {
            onGettingData(cachedData.data)
        } else {
            this.fetchOptionsData(params, true)
        }
    }

    fetchOptionsData = (params, cache) => {
        const { request: { endpoint, responseDataFormatter, headers }, onGettingData } = this.props
        const { lang } = this.context

        if (!isFunction(responseDataFormatter)) {
            throw new Error('You must provide a responseDataFormatter function to format incoming options data')
        }

        this.setState({ status: lang.pending })
        fetchJson(endpoint, params, headers)
            .then(responseDataFormatter)
            .then((optionsData = []) => {
                const state = this.getInitState()

                if (!optionsData.length) {
                    state.status = lang.empty
                }
                if (cache) {
                    cachedResponseData[endpoint] = {
                        data: optionsData,
                        params
                    }
                }

                onGettingData(optionsData)
                this.setState(state)
            })
            .catch(err => {
                console.warn(err) // eslint-disable-line no-console
                this.setState({ status: lang.error })
            })
    }

    onFetchTermChange = ({ target: { value: fetchTerm } }) => {
        const { request: { params, termQuery } } = this.props
        const fetchParams = Object.assign({}, params, { [termQuery]: fetchTerm })

        if (!fetchTerm.length) {
            this.setState(this.getInitState())
        }

        if (fetchTerm.length >= 3) {
            this.fetchRequest(fetchParams)
        }
    }

    render() {
        if (!this.props.dropdownOpened) {
            return null
        }

        const { data, highlighted, onSelect, request: { once }, value, onContainerKeyDown } = this.props
        const { status } = this.state

        return (
            <span className="dropdown-wrapper">
        <span className="react-select-dropdown">
          { !once && <SelectSearchInput onKeyDown={ onContainerKeyDown } onTermChange={ this.onFetchTermChange }/> }
            <span className="react-select-results">
            { data && data.length ?
                <SelectOptionsList {...{ data, value, highlighted, onSelect }}/>
                : <span className="react-select-results__message">{ status }</span>
            }
          </span>
        </span>
      </span>
        )
    }

}

export default SelectFetchDropdown