import React from "react";
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import ServerList from './server-list';
import { getUserServers } from '../../ducks/user';
import { setSelectedHub } from '../../ducks/app';
import { FormattedMessage } from 'react-intl';
import { Button, Popover, PopoverHeader, PopoverBody } from 'reactstrap';

import { startNowAction, stopServerAction } from '../../ducks/app';


class ServerButton extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      open: false,
      selectedIndex: 0,
    };
  }
  componentWillMount() {
    if (this.props.user !== null) {
      this.props.getUserServers();
    }
  }
  handleClick = (event) => {
    // This prevents ghost click.
    event.preventDefault();

    this.setState({
      open: true,
      anchorEl: event.currentTarget,

    });
  };

  handleRequestClose = () => {
    this.setState({
      open: false,
    });
  };

  handleServerClick = (event, index) => {
    const selected = this.props.servers.find(e => e.id == index);
    this.props.setSelectedHub(selected);
    this.setState({
      selectedIndex: index,
      open: false,
    });
  }

  render() {
    const { server_stage } = this.props;
    return (
      <div>
        {server_stage == 0 &&
          <div id="Popover1" className="button-notebook" onClick={this.handleClick}>
            <FormattedMessage id="Server.ChoseBtn" defaultMessage="Choose Server" />
          <i className="fa fa-crosshairs"></i>
          </div>
        }
        {server_stage == 1 &&
          <div className="button-notebook" onClick={() => this.props.startNowAction(this.props.selected_hub.id)}>
            {this.props.selected_hub && this.props.selected_hub.name}
            <i className="fa fa-play"></i>
          </div>
        }

        {server_stage == 2 && <div className="button-notebook animation" onClick={() => this.props.startNowAction(this.props.selected_hub.id)}>
          {this.props.selected_hub.name}
          <i className="fa fa-server"></i>
        </div>
        }

        {server_stage == 3 &&
          <div className="button-notebook" onClick={() => this.props.stopServerAction(this.props.selected_hub.id)}>
            <FormattedMessage id="Server.StopBtn" defaultMessage="Close Server" />
      <i className="fa fa-stop"></i>
          </div>}

        <Popover  placement="bottom" isOpen={this.state.open} target="Popover1" toggle={this.handleRequestClose}>
          <PopoverHeader><FormattedMessage id="server-list.servers" defaultMessage="Avaliable Servers" /></PopoverHeader>
          <PopoverBody className="" ><ServerList servers={this.props.servers} onClick={this.handleServerClick} selectedIndex={this.state.selectedIndex} /></PopoverBody>
      
          
        </Popover>
      </div >
    );
  }
}

function mapStateToProps(state) {
  return {
    target: state.app.target,
    servers: state.user.servers,
    user: state.user,
    selected_hub: state.app.selected_hub,
    server_stage: state.app.server_stage,
  };
}


const mapDispatchToProps = (dispatch) => bindActionCreators({ getUserServers, setSelectedHub, startNowAction, stopServerAction }, dispatch);

export default ServerButton = connect(mapStateToProps, mapDispatchToProps)(ServerButton);