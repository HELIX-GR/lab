import * as React from 'react';
import * as ReactRedux from 'react-redux';

import {
  bindActionCreators
} from 'redux';

import {
  searchById
} from '../../ducks/ui/views/search';

import {
  FormattedMessage,
} from 'react-intl';

class NotebookShow extends React.Component {

  constructor(props) {
    super(props);
    this.state= {
      uuid: props.match.params.uuid,
    };
  }
  componentWillMount() {
    this.props.searchById(this.state.uuid);
  }

  render() {
    const result = this.props.search.result;
    const uuid = this.props.match.params.uuid;
    return (
      <div className="results-lab">
        <section className="main-results-page-content">
          <div className="results-main-content">
            <section class="results-main-sidebar">
              <h5 class="side-heading org-heading">
                Organization</h5>
              <i class="icon-building"></i>
              <section class="org-content">
                <div class="image">
                  <a href="/organization/helix">
                    <img src="http://83.212.105.241:5000/uploads/group/2018-06-14-101450.705782Helix-logo.svg" width="200" alt="helix" />
                  </a>
                </div>
              </section>
              <h5 class="side-heading grayed">
                Tags</h5>
              <section class="side-content">
                <a class="tags" href="/dataset?tags=sewage">SEWAGE</a>
                <a class="tags" href="/dataset?tags=statistics">STATISTICS</a>
                <a class="tags" href="/dataset?tags=water">WATER</a>
              </section>
            </section>

            <section className="results-main-result-set">

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
  search: state.ui.search,
});

const mapDispatchToProps = (dispatch) => bindActionCreators({
  searchById
}, dispatch);

const mergeProps = (stateProps, dispatchProps, ownProps) => ({
  ...stateProps,
  ...dispatchProps,
  ...ownProps,
});

export default NotebookShow = ReactRedux.connect(mapStateToProps, mapDispatchToProps, mergeProps)(NotebookShow);
