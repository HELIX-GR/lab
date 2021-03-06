import React from "react";

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { toast } from 'react-toastify';

import { Modal, ModalHeader, ModalBody } from 'reactstrap';

import Button from '@material-ui/core/Button';
import WhiteListForm from './white-list-form';

import { addWhiteListUser } from '../../../ducks/admin';
import { formatErrors } from '../../../model/error';

const fieldMapper = (field) => {
  switch (field) {
    case 'email':
      return 'Email';
    case 'lastName':
      return 'Last Name';
    case 'firstName':
      return 'First Name';
    case 'roles':
      return 'Roles';
    case 'kernels':
      return 'Kernels';
    default:
      return null;
  }
};

class ModalAddWhiteList extends React.Component {

  constructor(props) {
    super(props);

    this.handleShow = this.handleShow.bind(this);
    this.onClose = this.onClose.bind(this);
    this.onAccept = this.onAccept.bind(this);

    this.state = {
      open: false,
    };
  }

  onClose() {
    this.setState({ open: false });
  }

  handleShow() {
    this.setState({ open: true });
  }


  onAccept(userInfo) {
    this.props.addWhiteListUser(userInfo)
      .then(() => {
        this.onClose();
      })
      .catch(err => {
        toast.error(formatErrors(err.errors, fieldMapper));
        throw err;
      });
  }

  render() {
    const { kernels } = this.props;

    return (
      <div>
        <Button onClick={this.handleShow}>Whitelist a User</Button>
        <Modal className="modal-dialog-centered"
          isOpen={this.state.open}
          toggle={this.onClose}
          backdrop={false}
          keyboard={false}
        >
          <ModalHeader toggle={this.onClose}> Users White List </ModalHeader>
          <ModalBody>
            <WhiteListForm kernels={kernels} accept={this.onAccept} cancel={this.onClose} />
          </ModalBody>
        </Modal>
      </div>
    );
  }
}


const mapStateToProps = (state) => ({
  kernels: state.config.kernels,
});

const mapDispatchToProps = (dispatch) => bindActionCreators({
  addWhiteListUser,
}, dispatch);

export default ModalAddWhiteList = connect(mapStateToProps, mapDispatchToProps)(ModalAddWhiteList);
