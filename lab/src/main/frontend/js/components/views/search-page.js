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
  changeText,
  toggleAdvanced,
  togglePill,
} from '../../ducks/ui/views/search';


import {
  Pill,
} from '../helpers';

import {
  LabFeatured,
  SearchResult,
} from './';

class SearchPage extends React.Component {

  constructor(props) {
    super(props);

    this.onPillChanged = this.onPillChanged.bind(this);

    this.onTextChanged = _.debounce((value) => {
      this.props.changeText(value);
    }, 1000);

  }

  static contextTypes = {
    intl: PropTypes.object,
  }

  onPillChanged(id) {
    this.props.togglePill(id);
  }


  render() {
    const { advanced, pills, text } = this.props.search;
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
                    className="landing-search-text"
                    name="landing-search-text" value=""
                    placeholder={_t({ id: 'labsearch.placeholder' })}
                    value={text}
                    onChange={(e) => this.onTextChanged(e.target.value)}
                  />
                  <div
                    className={
                      classnames({
                        'domain-pills': true,
                        'short': advanced,
                      })
                    }
                  >
                    <Pill
                      id="data"
                      text="pills.data"
                      className="pill-data"
                      selected={pills.data}
                      onChange={this.onPillChanged}
                    />
                    <Pill
                      id="pubs"
                      text="pills.pubs"
                      className="pill-pubs"
                      selected={pills.pubs}
                      onChange={this.onPillChanged}
                    />
                    <Pill
                      id="lab"
                      text="pills.lab"
                      className="pill-lab"
                      selected={pills.lab}
                      onChange={this.onPillChanged}
                    />

                  </div>
                  <SearchResult />

                </div>

                <button type="button" name="landing-search-button" className="landing-search-button">
                  <i className="fa fa-search"></i>
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
}, dispatch);

const mergeProps = (stateProps, dispatchProps, ownProps) => ({
  ...stateProps,
  ...dispatchProps,
  ...ownProps,
});

export default ReactRedux.connect(mapStateToProps, mapDispatchToProps, mergeProps)(SearchPage);
