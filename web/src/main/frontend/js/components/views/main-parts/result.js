import * as React from 'react';
import * as PropTypes from 'prop-types';

import classnames from 'classnames';

import {
  buildPath,
  DynamicRoutes,
} from '../../../model';

class Result extends React.Component {

  static propTypes = {
    hide: PropTypes.func.isRequired,
    navigate: PropTypes.func.isRequired,
    result: PropTypes.object,
    search: PropTypes.func.isRequired,
    visible: PropTypes.bool.isRequired,
  }

  constructor(props) {
    super(props);

    this.onDocumentClick = this.onDocumentClick.bind(this);
  }

  componentDidMount() {
    document.getElementById('root').addEventListener('click', this.onDocumentClick, false);
  }

  componentWillUnmount() {
    document.getElementById('root').removeEventListener('click', this.onDocumentClick, false);
  }

  onDocumentClick(e) {
    const elements = document.getElementsByClassName('main-form-content');
    if (elements.length === 0) {
      return;
    }
    const container = elements[0];
    if (!container.contains(e.target)) {
      this.props.hide();
    }
  }

  handleLink(e, id) {
    e.preventDefault();

    if (id === null) {
      this.props.search();
    } else {
      this.props.navigate(buildPath(DynamicRoutes.NOTEBOOK_DETAILS, [id]));
    }
  }

  render() {
    const { result: notebooks, visible } = this.props;
    const show = (visible && notebooks && notebooks.results && notebooks.results.length !== 0);

    return (
      <div
        className={
          classnames({
            'landing-live-search-container': true,
            'visible': show,
          })
        }
      >
        {show &&
          <div className="landing-live-search-group lab">
            <div className="results-header">
              <div className="results-title">
                Lab
              </div>
              <a className="all-link" onClick={(e) => this.handleLink(e, null)}>
                all Notebooks
              </a>
            </div>
            <div className="search-results">
              {this.renderNotebooks(notebooks.results)}
            </div>
          </div>
        }
      </div>
    );
  }

  renderNotebooks(notebooks) {
    return notebooks.map((n, index) => {
      return (
        <a
          key={`notebook-${n.id}`}
          onClick={(e) => this.handleLink(e, n.id)}
          className="result-entry"
        >
          {n.title}
        </a>
      );
    });
  }
}

export default Result;
