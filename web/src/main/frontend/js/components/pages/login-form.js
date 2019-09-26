import * as React from 'react';
import * as PropTypes from 'prop-types';
import * as ReactRedux from 'react-redux';

import {
  Modal,
} from 'reactstrap';


import {
  NavLink,
} from 'react-router-dom';

import {
  FormattedMessage,
} from 'react-intl';

import {
  toast,
} from 'react-toastify';

import {
  EnumAuthProvider,
  Pages,
  StaticRoutes,
} from '../../model';

import {
  getConfiguration,
} from '../../ducks/config';

import {
  login,
  refreshProfile,
} from '../../ducks/user';

class LoginForm extends React.Component {
  constructor(props) {
    super(props);

    this._submit = this._submit.bind(this);

    this.state = {
      username: '',
      password: '',
    };
  }

  static propTypes = {
    toggle: PropTypes.func.isRequired,
    visible: PropTypes.bool.isRequired,
  }

  _submit($event) {
    $event.preventDefault();

    let { username, password } = this.state;

    this.props.submit(username, password, this.props.i18n.locale);
  }

  render() {
    const { authProviders, defaultIdentityProvider: idp } = this.props.config;

    return (
      <Modal
        centered={true}
        isOpen={this.props.visible}
        keyboard={false}
        style={{ maxWidth: '780px' }}
        toggle={this.props.toggle}>
        <div id="login-form">
          <a href="" className="close" onClick={(e) => { e.preventDefault(); this.props.toggle(); }}></a>
          <div className="title">
            <FormattedMessage id="login.subtitle" defaultMessage="Sign-in into your account" />
          </div>
          <div className="text-center">

            <form onSubmit={this._submit}>

              {authProviders.indexOf(EnumAuthProvider.Forms) !== -1 &&
                <React.Fragment>
                  <div className="text-center username">
                    <input type="text" className="input-text" placeholder="username"
                      value={this.state.username}
                      onChange={(ev) => this.setState({ username: ev.target.value })}
                    />
                  </div>

                  <div className="text-center password">
                    <input type="password" className="input-text" placeholder="password"
                      value={this.state.password}
                      onChange={(ev) => this.setState({ password: ev.target.value })}
                    />
                  </div>

                  <div className="text-center forgot-password" >
                    <NavLink className="forgot-password" to={Pages.ResetPassword}>
                      <FormattedMessage id="login.forgot-password" defaultMessage="Forgot your password?" />
                    </NavLink>
                  </div>

                  <div className="login-helix">
                    <button type="submit" name="helix" className="helix">
                      <FormattedMessage id="login.login" defaultMessage="Login" />
                    </button>
                  </div>

                  {authProviders.length !== 1 &&
                    <div className="text-separator">
                      <span className="text-center">OR</span>
                    </div>
                  }

                </React.Fragment>
              }

              {authProviders.indexOf(EnumAuthProvider.Google) !== -1 &&
                <div className="login-google">
                  <a href={StaticRoutes.LOGIN.GOOGLE}>
                    <button type="button" name="google" className="oauth">
                      <span>Google</span>
                    </button>
                  </a>
                </div>
              }

              {authProviders.indexOf(EnumAuthProvider.GitHub) !== -1 &&
                <div className="login-github">
                  <a href={StaticRoutes.LOGIN.GITHUB}>
                    <button type="button" name="github" className="oauth">
                      <span>GitHub</span>
                    </button>
                  </a>
                </div>
              }

              {authProviders.indexOf(EnumAuthProvider.HELIX) !== -1 &&
                <div className="login-helix">
                  <a href={StaticRoutes.LOGIN.HELIX}>
                    <button type="button" name="helix" className="oauth">
                      <span>HELIX</span>
                    </button>
                  </a>
                </div>
              }

              {authProviders.indexOf(EnumAuthProvider.SAML) !== -1 &&
                <div className="login-academic">
                  <a href={idp ? `${StaticRoutes.LOGIN.SAML}?idp=${idp}` : StaticRoutes.LOGIN.SAML}>
                    <button type="button" name="academic" className="academic">
                      <span>Academic Login</span>
                    </button>
                  </a>
                </div>
              }

            </form>

          </div>
        </div>
      </Modal>
    );
  }
}

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
      .then(
        () => {
          toast.dismiss();
        },
        () => {
          toast.dismiss();
          toast.error(<FormattedMessage id="login.failure" />);
        })
      .catch(() => null)
  ),
});

export default ReactRedux.connect(mapStateToProps, mapDispatchToProps)(LoginForm);
