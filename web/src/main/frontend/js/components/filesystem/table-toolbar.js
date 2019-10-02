import React from "react";
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import PropTypes from 'prop-types';

import ServerButton from './servers-button';
import { getFileSystem, createFolder, deletePath, setNewFolder } from '../../ducks/filesystem';
import UploadModal from './upload-modal';
import PublishModal from './publish-modal';
import { toast, } from 'react-toastify';

class TableToolbar extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      value: 1,
    };
    this.handleCreate = this.handleCreate.bind(this);
    this.handleRefresh = this.handleRefresh.bind(this);

  }

  handleCreate = () => {
    this.props.setNewFolder(true);
  }

  handleRefresh = () => {
    this.props.getFileSystem('');
  }

  handleDelete = () => {
    let target = this.props.path + "/" + this.props.selectedFile;

    if (this.props.path === "/") {
      target = "/" + this.props.selectedFile;
    }

    this.props.deletePath(target)
      .catch(err => {
        toast.error(err.errors[0].description);
      });
  }

  render() {
    return (
      <div className="row">
        <div className="col-12 col-lg-6">
          <div className="filesystem-btn">
            <a data="NEW FOLDER" onClick={this.handleCreate}>
              <img src="/images/svg/SVG/add.svg" /></a>
          </div>
          {this.props.selectedFile &&
            <div className="filesystem-btn">
              <a data="DELETE" onClick={this.handleDelete}>
                <img src="/images/svg/SVG/delete.svg" /></a>
            </div>
          }

          {this.props.upload &&
            <UploadModal />
          }

          <div className="filesystem-btn">
            <a data="REFRESH" onClick={this.handleRefresh}>
              <img src="/images/svg/SVG/refresh.svg" /></a>
          </div>
          <PublishModal />

          {!this.props.selectedHub ?
            null
            : this.props.endpoint ?
              <div className="filesystem-btn">
                <a data="RUN " target="_blank" href={this.props.endpoint}>
                  {
                    //+ "/notebooks/" + this.props.path + this.props.selectedFile
                  }
                  <img src="/images/svg/SVG/run.svg" title="Run" /></a>
              </div> : null}

          {/* <Button variant="fab" mini={true} style={style} onClick={this.handleCreate}>
              <img className="image-icon" src="/images/svg/SVG/add.svg" title="Create Folder" />
            </Button>
            <Button variant="fab" mini={true} style={style} onClick={this.handleRefresh} >
              <img className="image-icon" src="/images/svg/SVG/refresh.svg" title="Refresh" />
            </Button>
            <UploadModal />
            <Button variant="fab" mini={true} style={style} onClick={this.handleDelete} >
              <img className="image-icon" src="/images/svg/SVG/delete.svg" title="Delete" />
            </Button>
            <PublishModal />
            {!this.props.selectedHub ?
              null
              : this.props.endpoint ?
                <Button variant="fab" label="Play" mini={true} style={style} target="_blank" href={this.props.endpoint + "/notebooks/" + this.props.path + this.props.selectedFile}>
                  <img className="image-icon" src="/images/svg/SVG/run.svg" title="Run" />
            </Button> : null}*/}
        </div>
        {this.props.serverButton &&
          <div className="col-12 col-lg-6 text-lg-right">
            <ServerButton />
          </div>
        }
      </div>
    );
  }

}
TableToolbar.propTypes = {
  path: PropTypes.string.isRequired,
  selectedFile: PropTypes.string.isRequired,
  endpoint: PropTypes.string,
};


function mapStateToProps(state) {
  return {
    filesystem: state.filesystem.data,
    path: state.filesystem.path,
    selectedFile: state.filesystem.selectedFile,
    endpoint: state.server.endpoint,
    selectedHub: state.server.selectedHub,
  };
}


const mapDispatchToProps = (dispatch) => bindActionCreators({ getFileSystem, createFolder, deletePath, setNewFolder }, dispatch);



export default TableToolbar = connect(mapStateToProps, mapDispatchToProps)(TableToolbar);