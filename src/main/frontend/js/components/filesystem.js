import React from "react";
import _ from 'lodash';

import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { FileSelect } from './helpers/file-select';
import { Route } from 'react-router-dom';
import { getFilesystem } from '../ducks/config';


class Filesystem extends React.Component {
  constructor(props) {
    super(props);
    
		this.state = {
      user:"totos2",
      show_login:false,
    };
  }
  componentWillMount() {
    if (this.props.user == null) {
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

    return   (
      <div>
        <h2>hello </h2>
      <FileSelect
        {...this.props}
        id="My Files "
        label="File system resource"
        help="Click on resource to select"
        style={{ height: '40vh' }}
      /> 
    </div>)
}
}

function mapStateToProps(state) {
  return {
    filesystem: state.config.filesystem,
  };
}


const mapDispatchToProps = (dispatch) => bindActionCreators({ getFilesystem }, dispatch);



export default connect(mapStateToProps, mapDispatchToProps)(Filesystem);