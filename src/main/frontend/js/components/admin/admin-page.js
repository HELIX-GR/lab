import React from "react";
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { requestServers, requestUsers } from '../../ducks/admin';
import { Tabs, Tab } from 'material-ui/Tabs';
import ModalAddServer from './modal-add-server';
import { AdminTable } from './table';
import { UserTable } from './user-table';
import { FormattedTime, injectIntl } from 'react-intl';

class AdminPage extends React.Component {
  constructor(props) {
    super(props);

    this._getServers = this._getServers.bind(this);

  }
  componentWillMount() {
    this._getServers();
  }
  _getServers() {
    this.props.requestServers();
    this.props.requestUsers();
  }
  render() {


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
          <Tabs>
            <Tab label="Servers Managment" >
              <div>
                <h2>Servers Managment</h2>
                <a> {this.props.intl.formatRelative(this.props.servers_update)} </a>

                <ModalAddServer />
                <AdminTable servers={this.props.servers} />
                }
            </div>
            </Tab>
            <Tab label="User Managment" >
              <div>
                <h2 >User Managment</h2>
                <a> {this.props.intl.formatRelative(this.props.users_update)} </a>

                <UserTable users={this.props.users} />

              </div>
            </Tab>
            <Tab
              label="Users to Servers"
            >
              <div>
                <p>This is a third example tab.</p>
              </div>
            </Tab>
          </Tabs>
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
  };
}

const mapDispatchToProps = (dispatch) => bindActionCreators({ requestServers, requestUsers }, dispatch);

export default AdminPage = connect(mapStateToProps, mapDispatchToProps)(injectIntl(AdminPage));