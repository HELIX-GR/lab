import React from "react";
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import Dropzone from 'react-dropzone';
import { Button as Btn } from 'reactstrap';
import { Modal, ModalHeader, ModalFooter } from 'reactstrap';
import formatFileSize from '../../util/file-size';
import { uploadFile } from '../../ducks/filesystem';
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
    path: this.props.path,
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
    toast.dismiss();

    let path = this.props.path;
    if (path.startsWith('/')) {
      path = path.slice(1);
    }

    this.setState({
      isUploading: true,
    });

    const file = this.state.file;

    this.props.uploadFile({ path, filename: file.name, }, file)
      .then(() => {
        toast.success(`File ${file.name} has been uploaded successfully`);
        this.setState({
          file: null,
          newFolderName: '',
          isUploading: false,
          open: false,
        });
      })
      .catch((err) => {
        toast.error(err.errors[0].description);
        this.setState({
          isUploading: false,
        });
      });
  };

  render() {

    return (
      <div className="filesystem-btn">
        <a data="UPLOAD FILE" onClick={this.handleOpen}>
          <img src="/images/svg/SVG/upload.svg" />
          <Modal isOpen={this.state.open} toggle={this.toggle} >
            <ModalHeader toggle={this.toggle}>Upload a file</ModalHeader>

            <div>
              <Dropzone
                onDrop={(accepted, rejected) => {
                  if (rejected.length) {
                    console.error('rejected file:', rejected);
                  }
                  const file = accepted && accepted.length && accepted[0];
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
                {({ getRootProps, getInputProps }) => {
                  return (
                    <div {...getRootProps()} style={{
                      textAlign: 'center',
                      fontSize: '3em',
                      color: '#656565',
                      border: '1px dotted #656565',
                      height: '12rem',
                      paddingTop: '1rem',
                    }}>
                      <input {...getInputProps()} />
                      {this.state.isUploading ?
                        <div style={{ paddingTop: '3rem' }}>
                          <CircularProgress size={80} thickness={5} />
                        </div>
                        :
                        <div>
                          <i className="fa fa-cloud-upload fa-4x"></i>
                        </div>
                      }
                    </div>
                  );
                }}
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
    filesystem: state.filesystem.data,
    path: state.filesystem.path,
  };
}


const mapDispatchToProps = (dispatch) => bindActionCreators({ uploadFile }, dispatch);



export default UploadModal = connect(mapStateToProps, mapDispatchToProps)(UploadModal);