import * as React from 'react';
import * as PropTypes from 'prop-types';

import classnames from 'classnames';

import {
  EnumCatalog,
} from '../../model';

class Result extends React.Component {

  constructor(props) {
    super(props);
  }

  static propTypes = {
    visible: PropTypes.bool.isRequired,
    result: PropTypes.object.isRequired,
  }

  render() {

    const {
      [EnumCatalog.CKAN]: packages,
      [EnumCatalog.OPENAIRE]: publications,
      [EnumCatalog.LAB]: notebooks,
    } = this.props.result;

    const showPackages = (packages && packages.results && packages.results.length !== 0);
    const showPublications = (publications && publications.results && publications.results.length !== 0);
    const showNotebooks = (notebooks && notebooks.results && notebooks.results.length !== 0);

    const visible = this.props.visible && (showPackages || showPublications || showNotebooks);

    return (
      <div
        className={
          classnames({
            'landing-live-search-container': true,
            'visible': visible,
          })
        }
      >

        {showPackages &&
          <div className="landing-live-search-group data">
            <div className="results-header">
              <div className="results-title">
                Data
              </div>
              <a className="all-link">
                all Data
              </a>
            </div>
            <div className="search-results">
              {this.renderPackages(packages.results)}
            </div>
          </div>
        }

        {showPublications &&
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
              {this.renderPackages(publications.results)}
            </div>
          </div>
        }

        {showNotebooks &&
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
        }

      </div>
    );
  }

  renderPackages(packages) {
    return packages.map((p, index) => {
      return (
        <a key={`package-${index}`} href="#" className="result-entry">{p.title}</a>
      );
    });
  }

  renderPublications(publications) {
    return publications.map((p, index) => {
      return (
        <a key={`publication-${index}`} href="#" className="result-entry">{p.title}</a>
      );
    });
  }

}

export default Result;
