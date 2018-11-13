import * as React from 'react';
import * as ReactRedux from 'react-redux';
import * as PropTypes from 'prop-types';

import _ from 'lodash';
import { withRouter } from 'react-router';

import {
  bindActionCreators
} from 'redux';

import {
  changeLocale,
} from '../../ducks/i18n';

import {
  logout,
} from '../../ducks/user';

import {
  StaticRoutes,
} from '../../model';

import {
  changeText,
  search as searchAll,
  searchAutoComplete,
  toggleSearchFacet,
  setResultVisibility,
} from '../../ducks/ui/views/search';

import {
  Result
} from '../helpers';

import SearchResult from './search-result';

import {
  LabFeatured,
} from './';


class SearchPage extends React.Component {

  constructor(props) {
    super(props);

    this.searchAutoComplete = _.debounce(this.props.searchAutoComplete, 400);
    this.textInput = React.createRef();
  }

  static contextTypes = {
    intl: PropTypes.object,
  }

  isTextValid(text) {
    return ((text) && (text.length > 2));
  }

  search(advanced = false) {
    const { text } = this.props.search;

    //if (this.isTextValid(text)) {
      this.props.searchAll(text, advanced).then(
        this.props.history.push(StaticRoutes.RESULTS));
    //}

  }

  onTextChanged(value, refresh = true) {
    this.props.changeText(value);

    if ((refresh) && (this.isTextValid(value))) {
      this.searchAutoComplete(value);
    }
  }

  onSearch(e) {
    e.preventDefault();


    this.search(false);
  }


  render() {
    const { advanced, partialResult: { visible, catalogs }, loading, pills, text } = this.props.search;
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
                    placeholder={_t({ id: 'labsearch.placeholder' })}
                    value={text}
                    onChange={(e) => this.onTextChanged(e.target.value)}
                    onFocus={() => this.props.setResultVisibility(true)}
                    onBlur={() => this.props.setResultVisibility(false)}
                    ref={this.textInput}
                  />
                  {text &&
                    <SearchResult visible={text.length > 3} text={text || ""} result={this.props.search.partialResult.catalogs} />}
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
        <LabFeatured />
      </div >
    );
  }
}

const mapStateToProps = (state) => ({
  config: state.config,
  locale: state.i18n.locale,
  search: state.ui.search,
  profile: state.user.profile,
});

const mapDispatchToProps = (dispatch) => bindActionCreators({
  changeLocale,
  changeText,
  logout,
  searchAll,
  searchAutoComplete,
  toggleSearchFacet,
  setResultVisibility,
}, dispatch);

const mergeProps = (stateProps, dispatchProps, ownProps) => ({
  ...stateProps,
  ...dispatchProps,
  ...ownProps,
});

SearchPage = ReactRedux.connect(mapStateToProps, mapDispatchToProps, mergeProps)(SearchPage);
export default withRouter(SearchPage);