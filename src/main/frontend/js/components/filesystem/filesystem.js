import React from "react";
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { getFilesystem, createFolder, setTablePath } from '../../ducks/config';
import TableToolbar from './table-toolbar';
import ServerButton  from './servers-button';
import { FormattedMessage } from 'react-intl';
import Paper from '@material-ui/core/Paper';

import FileSelect2 from './file-select2';


class Filesystem extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      open:false,
      folder: this.props.filesystem,
      user: "totos2",
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
      <Paper >
        <div className="jumbotron faq-header info-page-header jumbotron-with-breadcrumb-below row backround-white">
          <div className="col" >
            <h1 className="clip-text header-with-icon">
              <span className="fa fa-archive"></span>
              <span className="header-text">My Files</span>
            </h1>
          </div>
          <ServerButton/>
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
      </Paper>);
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