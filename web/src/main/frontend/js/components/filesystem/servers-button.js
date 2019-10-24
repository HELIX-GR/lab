import React from "react";
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import ServerList from './server-list';
import { getServers } from '../../ducks/user';
import { setSelectedHub } from '../../ducks/server';
import { FormattedMessage } from 'react-intl';

import { startNotebookServer, stopNotebookServer, getUserServer } from '../../ducks/server';
import { Modal, ModalHeader, ModalBody } from 'reactstrap';

class ServerButton extends React.Component {

  constructor(props) {
    super(props);
    this.toggle = this.toggle.bind(this);

    this.state = {
      popoverOpen: false,
      server: null,
      kernel: null,
    };
  }

  componentWillMount() {
    if (this.props.user !== null) {
      this.props.getServers();
      this.props.getUserServer();
    }
  }

  onSelectServer(server, kernel) {
    this.props.setSelectedHub(server, kernel);

    this.setState({
      popoverOpen: false,
      server,
      kernel,
    });
  }

  toggle() {
    this.setState({
      popoverOpen: !this.state.popoverOpen
    });
  }

  render() {
    const { serverStage } = this.props;

    return (
      <div>
        {serverStage == 0 &&
          <div id="Popover1" className="button-notebook" onClick={this.toggle}>
            <FormattedMessage id="server-selection.buttons.select" />
            <i className="fa fa-crosshairs"></i>

            <Modal isOpen={this.state.popoverOpen} toggle={this.toggle} >
              <ModalHeader toggle={this.toggle}><FormattedMessage id="server-selection.title" /></ModalHeader>

              <ModalBody>
                <ServerList kernels={this.props.kernels} servers={this.props.servers} selectServer={(server, kernel) => this.onSelectServer(server, kernel)} />
              </ModalBody>
            </Modal>
          </div>

        }
        {serverStage == 1 &&
          <div className="button-notebook" onClick={() => this.props.startNotebookServer(this.props.selectedHub.id, this.props.selectedKernel.name)}>
            {this.props.selectedHub && `${this.props.selectedHub.name} | ${this.props.selectedKernel.tag}`}
            <i className="fa fa-play"></i>
          </div>
        }

        {serverStage == 2 && <div className="button-notebook animation">
          {`${this.props.selectedHub.name} | ${this.props.selectedKernel.tag}`}
          <i className="fa fa-server"></i>
        </div>
        }

        {serverStage == 3 &&
          <div className="button-notebook" onClick={() => this.props.stopNotebookServer(this.props.selectedHub.id)}>
            <FormattedMessage id="server-selection.buttons.stop-server" />
            <i className="fa fa-stop"></i>
          </div>}


      </div >
    );
  }
}

function mapStateToProps(state) {
  return {
    kernels: state.config.kernels,
    selectedHub: state.server.selectedHub,
    selectedKernel: state.server.selectedKernel,
    serverStage: state.server.serverStage,
    servers: state.user.servers,
    user: state.user,
  };
}

const mapDispatchToProps = (dispatch) => bindActionCreators({
  getServers,
  getUserServer,
  setSelectedHub,
  startNotebookServer,
  stopNotebookServer,
}, dispatch);

export default ServerButton = connect(mapStateToProps, mapDispatchToProps)(ServerButton);