import React from "react";
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import Popover from '@material-ui/core/Popover';
import Button from '@material-ui/core/Button';
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
      open: false,
    });
  }

  render() {

    const style = {
      margin: 12,
    };

    return (
      <div>
        <Button
          variant="contained"
          onClick={this.handleClick}
        >
          Servers
        </Button>

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
  };
}


const mapDispatchToProps = (dispatch) => bindActionCreators({ getUserServers, }, dispatch);

export default ServerButton = connect(mapStateToProps, mapDispatchToProps)(ServerButton);