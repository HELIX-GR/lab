import React from "react";
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { injectIntl } from 'react-intl';
import { Redirect, Route, Switch } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';

import {
  DynamicRoutes,
  EnumAuthProvider,
  Pages,
  Roles,
  RoleGroups,
  StaticRoutes,
} from '../model';

import {
  SecureRoute
} from './helpers';

import {
  LoginForm,
} from './pages';

import {
  Footer,
  Header,
} from './views/shared-parts';

import {
  CourseProfessorExplorer,
  CourseStudentExplorer,
  Main,
  MainResults,
} from './views';

import { FileSystem } from './filesystem';
import { Admin, NotebookDetails } from './views';

import { toggleLoginDialog } from '../ducks/user';

class App extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      username: null,
    };

    this.toggleLoginDialog = this.toggleLoginDialog.bind(this);
  }

  toggleLoginDialog() {
    const { authProviders = [] } = this.props.config;

    if ((authProviders.length === 1) && (authProviders[0] === EnumAuthProvider.HELIX)) {
      window.location = StaticRoutes.LOGIN.HELIX;
    } else {
      this.props.toggleLoginDialog();
    }
  }

  render() {
    const routes = (
      <Switch>
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
            <Main locale={'en'} />
          </div>
        )} />

        <Route path={StaticRoutes.RESULTS} component={MainResults} />

        <SecureRoute roles={[Roles.BETA_STUDENT, Roles.STANDARD_STUDENT]}
          exact path={StaticRoutes.COURSES} component={CourseStudentExplorer}
        />

        <SecureRoute roles={[Roles.BETA_ACADEMIC, Roles.STANDARD_ACADEMIC]}
          exact path={StaticRoutes.COURSES_ADMIN} component={CourseProfessorExplorer}
        />

        <SecureRoute exact roles={RoleGroups.LAB} path={StaticRoutes.FILESYSTEM} render={() => (
          <React.Fragment>
            <div className="border-placeholder"></div>
            <div>
              <div>
                <section className="main-results-page-content">
                  <div className="results-main-content" style={{ flexDirection: 'column' }}>
                    <FileSystem />
                  </div>
                </section>
              </div>
            </div>
          </React.Fragment>
        )} />

        <SecureRoute exact path={StaticRoutes.ADMIN} roles={[Roles.ADMIN]} render={() => (
          <React.Fragment>
            <div className="border-placeholder"></div>
            <section className="main-results-page-content">
              <div className="results-main-content" style={{ flexDirection: 'column' }}>
                <Admin />
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

        <LoginForm
          toggle={this.toggleLoginDialog}
          visible={this.props.showLoginForm}
        />

        <Header />

        {routes}

        <Footer />
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    config: state.config,
    username: state.user.username,
    showLoginForm: state.user.showLoginForm,
  };
};

const mapDispatchToProps = (dispatch) => bindActionCreators({
  toggleLoginDialog,
}, dispatch);

const localizedComponent = injectIntl(App);

export default connect(mapStateToProps, mapDispatchToProps)(localizedComponent);