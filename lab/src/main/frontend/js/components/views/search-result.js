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
    result: PropTypes.object.isRequired,
  }

  render() {
    const notebooks = this.props.result;
    const text = this.props.text;
    const showNotebooks = (this.props.visible && notebooks && notebooks.results && notebooks.results.length !== 0);
    return (
      <div
        className={
          classnames({
            'landing-live-search-container': true,
            'visible': showNotebooks,
          })
        }
      >
        {showNotebooks &&
          <div className="landing-live-search-group lab">
            <div className="results-header">
              <div className="results-title">
                Lab
            </div>
              <a className="all-link">
                all Lab
            </a>
            </div>
            <div className="search-results">
              {this.renderNotebooks(notebooks.results, this.props.text)}
            </div>
          </div>}
      </div>
    );
  }

  renderNotebooks(packages, text) {
    return packages.map((p, index) => {
      const res = p.title.split(text, 2);

      return (
        <a key={`package-${index}`} href="#" className="result-entry">{res[0]} <span className="matched-text">{text}</span>{res[1]}

        </a>
      );
    });
  }
}


export default SearchResult;
