import _ from 'lodash';
import React from 'react';

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { toast } from 'react-toastify';

import { Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';

import Button from '@material-ui/core/Button';
import ServerForm from './server-form';

import { addServer } from '../../../ducks/admin';
import { formatErrors } from '../../../model/error';

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

class ModalAddServer extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      visible: false,
      server: null,
    };
  }

  toggleModal() {
    const { visible } = this.state;

    this.setState({
      visible: !visible,
      server: {
        available: false,
        description: '',
        eligibleRole: 'ROLE_STANDARD',
        kernels: [],
        memory: 1024,
        name: '',
        tags: [],
        token: '',
        url: '',
        virtualCores: 1,
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

    this.props.addServer(server)
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
      <div>
        <Button onClick={() => this.toggleModal()}>Add Server</Button>

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
              <ServerForm server={server} kernels={kernels} change={(server) => this.onChange(server)} />
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
  addServer,
}, dispatch);

export default ModalAddServer = connect(mapStateToProps, mapDispatchToProps)(ModalAddServer);
