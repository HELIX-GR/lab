import React from "react";
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import Dropzone from 'react-dropzone';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import FloatingActionButton from 'material-ui/FloatingActionButton';
import formatFileSize from '../../util/file-size'
import FileUpload from 'material-ui/svg-icons/file/file-upload';
import { uploadFile } from '../../ducks/config';

/**
 * A modal dialog can only be closed by selecting one of the actions.
 */
class UploadModal extends React.Component {
  state = {
    open: false,
    file: null,
  };

  handleOpen = () => {
    this.setState({ open: true });
  };

  handleClose = () => {
    this.setState({ open: false });
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
        onClick={this.handleClose}
      />,
    ];
    const dzstyle = {
      textAlign: 'center',
      fontSize: '3em',
      color: '#656565',
      border: '1px dotted #656565'
    }

    const { uploadFile } = this.props;
    console.log(uploadFile);

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
              style={dzstyle}
              onDrop={(accepted, rejected) => {
                if (rejected.length) {
                  console.error('rejected file:', rejected);
                }
                const file = accepted && accepted.length && accepted[0];
                this.setState({ file });
                if (typeof uploadFile === 'function') {
                  console.log("upload", file);
                  uploadFile(file);
                }

              }}
              disableClick={false}
              multiple={false}
            >
              <i className="fas fa-cloud-upload-alt"></i>

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
  };
}


const mapDispatchToProps = (dispatch) => bindActionCreators({ uploadFile }, dispatch);



export default UploadModal = connect(mapStateToProps, mapDispatchToProps)(UploadModal);