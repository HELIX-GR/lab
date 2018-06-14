import React from "react";
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import Dropzone from 'react-dropzone';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import FloatingActionButton from 'material-ui/FloatingActionButton';
import formatFileSize from '../../util/file-size';
import FileUpload from 'material-ui/svg-icons/file/file-upload';
import { uploadFile } from '../../ducks/config';
import CircularProgress from 'material-ui/CircularProgress';

/**
 * A modal dialog can only be closed by selecting one of the actions.
 */
class UploadModal extends React.Component {
  state = {
    open: false,
    file: null,
    newFolderName: '',
    isUploading: false,
    path: this.props.table_path,
  };

  handleOpen = () => {
    this.setState({ open: true });
  };

  handleClose = () => {
    this.setState({
      open: false,
      file: null,
      newFolderName: '',
      isUploading: false,
    });
  };


  handleUpload = () => {

    let path = this.props.table_path;
    if (path.startsWith('/')) {
      path = path.slice(1);
    }
    console.log("path : ", path);
    this.setState({
      isUploading: true,
    });
    let file = this.state.file;
    this.props.uploadFile({ path, filename: file.name, }, file, )
      .then(fs => {
        console.log(fs);
        this.setState({
          newFolderName: '',
          isUploading: false,
          open: false,
        });
      })
      .catch((err) => {
        this.setState({
          isUploading: false,
        });
      });
  };

  render() {
    const actions = [
      <FlatButton
        label="Cancel"
        primary={true}
        onClick={this.handleClose}
      />,
      <FlatButton
        label="Upload"
        primary={true}
        disabled={false}
        onClick={this.handleUpload}
      />,
    ];
    const dzstyle = {
      textAlign: 'center',
      fontSize: '3em',
      color: '#656565',
      border: '1px dotted #656565'
    };


    return (
      <FloatingActionButton
        mini={true}
        style={{ margin: 12 }}
        label="Modal Dialog"
        onClick={this.handleOpen} >
        <FileUpload />
        <Dialog
          title="Upload a file"
          actions={actions}
          modal={true}
          open={this.state.open}
        >
          <div>
            <Dropzone
              onDrop={(accepted, rejected) => {
                if (rejected.length) {
                  console.error('rejected file:', rejected);
                }
                const file = accepted && accepted.length && accepted[0];
                console.log(file);
                this.setState({
                  file: file,
                  isUploading: false,
                });


              }}
              style={{
                textAlign: 'center',
                fontSize: '3em',
                color: '#656565',
                border: '1px dotted #656565',
                height: '12rem',
              }}
              disableClick={false}
              multiple={false}
              disabled={this.state.isUploading}
            >
              {this.state.isUploading ?
                <div style={{ paddingTop: '3rem' }}>
                  <CircularProgress size={80} thickness={5} />
                </div>
                :
                <div>
                  <i className="fas fa-cloud-upload fa-4x"></i>
                </div>
              }
            </Dropzone>
            {this.state.file && this.state.file.name}
            {this.state.file && ` (${formatFileSize(this.state.file.size)})`}
          </div>
        </Dialog>
      </FloatingActionButton>

    );
  }
}

function mapStateToProps(state) {
  return {
    filesystem: state.config.filesystem,
    table_path: state.config.table_path,
  };
}


const mapDispatchToProps = (dispatch) => bindActionCreators({ uploadFile }, dispatch);



export default UploadModal = connect(mapStateToProps, mapDispatchToProps)(UploadModal);