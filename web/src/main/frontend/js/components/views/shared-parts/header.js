import * as React from 'react';
import * as ReactRedux from 'react-redux';

import { bindActionCreators } from 'redux';
import { Link, NavLink } from 'react-router-dom';
import { FormattedMessage, } from 'react-intl';

import { changeLocale, } from '../../../ducks/i18n';
import { logout, toggleLoginDialog } from '../../../ducks/user';

import {
  buildPath,
  DynamicRoutes,
  EnumLocale,
  Roles,
  StaticRoutes,
  WordPressPages,
} from '../../../model';

import {
  SecureContent,
} from '../../helpers';

class Header extends React.Component {

  constructor(props) {
    super(props);
    this.changeLocale = this.changeLocale.bind(this);

  }

  static defaultProps = {
    locale: 'en-GB',
  }

  changeLocale(e, locale) {
    e.preventDefault();

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
          <NavLink to={StaticRoutes.HOME}>
            <img className="logo-image" src="/images/svg/Lab-logo.svg" alt="Helix Lab" />
          </NavLink>
        </div>

        <div className="menu-wrapper">

          <nav className="nav-menu">
            <ul className="menu-items">
              <li id="menu-item-data" className="menu-item domain-item">
                <a href="http://data.hellenicdataservice.gr">
                  Data
                </a>
              </li>
              <li id="menu-item-pubs" className="menu-item domain-item">
                <a href="https://hellenicdataservice.gr/pubs/">
                  Pubs
                </a>
              </li>
              <li id="menu-item-lab" className="menu-item domain-item has-sub-menu">
                <NavLink to="/">
                  Lab
                </NavLink>
                <ul className="sub-menu">
                  <SecureContent roles={Roles.ALL}>
                    <li><Link to={StaticRoutes.FILESYSTEM}><FormattedMessage id="header.files" /></Link></li>
                  </SecureContent>
                  <SecureContent roles={[Roles.BETA_STUDENT, Roles.STANDARD_STUDENT]}>
                    <li><Link to={StaticRoutes.COURSES}><FormattedMessage id="header.courses-student" /></Link></li>
                  </SecureContent>
                  <SecureContent roles={[Roles.BETA_ACADEMIC, Roles.STANDARD_ACADEMIC]}>
                    <li><Link to={StaticRoutes.COURSES_ADMIN}><FormattedMessage id="header.courses-professor" /></Link></li>
                  </SecureContent>
                  <li><a href="https://jupyter-notebook-beginner-guide.readthedocs.io/en/latest/" target="_blank"><FormattedMessage id="header.guides" defaultMessage="Guides" /></a></li>
                  <li><a href="https://jupyterlab.readthedocs.io/en/latest/user/interface.html" target="_blank"><FormattedMessage id="header.courses" defaultMessage="Courses" /></a></li>
                </ul>
              </li>
              <li id="menu-item-project" className="menu-item aux-item has-sub-menu">
                <a href="#">
                  <FormattedMessage id="header.about" defaultMessage="About" />
                </a>
                <ul className="sub-menu">
                  <li><a href={buildPath(DynamicRoutes.PROJECT_PAGE, [WordPressPages.WhatIsHelix])}><span>What is HELIX?</span></a></li>
                  <li><a href={buildPath(DynamicRoutes.PROJECT_PAGE, [WordPressPages.Services])}><span> Services </span></a></li>
                  <li><a href={buildPath(DynamicRoutes.PROJECT_PAGE, [WordPressPages.FAQ])}><span>FAQ</span></a></li>
                  <li><a href={buildPath(DynamicRoutes.PROJECT_PAGE, [WordPressPages.PublishData])}><span>Publish Data </span></a></li>
                  <li><a href={buildPath(DynamicRoutes.PROJECT_PAGE, [WordPressPages.Software])}><span>Software </span></a></li>
                  <li><a href={buildPath(DynamicRoutes.PROJECT_PAGE, [WordPressPages.Project])}><span>The project </span></a></li>
                  <li><a href={buildPath(DynamicRoutes.PROJECT_PAGE, [WordPressPages.Media])}><span>Media </span></a></li>
                  <li><a href={buildPath(DynamicRoutes.PROJECT_PAGE, [WordPressPages.AcknowledgeHelix])}><span>Acknowledge Helix </span></a></li>
                  <li><a href={buildPath(DynamicRoutes.PROJECT_PAGE, [WordPressPages.Contact])}><span>Contact </span></a></li>
                  <li><a href={buildPath(DynamicRoutes.PROJECT_PAGE, [WordPressPages.TermsOfUse])}><span>Terms of use </span></a></li>
                </ul>
              </li>
              <li id="menu-item-news" className="menu-item aux-item has-sub-menu">
                <a href="#">
                  <FormattedMessage id="header.news" defaultMessage="News" />
                </a>
                <ul className="sub-menu">
                  <li><a href="https://hellenicdataservice.gr/news/"><span>News </span></a></li>
                  <li><a href="https://hellenicdataservice.gr/news/events/"><span>Events</span></a></li>
                </ul>
              </li>
              {authenticated && this.props.profile.roles.includes('ROLE_ADMIN') &&
                <li id="menu-item-admin" className="menu-item aux-item">
                  <NavLink to='/admin/'> Admin </NavLink>
                </li>
              }

              <li id="menu-item-lang" className="menu-item aux-item has-sub-menu">
                <a href="" onClick={(e) => e.preventDefault()}>{this.locale}</a>
                <ul className="sub-menu">
                  <li>
                    <a href="" onClick={(e) => this.changeLocale(e, this.props.locale === EnumLocale.EL ? EnumLocale.EN : EnumLocale.EL)}>
                      {this.props.locale === EnumLocale.EL ? 'EN' : 'ΕΛ'}
                    </a>
                  </li>
                </ul>
              </li>

            </ul>
          </nav>

          {!authenticated &&
            <div className="account-item">
              <a onClick={(e) => this.props.toggleLoginDialog()}>
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
                      <li><a href="https://goo.gl/forms/BusjilnDlJhIDrN32" target="_blank"> Report a bug <i className="fa fa-bug"></i></a></li>
                    </ul>
                  </li>
                </ul>
              </nav>
            </div>
          }

          <div className="search-item">
            <Link to={StaticRoutes.HOME}>
              <i className="fa fa-search"></i>
            </Link>
          </div>

        </div>

      </header >
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
  toggleLoginDialog,
}, dispatch);

const mergeProps = (stateProps, dispatchProps, ownProps) => ({
  ...stateProps,
  ...dispatchProps,
  ...ownProps,
});

export default ReactRedux.connect(mapStateToProps, mapDispatchToProps, mergeProps)(Header);