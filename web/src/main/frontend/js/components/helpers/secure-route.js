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
    const user = this.props.user;

    if ((!roles) || (roles.length === 0)) {
      return (user != null);
    }

    if (!user) {
      return false;
    }

    for (let role of roles) {
      if (user.roles.indexOf(role) !== -1) {
        return true;
      }
    }
    return false;
  }

  render() {
    let { roles, user, ...rest } = this.props;
    let authenticated = (user != null);

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
    user: state.user.profile
  };
};

const mapDispatchToProps = null;

SecureRoute = ReactRedux.connect(mapStateToProps, mapDispatchToProps)(SecureRoute);

export default SecureRoute;
