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

import Pagination from './pagination';



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

  componentWillMount() {
    if (this.props.search.text == "") {
      this.props.searchAll("");
    } 
  }

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

   // if (this.isTextValid(text)) {
      this.props.searchAll(text, true, pageIndex);
   // }
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

    const { text } = this.props.search;

    //if (this.isTextValid(text)) {
      this.props.searchAll(text);
    //}

  }
  onPageChange(index) {
    const {
      search: { result: pageIndex }
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
          {items.slice(0, size).map((value, index) => {
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
          })}
          {items.length > minOptions &&
            <div className="more-link">
              <a onClick={(e) => this.toggleMore(e, key)}>{showAll ? "View Less" : "View More"}</a>
            </div>}
        </div>
      </div>
    );
  }

  renderResults(data) {
    if (data.count === 0) {
      return null;
    }

    const host = "notebook";

    return data.results.map(r => {
      // Note: parse modification timestamp from server (do not assume same timezone offset!) 
      const modifiedAt = moment(r.metadata_modified).parseZone();
      const age = moment.duration(moment() - modifiedAt);
      const date = age.asHours() < 24 ?
        ('Before ' + age.humanize()):
        <FormattedDate value={r.metadata_modified} day='numeric' month='numeric' year='numeric' />;

      return (
        <div className="result-item lab" key={r.id} >
          <div className="date-of-entry">
            {date}
          </div>
          <h3 className="title">
            <a href={`${host}/${r.id}`}>
              {r.title}
            </a>
          </h3>
          <div className="notes"> {r.notes.length<=220 ? r.notes :r.notes.substring(0,220)+"..."} </div>
          <div className="service">
            <a href="#">{r.organization.title}</a>
          </div>

          <div className="tag-list">
            {r.tags && r.tags.length !== 0 &&
              r.tags.map(tag => {
                return (
                  <a href="#" className="tag-box" key={tag.id}>
                    <div>
                      {tag.name}
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
      search: { result = { count: 0, pageSize: 10 }, loading, text }
    } = this.props;
    console.log(result);
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
                      placeholder={_t({ id: 'labsearch.placeholder' })}
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
              {//this.renderParameters("Organization", 'ORGANIZATIONS', 'name', 'title', 'org', 5, (() => { }))
              }

            </section>


            <section className="results-main-result-set">
              {result.results &&
                <Pagination
                  className="top"
                  pageIndex={result.pageIndex}
                  pageCount={Math.ceil(result.count / result.pageSize)}
                  pageChange={(pageIndex) => this.onPageChange(pageIndex)}
                />}

              <div className="main-results-border-bottom">
                <label className="order-by" htmlFor="order-by">Ταξινόμηση κατά
                  <select name="order-by" id="order-by" value="">
                    <option value="1">
                      Σχετικότητα
                    </option>
                  </select>
                </label>
                <div className="main-results-result-count">
                  Βρέθηκαν {result.count} Notebooks
                </div>
              </div>

              <div className="result-items">
                {result.results && this.renderResults(result)}

              </div>

              <div className="main-results-border-bottom">

              </div>

              {result.results &&
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
