import React from "react";
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Button as Btn } from 'reactstrap';
import { Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import { Form, FormGroup, Label, Input, FormText } from 'reactstrap';
import { InputGroup, InputGroupAddon, InputGroupText } from 'reactstrap';

import Button from '@material-ui/core/Button';
import formatFileSize from '../../util/file-size';
import { publishFile } from '../../ducks/config';
import { toast, } from 'react-toastify';

/**
 * A modal dialog can only be closed by selecting one of the actions.
 */
class PublishModal extends React.Component {
  state = {
    open: false,
    file: null,
    newFolderName: '',
    isUploading: false,
    path: this.props.table_path,
  };


  toggle = () => {
    if (this.state.open) {
      this.handleClose()
    }
    else {
      this.handleOpen()
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
      <Button
        variant="fab"
        mini={true}
        style={{ margin: 12 }}
        label="Modal Dialog"
        onClick={this.handleOpen} >
        <img className="image-icon" src="/images/svg/SVG/copy.svg" title="Publish" />
        <Modal isOpen={this.state.open} toggle={this.toggle} >
          <ModalHeader toggle={this.toggle}>Publish a notebook</ModalHeader>

          <ModalBody>
            <Form autoComplete={false} onClose={this.props.handleClose}>
              <FormGroup autoComplete={false}>
                <Label for="name">Title</Label>
                <Input type="text" name="name" id="name" value={this.state.name} placeholder="Give a title to your upload" onChange={this.handleChange} />
              </FormGroup>
              <FormGroup autoComplete={false}>
                <Label for="name">File name</Label>
                <Input placeholder={this.props.selected_file} />
              
              </FormGroup>

              <FormGroup>
                <Label for="description">Description</Label>
                <Input type="textarea" name="description" id="description" placeholder="Description visible to user." onChange={this.handleChange} />
              </FormGroup>
              <FormGroup>
                <Label for="role_eligible">Select language</Label>
                <Input type="select" name="role_eligible" id="role_eligible" placeholder="What role a user must have to see this server?" onChange={this.handleChangeRole}>
                  <option key={'ROLE_STANDARD'} value={'ROLE_STANDARD'}> Python</option>
                  <option key={'ROLE_BETA'} value={'ROLE_BETA'}> R</option>
                  <option key={'ROLE_ADMIN'} value={'ROLE_ADMIN'}> C</option>
                </Input>
              </FormGroup>

            </Form>
          </ModalBody>

          <ModalFooter>
            <Btn
              color="primary"
              onClick={this.handleClose}
            >Cancel </Btn>{' '}
            <Btn
              color="primary"
              onClick={this.handleUpload}
              disabled={this.state.file == null}
            >Publish </Btn>

          </ModalFooter>

        </Modal>
      </Button>

    );
  }
}

function mapStateToProps(state) {
  return {
    filesystem: state.config.filesystem,
    table_path: state.config.table_path,
    selected_file: state.config.selected_file,
  };
}


const mapDispatchToProps = (dispatch) => bindActionCreators({ publishFile }, dispatch);



export default PublishModal = connect(mapStateToProps, mapDispatchToProps)(PublishModal);