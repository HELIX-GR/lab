import * as React from 'react';

import { injectIntl } from 'react-intl';

import {
  Link,
} from 'react-router-dom';

import {
  buildPath,
  DynamicRoutes,
  ExternalRoutes,
  StaticRoutes,
  WordPressPages,
} from '../../../model';

class Footer extends React.Component {

  constructor(props) {
    super(props);
  }

  render() {
    const _t = this.props.intl.formatMessage;

    return (
      <footer id="footer" className="lab-footer">
        <div className="footer-content">
          <div className="d-flex flex-wrap">
            <div className="footer-column logo">
              <Link to={StaticRoutes.CORE}>
                <img src="/images/svg/Helix-logo-White-on-Purple.svg" alt="" />
              </Link>
            </div>
            <div className="footer-column about">
              <h3 className="footer-column-title">
                {_t({ id: 'footer.columns.about.title' })}
              </h3>
              <ul>
                <li><a href={StaticRoutes.CORE}>{_t({ id: 'footer.columns.about.links.home' })}</a></li>
                <li><a href={buildPath(DynamicRoutes.PROJECT_PAGE, [WordPressPages.WhatIsHelix])}>{_t({ id: 'footer.columns.about.links.what-is-helix' })}</a></li>
                <li><a href={buildPath(DynamicRoutes.PROJECT_PAGE, [WordPressPages.Contact])}>{_t({ id: 'footer.columns.about.links.contact' })}</a></li>
                <li><a href={buildPath(DynamicRoutes.PROJECT_PAGE, [WordPressPages.TermsOfUse])}>{_t({ id: 'footer.columns.about.links.terms-of-use' })}</a></li>
              </ul>
            </div>
            <div className="footer-column research">
              <h3 className="footer-column-title">
                {_t({ id: 'footer.columns.research.title' })}
              </h3>
              <ul>
                <li><a href={ExternalRoutes.Data}>{_t({ id: 'footer.columns.research.links.data' })}</a></li>
                <li><a href={ExternalRoutes.Pubs}>{_t({ id: 'footer.columns.research.links.pubs' })}</a></li>
                <li><a href={ExternalRoutes.Lab}>{_t({ id: 'footer.columns.research.links.lab' })}</a></li>
                <li><a href=''>{_t({ id: 'footer.columns.research.links.topics' })}</a></li>
                <li><a href=''>{_t({ id: 'footer.columns.research.links.organizations' })}</a></li>
              </ul>
            </div>
            <div className="footer-column partners">
              <h3 className="footer-column-title">
                {_t({ id: 'footer.columns.partners.title' })}
              </h3>
              <ul>
                <li>
                  <a href="https://www.athenarc.gr/" target="blank">
                    <img src="/images/png/PARTNER-ATHENA.png" alt="" />
                  </a>
                </li>
                <li>
                  <a href="https://grnet.gr/" target="blank">
                    <img src="/images/png/PARTNER_GRNET.png" alt="" />
                  </a>
                </li>
                <li>
                  <a href="https://www.openaire.eu/" target="blank">
                    <img src="/images/png/PARTNER_OPENAIRE.png" alt="" />
                  </a>
                </li>
                <li>
                  <a href="https://www.minedu.gov.gr/" target="blank">
                    <img src="/images/png/PARTNER-EDUC.png" alt="" />
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <div className="eu-logo">
            <img src="/images/eu-logo.jpg" alt="" />
          </div>
          <div className="copyright-notes">
            {_t({ id: 'footer.copyright' })}
          </div>
        </div>
      </footer>
    );
  }
}

export default injectIntl(Footer);