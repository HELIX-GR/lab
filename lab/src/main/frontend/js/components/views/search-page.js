import * as React from 'react';
import * as ReactRedux from 'react-redux';
import * as PropTypes from 'prop-types';

import _ from 'lodash';
import classnames from 'classnames';

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
  EnumCatalog,
  StaticRoutes,
} from '../../model';

import {
  changeText,
  search as searchAll,
  searchAutoComplete,
  toggleAdvanced,
  togglePill,
  toggleSearchFacet,
  setResultVisibility,
} from '../../ducks/ui/views/search';

import {
  Pill,
  Result
} from '../helpers';

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

    if (this.isTextValid(text)) {
      this.props.searchAll(text, advanced).then((data) => {
        const found = Object.keys(EnumCatalog).some((key) => {
          return (data.catalogs[key] && data.catalogs[key].count !== 0);
        });

        if (found) {
          this.props.history.push(StaticRoutes.RESULTS);
        }
      });
    }
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
  onPillChanged(id) {
    this.props.togglePill(id);
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
                    className="landing-search-text"
                    name="landing-search-text"
                    placeholder={_t({ id: 'labsearch.placeholder' })}
                    value={text}
                    onChange={(e) => this.onTextChanged(e.target.value)}
                    onFocus={() => this.props.setResultVisibility(true)}
                    onBlur={() => this.props.setResultVisibility(false)}
                    ref={this.textInput}
                  />

                  <Result
                    visible={visible && !loading}
                    result={catalogs}
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
  toggleAdvanced,
  togglePill,
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

export default ReactRedux.connect(mapStateToProps, mapDispatchToProps, mergeProps)(SearchPage);
