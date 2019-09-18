import * as React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import { Input } from 'reactstrap';

/**
 * Checkbox component
 *
 * @export
 * @class Checkbox
 * @extends {React.Component}
 */
export class Checkbox extends React.Component {

  static propTypes = {
    disabled: PropTypes.bool,
    id: PropTypes.string.isRequired,
    value: PropTypes.bool,
    onChange: PropTypes.func,
    readOnly: PropTypes.oneOfType([PropTypes.bool, PropTypes.func]),
    text: PropTypes.string,
  }

  static defaultProps = {
    disabled: false,
  }

  /**
   * Returns true if the component is read-only; Otherwise false
   *
   * @readonly
   * @memberof Checkbox
   */
  get isReadOnly() {
    if (typeof this.props.readOnly === 'function') {
      return this.props.readOnly(this.props.id) || this.props.disabled;
    }
    return this.props.readOnly || this.props.disabled;
  }

  render() {
    const props = this.props;

    return (
      <div
        className={
          classnames({
            "checkbox": true,
            "c-checkbox": true,
            "c-checkbox-disabled": this.isReadOnly,
          })
        }>
        <label>
          <Input
            type='checkbox'
            disabled={this.isReadOnly ? "disabled" : false}
            checked={props.value || false}
            onChange={e => typeof props.onChange === 'function' ? props.onChange(e.target.checked) : null}
          />
          <span className='fa fa-close' style={{ marginRight: 0 }}></span>
          <span className='checkbox-text'>{props.text}</span>
        </label>
      </div>
    );
  }
}

export default Checkbox;
