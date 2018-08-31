import * as React from 'react';
import * as ReactRedux from 'react-redux';
import * as PropTypes from 'prop-types';

import moment from '../../../moment-localized';

import {
  bindActionCreators
} from 'redux';

import {
  FormattedDate,
} from 'react-intl';

import {
  changeText,
  search as searchAll,
  toggleAdvanced,
  togglePill,
  toggleSearchFacet,
  setResultVisibility,
} from '../../../ducks/ui/views/search';

import {
  EnumCatalog,
  EnumFacet,
} from '../../../model';

import {
  Pagination,
} from './pagination';

const MIN_FACET_VALUES = 3;

class Results extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      more: Object.keys(EnumFacet).reduce((result, key) => { result[EnumFacet[key]] = false; return result; }, {}),
    };

    this.textInput = React.createRef();
  }

  static contextTypes = {
    intl: PropTypes.object,
  };

  toggleMore(e, key) {
    e.preventDefault();
    this.setState({
      more: {
        ...this.state.more,
        [key]: !this.state.more[key],
      }
    });
  }

  isTextValid(text) {
    return ((text) && (text.length > 2));
  }

  search(pageIndex) {
    const { text } = this.props.search;

    if (this.isTextValid(text)) {
      this.props.searchAll(text, true, pageIndex).then((data) => {
        const found = Object.keys(EnumCatalog).some((key) => {
          return (data.catalogs[key] && data.catalogs[key].count !== 0);
        });
      });
    }
  }

  onTextChanged(value) {
    this.props.changeText(value);
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
      search: { result: { catalogs: { [EnumCatalog.CKAN]: { pageIndex } } } }
    } = this.props;

    if (index !== pageIndex) {
      this.search(index);
    }
  }

  renderParameters(key, title, valueProperty, textProperty, prefix, minOptions, showAll) {
    const { facets } = this.props.search;
    const { ckan } = this.props.config;

    const items = ckan[key];
    const size = Array.isArray(items) ? showAll ? items.length : Math.min(items.length, minOptions) : 0;
    if (size === 0) {
      return null;
    }

    return (
      <div className={`${key} param-box`}>
        <h5 className="title">{title}</h5>

        <div className="switches">
          {
            items.slice(0, size).map((value, index) => {
              const resolvedValue = valueProperty ? value[valueProperty] : value;
              const checked = !!facets[key].find(value => value === resolvedValue);

              return (
                <label htmlFor={`switch-${prefix}-${index}`} key={`switch-${prefix}-${index}`}>
                  <input
                    type="checkbox"
                    id={`switch-${prefix}-${index}`}
                    name={`switch-${prefix}-${index}`}
                    value={resolvedValue}
                    onChange={() => { this.onFacetChanged(key, resolvedValue); }}
                    checked={checked}
                  />
                  {textProperty ? value[textProperty] : value}
                </label>
              );
            })
          }

          {items.length > minOptions &&
            <div className="more-link">
              <a onClick={(e) => this.toggleMore(e, key)}>{showAll ? "View Less" : "View More"}</a>
            </div>
          }
        </div>

      </div>
    );
  }

  renderResults(data) {
    if (data.count === 0) {
      return null;
    }

    const { ckan: { host } } = this.props.config;

    return data.results.map(r => {
      const formats = r.resources.reduce((result, value) => {
        if (!result.includes(value.format)) {
          return [...result, value.format];
        }
        return result;
      }, []);

      const age = moment.duration(moment() - moment(r.metadata_modified));
      const date = age.asHours() < 24 ?
        moment(r.metadata_modified).fromNow() :
        <FormattedDate value={r.metadata_modified} day='numeric' month='numeric' year='numeric' />;

      return (
        <div className="result-item data" key={r.id} >
          <div className="date-of-entry">
            {date}
          </div>
          <h3 className="title">
            <a href={`${host}/dataset/${r.id}`} target="_blank">
              {r.title}
            </a>
            <div className="pill data">
              DATA
            </div>
          </h3>
          <div className="service">
            <a href="#">titlos</a>
          </div>

          <div className="tag-list">
            {formats.length !== 0 &&
              formats.filter(format => !!format).map(format => {
                return (
                  <a href="#" className="tag-box" key={format}>
                    <div>
                      {format}
                    </div>
                  </a>
                );
              })
            }
          </div>
        </div >
      );
    });
  }

  render() {

    const {
      search: { results = { count: 0, pageSize: 10 }, loading, text }
    } = this.props;

    const _t = this.context.intl.formatMessage;

    return (
      <div>
        <section className="main-results-page-content">
          <div className="results-main-content">

            <section className="results-main-sidebar">

              <div className="search-form-wrapper">

                <form className="landing-search-form">

                  <div className="main-form-content">
                    <input
                      type="text"
                      autoComplete="off"
                      className="landing-search-text"
                      name="landing-search-text" value=""
                      placeholder={_t({ id: 'search.placeholder' })}
                      value={text}
                      onChange={(e) => this.onTextChanged(e.target.value)}
                    />
                  </div>

                  <button
                    type="submit"
                    name="landing-search-button"
                    className="landing-search-button"
                    disabled={loading}
                  >
                    <i className={loading ? 'fa fa-spin fa-spinner' : 'fa fa-search'}></i>
                  </button>

                </form>
              </div>

            </section>


            <section className="results-main-result-set">

              {/* <Pagination
                className="top"
                pageIndex={results.pageIndex}
                pageCount={Math.ceil(results.count / results.pageSize)}
                pageChange={(pageIndex) => this.onPageChange(pageIndex)}
             />*/}

              <div className="main-results-border-bottom">
                <label className="order-by" htmlFor="order-by">Ταξινόμηση κατά
                  <select name="order-by" id="order-by" value="">
                    <option value="1">
                      Σχετικότητα
                    </option>
                  </select>
                </label>
                <div className="main-results-result-count">
                  Βρέθηκαν {results.count} σύνολα δεδομένων
                </div>
              </div>

              <div className="result-items">
                {//this.renderResults(results)
                }
              </div>

              <div className="main-results-border-bottom">

              </div>

            {/*  <Pagination
                className="bottom"
                pageIndex={results.pageIndex}
                pageCount={Math.ceil(results.count / results.pageSize)}
                pageChange={(pageIndex) => this.onPageChange(pageIndex)}
            />*/}

            </section>

          </div>
        </section>
      </div >
    );
  }
}

const mapStateToProps = (state) => ({
  config: state.config,
  locale: state.i18n.locale,
  search: state.ui.search,
});

const mapDispatchToProps = (dispatch) => bindActionCreators({
  changeText,
  searchAll,
  toggleAdvanced,
  togglePill,
  toggleSearchFacet,
  setResultVisibility,
}, dispatch);

const mergeProps = (stateProps, dispatchProps, ownProps) => ({
  ...stateProps,
  ...dispatchProps,
  ...ownProps,
});

export default ReactRedux.connect(mapStateToProps, mapDispatchToProps, mergeProps)(Results);
