import * as React from 'react';
import * as PropTypes from 'prop-types';

import {
  EnumCkanFacet,
} from '../../model';

import {
  Checkbox,
} from '../helpers';

class CkanAdvancedOptions extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      more: Object.keys(EnumCkanFacet).reduce((result, key) => { result[EnumCkanFacet[key]] = false; return result; }, {}),
    };
  }

  static contextTypes = {
    intl: PropTypes.object,
  }

  static propTypes = {
    facets: PropTypes.object.isRequired,
    metadata: PropTypes.object.isRequired,
    minOptions: PropTypes.number,
    toggleFacet: PropTypes.func.isRequired,
  }

  static defaultProps = {
    minOptions: 4,
  }

  toggleMore(e, key) {
    e.preventDefault();
    this.setState({
      more: {
        ...this.state.more,
        [key]: !this.state.more[key],
      }
    });
  }

  onFacetChanged(facet, value) {
    this.props.toggleFacet(facet, value);
  }

  renderParameters(key, title, items, valueProperty, textProperty, prefix, minOptions, showAll) {
    const _t = this.context.intl.formatMessage;
    const size = Array.isArray(items) ? showAll ? items.length : Math.min(items.length, minOptions) : 0;

    if (size === 0) {
      return null;
    }

    return (
      <div className={`${key} param-box ${showAll ? '' : 'less'}`}>
        <h5 className="title">{title}</h5>
        <div className={`switches ${showAll ? 'more' : 'less'}`}>
          {
            items.slice(0, size).map((value, index) => {
              const resolvedValue = valueProperty ? value[valueProperty] : value;
              const checked = !!this.props.facets[key].find(value => value === resolvedValue);

              return (
                <Checkbox
                  key={`switch-${prefix}-${index}`}
                  id={`switch-${prefix}-${index}`}
                  name={`switch-${prefix}-${index}`}
                  text={textProperty ? value[textProperty] : value}
                  value={checked}
                  readOnly={false}
                  onChange={() => { this.onFacetChanged(key, resolvedValue); }}
                />
              );
            })
          }
        </div>
        {items.length > minOptions &&
          <div className="more-link">
            <a onClick={(e) => this.toggleMore(e, key)}>{showAll ? _t({ id: 'advanced-search.view-less' }) : _t({ id: 'advanced-search.view-more' })}</a>
          </div>
        }
      </div>
    );
  }

  render() {
    const {
      config: { groups, organizations, licenses, formats, tags },
      minOptions,
    } = this.props;
    const {
      more: {
        [EnumCkanFacet.Group]: showAllGroups,
        [EnumCkanFacet.Organization]: showAllOrganizations,
        [EnumCkanFacet.License]: showAllLicenses,
        [EnumCkanFacet.Format]: showAllFormats,
        [EnumCkanFacet.Tag]: showAllTags
      },
    } = this.state;
    const _t = this.context.intl.formatMessage;

    return (
      <div className="fields">
        {organizations.length !== 0 &&
          <div className="fields-group">
            {this.renderParameters(EnumCkanFacet.Organization, _t({ id: 'advanced-search.filters.ckan.organizations' }), organizations, 'name', 'title', 'org', minOptions, showAllOrganizations)}
          </div>
        }
        {groups.length !== 0 &&
          <div className="fields-group">
            {this.renderParameters(EnumCkanFacet.Group, _t({ id: 'advanced-search.filters.ckan.topics' }), groups, 'name', 'title', 'grp', minOptions, showAllGroups)}
          </div>
        }
        {tags.length !== 0 &&
          <div className="fields-group">
            {this.renderParameters(EnumCkanFacet.Tag, _t({ id: 'advanced-search.filters.ckan.tags' }), tags, 'name', 'display_name', 'tag', minOptions, showAllTags)}
          </div>
        }
        {formats.length !== 0 &&
          <div className="fields-group">
            {this.renderParameters(EnumCkanFacet.Format, _t({ id: 'advanced-search.filters.ckan.formats' }), formats, null, null, 'fmt', minOptions, showAllFormats)}
          </div>
        }
        {licenses.length !== 0 &&
          <div className="fields-group">
            {this.renderParameters(EnumCkanFacet.License, _t({ id: 'advanced-search.filters.ckan.licenses' }), licenses, 'id', 'title', 'lic', minOptions, showAllLicenses)}
          </div>
        }
      </div>
    );
  }
}

export default CkanAdvancedOptions;
