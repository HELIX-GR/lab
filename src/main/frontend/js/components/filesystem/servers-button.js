import React from "react";
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import Popover from '@material-ui/core/Popover';
import Button from '@material-ui/core/Button';
import ServerList from './server-list';
import { getUserServers } from '../../ducks/user';
import { setSelectedHub } from '../../ducks/app';
import PlayArrow from '@material-ui/icons/PlayArrow';
import Stop from '@material-ui/icons/Stop';
import StartStop from './start-stop';
import CircularProgress from '@material-ui/core/CircularProgress';
import { startNowAction } from '../../ducks/app';


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

    const style = {
      margin: 12,
    };
    const { server_stage } = this.props;
    return (
      <div>
        {server_stage == 0 &&
          <div className="button-notebook" onClick={this.handleClick}>
            Choose Notebook
          <i class="fa fa-crosshairs"></i>
          </div>
        }
        {server_stage == 1 &&
          <div className="button-notebook" onClick={() => this.props.startNowAction(this.props.selected_hub.id)}>
            {this.props.selected_hub && this.props.selected_hub.name}
            <i class="fa fa-play"></i>
          </div>
        }

        {server_stage == 2 && <div className="button-notebook animation" onClick={() => this.props.startNowAction(this.props.selected_hub.id)}>
          {this.props.selected_hub.name}
          <i className="fa fa-server"></i>
        </div>
        }

        {server_stage == 3 &&
          <div className="button-notebook" onClick={this}>
            Stop Notebook
      <i class="fa fa-stop"></i>
          </div>}

        <Popover
          open={this.state.open}
          anchorEl={this.state.anchorEl}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'right',
          }}
          transformOrigin={{
            vertical: 'top',
            horizontal: 'right',
          }}
          onClose={this.handleRequestClose}
        >
          <ServerList servers={this.props.servers} onClick={this.handleServerClick} selectedIndex={this.state.selectedIndex} />
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


const mapDispatchToProps = (dispatch) => bindActionCreators({ getUserServers, setSelectedHub, startNowAction }, dispatch);

export default ServerButton = connect(mapStateToProps, mapDispatchToProps)(ServerButton);