import _ from 'lodash';
import React from "react";

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { toast } from 'react-toastify';
import { Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';

import Button from '@material-ui/core/Button';

import { formatErrors } from '../../../model/error';
import { updateServer } from '../../../ducks/admin';

import ServerForm from './server-form';

const fieldMapper = (field) => {
  switch (field) {
    case 'available':
      return 'Available';
    case 'description':
      return 'Description';
    case 'eligibleRole':
      return 'Eligible Role';
    case 'kernels':
      return 'Kernels';
    case 'memory':
      return 'Ram';
    case 'name':
      return 'Name';
    case 'tags':
      return 'Tags';
    case 'token':
      return 'Admin token';
    case 'url':
      return 'URL';
    case 'virtualCores':
      return 'Virtual CPUs';
    default:
      return null;
  }
};

class ModalEditServer extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      visible: false,
      server: null,
    };
  }

  toggleModal() {
    const { visible } = this.state;
    const { server } = this.props;

    this.setState({
      visible: !visible,
      server: {
        ..._.cloneDeep(server),
      },
    });
  }

  onChange(updates) {
    this.setState((state) => ({
      ...state,
      server: {
        ...state.server,
        ...updates,
      },
    }));
  }

  update() {
    const { server } = this.state;

    this.props.updateServer(server.id, server)
      .then(() => {
        this.toggleModal();
      })
      .catch((err) => {
        toast.error(formatErrors(err.errors, fieldMapper));
      });
  }

  render() {
    const { server } = this.state;
    const { kernels } = this.props;

    return (
      <React.Fragment>
        <div onClick={() => this.toggleModal()}>
          <i className="fa fa-wrench"></i>
        </div>
        {this.state.visible &&
          <Modal
            isOpen={this.state.visible}
            toggle={() => this.toggleModal()}
            className={this.props.className}
            centered={true}
            backdrop={false}
            keyboard={false}
          >
            <ModalHeader toggle={() => this.toggleModal()}>Edit Server: {this.props.server.name}</ModalHeader>
            <ModalBody>
              <ServerForm server={server} kernels={kernels} change={(server) => this.onChange(server)} />
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
  updateServer,
}, dispatch);

export default ModalEditServer = connect(mapStateToProps, mapDispatchToProps)(ModalEditServer);
