import React from "react";
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Button as Btn } from 'reactstrap';
import { Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import { Form, FormGroup, Label, Input } from 'reactstrap';

import { publishNotebook } from '../../ducks/notebook';
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

  constructor(props) {
    super(props);

    this.state = {
      title: '',
      open: false,
      filename: '',
      filerename: '',
      isPublishing: false,
      path: this.props.path,
      lang: "Python"
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleChangeTags = this.handleChangeTags.bind(this);
  }

  toggle() {
    if (this.state.open) {
      this.handleClose();
    }
    else {
      this.handleOpen();
    }
  }

  handleOpen() {
    this.setState({
      open: true,
      path: this.props.path,
      filename: this.props.selectedFile,
      filerename: this.props.selectedFile,
    });
  }

  handleClose() {
    this.setState({
      title: '',
      open: false,
      filename: '',
      filerename: '',
      isPublishing: false,
    });
  }

  getFileExtension(filename) {
    return filename.substring(filename.lastIndexOf('.') + 1, filename.length) || filename;
  }

  handlePublish() {
    let path = this.props.path;
    if (path.startsWith('/')) {
      path = path.slice(1);
    }

    this.setState({
      isPublishing: true,
    });

    let { title, filename, filerename, description, lang, tags } = this.state;
    if (this.getFileExtension(filename) == "ipynb") {
      this.props.publishNotebook({ title, path, filename, filerename, description, lang, tags })
        .then((result) => {
          if (result) {
            const style = { fontWeight: 'bold', textDecoration: 'underline', color: '#ffffff' };
            const href = `/notebook/${result.package_id}`;

            toast.success(
              <span>File <a style={style} href={href}>{filename}</a> has been published successfully</span>, {
              autoClose: 5000,
              closeOnClick: false,
              pauseOnHover: true
            });
          }

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
  }

  handleChange(event) {
    this.setState({ [event.target.id]: event.target.value });
    // this.props.change(this.state);
  }

  handleChangeTags(newValue) {
    var arr = [];
    newValue.map(s => { arr.push(s.value); });
    this.setState({ tags: arr });
  }

  render() {
    const show = this.getFileExtension(this.props.selectedFile) == "ipynb";
    return (show &&
      <div className="filesystem-btn">
        <a data="PUBLISH NOTEBOOK" onClick={() => this.handleOpen()}>
          <img src="/images/svg/SVG/copy.svg" /></a>
        <Modal isOpen={this.state.open} toggle={() => this.toggle()} >
          <ModalHeader toggle={() => this.toggle()}>Publish a notebook</ModalHeader>

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
              onClick={(e) => this.handlePublish()}
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
    filesystem: state.filesystem.data,
    path: state.filesystem.path,
    selectedFile: state.filesystem.selectedFile,
  };
}


const mapDispatchToProps = (dispatch) => bindActionCreators({ publishNotebook }, dispatch);



export default PublishModal = connect(mapStateToProps, mapDispatchToProps)(PublishModal);