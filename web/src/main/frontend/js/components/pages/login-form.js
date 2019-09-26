import React from "react";
import { connect } from 'react-redux';
import {  FormattedMessage, } from 'react-intl';
import PropTypes from 'prop-types';
import {  Modal, } from 'reactstrap';

import {
  NavLink,
} from 'react-router-dom';

import {
  toast,
} from 'react-toastify';

import {
  Pages
} from '../../model/routes';

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
      username: props.username || '',
      password: '',
    };
  }

  static propTypes = {
    showIt: PropTypes.func.isRequired,
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

  componentWillMount() {
    this.state.showLoginForm = this.props.showLoginForm;
  }

  handleClose() {
    this.props.showIt(!this.state.showLoginForm);

  }

  handleShow() {
    this.props.showIt(true);
  }


  render() {
    const { defaultIdentityProvider: idp } = this.props.config;

    return (
      <Modal
        centered={true}
        isOpen={this.props.visible}
        keyboard={false}
        style={{ maxWidth: '780px' }}
        toggle={this.props.toggle}>
        <div id="login-form">
          <a href="" className="close" onClick={(e) => { e.preventDefault(); this.props.showIt(false); }}></a>
          <div className="title">
            <FormattedMessage id="login.subtitle" defaultMessage="Sign-in into your account" />
          </div>
          <div className="text-center">

            <form onSubmit={this._submit}>

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
                  <FormattedMessage id="login.login" defaultMessage="Login" disabled/>
                </button>
              </div>

              <div className="text-separator">
                <span className="text-center">OR</span>
              </div>

              <div className="login-google">
                <a href="/login/google">
                  <button type="button" name="google" className="oauth">
                    <span>Google</span>
                  </button>
                </a>
              </div>

              <div className="login-academic">
                <a href={idp ? `/saml/login?idp=${idp}` : '/saml/login'}>
                  <button type="button" name="academic" className="academic" disabled>
                    <span>Academic Login</span>
                  </button>
                </a>
              </div>

            </form>

          </div>
        </div>
      </Modal>
    );
  }
}

const mapStateToProps = (state) => ({
  config: state.config,
  i18n: state.i18n,
  visible: state.user.showLoginForm,
});

const mapDispatchToProps = (dispatch) => ({
  submit: (username, password, locale) => (
    dispatch(login(username, password))
      .then(() => dispatch(getConfiguration(locale)))
      .then(() => dispatch(refreshProfile()))
      .then(
        () => {
          toast.dismiss();
          dispatch(this.props.showIt(false));
        },
        () => {
          toast.dismiss();
          toast.error(<FormattedMessage id="login.failure" defaultMessage="The username or password is incorrect." />);
        })
      .catch(() => null)
  ),
});

export default connect(mapStateToProps, mapDispatchToProps)(LoginForm);

