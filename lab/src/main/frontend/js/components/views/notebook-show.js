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
            <section className="results-main-result-set">

              {result && result.resources &&
                <div className="main-results-border-bottom">
                  <div className="nav-bar">
                    <h1 className="package-title">{result.title}</h1>
                    <div className="dataset-dates">
                      <div className="title"> CREATED: </div>
                      <div className="date"> {result.resources[0].created}</div>

                      <div className="title"> LAST REVISION: </div>
                      <div className="date"> {result.resources[0].last_modified}</div>
                    </div>
                  </div>
                  <div className="package-notes">
                    <p>{result.notes}</p>
                  </div>
                  <section class="package-resources ">
                    <div class="section-title">
                      <h5 class="inline">NOTEBOOK FILE</h5>

                      <hr class="separator" />  </div>

                    <div class="package-resource-list">
                      <li class="resource-component clearfix" >

                        <a class="resource-title" href={result.resources[0].url} title={result.resources[0].name}>
                          {result.resources[0].name}
                        </a>

                        <div class="btn-download btn-group ">
                          <a class=" btn-group-main" href={"http://nbviewer.jupyter.org/url/" + result.resources[0].url}> VIEW</a>
                        </div>
                      </li>

                    </div></section>
                  <div className="main-results-border-bottom">
                  </div>

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
