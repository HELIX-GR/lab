import * as React from 'react';
import * as ReactRedux from 'react-redux';

import { bindActionCreators } from 'redux';
import { injectIntl } from 'react-intl';
import { Link, NavLink } from 'react-router-dom';
import { FormattedMessage, } from 'react-intl';

import { changeLocale, } from '../../../ducks/i18n';
import { logout, toggleLoginDialog } from '../../../ducks/user';

import {
  buildPath,
  DynamicRoutes,
  EnumLocale,
  Roles,
  RoleGroups,
  StaticRoutes,
  WordPressPages,
} from '../../../model';

import {
  SecureContent,
} from '../../helpers';

class Header extends React.Component {

  constructor(props) {
    super(props);

    this.onLocaleChange = this.onLocaleChange.bind(this);
    this.onLogout = this.onLogout.bind(this);
  }

  static defaultProps = {
    locale: 'en-GB',
  }

  onLogout(e) {
    e.preventDefault();

    this.props.logout();
  }

  onLocaleChange(e, locale) {
    e.preventDefault();

    this.props.changeLocale(locale);
  }

  get locale() {
    return (this.props.locale === 'el' ? 'ΕΛ' : 'EN');
  }

  get avatarImage() {
    const { profile = null, imageUrl = null } = this.props.account;

    if (profile && profile.image && profile.imageMimeType) {
      return `data:${profile.imageMimeType};base64,${profile.image}`;
    }

    return imageUrl || '/images/svg/Avatar.svg';
  }

  render() {
    const { account } = this.props;
    const authenticated = (account != null);
    const _t = this.props.intl.formatMessage;

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
                  <SecureContent roles={RoleGroups.LAB}>
                    <li><Link to={StaticRoutes.FILESYSTEM}><FormattedMessage id="header.menu.files" /></Link></li>
                  </SecureContent>
                  <SecureContent roles={[Roles.BETA_STUDENT, Roles.STANDARD_STUDENT]}>
                    <li><Link to={StaticRoutes.COURSES}><FormattedMessage id="header.menu.courses-student" /></Link></li>
                  </SecureContent>
                  <SecureContent roles={[Roles.BETA_ACADEMIC, Roles.STANDARD_ACADEMIC]}>
                    <li><Link to={StaticRoutes.COURSES_ADMIN}><FormattedMessage id="header.menu.courses-professor" /></Link></li>
                  </SecureContent>
                  <li>
                    <a href="https://jupyter-notebook-beginner-guide.readthedocs.io/en/latest/" target="_blank">
                      <FormattedMessage id="header.menu.guides" />
                    </a>
                  </li>
                  <li>
                    <a href="https://jupyterlab.readthedocs.io/en/latest/user/interface.html" target="_blank">
                      <FormattedMessage id="header.menu.courses" />
                    </a>
                  </li>
                </ul>
              </li>
              <li id="menu-item-project" className="menu-item aux-item has-sub-menu">
                <a href="#">
                  <FormattedMessage id="header.menu.project.title" />
                </a>
                <ul className="sub-menu">
                  <li><a href={buildPath(DynamicRoutes.PROJECT_PAGE, [WordPressPages.WhatIsHelix])}>{_t({ id: 'header.menu.project.items.what-is-helix' })}</a></li>
                  <li><a href={buildPath(DynamicRoutes.PROJECT_PAGE, [WordPressPages.Services])}>{_t({ id: 'header.menu.project.items.services' })}</a></li>
                  <li><a href={buildPath(DynamicRoutes.PROJECT_PAGE, [WordPressPages.FAQ])}>{_t({ id: 'header.menu.project.items.faq' })}</a></li>
                  <li><a href={buildPath(DynamicRoutes.PROJECT_PAGE, [WordPressPages.PublishData])}>{_t({ id: 'header.menu.project.items.publish-data' })}</a></li>
                  <li><a href={buildPath(DynamicRoutes.PROJECT_PAGE, [WordPressPages.Software])}>{_t({ id: 'header.menu.project.items.software' })}</a></li>
                  <li><a href={buildPath(DynamicRoutes.PROJECT_PAGE, [WordPressPages.Project])}>{_t({ id: 'header.menu.project.items.the-project' })}</a></li>
                  <li><a href={buildPath(DynamicRoutes.PROJECT_PAGE, [WordPressPages.Media])}>{_t({ id: 'header.menu.project.items.media' })}</a></li>
                  <li><a href={buildPath(DynamicRoutes.PROJECT_PAGE, [WordPressPages.AcknowledgeHelix])}>{_t({ id: 'header.menu.project.items.acknowledge-helix' })}</a></li>
                  <li><a href={buildPath(DynamicRoutes.PROJECT_PAGE, [WordPressPages.Contact])}>{_t({ id: 'header.menu.project.items.contact' })}</a></li>
                  <li><a href={buildPath(DynamicRoutes.PROJECT_PAGE, [WordPressPages.TermsOfUse])}>{_t({ id: 'header.menu.project.items.terms-of-use' })}</a></li>
                </ul>
              </li>
              <li id="menu-item-news" className="menu-item aux-item has-sub-menu">
                <a href="#">
                  <FormattedMessage id="header.menu.news.title" />
                </a>
                <ul className="sub-menu">
                  <li><a href={StaticRoutes.NEWS}>{_t({ id: 'header.menu.news.items.news' })}</a></li>
                  <li><a href={StaticRoutes.EVENTS}>{_t({ id: 'header.menu.news.items.events' })}</a></li>
                  <li><a href={StaticRoutes.ACTIONS}>{_t({ id: 'header.menu.news.items.actions' })}</a></li>
                </ul>
              </li>
              {authenticated && account.roles.includes('ROLE_ADMIN') &&
                <li id="menu-item-admin" className="menu-item aux-item">
                  <NavLink to='/admin/'> Admin </NavLink>
                </li>
              }

              <li id="menu-item-lang" className="menu-item aux-item has-sub-menu">
                <a href="" onClick={(e) => e.preventDefault()}>{this.locale}</a>
                <ul className="sub-menu">
                  <li>
                    <a href="" onClick={(e) => this.onLocaleChange(e, this.props.locale === EnumLocale.EL ? EnumLocale.EN : EnumLocale.EL)}>
                      {this.props.locale === EnumLocale.EL ? 'EN' : 'ΕΛ'}
                    </a>
                  </li>
                </ul>
              </li>

            </ul>
          </nav>

          {!authenticated &&
            <div className="account-item">
              <a onClick={() => this.props.toggleLoginDialog()}>
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
                      <img className="account-icon" src={this.avatarImage} alt="Account tab" />
                    </a>
                    <ul className="sub-menu">
                      {authenticated &&
                        <li><a>{_t({ id: 'header.menu.login.items.signed-in' }, { username: account.username })}</a></li>
                      }
                      <li><a href={StaticRoutes.PROFILE}>{_t({ id: 'header.menu.login.items.account' })}</a></li>
                      <li><a href={StaticRoutes.FAVORITES}>{_t({ id: 'header.menu.login.items.favorites' })}</a></li>
                      <li><a href={StaticRoutes.COLLECTIONS}>{_t({ id: 'header.menu.login.items.collections' })}</a></li>
                      <li><a href={StaticRoutes.PROJECT}>{_t({ id: 'header.menu.login.items.help' })}</a></li>
                      <li><a href="#" onClick={this.onLogout}>{_t({ id: 'header.menu.login.items.logout' })}</a></li>
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
  account: state.user.profile ? state.user.profile.account : null,
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

export default ReactRedux.connect(mapStateToProps, mapDispatchToProps, mergeProps)(injectIntl(Header));
