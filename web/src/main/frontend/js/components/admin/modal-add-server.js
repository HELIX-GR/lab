import React from "react";
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import Button from '@material-ui/core/Button';
import ServerForm from './server-form';
import { addServer } from '../../ducks/admin';
import { Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';


class ModalAddServer extends React.Component {
  constructor(props) {
    super(props);

    this.handleShow = this.handleShow.bind(this);
    this.handleClose = this.handleClose.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.state = {
      show_modal: false,
      data: {
        name: "",
        url: "",
        description: "",
        token: "",
        available: false,
        memory: 1024,
        virtualCores: 1,
        eligibleRole: "ROLE_STANDARD"
      }
    };
  }


  handleClose() {
    this.setState({ show_modal: false });
  }

  handleShow() {
    this.setState({ show_modal: !this.state.show_modal });
  }
  handleChange(data) {
    this.setState({ data });
  }
  handleSubmit() {
    this.props.addServer(this.state.data)
      .then(this.setState({ show_modal: false }));

  }

  render() {
    return (
      <div>
        <Button onClick={this.handleShow}>Add Server </Button>

        <Modal isOpen={this.state.show_modal} toggle={this.handleShow} className={this.props.className}>
          <ModalHeader toggle={this.handleShow}>Add Server</ModalHeader>
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

function mapStateToProps(state) {
  return {
  };
}
const mapDispatchToProps = (dispatch) => bindActionCreators({ addServer }, dispatch);



export default ModalAddServer = connect(mapStateToProps, mapDispatchToProps)(ModalAddServer);