import * as React from 'react';
import * as ReactRedux from 'react-redux';
import * as PropTypes from 'prop-types';

import moment from '../../../moment-localized';

import {
  bindActionCreators
} from 'redux';

import {
  FormattedDate,
  FormattedMessage,
} from 'react-intl';

import {
  Link,
} from 'react-router-dom';

import {
  setText,
  search as searchAll,
  setResultVisibility,
  toggleAdvanced,
  toggleSearchFacet,
} from '../../../ducks/search';

import {
  buildPath,
  DynamicRoutes,
  EnumCatalog,
  EnumCkanFacet,
} from '../../../model';

import {
  toast,
} from 'react-toastify';

import {
  Favorite,
} from '../../helpers';

import {
  default as CkanAdvancedOptions,
} from '../ckan-advanced-options';

import Pagination from './pagination';

const MAX_TITLE_LENGTH = 77;
const MAX_NOTES_LENGTH = 192;

class Results extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      more: Object.keys(EnumCkanFacet).reduce((result, key) => { result[EnumCkanFacet[key]] = false; return result; }, {}),
    };

    this.textInput = React.createRef();

    this.onFacetChanged = this.onFacetChanged.bind(this);
    this.toggleFavorite = this.toggleFavorite.bind(this);
  }

  static contextTypes = {
    intl: PropTypes.object,
  };

  isTextValid(text) {
    return ((text) && (text.length > 2));
  }

  search(pageIndex) {
    const { text } = this.props.search;

    if (this.isTextValid(text)) {
      this.props.searchAll(text, true, pageIndex);
    }
  }

  onTextChanged(value) {
    this.props.setText(value);
  }

  onFacetChanged(facet, value) {
    this.props.toggleSearchFacet(facet, value);
    this.search();
  }

  onSearch(e) {
    e.preventDefault();

    this.search();
  }

  onPageChange(index) {
    const {
      search: { result = {} }
    } = this.props;

    const pageIndex = result.pageIndex || 0;

    if (index !== pageIndex) {
      this.search(index);
    }
  }

  isFavoriteActive(catalog, handle) {
    return false;
    //return !!this.props.favorites.find(f => f.catalog === catalog && f.handle === handle);
  }

  toggleFavorite(data) {
    const authenticated = (this.props.profile != null);
    const active = this.isFavoriteActive(data.catalog, data.handle);

    if (authenticated) {
      (active ? this.props.removeFavorite(data) : this.props.addFavorite(data))
        .catch((err) => {
          if ((err.errors) && (err.errors[0].code.startsWith('FavoriteErrorCode.'))) {
            // Ignore
            return;
          }
          toast.dismiss();
          toast.error(<FormattedMessage id={`favorite.${active ? 'remove' : 'add'}-error-notebook`} />);
        });
    } else {
      toast.dismiss();
      toast.error(<FormattedMessage id='favorite.login-required' />);
    }
  }

  renderNotebook(n, host) {
    const modifiedAt = moment(n.metadata_modified).parseZone();
    const age = moment.duration(moment() - modifiedAt);
    const date = age.asHours() < 24 ?
      moment(modifiedAt).fromNow() :
      <FormattedDate value={n.metadata_modified} day='numeric' month='numeric' year='numeric' />;

    return (
      <div className="result-item lab" key={n.id} >
        <div className="date-of-entry">
          {date}
        </div>
        <Favorite
          active={this.isFavoriteActive(EnumCatalog.LAB, n.id)}
          catalog={EnumCatalog.LAB}
          description={n.notes}
          handle={n.id}
          onClick={this.toggleFavorite}
          title={n.title}
          url={`${host}/notebook/${n.id}`}
        />
        <h3 className="title">
          <Link to={buildPath(DynamicRoutes.NOTEBOOK_DETAILS, [n.id])}>
            {n.title.length > MAX_TITLE_LENGTH ? `${n.title.substring(0, MAX_TITLE_LENGTH)} ...` : n.title}
          </Link>
          <div className="pill lab ml-1">
            LAB
          </div>
        </h3>
        <div className="notes">
          {n.notes.length > MAX_NOTES_LENGTH ? `${n.notes.substring(0, MAX_NOTES_LENGTH)} ...` : n.notes}
        </div>
        <div className="service">
          <a onClick={(e) => e.preventDefault()}>{n.organization.title}</a>
        </div>

        <div className="tag-list">
          {n.tags && n.tags.length !== 0 &&
            n.tags.map(tag => {
              return (
                <a onClick={(e) => e.preventDefault()} className="tag-box" key={tag}>
                  <div>
                    {tag}
                  </div>
                </a>
              );
            })
          }
        </div>
      </div>
    );
  }

  renderResults(data) {
    if (data.count === 0) {
      return null;
    }

    return data.results.map(r => this.renderNotebook(r));
  }

  render() {
    const {
      search: { result, loading, text }
    } = this.props;
    const _t = this.context.intl.formatMessage;

    return (
      <div className="results-lab">
        <section className="main-results-page-content">
          <div className="results-main-content">

            <section className="results-main-sidebar">

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
                      ref={this.textInput}
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

              <div className="main-results-advanced-search">

                <h4 className="header">
                  {_t({ id: 'results.advanced-search' })}
                </h4>


                <div className="border-bottom-bar">

                </div>
              </div>

              {true === false &&
                <LocationFilter />
              }

              <CkanAdvancedOptions
                config={this.props.config}
                facets={this.props.search.facets}
                minOptions={4}
                toggleFacet={this.onFacetChanged}
              />

            </section>

            <section className="results-main-result-set">
              {result &&
                <Pagination
                  className="top"
                  pageIndex={result.pageIndex}
                  pageCount={Math.ceil(result.count / result.pageSize)}
                  pageChange={(pageIndex) => this.onPageChange(pageIndex)}
                />}

              <div className="main-results-border-bottom">
                <label className="order-by" htmlFor="order-by">Ταξινόμηση κατά
                  <select name="order-by" id="order-by" value="" onChange={(e) => null}>
                    <option value="1">
                      Σχετικότητα
                    </option>
                  </select>
                </label>
                <div className="main-results-result-count">
                  Βρέθηκαν {result ? result.count : 0} Notebooks
                </div>
              </div>

              <div className="result-items">
                {result && this.renderResults(result)}

              </div>

              <div className="main-results-border-bottom">

              </div>

              {result &&
                <Pagination
                  className="bottom"
                  pageIndex={result.pageIndex}
                  pageCount={Math.ceil(result.count / result.pageSize)}
                  pageChange={(pageIndex) => this.onPageChange(pageIndex)}
                />}

            </section>

          </div>
        </section>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  config: state.config.ckan,
  profile: state.user.profile,
  search: state.ui.search,
});

const mapDispatchToProps = (dispatch) => bindActionCreators({
  setText,
  searchAll,
  toggleAdvanced,
  toggleSearchFacet,
  setResultVisibility,
}, dispatch);

const mergeProps = (stateProps, dispatchProps, ownProps) => ({
  ...stateProps,
  ...dispatchProps,
  ...ownProps,
});

export default ReactRedux.connect(mapStateToProps, mapDispatchToProps, mergeProps)(Results);
