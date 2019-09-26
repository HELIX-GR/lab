import React from "react";
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Switch, Route, Redirect } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';

import {
  DynamicRoutes,
  ErrorPages,
  Pages,
  StaticRoutes,
} from '../model';

import {
  SecureRoute
} from './helpers';

import {
  LoginForm,
  Page403,
  Page404,
} from './pages';

import {
  Footer,
  Header,
  ResultPage,
  SearchPage,
} from './views';

import { AdminPage } from './admin';
import { Filesystem } from './filesystem';
import { NotebookDetails } from './views';

import { setLoginFormVisibility } from '../ducks/user';
import { startNotebookServer } from '../ducks/server';

class App extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      username: null,
      showLoginForm: false,
    };
  }

  render() {
    const routes = (
      <Switch>
        {/* Handle errors first */}
        <Route path={ErrorPages.Forbidden} component={Page403} exact />
        <Route path={ErrorPages.NotFound} component={Page404} exact />

        {/* 
          Redirect for authenticated users. Navigation after a successful login operation
          occurs after the component hierarchy is rendered due to state change and causes
          /error/404 to render 
        */}

        <Redirect from={Pages.Login} to={StaticRoutes.HOME} exact />
        <Redirect from={Pages.Register} to={StaticRoutes.HOME} exact />

        {/* Static routes */}

        <Route exact path={StaticRoutes.HOME} render={() => (
          <div>
            <SearchPage changeLocale={() => { }} locale={'en'} logout={() => { }} />
          </div>
        )} />

        <Route path={StaticRoutes.RESULTS} component={ResultPage} />

        <SecureRoute exact path={StaticRoutes.FILESYSTEM} render={() => (
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

        <SecureRoute exact path={StaticRoutes.ADMIN} roles={['ROLE_ADMIN']} render={() => (
          <React.Fragment>
            <div className="border-placeholder"></div>
            <section className="main-results-page-content">
              <div className="results-main-content" style={{ flexDirection: 'column' }}>
                <AdminPage />
              </div>
            </section>
          </React.Fragment>
        )} />

        {/* Dynamic routes */}

        <Route path={DynamicRoutes.NOTEBOOK_DETAILS} component={NotebookDetails} />

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
        <LoginForm showIt={this.props.setLoginFormVisibility} />
        <Footer />

      </div>);
  }
}

const mapStateToProps = (state) => {
  return {
    username: state.user.username,
    showLoginForm: state.user.showLoginForm,
    admin: state.admin.isAdmin,
  };
}

const mapDispatchToProps = (dispatch) => bindActionCreators({
  setLoginFormVisibility,
  startNotebookServer,
}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(App);