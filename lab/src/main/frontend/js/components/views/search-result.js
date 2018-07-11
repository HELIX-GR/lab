import * as React from 'react';
import * as PropTypes from 'prop-types';

import classnames from 'classnames';

import {
  FormattedMessage,
} from 'react-intl';

class SearchResult extends React.Component {

  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className="landing-live-search-container">
        <div className="landing-live-search-group data">
          <div className="results-header">
            <div className="results-title">Data</div>
            <a className="all-link">              all Data          </a>
          </div>
          <div className="search-results">
            <a href="#" className="result-entry">
              <span className="matched-text">Water Po</span>llution Guidelines
            </a>
            <a href="#" className="result-entry">
              <span className="matched-text">Water Po</span>llution Composition Annual Data 2018
            </a>
          </div>
        </div>

        <div className="landing-live-search-group pubs">
          <div className="results-header">
            <div className="results-title">
              Pubs
            </div>
            <a className="all-link">
              all Pubs
           </a>
          </div>
          <div className="search-results">
            <a href="#" className="result-entry">
              <span className="matched-text">Water Po</span>llution Guidelines
            </a>
            <a href="#" className="result-entry">
              <span className="matched-text">Water Po</span>llution Composition Annual Data 2018
            </a>
          </div>
        </div>

        <div className="landing-live-search-group lab">
          <div className="results-header">
            <div className="results-title">
              Pubs
            </div>
            <a className="all-link">
              all Lab
            </a>
          </div>
          <div className="search-results">
            <a href="#" className="result-entry">
              <span className="matched-text">Water Po</span>llution Guidelines
            </a>
            <a href="#" className="result-entry">
              <span className="matched-text">Water Po</span>llution Composition Annual Data 2018
            </a>
          </div>
        </div>
      </div>
    );
  }
}

export default SearchResult;
