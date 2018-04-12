import * as React from 'react';
import * as PropTypes from 'prop-types';
import * as ReactRedux from 'react-redux';

import {
  FormattedMessage,
} from 'react-intl';

import {
  toast,
} from 'react-toastify';

import { login } from '../ducks/users';
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
    console.log(props);
    console.log(this.state);
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      username: nextProps.username || '',
      password: '',
    });
  }

  _submit($event) {
    $event.preventDefault();
    console.log('submit');
    let { username, password } = this.state;

    this.props.submit(username, password);
  }

  render() { 
    return ( 
    <form className="form-signin" onSubmit={this._submit}>
      <div className="text-center mb-4">
        <img className="mb-4" src="/images/helix-lab.png" alt="" width="131" height="70"/>
        <h1 className="h3 mb-3 font-weight-normal">Helix Lab</h1>
        <p>Try your code now in one of Helix Lab services. </p>
      </div>

      <div className="form-label-group">
        <input type="username" id="inputEmail" className="form-control" placeholder="Username" required="" autoFocus="" value={this.state.username} 
        onChange={(ev) => this.setState({ username: ev.target.value })}/>
        <label htmlFor="inputEmail"> Username</label>
      </div>

      <div className="form-label-group">
        <input type="password" id="inputPassword" className="form-control" placeholder="Password" required=""
          value={this.state.password}
          onChange={(ev) => this.setState({ password: ev.target.value })}
          />
        <label htmlFor="inputPassword"> Password</label>
      </div>

      <div className="checkbox mb-3">
        <label>
          <input type="checkbox" value="remember-me"/> Remember me
        </label>
      </div>
        <button type="submit" className="btn btn-primary px-4">Login         </button>

      <p className="mt-5 mb-3 text-muted text-center">© Powered by HELIX</p>
    </form>);
  }
}



LoginForm.propTypes = {
  submit: PropTypes.func.isRequired,
  username: PropTypes.string,
};


const mapStateToProps = null;

const mapDispatchToProps = (dispatch) => ({
  submit: (username, password) => (
    dispatch(login(username, password))
      //.then(() => dispatch(getConfiguration()))
     // .then(() => dispatch(refreshProfile()))
      .then(() => toast.dismiss(),
        () => {
          toast.dismiss();
          toast.error(<FormattedMessage id="login.failure" defaultMessage="The username or password is incorrect." />);
        })
      .catch((err) => null)
  ),
});

LoginForm = ReactRedux.connect(mapStateToProps, mapDispatchToProps)(LoginForm);

module.exports = LoginForm;