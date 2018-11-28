import React from "react";
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Button as Btn } from 'reactstrap';
import { Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import { Form, FormGroup, Label, Input } from 'reactstrap';

import Button from '@material-ui/core/Button';
import { publishFile } from '../../ducks/config';
import { toast, } from 'react-toastify';
import CreatableSelect from 'react-select/lib/Creatable';


const tagOptions = [
  { value: 'Python', label: 'Python' },
  { value: 'R language', label: 'R language' },
  { value: 'Data Science', label: 'Data Science' },
  { value: 'Lite', label: 'Lite' },
  { value: 'GeoNotebook', label: 'GeoNotebook' },
  { value: 'scipy', label: 'scipy' },
];
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

  getFileExtension = (filename) => {
    return filename.substring(filename.lastIndexOf('.') + 1, filename.length) || filename;
  };

  handlePublish = () => {
    let path = this.props.table_path;
    if (path.startsWith('/')) {
      path = path.slice(1);
    }

    this.setState({
      isPublishing: true,
    });

    let { title, filename, filerename, description, lang, tags } = this.state;
    if (this.getFileExtension(filename) == "ipynb") {
      this.props.publishFile({ title, path, filename, filerename, description, lang, tags })
        .then((fs) => {
          this.handleClose();
        })
        .catch((err) => {
          toast.error("Can't publish this file!");
          this.setState({
            isPublishing: false,
          });
        });
    } else {
      toast.error("Only Notebooks (.ipynb) can be published!");
      this.setState({
        isPublishing: false,
      });

    }
  };

  handleChange = (event) => {
    this.setState({ [event.target.id]: event.target.value });
    // this.props.change(this.state);
  }

  handleChangeTags = (newValue, actionMeta) => {
    var arr = [];
    newValue.map(s => { arr.push(s.value); });
    this.setState({ tags: arr });
  };

  render() {
    const show = this.getFileExtension(this.props.selected_file) == "ipynb";
    return (show &&
      <div className="filesystem-btn">
        <a data="PUBLISH NOTEBOOK" onClick={this.handleOpen}>
          <img src="/images/svg/SVG/copy.svg" /></a>
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

                <Label for="tags">Select tags</Label>
                <CreatableSelect
                  isClearable
                  isMulti
                  name="tags"
                  options={tagOptions}
                  onChange={this.handleChangeTags}
                />
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
      </div>
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