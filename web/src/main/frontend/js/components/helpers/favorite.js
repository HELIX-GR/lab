import _ from 'lodash';
import * as React from 'react';
import * as PropTypes from 'prop-types';

import { injectIntl } from 'react-intl';

import { Tooltip } from 'reactstrap';

import {
  EnumCatalog
} from '../../model';

const catalogs = Object.keys(EnumCatalog).map(k => EnumCatalog[k]);

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
    activeClass: PropTypes.string,
    activeImage: PropTypes.string,
    catalog: PropTypes.oneOf(catalogs).isRequired,
    description: PropTypes.string,
    handle: PropTypes.string.isRequired,
    inactiveImage: PropTypes.string,
    onClick: PropTypes.func,
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

    const { catalog, handle, title, description, url } = this.props;

    if (this.props.onClick) {
      this.props.onClick({
        catalog,
        description,
        handle,
        title,
        url,
      });
    }
  }

  resolveImage() {
    const { active, activeImage, inactiveImage } = this.props;

    if ((active && !activeImage) || (!active && !inactiveImage)) {
      return `/images/icons/various/Favorite_${active ? 'active' : 'inactive'}.svg`;
    }

    return active ? activeImage : inactiveImage;
  }

  render() {
    const { active, activeClass = null } = this.props;
    const _t = this.props.intl.formatMessage;

    return (
      <>
        <div className={`btn-favorite ${active ? activeClass ? activeClass : 'active' : ''}`} id={this.id}>
          <a onClick={(e) => this.onClick(e)}  >
            <img
              src={this.resolveImage()}
              style={{ width: 20, marginTop: 8 }}
            />
          </a>
        </div>
        <Tooltip placement="bottom" isOpen={this.state.tooltipOpen} target={this.id} toggle={this.toggle}>
          {_t({ id: active ? 'tooltip.remove-favorite' : 'tooltip.add-favorite' })}
        </Tooltip>
      </>
    );
  }
}

export default injectIntl(Favorite);
