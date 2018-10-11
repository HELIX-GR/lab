import * as React from 'react';
import * as PropTypes from 'prop-types';

import classnames from 'classnames';

class Pagination extends React.Component {

  constructor(props) {
    super(props);
  }

  static propTypes = {
    pageIndex: PropTypes.number.isRequired,
    pageCount: PropTypes.number.isRequired,
    pageChange: PropTypes.func.isRequired,
  }

  static defaultProps = {
    pageIndex: 0,
    pageCount: 0,
  }

  onPageChange(e, index) {
    e.preventDefault();
    this.props.pageChange(index);
  }

  render() {
    const { pageIndex, pageCount: count } = this.props;
    const index = pageIndex + 1;
    const isFirst = index === 1;
    const isLast = index === count;

    if (count === 0) {
      return null;
    }

    return (
      <div className={"breadcrumbs-pagination " + this.props.className}>
        <div className="breadcrumbs">
          <a href="#" className="breadcrumbs-part">RESULT</a>
          <a href="#" className="breadcrumbs-part last-part">NOTEBOOKS</a>
        </div>

        <div className="pagination-block">

          {index > 2 &&
            <a onClick={(e) => this.onPageChange(e, 0)} className='pagination-item double-left-arrow'>{'<<'}</a>
          }
          {index > 1 &&
            <a onClick={(e) => this.onPageChange(e, index - 2)} className='pagination-item single-left-arrow'>{'<'}</a>
          }

          <a onClick={(e) => this.onPageChange(e, index < 3 ? 0 : index > count - 2 ? count - 3 : index - 2)} className={
            classnames({
              'pagination-item': true,
              'current-item': isFirst,
            })
          }>{index < 3 ? 1 : index > count - 2 ? count - 2 : index - 1}</a>

          {count > 1 &&
            <a onClick={(e) => this.onPageChange(e, index < 3 ? 1 : index > count - 2 ? count - 2 : index - 1)} className={
              classnames({
                'pagination-item': true,
                'current-item': !isFirst && !isLast,
              })
            }>{index < 3 ? 2 : index > count - 2 ? count - 1 : index}</a>
          }

          {count > 2 &&
            <a onClick={(e) => this.onPageChange(e, index < 3 ? 2 : index > count - 2 ? count - 1 : index)} className={
              classnames({
                'pagination-item': true,
                'current-item': isLast,
              })
            }>{index < 3 ? 3 : index > count - 2 ? count : index + 1}</a>
          }

          {index < count &&
            <a onClick={(e) => this.onPageChange(e, index)} className='pagination-item single-right-arrow'>></a>
          }
          {index < (count - 1) &&
            <a onClick={(e) => this.onPageChange(e, count - 1)} className='pagination-item double-right-arrow'>>></a>
          }

        </div>
      </div>
    );
  }

}

export default Pagination;
