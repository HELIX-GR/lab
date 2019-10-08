import _ from 'lodash';
import * as React from 'react';
import * as ReactRedux from 'react-redux';
import * as PropTypes from 'prop-types';
import classnames from 'classnames';

import { withRouter } from 'react-router';

import {
  bindActionCreators
} from 'redux';

import {
  StaticRoutes,
} from '../../model';

import {
  setText,
  search as searchAll,
  searchAutoComplete,
  setResultVisibility,
  toggleAdvanced,
  toggleSearchFacet,
} from '../../ducks/search';

import {
  AdvancedSearchModal,
} from './shared-parts';

import {
  Featured,
  Result,
} from './main-parts';

const KEYSTROKE_INTERVAL = 800;

class SearchPage extends React.Component {

  constructor(props) {
    super(props);

    this.onKeyDown = this.onKeyDown.bind(this);
    this.searchAutoComplete = _.debounce(this.props.searchAutoComplete, KEYSTROKE_INTERVAL);

    this.textInput = React.createRef();
  }

  static contextTypes = {
    intl: PropTypes.object,
  }

  componentDidMount() {
    document.addEventListener('keydown', this.onKeyDown, false);
    this.props.setResultVisibility(false);
  }

  componentWillUnmount() {
    document.removeEventListener('keydown', this.onKeyDown, false);
  }

  isTextValid(text) {
    return ((text) && (text.length > 2));
  }

  search(advanced = false) {
    const { text } = this.props.search;

    if (this.isTextValid(text)) {
      this.props.searchAll(text, advanced)
        .then((data) => {
          if (data.results.length !== 0) {
            if (advanced) {
              this.props.toggleAdvanced();
            }
            this.props.history.push(StaticRoutes.RESULTS);
          }
        });
    }
  }

  onTextChanged(value, refresh = true) {
    this.props.setText(value);

    if ((refresh) && (this.isTextValid(value))) {
      this.searchAutoComplete(value);
    }
  }

  onSearch(e) {
    e.preventDefault();

    this.search(false);
  }

  onKeyDown(e) {
    if (e.key === 'Escape') {
      this.props.setResultVisibility(false);
    }
  }

  render() {
    const { advanced, loading, partialResult: { visible }, text } = this.props.search;
    const _t = this.context.intl.formatMessage;

    return (
      <div>
        <section>
          <div className="landing-section">
            <div className="search-form-wrapper">
              <form className="landing-search-form">
                <div className="main-form-content">
                  <input
                    type="text"
                    autoComplete="off"
                    outline="off"
                    className="landing-search-text"
                    name="landing-search-text"
                    placeholder={_t({ id: 'search.placeholder' })}
                    value={text}
                    onChange={(e) => this.onTextChanged(e.target.value)}
                    onFocus={() => this.props.setResultVisibility(true)}
                    ref={this.textInput}
                  />
                  <div
                    className={
                      classnames({
                        'domain-pills': true,
                        'short': advanced,
                      })
                    }
                  >
                    <div
                      className={
                        classnames({
                          'advanced-search-link': true,
                          'hidden': advanced,
                        })
                      }
                      onClick={() => this.props.toggleAdvanced()}
                    >
                      {_t({ id: 'search.advanced-search' })}
                    </div>
                  </div>

                  <Result
                    hide={() => this.props.setResultVisibility(false)}
                    navigate={(url) => this.props.history.push(url)}
                    result={this.props.search.partialResult.data}
                    search={() => this.search(false)}
                    visible={visible && !loading}
                  />
                </div>

                <button
                  type="submit"
                  name="landing-search-button"
                  className="landing-search-button"
                  disabled={loading}
                  onClick={(e) => this.onSearch(e)}
                >
                  <i className={loading ? 'fa fa-spin fa-spinner' : 'fa fa-search'}></i>
                </button>
              </form>
            </div>
          </div>
        </section>

        <Featured />

        <AdvancedSearchModal
          config={this.props.config.ckan}
          data={this.props.search}
          search={() => this.search(true)}
          setText={(text) => this.onTextChanged(text, false)}
          toggle={this.props.toggleAdvanced}
          toggleFacet={this.props.toggleSearchFacet}
          visible={advanced}
        />

      </div >
    );
  }
}

const mapStateToProps = (state) => ({
  config: state.config,
  locale: state.i18n.locale,
  profile: state.user.profile,
  search: state.ui.search,
});

const mapDispatchToProps = (dispatch) => bindActionCreators({
  setText,
  searchAll,
  searchAutoComplete,
  setResultVisibility,
  toggleAdvanced,
  toggleSearchFacet,
}, dispatch);

const mergeProps = (stateProps, dispatchProps, ownProps) => ({
  ...stateProps,
  ...dispatchProps,
  ...ownProps,
});

SearchPage = ReactRedux.connect(mapStateToProps, mapDispatchToProps, mergeProps)(SearchPage);

export default withRouter(SearchPage);