import React from "react";
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import {
  Footer,
  Header,
  SearchResult,
  SearchPage,
} from './views';
import { Pages, StaticRoutes, DynamicRoutes, ErrorPages } from '../model/routes';

import ModalLogin from './modal-login';
import { modalLoginAction } from '../ducks/user';
import { startNowAction } from '../ducks/app';
import { Switch, Route, Redirect } from 'react-router-dom';
import Filesystem from './filesystem/filesystem';
import AdminPage from './admin/admin-page';
import { ToastContainer } from 'react-toastify';
import {
  Page403,
  Page404,
} from './pages';

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

    const routes = (
      <Switch>
        {/* Handle errors first */}
        <Route path={ErrorPages.Forbidden} component={Page403} exact />
        <Route path={ErrorPages.NotFound} component={Page404} exact />
        {/* Redirect for authenticated users. Navigation after a successful login operation
            occurs after the component hierarchy is rendered due to state change and causes
            /error/404 to render */}
        <Redirect from={Pages.Login} to={StaticRoutes.LABHOME} exact />
        <Redirect from={Pages.Register} to={StaticRoutes.LABHOME} exact />
        {/* Static routes */}
        <Route path={StaticRoutes.RESULTS} component={SearchResult} />

        <Route exact={true} path={StaticRoutes.LABHOME} render={() => (
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

      </Switch>
    );

    return (
      <div className="lab">
        <ToastContainer
          className="helix-toastify"
          position="bottom-center"
          type="default"
          autoClose={5000}
          hideProgressBar={true}
          newestOnTop={false}
          closeOnClick
          pauseOnHover
        />
        <Header />
        {routes}
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