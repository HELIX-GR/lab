import React from "react";
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import ServerList from './server-list';
import { getServers } from '../../ducks/user';
import { setSelectedHub } from '../../ducks/server';
import { FormattedMessage } from 'react-intl';

import { startNotebookServer, stopNotebookServer, getUserServer } from '../../ducks/server';
import { Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';


class ServerButton extends React.Component {
  constructor(props) {
    super(props);
    this.toggle = this.toggle.bind(this);

    this.state = {
      popoverOpen: false,
      selectedIndex: 0,
    };
  }
  componentWillMount() {
    if (this.props.user !== null) {
      this.props.getServers();
      this.props.getUserServer();
    }
  }

  handleServerClick = (event, index) => {
    const selected = this.props.servers.find(e => e.id == index);
    this.props.setSelectedHub(selected);
    this.setState({
      selectedIndex: index,
      popoverOpen: false,
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
            <FormattedMessage id="Server.ChoseBtn" defaultMessage="Servers" />
            <i className="fa fa-crosshairs"></i>

            <Modal isOpen={this.state.popoverOpen} toggle={this.toggle} >
              <ModalHeader toggle={this.toggle}><FormattedMessage id="server-list.servers" defaultMessage="Avaliable Servers" /></ModalHeader>

              <ModalBody>
                <ServerList servers={this.props.servers} onClick={this.handleServerClick} selectedIndex={this.state.selectedIndex} />
              </ModalBody>
            </Modal>
            {/* <Popover placement="bottom" isOpen={this.state.popoverOpen} target="Popover1" toggle={this.toggle}>
              <PopoverHeader><FormattedMessage id="server-list.servers" defaultMessage="Avaliable Servers" /></PopoverHeader>
              <PopoverBody className="" ><ServerList servers={this.props.servers} onClick={this.handleServerClick} selectedIndex={this.state.selectedIndex} /></PopoverBody>
              </Popover>*/}
          </div>

        }
        {serverStage == 1 &&
          <div className="button-notebook" onClick={() => this.props.startNotebookServer(this.props.selectedHub.id)}>
            {this.props.selectedHub && this.props.selectedHub.name}
            <i className="fa fa-play"></i>
          </div>
        }

        {serverStage == 2 && <div className="button-notebook animation" onClick={() => this.props.startNotebookServer(this.props.selectedHub.id)}>
          {this.props.selectedHub.name}
          <i className="fa fa-server"></i>
        </div>
        }

        {serverStage == 3 &&
          <div className="button-notebook" onClick={() => this.props.stopNotebookServer(this.props.selectedHub.id)}>
            <FormattedMessage id="Server.StopBtn" defaultMessage="Close Server" />
            <i className="fa fa-stop"></i>
          </div>}


      </div >
    );
  }
}

function mapStateToProps(state) {
  return {
    selectedHub: state.server.selectedHub,
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