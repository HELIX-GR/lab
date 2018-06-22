import * as React from 'react';
import * as PropTypes from 'prop-types';
import * as ReactRedux from 'react-redux';

import {
  NavLink,
} from 'react-router-dom';

import {
  FormattedMessage,
} from 'react-intl';

import {
  toast,
} from 'react-toastify';

//import {
//  Pages
//} from '../../model/routes';

import {
  getConfiguration,
} from '../ducks/config';

import {
  login,
  refreshProfile,
} from '../ducks/user';

//
// Presentational component
//

class LoginForm extends React.Component {
  constructor(props) {
    super(props);

    this._submit = this._submit.bind(this);

    this.state = {
      username: props.username || '',
      password: '',
    };
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      username: nextProps.username || '',
      password: '',
    });
  }

  _submit($event) {
    $event.preventDefault();

    let { username, password } = this.state;

    this.props.submit(username, password, this.props.i18n.locale);
  }

  render() {
    const { defaultIdentityProvider: idp } = this.props.config;

    return (
      <div className="app flex-row align-items-center">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-lg-6 col-md-8">
              <div className="mb-0">

                <div className="p-4">
                  <form className="card-block" onSubmit={this._submit}>

                    <a className="login-brand" target="_blank" href="http://www.hellenicdataservice.gr/"></a>

                    <p className="text-muted">
                      <FormattedMessage id="login.subtitle" defaultMessage="Sign-in into your account" />
                    </p>

                    <div className="input-group mb-3">
                      <input type="text" className="form-control" placeholder="username"
                        value={this.state.username}
                        onChange={(ev) => this.setState({ username: ev.target.value })}
                      />
                    </div>

                    <div className="input-group">
                      <input type="password" className="form-control" placeholder="password"
                        value={this.state.password}
                        onChange={(ev) => this.setState({ password: ev.target.value })}
                      />
                    </div>

                    <div className="row">
                      <div className="col text-small text-right">
                        <NavLink className="btn px-0 font-xs" activeClassName="active" to={'Pages.ResetPassword'}>
                          <FormattedMessage id="login.forgot-password" defaultMessage="Forgot password?" />
                        </NavLink>
                      </div>
                    </div>

                    <div className="row pb-3">
                      <div className="col">
                        <button type="submit" className="btn btn-primary px-4 w-100">
                          <FormattedMessage id="login.login" defaultMessage="Login" />
                        </button>
                      </div>
                    </div>
                    <div className="row pt-3 pb-3">
                      <div className="col">
                        <a href="/login/google" className="btn btn-secondary px-4 w-100">
                          Google
                        </a>
                      </div>
                    </div>
                    <div className="row pt-3 pb-3">
                      <div className="col">
                        <a href={idp ? `/saml/login?idp=${idp}` : '/saml/login'}
                           className="btn btn-danger px-4 w-100"
                        >
                          Academic Login
                        </a>
                      </div>
                    </div>

                  </form>
                </div>

              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

LoginForm.propTypes = {
  submit: PropTypes.func.isRequired,
  username: PropTypes.string,
};

//
// Container component
//

const mapStateToProps = (state) => ({
  config: state.config,
  i18n: state.i18n,
});

const mapDispatchToProps = (dispatch) => ({
  submit: (username, password, locale) => (
    dispatch(login(username, password))
      .then(() => dispatch(getConfiguration(locale)))
      .then(() => dispatch(refreshProfile()))
      .then(() => toast.dismiss(),
        () => {
          toast.dismiss();
          toast.error(<FormattedMessage id="login.failure" defaultMessage="The username or password is incorrect." />);
        })
      .catch((err) => null)
  ),
});

export default ReactRedux.connect(mapStateToProps, mapDispatchToProps)(LoginForm);
