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
    this.state = {
      uuid: props.match.params.uuid,
    };
  }

  componentWillMount() {
    const { uuid } = this.props.match.params;
    this.props.searchById(uuid);
  }

  render() {
    const result = this.props.search.result;
    const uuid = this.props.match.params.uuid;

    return (
      <div className="results-lab">
        <section className="main-results-page-content">
          <div className="results-main-content">
            <section className="results-main-sidebar">
              <h5 className="side-heading org-heading">
                Organization</h5>
              <i className="icon-building"></i>
              <section className="org-content">
                <div className="image">
                  <a href="/organization/helix">
                    <img src="http://83.212.105.241:5000/uploads/group/2018-06-14-101450.705782Helix-logo.svg" width="200" alt="helix" />
                  </a>
                </div>
              </section>
              <h5 className="side-heading grayed">
                Tags</h5>
              <section className="side-content">
                <a className="tags" >SEWAGE</a>
                <a className="tags" >STATISTICS</a>
                <a className="tags" >WATER</a>
              </section>
            </section>

            <section className="results-main-result-set">

              {result && result.resources &&
                <div className="main-results-border-bottom">

                  <h1 className="package-title">{result.title}</h1>
                  <div className="dataset-dates">
                    <div className="title"> CREATED: </div>
                    <div className="date"> {result.resources[0].created}</div>

                    <div className="title"> LAST REVISION: </div>
                    <div className="date"> {result.resources[0].last_modified}</div>

                  </div>
                  <div className="package-notes">
                    <p>{result.notes}</p>
                  </div>

                  <div className="main-results-border-bottom">          </div>

                </div>
              }


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
