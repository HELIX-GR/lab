import React from "react";
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { getServers, getUsers, getUserServers, getWhiteList } from '../../ducks/admin';
import Paper from '@material-ui/core/Paper';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import ModalAddServer from './modal-add-server';
import { AdminTable } from './server-table';
import UserTable from './user-table';
import U2sTable from './u2s-table';
import { injectIntl } from 'react-intl';
import Typography from '@material-ui/core/Typography';
import WhiteListTable from "./white-list-table";
import ModalAddWhiteList from './modal-add-white-list';
import { withRouter } from 'react-router-dom';

import moment from '../../moment-localized';

import Icon from '@mdi/react';
import { mdiServer, mdiAccountGroup, mdiAccountKey, mdiMonitorDashboard } from '@mdi/js';

import {
  StaticRoutes,
} from '../../model';

function TabContainer(props) {
  return (
    <Typography component="div" style={{ padding: 8 * 3 }}>
      {props.children}
    </Typography>
  );
}

class AdminPage extends React.Component {

  state = {
    value: 0,
  };

  handleChange = (event, value) => {
    this.setState({ value });
  };

  handleEdit = (e) => {

  }

  componentWillMount() {
    if (this.props.profile.roles.includes('ROLE_ADMIN')) {
      this._getServers();
    } else {
      this.props.history.push(StaticRoutes.HOME);
    }
  }
  _getServers() {
    this.props.getServers();
    this.props.getUsers();
    this.props.getWhiteList();
    this.props.getUserServers();
  }
  render() {

    const { value } = this.state;
    return (
      <React.Fragment>
        <div className="top-border-lab" />

        <Paper className="mb-5">
          <Tabs
            value={this.state.value}
            onChange={this.handleChange}
            indicatorColor="primary"
            textColor="primary"
            centered={false}
            fullWidth={true}
          >
            <Tab label="Servers" />
            <Tab label="Users" />
            <Tab label="White-List" />
            <Tab label="Monitoring" />
          </Tabs>

          {value === 0 &&
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
              <AdminTable servers={this.props.servers} serverEdit={this.handleEdit} />
            </TabContainer>
          }
          {value === 1 &&
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
          {value === 2 &&
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
          {value === 3 &&
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
              <U2sTable userServers={this.props.userServers} />
            </TabContainer>
          }
        </Paper>

      </React.Fragment >
    );
  }
}


function mapStateToProps(state) {
  return {
    servers: state.admin.servers,
    serversLastUpdate: state.admin.serversLastUpdate,
    users: state.admin.users,
    usersLastUpdate: state.admin.usersLastUpdate,
    whitelist: state.admin.whitelist,
    whitelistLastUpdate: state.admin.whitelistLastUpdate,
    userServers: state.admin.userServers,
    userServersLastUpdate: state.admin.userServersLastUpdate,
    profile: state.user.profile,
  };
}

const mapDispatchToProps = (dispatch) => bindActionCreators({ getServers, getUsers, getUserServers, getWhiteList }, dispatch);

AdminPage = connect(mapStateToProps, mapDispatchToProps)(injectIntl(AdminPage));
export default withRouter(AdminPage);