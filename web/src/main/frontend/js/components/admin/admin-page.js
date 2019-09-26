import React from "react";
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { getServers, getUsers, getUserServers, getWhiteList } from '../../ducks/admin';
import Paper from '@material-ui/core/Paper';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import ModalAddServer from './modal-add-server';
import { AdminTable } from './server-table';
import { UserTable } from './user-table';
import { U2sTable } from './u2s-table';
import { injectIntl } from 'react-intl';
import Typography from '@material-ui/core/Typography';
import { WhiteListTable } from "./white-list-table";
import ModalAddWhiteList from './madal-add-white-list';
import { withRouter, Redirect } from 'react-router-dom';
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
      this.props.history.push(StaticRoutes.LABHOME);
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
        <div className="breadcrumbs-pagination" >
          <div className="breadcrumbs">
            <a className="breadcrumbs-part">
              <span className="fa fa-cogs mr-2"></span>
              <span className="header-text">Admin Panel</span>
            </a>
          </div>

        </div>

        <div className="top-border-lab" />

        <Paper className="mb-5">
          <Tabs
            value={this.state.value}
            onChange={this.handleChange}
            indicatorColor="primary"
            textColor="primary"
            centered
          >
            <Tab label="Servers" />
            <Tab label="Users" />
            <Tab label="White-List" />
            <Tab label="Monitoring" />
          </Tabs>

          {value === 0 &&
            <TabContainer>
              <h2><i className="fa fa-server mr-2" /> Servers</h2>
              <a> {this.props.intl.formatRelative(this.props.serversLastUpdate)} </a>

              <ModalAddServer />
              <AdminTable servers={this.props.servers} serverEdit={this.handleEdit} />

            </TabContainer>
          }
          {value === 1 &&
            <TabContainer>
              <div>
                <h2><i className="fa fa-users mr-2" /> Users</h2>
                <a> {this.props.intl.formatRelative(this.props.usersLastUpdate)} </a>
                <UserTable users={this.props.users} />
              </div>
            </TabContainer>
          }
          {value === 2 &&
            <TabContainer><div>
              <h2><i className="fa fa-address-book-o mr-2" />White-List</h2>
              <a> {this.props.intl.formatRelative(this.props.whitelistLastUpdate)} </a>
              <ModalAddWhiteList />
              <WhiteListTable users={this.props.whitelist} />
            </div>
            </TabContainer>
          }
          {value === 3 &&
            <TabContainer><div>
              <h2><i className="fa fa-heartbeat mr-2" />User to Servers Management
                 <div className="pill data ml-2">
                  {this.props.userServers.length} Running
          </div>
              </h2>
              <a> {this.props.intl.formatRelative(this.props.userServersLastUpdate)} </a>
              <U2sTable userServers={this.props.userServers} />

            </div>
            </TabContainer>
          }
        </Paper>

      </React.Fragment>
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