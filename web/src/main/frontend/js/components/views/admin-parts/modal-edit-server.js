import _ from 'lodash';
import React from "react";

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { toast } from 'react-toastify';
import { Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';

import Button from '@material-ui/core/Button';

import { updateServer } from '../../../ducks/admin';

import ServerForm from './server-form';

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
        toast.error(err.errors[0].description);
      });
  }

  render() {
    const { server } = this.state;
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
      </div>
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
