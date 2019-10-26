import _ from 'lodash';
import * as React from 'react';
import * as PropTypes from 'prop-types';

import { injectIntl } from 'react-intl';

import { Tooltip } from 'reactstrap';

class FavoriteCollectionPicker extends React.Component {

  constructor(props) {
    super(props);

    this.toggle = this.toggle.bind(this);
    this.state = {
      tooltipOpen: false
    };
    this.id = _.uniqueId('btn-favorite-collection-picker-');
  }

  static propTypes = {
    favorite: PropTypes.object,
    imageClass: PropTypes.string,
    onClick: PropTypes.func.isRequired,
  }

  static defaultProps = {
    imageClass: 'fa fa-archive',
  }

  toggle() {
    this.setState({
      tooltipOpen: !this.state.tooltipOpen
    });
  }

  onClick(e) {
    e.preventDefault();

    const { favorite } = this.props;

    this.props.onClick(favorite);
  }

  render() {
    const { imageClass } = this.props;
    const _t = this.props.intl.formatMessage;

    return (
      <>
        <div className="btn-collections" id={this.id}>
          <a onClick={(e) => this.onClick(e)}  >
            <i className={imageClass} />
          </a>
        </div>
        <Tooltip placement="bottom" isOpen={this.state.tooltipOpen} target={this.id} toggle={this.toggle}>
          {_t({ id: 'tooltip.manage-collections' })}
        </Tooltip>
      </>
    );
  }
}

export default injectIntl(FavoriteCollectionPicker);