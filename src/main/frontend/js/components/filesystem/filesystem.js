import React from "react";
import _ from 'lodash';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { FileSelect } from '../helpers/file-select';
import { Route } from 'react-router-dom';
import { getFilesystem, createFolder } from '../../ducks/config';
import TableToolbar from './table-toolbar';



import FileSelect2 from './file-select2';


class Filesystem extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      folder: this.props.filesystem,
      user: "totos2",
      show_login: false,
      value: 1,
    };
    this._getFileSystem = this._getFileSystem.bind(this);

  }
  componentWillMount() {
    if (this.props.user !== null) {
      this._getFileSystem();
    }
  }


  componentWillReceiveProps(nextProps) {
    if (this.props.user == null && nextProps.user != null) {
      this._getFileSystem();
    }
  }
  _getFileSystem() {
    this.props.getFilesystem('');
    this.render();
  }

  render() {

    const style = {
      margin: 12,
    };
    return (
      <div>
        <div className="jumbotron faq-header info-page-header jumbotron-with-breadcrumb-below">
          <div >
            <h1 className="clip-text header-with-icon">
              <span className="fas fa-archive"></span>
              <span className="header-text">My Files</span>
            </h1>
          </div>
        </div>

        <TableToolbar onclick={this._getFileSystem} />
        <FileSelect2 filesystem={this.props.filesystem} />

        {/* <FileSelect
          {...this.props}
          onChange={(r) => { console.log(r) }}
          id="My Files "
          label="File system resource"
          help="Click on resource to select"
          style={{ height: '40vh' }}
       />*/}
      </div>)
  }
}

function mapStateToProps(state) {
  return {
    filesystem: state.config.filesystem,
  };
}


const mapDispatchToProps = (dispatch) => bindActionCreators({ getFilesystem, createFolder }, dispatch);



export default Filesystem = connect(mapStateToProps, mapDispatchToProps)(Filesystem);