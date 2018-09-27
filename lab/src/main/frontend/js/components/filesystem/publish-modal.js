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
    title: '',
    open: false,
    filename: '',
    filerename: '',
    isPublishing: false,
    path: this.props.table_path,
    lang: "Python"
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
    this.setState({
      open: true,
      path: this.props.table_path,
      filename: this.props.selected_file,
      filerename: this.props.selected_file,
    });
  };

  handleClose = () => {
    this.setState({
      title: '',
      open: false,
      filename: '',
      filerename: '',
      isPublishing: false,
    });
  };


  handlePublish = () => {

    let path = this.props.table_path;
    if (path.startsWith('/')) {
      path = path.slice(1);
    }
   
    console.log("path : ", path);
    this.setState({
      isPublishing: true,
    });

    let { title, filename, filerename, description, lang } = this.state;
    this.props.publishFile({ title, path, filename, filerename, description, lang })
      .then(fs => {
        toast.success("The file is published!");
        this.handleClose();
      })
      .catch((err) => {
        toast.error("Can't publish this file!");
        this.setState({
          isPublishing: false,
        });
      });
  };

  handleChange = (event) => {
    this.setState({ [event.target.id]: event.target.value });
    // this.props.change(this.state);
  }

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
            <Form onClose={this.props.handleClose}>
              <FormGroup >
                <Label for="title">Title</Label>
                <Input type="text" id="title" value={this.state.title} placeholder="Give a title to your upload" onChange={this.handleChange} />
              </FormGroup>
              <FormGroup >
                <Label for="name">File name</Label>
                <Input id="filerename" placeholder={this.state.filename} value={this.state.filerename} onChange={this.handleChange} />

              </FormGroup>

              <FormGroup>
                <Label for="description">Description</Label>
                <Input type="textarea" name="description" id="description" value={this.state.description} placeholder="Description visible to user." onChange={this.handleChange} />
              </FormGroup>
              <FormGroup>
                <Label for="role_eligible">Select language</Label>
                <Input type="select" name="lang" id="lang"  onChange={this.handleChange}>
                  <option key={'Python'} value={'Python'}> Python</option>
                  <option key={'R'} value={'R'}> R</option>
                  <option key={'C'} value={'C'}> C</option>
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
              onClick={this.handlePublish}
              disabled={this.state.title == null}
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