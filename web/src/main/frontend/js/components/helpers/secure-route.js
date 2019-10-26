import * as React from 'react';
import * as ReactRedux from 'react-redux';
import * as PropTypes from 'prop-types';
import { Route, Redirect } from 'react-router-dom';

import { StaticRoutes, ErrorPages } from '../../model/routes';

class SecureRoute extends React.Component {

  constructor(props) {
    super(props);
  }

  static propTypes = {
    roles: PropTypes.arrayOf(PropTypes.string).isRequired,
  }

  static defaultProps = {
    roles: [],
  }

  hasAnyRole(roles) {
    const account = this.props.account;

    if ((!roles) || (roles.length === 0)) {
      return (account != null);
    }

    if (!account) {
      return false;
    }

    for (let role of roles) {
      if (account.roles.indexOf(role) !== -1) {
        return true;
      }
    }
    return false;
  }

  render() {
    let { roles, account, ...rest } = this.props;
    let authenticated = (account != null);

    if (!authenticated) {
      return (
        <Redirect to={StaticRoutes.HOME} />
      );
    }
    if (this.hasAnyRole(roles)) {
      return (
        <Route {...rest} />
      );
    }
    return (
      <Redirect to={ErrorPages.Forbidden} />
    );
  }
}

//
// Wrap into a connected component
//

const mapStateToProps = (state) => {
  return {
    account: state.user.profile ? state.user.profile.account : null,
  };
};

const mapDispatchToProps = null;

SecureRoute = ReactRedux.connect(mapStateToProps, mapDispatchToProps)(SecureRoute);

export default SecureRoute;
