import * as React from 'react';
import * as PropTypes from 'prop-types';

import {
  removeAccent
} from '../../util';

class Tag extends React.Component {

  constructor(props) {
    super(props);
  }

  static propTypes = {
    text: PropTypes.string.isRequired,
    onClick: PropTypes.func,
  }

  onClick(e) {
    if (typeof this.props.onClick === 'function') {
      this.props.onClick(e, this.props.text);
    }
  }

  render() {
    const { text } = this.props;
    if (!text) {
      return null;
    }
    return (
      <div className="topics">
        <div className="text">
          <a onClick={(e) => this.onClick(e)} title={text}>{removeAccent(text)}</a>
        </div>
        <div className="edge">
        </div>
      </div>
    );
  }
}

export default Tag;
