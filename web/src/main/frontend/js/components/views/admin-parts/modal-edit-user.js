import _ from 'lodash';
import React from 'react';

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { toast } from 'react-toastify';
import { Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';

import Button from '@material-ui/core/Button';

import { updateUser } from '../../../ducks/admin';

import UserForm from './user-form';

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
        toast.error(err.errors[0].description);
      });
  }

  render() {
    const { user } = this.state;
    const { kernels } = this.props;

    return (
      <div onClick={() => this.toggleModal()}>
        <i className="fa fa-wrench"></i>

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

      </div >
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
