import React from "react";
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { requestServers, requestUsers, requestUsersToServers } from '../../ducks/admin';
import Paper from '@material-ui/core/Paper';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import ModalAddServer from './modal-add-server';
import { AdminTable } from './server-table';
import { UserTable } from './user-table';
import { U2sTable } from './u2s-table';
import { FormattedTime, injectIntl } from 'react-intl';
import Typography from '@material-ui/core/Typography';


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

  componentWillMount() {
    this._getServers();
  }
  _getServers() {
    this.props.requestServers();
    this.props.requestUsers();
    this.props.requestUsersToServers();
  }
  render() {

    const { value } = this.state;
    return (
      <section >
        <div >
          <div className="jumbotron faq-header info-page-header jumbotron-with-breadcrumb-below row backround-white">
            <div className="col" >
              <h1 className="clip-text header-with-icon">
                <span className="fa fa-key"></span>
                <span className="header-text">Admin Panel</span>
              </h1>
            </div>
          </div>
          <Paper>
            <Tabs
              value={this.state.value}
              onChange={this.handleChange}
              indicatorColor="primary"
              textColor="primary"
              centered
            >
              <Tab label="Servers Managment" />
              <Tab label="User Managment" />
              <Tab label="Users to Servers" />
            </Tabs>

            {value === 0 &&
              <TabContainer>
                <h2>Servers Managment</h2>
                <a> {this.props.intl.formatRelative(this.props.servers_update)} </a>

                <ModalAddServer />
                <AdminTable servers={this.props.servers} />
                
              </TabContainer>
            }
            {value === 1 &&
                <div>
                  <h2>User Managment</h2>
                  <a> {this.props.intl.formatRelative(this.props.users_update)} </a>

                  <UserTable users={this.props.users} />
                  
                </div>
            }
            {value === 2 &&
              <TabContainer><div>
                <h2>User to Servers Managment</h2>
                <a> {this.props.intl.formatRelative(this.props.u2s_update)} </a>
                {// <U2sTable u2s={this.props.u2s} />
                }
              </div>
              </TabContainer>
            }
          </Paper>
        </div>
      </section>
    );
  }
}


function mapStateToProps(state) {
  return {
    servers: state.admin.servers,
    users: state.admin.users,
    servers_update: state.admin.servers_update,
    users_update: state.admin.users_update,
    u2s: state.admin.u2s,
    u2s_update: state.admin.u2s_update,
  };
}

const mapDispatchToProps = (dispatch) => bindActionCreators({ requestServers, requestUsers, requestUsersToServers }, dispatch);

export default AdminPage = connect(mapStateToProps, mapDispatchToProps)(injectIntl(AdminPage));