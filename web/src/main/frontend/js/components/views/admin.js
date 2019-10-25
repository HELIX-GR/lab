import React from "react";

import moment from '../../moment-localized';

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { injectIntl } from 'react-intl';
import { mdiServer, mdiAccountGroup, mdiAccountKey, mdiMonitorDashboard } from '@mdi/js';
import { withRouter } from 'react-router-dom';
import { withStyles } from '@material-ui/core/styles';

import Icon from '@mdi/react';
import Paper from '@material-ui/core/Paper';
import Tab from '@material-ui/core/Tab';
import Tabs from '@material-ui/core/Tabs';
import Typography from '@material-ui/core/Typography';

import {
  getServers,
  getUsers,
  getUserServers,
  getWhiteList,
} from '../../ducks/admin';

import {
  ModalAddServer,
  ModalAddWhiteList,
  UserServerTable,
  UserTable,
  ServerTable,
  WhiteListTable,
} from './admin-parts';

import {
  StaticRoutes,
} from '../../model';

const styles = theme => ({
  tab: {
    fontSize: 16,
  },
});

function TabContainer(props) {
  return (
    <Typography component="div" style={{ padding: 8 * 3 }}>
      {props.children}
    </Typography>
  );
}

class Admin extends React.Component {

  state = {
    tabIndex: 0,
  };

  handleChange = (event, tabIndex) => {
    this.setState({ tabIndex });
  };

  componentWillMount() {
    if (this.props.account.roles.includes('ROLE_ADMIN')) {
      this.getData();
    } else {
      this.props.history.push(StaticRoutes.HOME);
    }
  }

  getData() {
    this.props.getServers();
    this.props.getUsers();
    this.props.getWhiteList();
    this.props.getUserServers();
  }

  render() {
    const { tabIndex } = this.state;
    const { classes } = this.props;

    return (
      <React.Fragment>
        <div className="top-border-lab" />

        <Paper className="mb-5">
          <Tabs
            value={tabIndex}
            onChange={this.handleChange}
            indicatorColor="primary"
            textColor="primary"
            variant="fullWidth"
          >
            <Tab label="Servers" className={classes.tab} />
            <Tab label="Users" className={classes.tab} />
            <Tab label="White-List" className={classes.tab} />
            <Tab label="Monitoring" className={classes.tab} />
          </Tabs>

          {tabIndex === 0 &&
            <TabContainer>
              <div className="d-flex align-items-center">
                <div>
                  <Icon path={mdiServer} size={'30px'} className="mr-2" />
                </div>
                <div style={{ fontSize: 30 }}>Servers</div>
                <div className="mt-2" style={{ marginLeft: 'auto' }}>
                  <ModalAddServer />
                </div>
              </div>
              <div className="pl-1">
                <a className="text-muted small">Last update before {moment.duration(Date.now() - this.props.serversLastUpdate).humanize()}</a>
              </div>
              <ServerTable kernels={this.props.kernels} servers={this.props.servers} />
            </TabContainer>
          }
          {tabIndex === 1 &&
            <TabContainer>
              <div className="d-flex align-items-center">
                <div>
                  <Icon path={mdiAccountGroup} size={'40px'} className="mr-2" />
                </div>
                <div style={{ fontSize: 30 }}>Users</div>
              </div>
              <div className="pl-1">
                <a className="text-muted small">{moment.duration(Date.now() - this.props.usersLastUpdate).humanize()}</a>
              </div>
              <UserTable users={this.props.users} />
            </TabContainer>
          }
          {tabIndex === 2 &&
            <TabContainer>
              <div className="d-flex align-items-center">
                <div>
                  <Icon path={mdiAccountKey} size={'40px'} className="mr-2" />
                </div>
                <div style={{ fontSize: 30 }}>White-List</div>
                <div className="mt-2" style={{ marginLeft: 'auto' }}>
                  <ModalAddWhiteList />
                </div>
              </div>
              <div className="pl-1">
                <a className="text-muted small">{moment.duration(Date.now() - this.props.whitelistLastUpdate).humanize()}</a>
              </div>
              <WhiteListTable users={this.props.whitelist} />
            </TabContainer>
          }
          {tabIndex === 3 &&
            <TabContainer>
              <div className="d-flex align-items-center">
                <div>
                  <Icon path={mdiMonitorDashboard} size={'40px'} className="mr-2" />
                </div>
                <div style={{ fontSize: 30 }}>Active Notebook Servers</div>
                <div className="pill data ml-2" style={{ marginTop: 12 }}>
                  {`${this.props.userServers.length} Running`}
                </div>
              </div>
              <div className="pl-1">
                <a className="text-muted small">{moment.duration(Date.now() - this.props.userServersLastUpdate).humanize()}</a>
              </div>
              <UserServerTable userServers={this.props.userServers} />
            </TabContainer>
          }
        </Paper>

      </React.Fragment >
    );
  }
}

function mapStateToProps(state) {
  return {
    account: state.user.profile ? state.user.profile.account : null,
    kernels: state.config.kernels,
    servers: state.admin.servers,
    serversLastUpdate: state.admin.serversLastUpdate,
    users: state.admin.users,
    usersLastUpdate: state.admin.usersLastUpdate,
    whitelist: state.admin.whitelist,
    whitelistLastUpdate: state.admin.whitelistLastUpdate,
    userServers: state.admin.userServers,
    userServersLastUpdate: state.admin.userServersLastUpdate,
  };
}

const mapDispatchToProps = (dispatch) => bindActionCreators({
  getServers,
  getUsers,
  getUserServers,
  getWhiteList,
}, dispatch);

const localizedComponent = injectIntl(Admin);

const componentWithState = connect(mapStateToProps, mapDispatchToProps)(localizedComponent);

const styledComponent = withStyles(styles)(componentWithState);

export default withRouter(styledComponent);