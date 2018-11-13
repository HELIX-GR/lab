import * as React from 'react';
import { Link, } from 'react-router-dom';

import {
  buildPath,
  DynamicRoutes,
  ExternalRoutes,
  StaticRoutes,
  WordPressPages,
} from '../../model';
class Footer extends React.Component {

  constructor(props) {
    super(props);
  }

  render() {
    return (
      <footer id="footer" className="lab-footer">
        <div className="footer-content">
          <div className="d-flex flex-wrap">
            <div className="footer-column logo">
              <a href="https://hellenicdataservice.gr">
                <img src="/images/svg/Helix-logo-White-on-Purple.svg" alt="" />
              </a>
            </div>
            <div className="footer-column about">
              <h3 className="footer-column-title">
                About
            </h3>
              <ul>
                <li><a href="#">Αρχική</a></li>
                <li><a href="http://hellenicdataservice.gr/project/page/about">Το έργο</a></li>
                <li><a href="http://hellenicdataservice.gr/project/page/contact">Επικοινωνία</a></li>
                <li><a href="http://hellenicdataservice.gr/project/page/terms-of-use">Όροι χρήσης</a></li>
              </ul>
            </div>
            <div className="footer-column research">
              <h3 className="footer-column-title">
                Έρευνα
            </h3>
              <ul>
                <li><a href="https://data.hellenicdataservice.gr">Data</a></li>
                <li><a href="https://pubs.hellenicdataservice.gr">Publications</a></li>
                <li><a href="#">Lab</a></li>
                <li><a href="#">Θεματικές</a></li>
                <li><a href="#">Οργανισμοί</a></li>
              </ul>
            </div>
            <div className="footer-column partners">
              <h3 className="footer-column-title">
                Συνεργάτες
            </h3>
              <ul>
                <li>
                  <a href="https://www.athena-innovation.gr/">
                    <img src="/images/png/PARTNER-ATHENA.png" alt="" />
                  </a>
                </li>
                <li>
                  <a href="https://grnet.gr/">
                    <img src="/images/png/PARTNER_GRNET.png" alt="" />
                  </a>
                </li>
                <li>
                  <a href="https://www.openaire.eu/">
                    <img src="/images/png/PARTNER_OPENAIRE.png" alt="" />
                  </a>
                </li>
                <li>
                  <a href="https://www.minedu.gov.gr/">
                    <img src="/images/png/PARTNER-EDUC.png" alt="" />
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div className="copyright-notes">
            © 2018 HELIX. All rights reserved.
          </div>
        </div>
      </footer>
    );
  }
}

export default Footer;
