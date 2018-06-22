import * as React from 'react';

class Footer extends React.Component {

  constructor(props) {
    super(props);
  }

  render() {
    return (
      <footer id="footer" className="lab-footer">
        <div className="footer-content">

          <div className="footer-column logo">
            <a href="#">
              <img src="/images/svg/Helix-logo-White-on-Black.svg" alt="" />
            </a>
          </div>
          <div className="footer-column about">
            <h3 className="footer-column-title">
              About
            </h3>
            <ul>
              <li><a href="#">Αρχική</a></li>
              <li><a href="#">Το έργο</a></li>
              <li><a href="#">Επικοινωνία</a></li>
              <li><a href="#">Όροι χρήσης</a></li>
            </ul>
          </div>
          <div className="footer-column research">
            <h3 className="footer-column-title">
              Έρευνα
            </h3>
            <ul>
              <li><a href="#">Data</a></li>
              <li><a href="#">Publications</a></li>
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
                <a href="#">
                  <img src="/images/png/PARTNER-ATHENA.png" alt="" />
                </a>
              </li>

              <li>
                <a href="#">
                  <img src="/images/png/PARTNER_GRNET.png" alt="" />
                </a>
              </li>

              <li>
                <a href="#">
                  <img src="/images/png/PARTNER_OPENAIRE.png" alt="" />
                </a>
              </li>
            </ul>
            <ul>
              <li>
                <a href="#">
                  <img src="/images/png/PARTNER-EDUC.png" alt="" />
                </a>
              </li>

            </ul>
          </div>

          <div className="copyright-notes">
            © 2018 Helix. All rights reserved.
          </div>
        </div>
      </footer>
    );
  }
}

export default Footer;
