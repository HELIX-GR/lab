import React from "react";
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import Button from '@material-ui/core/Button';
import ServerForm from './server-form';
import { updateServer } from '../../ducks/admin';
import { Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import * as PropTypes from 'prop-types';


class ModalEditServer extends React.Component {
  constructor(props) {
    super(props);

    this.handleOpen = this.handleOpen.bind(this);
    this.handleShow = this.handleShow.bind(this);
    this.handleClose = this.handleClose.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.state = {
      show_modal: false,
      data: null
    };
  }

  handleClose() {
    this.setState({ show_modal: false });
  }

  handleOpen() {
    this.setState({
      show_modal: !this.state.show_modal,
      id: this.props.data.id,
      data: {
        ...this.props.data,
        tags: this.props.data.tags
      }

    });
  }

  handleShow() {
    this.setState({ show_modal: !this.state.show_modal });
  }

  handleChange(data) {
    this.setState({ data });
  }

  handleSubmit() {
    this.props.updateServer(this.props.data.id, this.state.data)
      .then(this.setState({ show_modal: false }));

  }
  
  render() {
    return (
      <div>
        <i className="fa fa-wrench" onClick={this.handleOpen}></i>

        <Modal isOpen={this.state.show_modal} toggle={this.handleShow} className={this.props.className}>
          <ModalHeader toggle={this.handleShow}>Edit Server: {this.props.data.name}</ModalHeader>
          <ModalBody>
            <ServerForm change={this.handleChange} handleClose={this.handleClose} data={this.state.data} />
          </ModalBody>
          <ModalFooter>
            <Button color="secondary" onClick={this.handleClose}>Cancel</Button>{' '}
            <Button color="primary" onClick={this.handleSubmit}>Submit</Button>
          </ModalFooter>
        </Modal>

      </div>
    );
  }
}
ModalEditServer.propTypes = {
  data: PropTypes.object,
};

function mapStateToProps(state) {
  return {
  };
}
const mapDispatchToProps = (dispatch) => bindActionCreators({ updateServer }, dispatch);

export default ModalEditServer = connect(mapStateToProps, mapDispatchToProps)(ModalEditServer);
