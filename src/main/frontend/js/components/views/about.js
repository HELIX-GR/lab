import * as React from 'react';
import * as PropTypes from 'prop-types';

import classnames from 'classnames';

import {
  FormattedMessage,
} from 'react-intl';

class About extends React.Component {

  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className="about-helix-container container-fluid">
        <div className="row">

          <div className="col-sm-12">
            <h4 className="about-header">
              About Helix
                </h4>
          </div>

          <div className="col-md-3 col-sm-6 col-xs-12">
            <div className="about-item">
              <a href="#">
                <h3 className="about-title">
                  Research for Data
                    </h3>
              </a>

              <div className="about-text style-5">
                Find, access, and reuse data from Australian research organizations, agencies and institutions via Hellix flagship service.
                  </div>

              <a href="#">
                <div className="about-link">
                  Find research data
                    </div>
              </a>

            </div>
          </div>

          <div className="col-md-3 col-sm-6 col-xs-12">
            <div className="about-item">
              <a href="#">
                <h3 className="about-title">
                  Our partners
                    </h3>
              </a>

              <div className="about-text style-5">
                Helix collaborates with universities and other research institutions to enhance the value of data and enable new discoveries.
                  </div>

              <a href="#">
                <div className="about-link">
                  Who we work with
                    </div>
              </a>

            </div>
          </div>

          <div className="col-md-3 col-sm-6 col-xs-12">
            <div className="about-item">
              <a href="#">
                <h3 className="about-title">
                  The project
                    </h3>
              </a>

              <div className="about-text style-5">
                Hellix-Nectar-RDS News is a great source of news, events and data jobs - sent direct to your inbox every fortnight. Sign up now to get the next edition.
                  </div>

              <a href="#">
                <div className="about-link">
                  Don't miss out!
                    </div>
              </a>

            </div>
          </div>

          <div className="col-md-3 col-sm-6 col-xs-12">
            <div className="about-item">
              <a href="#">
                <h3 className="about-title">
                  Deliverables
                    </h3>
              </a>

              <div className="about-text style-5">
                Hellix-Nectar-RDS News is a great source of news, events and data jobs - sent direct to your inbox every fortnight. Sign up now to get the next edition.
                  </div>

              <a href="#">
                <div className="about-link">
                  Don't miss out!
                    </div>
              </a>

            </div>
          </div>

        </div>
      </div>
    );
  }
}

export default About;
