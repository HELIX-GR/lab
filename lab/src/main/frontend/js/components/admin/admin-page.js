import React from "react";
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { requestServers, requestUsers, requestUsersToServers, requestWhiteList } from '../../ducks/admin';
import Paper from '@material-ui/core/Paper';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import ModalAddServer from './modal-add-server';
import { AdminTable } from './server-table';
import { UserTable } from './user-table';
import { U2sTable } from './u2s-table';
import { FormattedTime, injectIntl } from 'react-intl';
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
    this.props.requestServers();
    this.props.requestUsers();
    this.props.requestWhiteList();
    this.props.requestUsersToServers();
  }
  render() {

    const { value } = this.state;
    return (
      <React.Fragment>
        <div className="breadcrumbs-pagination" >
          <div className="breadcrumbs">
            <a className="breadcrumbs-part">
              <span className="fa fa-key"></span>
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
              <h2><i className="fa fa-server" /> Servers</h2>
              <a> {this.props.intl.formatRelative(this.props.servers_update)} </a>

              <ModalAddServer />
              <AdminTable servers={this.props.servers} serverEdit={this.handleEdit} />

            </TabContainer>
          }
          {value === 1 &&
            <TabContainer>
              <div>
                <h2>Users</h2>
                <a> {this.props.intl.formatRelative(this.props.users_update)} </a>
                <UserTable users={this.props.users} />
              </div>
            </TabContainer>
          }
          {value === 2 &&
            <TabContainer><div>
              <h2>White-List</h2>
              <a> {this.props.intl.formatRelative(this.props.whitelist_update)} </a>
              <ModalAddWhiteList />
              <WhiteListTable users={this.props.whitelist} />
            </div>
            </TabContainer>
          }
          {value === 3 &&
            <TabContainer><div>
              <h2>User to Servers Managment
                 <div className="pill data">
                  {this.props.u2s.length} Runing
          </div>
              </h2>
              <a> {this.props.intl.formatRelative(this.props.u2s_update)} </a>
              <U2sTable u2s={this.props.u2s} />

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
    servers_update: state.admin.servers_update,
    users: state.admin.users,
    users_update: state.admin.users_update,
    whitelist: state.admin.whitelist,
    whitelist_update: state.admin.whitelist_update,
    u2s: state.admin.u2s,
    u2s_update: state.admin.u2s_update,
    profile: state.user.profile,
  };
}

const mapDispatchToProps = (dispatch) => bindActionCreators({ requestServers, requestUsers, requestUsersToServers, requestWhiteList }, dispatch);

AdminPage = connect(mapStateToProps, mapDispatchToProps)(injectIntl(AdminPage));
export default withRouter(AdminPage);