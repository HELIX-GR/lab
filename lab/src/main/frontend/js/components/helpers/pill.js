import * as React from 'react';
import * as PropTypes from 'prop-types';

import classnames from 'classnames';

import {
  FormattedMessage,
} from 'react-intl';

/**
 * A selectable label component
 *
 * @class Pill
 * @extends {React.Component}
 */
class Pill extends React.Component {

  constructor(props) {
    super(props);
  }

  static propTypes = {
    id: PropTypes.string.isRequired,
    text: PropTypes.string.isRequired,
    selected: PropTypes.bool,
    className: PropTypes.string,
    onChange: PropTypes.func.isRequired,
  }

  static defaultProps = {
    selected: false,
  }

  render() {
    return (
      <div
        className={
          classnames({
            "filter-pill": true,
            [this.props.className]: true,
            'selected': this.props.selected,
          })
        }
        onClick={(e) => this.props.onChange(this.props.id)}
      >
        <FormattedMessage id={this.props.text} defaultMessage={this.props.text} />
      </div>
    );
  }
}

export default Pill;