import * as React from 'react';
import * as PropTypes from 'prop-types';

import { injectIntl } from 'react-intl';

import {
  Checkbox,
} from '../../helpers';

class CourseAdvancedOptions extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      more: false,
    };
  }

  static propTypes = {
    minOptions: PropTypes.number,
    toggleYear: PropTypes.func.isRequired,
    years: PropTypes.object.isRequired,
  }

  static defaultProps = {
    minOptions: 4,
  }

  toggleMore(e) {
    e.preventDefault();

    this.setState(state => ({
      more: !state.more,
    }));
  }

  onYearChanged(year, checked) {
    this.props.toggleYear(year, checked);
  }

  renderYears() {
    const { more } = this.state;
    const { minOptions, years } = this.props;

    const _t = this.props.intl.formatMessage;

    const keys = Object.keys(years);
    const size = more ? keys.length : Math.min(keys.length, minOptions);

    if (size === 0) {
      return null;
    }

    return (
      <div className={`year param-box ${more ? '' : 'less'}`}>
        <h5 className="title">{_t({ id: 'course.search.years' })}</h5>
        <div className={`switches ${more ? 'more' : 'less'}`}>
          {
            keys.sort().reverse().slice(0, size).map((key, index) => {
              const checked = years[key];

              return (
                <Checkbox
                  key={`switch-year-${index}`}
                  id={`switch-year-${index}`}
                  name={`switch-year-${index}`}
                  text={key}
                  value={checked}
                  readOnly={false}
                  onChange={() => { this.props.toggleYear(key, checked); }}
                />
              );
            })
          }
        </div>
        {keys.length > minOptions &&
          <div className="more-link">
            <a onClick={(e) => this.toggleMore(e)}>{more ? _t({ id: 'advanced-search.view-less' }) : _t({ id: 'advanced-search.view-more' })}</a>
          </div>
        }
      </div>
    );
  }

  render() {
    const { years } = this.props;

    return (
      <div className="fields">
        {Object.keys(years).length !== 0 &&
          <div className="fields-group">
            {this.renderYears()}
          </div>
        }
      </div>
    );
  }
}

export default injectIntl(CourseAdvancedOptions);
