import * as React from 'react';
import * as ReactRedux from 'react-redux';
import { FormattedTime } from 'react-intl';

import {
  bindActionCreators
} from 'redux';

import { 
  getNotebookToFilesystem,
 } from '../../ducks/config';

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
                  {this.props.username &&
                    <div className="btn-save">
                      <a onClick={() => this.props.getNotebookToFilesystem(uuid)}><img  src="/images/png/save.png" title="Add to my Folder"/></a>
                    </div>}
                    <h1 className="package-title">{result.title}</h1>
                    <div className="dataset-dates">
                      <div className="title"> CREATED: </div>
                      <div className="date"> <FormattedTime value={result.resources[0].created} day='numeric' month='numeric' year='numeric' /></div>

                      <div className="title"> LAST REVISION: </div>
                      <div className="date"> <FormattedTime value={result.resources[0].last_modified} day='numeric' month='numeric' year='numeric' /></div>
                    </div>
                  </div>
                  <div className="package-notes">
                    <p>{result.notes}</p>
                  </div>
                  <section className="package-resources ">
                    <div className="section-title">
                      <h5 className="inline">NOTEBOOK FILE</h5>

                      <hr className="separator" />  </div>

                    <div className="package-resource-list">

                      <li className="resource-component clearfix" >

                        <a className="resource-title" href={result.resources[0].url} title={result.resources[0].name}>

                          {result.resources[0].name}
                          <img class="format-label" src="\images\ipynb.svg" />
                        </a>

                        <div className="btn-download btn-group ">
                          <a className=" btn-group-main" href={"http://nbviewer.jupyter.org/url/" + result.resources[0].url.replace("http://", "").replace("https://", "")}> VIEW</a>
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
  username: state.user.username,
});

const mapDispatchToProps = (dispatch) => bindActionCreators({
  searchById,
  getNotebookToFilesystem,
}, dispatch);

const mergeProps = (stateProps, dispatchProps, ownProps) => ({
  ...stateProps,
  ...dispatchProps,
  ...ownProps,
});

export default NotebookShow = ReactRedux.connect(mapStateToProps, mapDispatchToProps, mergeProps)(NotebookShow);
