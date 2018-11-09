import React from "react";
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import Dropzone from 'react-dropzone';
import { Button as Btn } from 'reactstrap';
import { Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import Button from '@material-ui/core/Button';
import formatFileSize from '../../util/file-size';
import { uploadFile } from '../../ducks/config';
import CircularProgress from '@material-ui/core/CircularProgress';
import { toast, } from 'react-toastify';

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


  toggle = () => {
    if (this.state.open) {
      this.handleClose();
    }
    else {
      this.handleOpen();
    }
  }
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
    this.props.uploadFile({ path, filename: file.name, }, file)
      .then(fs => {
        toast.success("The file is uploaded!");
        this.setState({
          file: null,
          newFolderName: '',
          isUploading: false,
          open: false,
        });
      })
      .catch((err) => {
        toast.error("Can't upload file!");
        this.setState({
          isUploading: false,
        });
      });
  };

  render() {

    return (
      <div className="filesystem-btn">
        <a onClick={this.handleOpen}>
          <img src="/images/svg/SVG/upload.svg" title="Upload File" />
          <Modal isOpen={this.state.open} toggle={this.toggle} >
            <ModalHeader toggle={this.toggle}>Upload a file</ModalHeader>

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
                    <i className="fa fa-cloud-upload fa-4x"></i>
                  </div>
                }
              </Dropzone>
              {this.state.file && this.state.file.name}
              {this.state.file && ` (${formatFileSize(this.state.file.size)})`}
            </div>

            <ModalFooter>
              <Btn
                color="primary"
                onClick={this.handleClose}
              >Cancel </Btn>{' '}
              <Btn
                color="primary"
                onClick={this.handleUpload}
                disabled={this.state.file == null}
              >Upload </Btn>

            </ModalFooter>

          </Modal>
        </a>
      </div>
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