import _ from 'lodash';
import React from 'react';

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { toast } from 'react-toastify';
import { Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';

import Button from '@material-ui/core/Button';

import { formatErrors } from '../../../model/error';
import { updateUser } from '../../../ducks/admin';

import UserForm from './user-form';

const fieldMapper = (field) => {
  switch (field) {
    case 'email':
      return 'Email';
    case 'familyName':
      return 'Last Name';
    case 'givenName':
      return 'First Name';
    case 'roles':
      return 'Roles';
    case 'kernels':
      return 'Kernels';
    default:
      return null;
  }
};

class ModalAddUser extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      visible: false,
      user: null,
    };
  }

  toggleModal() {
    const { visible } = this.state;
    const { user } = this.props;

    this.setState({
      visible: !visible,
      user: {
        ..._.cloneDeep(user),
      },
    });
  }

  onChange(updates) {
    this.setState((state) => ({
      ...state,
      user: {
        ...state.user,
        ...updates,
      },
    }));
  }

  update() {
    const { user } = this.state;

    this.props.updateUser(user.id, user)
      .then(() => {
        this.toggleModal();
      })
      .catch((err) => {
        toast.error(formatErrors(err.errors, fieldMapper));
      });
  }

  render() {
    const { user } = this.state;
    const { kernels } = this.props;

    return (
      <React.Fragment>
        <div onClick={() => this.toggleModal()}>
          <i className="fa fa-pencil"></i>
        </div >
        {this.state.visible &&
          <Modal
            isOpen={this.state.visible}
            toggle={() => this.toggleModal()}
            className={this.props.className}
            centered={true}
            backdrop={false}
            keyboard={false}
          >
            <ModalHeader toggle={() => this.toggleModal()}>Add Server</ModalHeader>
            <ModalBody>
              <UserForm user={user} kernels={kernels} change={(user) => this.onChange(user)} />
            </ModalBody>
            <ModalFooter>
              <Button color="secondary" onClick={() => this.toggleModal()}>Cancel</Button>{' '}
              <Button color="primary" onClick={() => this.update()}>Submit</Button>
            </ModalFooter>
          </Modal>
        }
      </React.Fragment>
    );
  }
}

const mapStateToProps = (state) => ({
  kernels: state.config.kernels,
});

const mapDispatchToProps = (dispatch) => bindActionCreators({
  updateUser,
}, dispatch);

export default ModalAddUser = connect(mapStateToProps, mapDispatchToProps)(ModalAddUser);
