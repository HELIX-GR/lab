import React from "react";
import _ from 'lodash';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { FileSelect } from '../helpers/file-select';
import { Route } from 'react-router-dom';
import { getFilesystem, createFolder, setTablePath } from '../../ducks/config';
import TableToolbar from './table-toolbar';
import { Card, CardActions, CardHeader, CardMedia, CardTitle, CardText } from 'material-ui/Card';
import FlatButton from 'material-ui/FlatButton';


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
  }

  render() {

    const style = {
      margin: 12,
    };
    return (
      <div>
        <div className="jumbotron faq-header info-page-header jumbotron-with-breadcrumb-below row">
          <div className="col" >
            <h1 className="clip-text header-with-icon">
              <span className="fas fa-archive"></span>
              <span className="header-text">My Files</span>
            </h1>
          </div>
          <FlatButton label="Jupyter Lab" subtitle="Next-generation web-based user interface for Project Jupyter" target="_blank" href={this.props.target + "/lab"} />
        </div>

        <TableToolbar onclick={this._getFileSystem} />
        <FileSelect2 />

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
    target: state.app.target,
  };
}


const mapDispatchToProps = (dispatch) => bindActionCreators({ getFilesystem, createFolder, setTablePath }, dispatch);



export default Filesystem = connect(mapStateToProps, mapDispatchToProps)(Filesystem);