import React from "react";
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import {
  SecureRoute
} from './helpers';

import {
  Footer,
  Header,
  SearchPage,
  ResultPage,
} from './views';

import { Pages, StaticRoutes, ErrorPages } from '../model/routes';

import ModalLogin from './modal-login';
import { setLoginFormVisibility } from '../ducks/user';
import { startNotebookServer } from '../ducks/server';
import { Switch, Route, Redirect } from 'react-router-dom';
import Filesystem from './filesystem/filesystem';
import AdminPage from './admin/admin-page';
import NotebookShow from './views/notebook-show';
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
      showLoginForm: false,
    };
  }
  render() {
    var start_now = () => { };
    if (!this.props.username) {
      start_now = () => { this.props.setLoginFormVisibility(true); };
    } else {
      start_now = this.props.startNotebookServer;
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
        <Route path={StaticRoutes.RESULTS} component={ResultPage} />

        <Route exact path={StaticRoutes.LABHOME} render={() => (
          <div>
            <SearchPage changeLocale={() => { }} locale={'en'} logout={() => { }} />
          </div>)} />
        <Route path='/notebook/:uuid' component={NotebookShow} />
        <Route exact path="/filesystem/" render={() => (
          <React.Fragment>
            <div className="border-placeholder"></div>
            <div>
              <div>
                <section className="main-results-page-content">
                  <div className="results-main-content" style={{ flexDirection: 'column' }}>
                    <Filesystem />
                  </div>
                </section>
              </div>
            </div>
          </React.Fragment>
        )} />
        <Route path="/courses/" render={() => (
          <section className="main-results-page-content">
            <div className="results-main-content">
              <h2>
                <i className="fa fa-cog fa-spin"></i> Under construction <i className="fa fa-cog fa-spin"></i>
              </h2>
            </div>
          </section>
        )} />
        <Route exact path="/guides/" render={() => (
          <section className="main-results-page-content">
            <div className="results-main-content">
              <h2>
                <i className="fa fa-cog fa-spin"></i> Under construction <i className="fa fa-cog fa-spin"></i>
              </h2>
            </div>
          </section>
        )} />
        <SecureRoute exact path="/admin/" roles={['ROLE_ADMIN']} render={() => (
          <React.Fragment>
            <div className="border-placeholder"></div>
            <section className="main-results-page-content">
              <div className="results-main-content" style={{ flexDirection: 'column' }}>
                <AdminPage />
              </div>
            </section>
          </React.Fragment>
        )} />
        <Redirect to="/" />
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
        <ModalLogin showIt={this.props.setLoginFormVisibility} />
        <Footer />

      </div>);
  }
}
function mapStateToProps(state) {
  return {
    username: state.user.username,
    showLoginForm: state.user.showLoginForm,
    admin: state.admin.isAdmin,
  };
}


const mapDispatchToProps = (dispatch) => bindActionCreators({ setLoginFormVisibility, startNotebookServer, }, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(App);