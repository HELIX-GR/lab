import * as React from 'react';
import * as ReactRedux from 'react-redux';
import { Link, NavLink } from 'react-router-dom';
import { bindActionCreators } from 'redux';
import { changeLocale, } from '../../ducks/i18n';
import { logout, modalLoginAction } from '../../ducks/user';
import { FormattedMessage, } from 'react-intl';
import {
  StaticRoutes,
} from '../../model';


class Header extends React.Component {

  constructor(props) {
    super(props);
    this.changeLocale = this.changeLocale.bind(this);

  }

  static defaultProps = {
    locale: 'en-GB',
  }

  changeLocale() {
    const locale = (this.props.locale === 'el' ? 'en-GB' : 'el');
    this.props.changeLocale(locale);
  }

  get locale() {
    return (this.props.locale === 'el' ? 'ΕΛ' : 'EN');
  }

  render() {
    const authenticated = (this.props.profile != null);

    return (
      <header className="header">

        <div className="logo-area">
          <NavLink to={StaticRoutes.LABHOME}>
            <img className="logo-image" src="/images/svg/Lab-logo.svg" alt="Helix Lab" />
          </NavLink>
        </div>

        <div className="menu-wrapper">
          <nav className="nav-menu">
            <ul className="menu-items">
              <li id="menu-item-data" className="menu-item domain-item">
                <a href="index_data.html">
                  Data
                </a>
              </li>
              <li id="menu-item-pubs" className="menu-item domain-item">
                <a href="index_pubs.html">
                  Pubs
                </a>
              </li>
              <li id="menu-item-lab" className="menu-item domain-item  has-sub-menu">
                <a href="/">
                  Lab
                </a>
                <ul className="sub-menu">
                  <li><Link to={'/filesystem'}> <FormattedMessage id="header.files" defaultMessage="My Files" /></Link></li>
                  <li><Link to={'/guides'}> <FormattedMessage id="header.guides" defaultMessage="Guides" /></Link></li>
                  <li><Link to={'/courses'}> <FormattedMessage id="header.courses" defaultMessage="Courses" /></Link></li>
                  <li><Link to={'/whatislab'}> <FormattedMessage id="header.whatislab" defaultMessage="What is Lab?" /></Link></li>
                </ul>
              </li>
              <li id="menu-item-project" className="menu-item aux-item">
                <a href="#">
                <FormattedMessage id="header.about" defaultMessage="About" />
                </a>
              </li>
              <li id="menu-item-news" className="menu-item aux-item">
                <a href="#">
                <FormattedMessage id="header.news" defaultMessage="News" />
                </a>
              </li>
              {authenticated && this.props.profile.roles.includes('ROLE_ADMIN') &&
                <li id="menu-item-news" className="menu-item aux-item">
                  <Link to={'/Admin'}> Admin </Link>
                </li>
              }
            </ul>
          </nav>


          <div className="language-selector" onClick={this.changeLocale}>
            <a href="#">
              {this.locale}
            </a>
          </div>

          {!authenticated &&
            <div className="account-item">
              <a onClick={(e) => this.props.modalLoginAction(true)}>
                <img className="account-icon" src="/images/svg/Avatar.svg" alt="Account tab" />
              </a>
            </div>
          }
          {authenticated &&
            <div className="account-item">
              <nav className="nav-menu">
                <ul className="menu-items">
                  <li id="menu-item-account" className="menu-item aux-item has-sub-menu">
                    <a>
                      <img className="account-icon" src={this.props.profile.imageUrl || '/images/svg/Avatar.svg'} alt="Account tab" />
                    </a>
                    <ul className="sub-menu">
                      {authenticated &&
                        <li><a href="#">Signed in as {this.props.profile.username}</a></li>
                      }
                      <li><a href="#">Account</a></li>
                      <li><a href="#">Help</a></li>
                      <li><a href="#">Settings</a></li>
                      <li><a href="#" onClick={() => this.props.logout()}>Log out</a></li>
                    </ul>
                  </li>
                </ul>
              </nav>
            </div>
          }

          <div className="search-item">
            <a href="#">
              <i className="fa fa-search"></i>
            </a>
          </div>
        </div>
      </header>
    );
  }
}

const mapStateToProps = (state) => ({
  locale: state.i18n.locale,
  profile: state.user.profile,
});

const mapDispatchToProps = (dispatch) => bindActionCreators({
  changeLocale,
  logout,
  modalLoginAction,
}, dispatch);

const mergeProps = (stateProps, dispatchProps, ownProps) => ({
  ...stateProps,
  ...dispatchProps,
  ...ownProps,
});

export default ReactRedux.connect(mapStateToProps, mapDispatchToProps, mergeProps)(Header);
