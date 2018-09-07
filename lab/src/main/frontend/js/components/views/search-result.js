import * as React from 'react';
import classnames from 'classnames';
import * as PropTypes from 'prop-types';

import {
  FormattedMessage,
} from 'react-intl';

class SearchResult extends React.Component {

  constructor(props) {
    super(props);
  }
  static propTypes = {
    visible: PropTypes.bool.isRequired,
    text: PropTypes.text,
    //result: PropTypes.object.isRequired,
  }
  render() {
    const { text } = this.props;

    return (
      <div
        className={
          classnames({
            'landing-live-search-container': true,
            'visible': this.props.visible,
          })
        }
      >        <div className="landing-live-search-group lab">
          <div className="results-header">
            <div className="results-title">
              Lab
            </div>
            <a className="all-link">
              all Lab
            </a>
          </div>
          <div className="search-results">
            <a href="#" className="result-entry">
              <span className="matched-text">{text}</span>llution Guidelines
            </a>
            <a href="#" className="result-entry">
              <span className="matched-text">{text}</span>llution Composition Annual Data 2018
            </a>
          </div>
        </div>
      </div>
    );
  }
}

export default SearchResult;
