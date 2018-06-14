import React from "react";
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { LabHeader } from './header';
import SearchPage from './views/search-page';
import Footer from './views/footer';
import Header from './views/header';

import CardLab from '../helpers/cardLab';
import ModalLogin from './modal-login';
import { modalLoginAction } from '../ducks/user';
import { startNowAction } from '../ducks/app';
import { Route } from 'react-router-dom';
import Filesystem from './filesystem/filesystem';
import AdminPage from './admin/admin-page';
import Divider from "material-ui/Divider";

class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      username: null,
      show_login: false,
    };
  }



  render() {
    var start_now = () => { };
    if (!this.props.username) {
      start_now = () => { this.props.modalLoginAction(true); };
    } else {
      start_now = this.props.startNowAction;
    }
    return (
      <div className="lab">
        <Header />
        <Route exact={true} path="/" render={() => (
          <div>
            <SearchPage changeLocale={() => { }} locale={'en'} logout={() => { }} />
          </div>)} />

        <Route path="/filesystem" render={() => (
          <section className="main-results-page-content">
            <div className="results-main-content">
              <Filesystem />
            </div>
          </section>)} />

        <Route path="/admin" render={() => (
          <section className="main-results-page-content">
            <div className="results-main-content">
              <AdminPage />
            </div>
          </section>)} />


        <ModalLogin showIt={this.props.modalLoginAction} />
        <Footer />

      </div>);
  }
}
function mapStateToProps(state) {
  return {
    username: state.user.username,
    show_login: state.user.show_login,
    target: state.app.target || null,
    admin: state.admin.isadmin,
  };
}


const mapDispatchToProps = (dispatch) => bindActionCreators({ modalLoginAction, startNowAction, }, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(App);