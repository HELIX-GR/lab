import React from "react";
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import Popover from 'material-ui/Popover';
import FlatButton from 'material-ui/FlatButton';
import ServerList from './server-list';
import { getUserServers } from '../../ducks/user';


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
    console.log(index);
    this.setState({
      selectedIndex: index,
    });
  }

  render() {

    const style = {
      margin: 12,
    };

    return (
      <div>
        <FlatButton
          onClick={this.handleClick}
          label="Servers" />
        <Popover
          open={this.state.open}
          anchorEl={this.state.anchorEl}
          anchorOrigin={{ horizontal: 'left', vertical: 'bottom' }}
          targetOrigin={{ horizontal: 'left', vertical: 'top' }}
          onRequestClose={this.handleRequestClose}
        >
          <ServerList servers={this.props.servers} onClick={this.handleServerClick} selectedIndex={this.state.selectedIndex}/>
        </Popover>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    target: state.app.target,
    servers: state.user.servers,
  };
}


const mapDispatchToProps = (dispatch) => bindActionCreators({ getUserServers, }, dispatch);

export default ServerButton = connect(mapStateToProps, mapDispatchToProps)(ServerButton);