import * as React from 'react';
import * as ReactRedux from 'react-redux';

import moment from '../../moment-localized';

import { injectIntl } from 'react-intl';

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
} from '../../ducks/search';

import {
  addFavorite,
  addFavoriteToCollection,
  removeFavorite,
  removeFavoriteFromCollection,
} from '../../ducks/user';

import {
  buildPath,
  DynamicRoutes,
  EnumCatalog,
  EnumCkanFacet,
  ServerError,
} from '../../model';

import {
  toast,
} from 'react-toastify';

import {
  CollectionSelectModal,
  Favorite,
  FavoriteCollectionPicker,
} from '../helpers';

import {
  CkanAdvancedOptions,
  Pagination,
} from './shared-parts';

const MAX_TITLE_LENGTH = 77;
const MAX_NOTES_LENGTH = 192;

class Results extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      more: Object.keys(EnumCkanFacet).reduce((result, key) => { result[EnumCkanFacet[key]] = false; return result; }, {}),
      collectionModal: {
        visible: false,
        catalog: null,
        item: null,
        favorite: null,
      },
    };

    this.textInput = React.createRef();

    this.onAddFavoriteToCollection = this.onAddFavoriteToCollection.bind(this);
    this.onFacetChanged = this.onFacetChanged.bind(this);
    this.onRemoveFavoriteFromCollection = this.onRemoveFavoriteFromCollection.bind(this);
    this.toggleFavorite = this.toggleFavorite.bind(this);
  }

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

  onCollectionSelect(catalog, item, favorite = null) {
    this.showModal(catalog, item, favorite);
  }

  onAddFavoriteToCollection(collection, favorite = null) {
    const { profile } = this.props;
    const authenticated = (profile != null);

    if (authenticated) {
      const { collectionModal: { catalog, item } } = this.state;
      const data = this.getFavoriteProperties(catalog, item);

      const create = favorite ? Promise.resolve(favorite) : this.props.addFavorite(data);

      create.then((favorite) => {
        // Refresh favorite
        this.setState(state => ({
          collectionModal: {
            ...state.collectionModal,
            favorite,
          }
        }));

        this.props.addFavoriteToCollection(collection.id, favorite.id)
          .catch(err => {
            if (err instanceof ServerError) {
              toast.error(
                <div>
                  {err.errors.map((e) => (
                    <FormattedMessage key={e.code} id={e.code} />
                  ))}
                </div>
              );
            } else {
              toast.error(
                <FormattedMessage id={'collections.add-favorite.failure'} />
              );
            }
          });
      });
    } else {
      toast.dismiss();
      toast.error(<FormattedMessage id='favorite.login-required' />);
    }
  }

  onRemoveFavoriteFromCollection(collection, favorite) {
    const { profile } = this.props;
    const authenticated = (profile != null);

    if (authenticated) {
      this.props.removeFavoriteFromCollection(collection.id, favorite.id)
        .catch(err => {
          if (err instanceof ServerError) {
            toast.error(
              <div>
                {err.errors.map((e) => (
                  <FormattedMessage key={e.code} id={e.code} />
                ))}
              </div>
            );
          } else {
            toast.error(
              <FormattedMessage id={'collections.remove-favorite.failure'} />
            );
          }
        });
    } else {
      toast.dismiss();
      toast.error(<FormattedMessage id='favorite.login-required' />);
    }
  }

  isFavoriteActive(catalog, handle) {
    return !!this.props.favorites.find(f => f.catalog === catalog && f.handle === handle);
  }

  getFavorite(catalog, handle) {
    return this.props.favorites.find(f => f.catalog === catalog && f.handle === handle) || null;
  }

  showModal(catalog, item, favorite) {
    this.setState({
      collectionModal: {
        visible: true,
        catalog,
        item,
        favorite,
      },
    });
  }

  hideModal() {
    this.setState({
      collectionModal: {
        visible: false,
        catalog: null,
        item: null,
        favorite: null,
      },
    });
  }

  getFavoriteProperties(catalog, item) {
    const { config: { host } } = this.props;

    return {
      catalog,
      description: item.notes,
      handle: item.id,
      title: item.title,
      url: `${host}/dataset/${item.id}`,
    };
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
          const type = data.catalog === EnumCatalog.CKAN ? 'dataset' : data.catalog === EnumCatalog.OPENAIRE ? 'publication' : 'notebook';

          toast.dismiss();
          toast.error(<FormattedMessage id={`favorite.${active ? 'remove' : 'add'}-error-${type}`} />);
        });
    } else {
      toast.dismiss();
      toast.error(<FormattedMessage id='favorite.login-required' />);
    }
  }

  renderNotebook(n) {
    const { config: { host } } = this.props;
    const authenticated = (this.props.profile != null);
    const modifiedAt = moment(n.metadata_modified).parseZone();
    const age = moment.duration(moment() - modifiedAt);
    const date = age.asHours() < 24 ?
      moment(modifiedAt).fromNow() :
      <FormattedDate value={n.metadata_modified} day='numeric' month='numeric' year='numeric' />;

    const favorite = this.getFavorite(EnumCatalog.LAB, n.id);

    return (
      <div className="result-item lab" key={n.id} >
        <div className="date-of-entry">
          {date}
        </div>
        {authenticated &&
          <React.Fragment>
            <Favorite
              active={this.isFavoriteActive(EnumCatalog.LAB, n.id)}
              catalog={EnumCatalog.LAB}
              description={n.notes}
              handle={n.id}
              onClick={this.toggleFavorite}
              title={n.title}
              url={`${host}/dataset/${n.id}`}
            />
            {this.props.collections.length !== 0 &&
              <FavoriteCollectionPicker
                favorite={favorite}
                onClick={() => this.onCollectionSelect(EnumCatalog.LAB, n, favorite)}
              />
            }
          </React.Fragment>
        }
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

    return data.results.map(n => this.renderNotebook(n));
  }

  render() {
    const {
      collectionModal,
    } = this.state;
    const {
      collections, search: { result, loading, text }
    } = this.props;
    const _t = this.props.intl.formatMessage;

    return (
      <>
        {collectionModal.visible &&
          <CollectionSelectModal
            addFavoriteToCollection={this.onAddFavoriteToCollection}
            collections={collections}
            favorite={collectionModal.favorite}
            removeFavoriteFromCollection={this.onRemoveFavoriteFromCollection}
            toggle={() => this.hideModal()}
            visible={collectionModal.visible}>
          </CollectionSelectModal>
        }
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
      </>
    );
  }
}

const mapStateToProps = (state) => ({
  collections: state.user.profile ? state.user.profile.collections : [],
  config: state.config.ckan,
  favorites: state.user.profile ? state.user.profile.favorites : [],
  profile: state.user.profile,
  search: state.ui.search,
});

const mapDispatchToProps = (dispatch) => bindActionCreators({
  addFavorite,
  addFavoriteToCollection,
  removeFavorite,
  removeFavoriteFromCollection,
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

const localizedComponent = injectIntl(Results);

export default ReactRedux.connect(mapStateToProps, mapDispatchToProps, mergeProps)(localizedComponent);
