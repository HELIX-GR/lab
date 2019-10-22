import _ from 'lodash';
import * as React from 'react';
import * as PropTypes from 'prop-types';

import { injectIntl } from 'react-intl';

import { Tooltip } from 'reactstrap';

import {
  EnumCatalog
} from '../../model';

class Favorite extends React.Component {

  constructor(props) {
    super(props);

    this.toggle = this.toggle.bind(this);
    this.state = {
      tooltipOpen: false
    };
    this.id = _.uniqueId('btn-favorite-');
  }

  static propTypes = {
    active: PropTypes.bool.isRequired,
    description: PropTypes.string,
    handle: PropTypes.string.isRequired,
    onClick: PropTypes.func.isRequired,
    title: PropTypes.string.isRequired,
    url: PropTypes.string.isRequired,
  }

  toggle() {
    this.setState({
      tooltipOpen: !this.state.tooltipOpen
    });
  }

  onClick(e) {
    e.preventDefault();

    const { handle, title, description, url } = this.props;

    this.props.onClick({
      catalog: EnumCatalog.LAB,
      description,
      handle,
      title,
      url,
    });
  }

  render() {
    const { active } = this.props;
    const _t = this.props.intl.formatMessage;

    return (
      <React.Fragment>
        <div className={`btn-favorite ${active ? 'active' : ''}`} id={this.id}>
          <a onClick={(e) => this.onClick(e)}  >
            <img
              src={`/images/icons/various/Favorite_${active ? 'active' : 'inactive'}.svg`}
              style={{ width: (active ? 20 : 22), marginTop: 7 }}
            />
          </a>
        </div>
        <Tooltip placement="bottom" isOpen={this.state.tooltipOpen} target={this.id} toggle={this.toggle}>
          {_t({ id: active ? 'tooltip.remove-favorite' : 'tooltip.add-favorite' })}
        </Tooltip>
      </React.Fragment>
    );
  }
}

export default injectIntl(Favorite);
