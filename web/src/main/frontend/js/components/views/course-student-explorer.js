import _ from 'lodash';
import * as React from 'react';
import * as ReactRedux from 'react-redux';

import { bindActionCreators } from 'redux';
import { injectIntl } from 'react-intl';
import { toast, } from 'react-toastify';

import {
  EnumCourseAction,
} from '../../model';

import {
  copyCourseFiles,
  getCourses,
  removeCourse,
} from '../../ducks/course-student';

import {
  CourseAdvancedOptions,
  CourseCard,
  CourseCopyFilesModal,
  CourseDeleteModal,
} from './course-parts';

class CourseStudentExplorer extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      action: null,
      courses: [],
      orderBy: 'title',
      selected: null,
      showModal: false,
      text: '',
      years: {},
    };

    this.textInput = React.createRef();

    this.onYearSelect = this.onYearSelect.bind(this);
  }

  handleAction(action, course = null) {
    switch (action) {
      case EnumCourseAction.COPY_FILES:
        this.showModal(action, course);
        break;
      case EnumCourseAction.DELETE:
        this.showModal(action, course);
        break;
    }
  }

  showModal(action, selected = null) {
    this.setState({
      action,
      selected,
      showModal: true,
    });
  }

  hideModal() {
    this.setState({
      action: null,
      selected: null,
      showModal: false,
    });
  }

  onTextChanged(text) {
    this.setState({
      text,
    });
  }

  onSearch(e) {
    e.preventDefault();

    this.search();
  }

  onYearSelect(year, selected) {
    this.setState(state => ({
      years: {
        ...state.years,
        [year]: !selected,
      },
    }));

    // Refresh UI on the text tick
    setTimeout(() => this.search(), 0);
  }

  onOrderChange(orderBy) {
    this.setState({
      orderBy,
    });

    // Refresh UI on the text tick
    setTimeout(() => this.search(), 0);
  }

  componentDidMount() {
    this.props.getCourses()
      .then(courses => {
        const years = {};
        _.uniqBy(courses, 'year').forEach(c => {
          years[c.year] = false;
        });

        this.setState({
          years,
        });

        this.search();
      })
      .catch(() => {
        toast.error('course.error.load.course');
      });
  }

  search() {
    const { courses: data } = this.props;
    const { orderBy, text, years } = this.state;

    const courses = data.filter(c => {
      if (text && c.title.indexOf(text) === -1) {
        return false;
      }
      const selectedYears = Object.keys(years).filter(y => years[y]).map(y => Number(y));

      if (selectedYears.length !== 0) {
        return !!selectedYears.find(y => y === c.year);
      }

      return true;
    });

    this.setState({
      courses: _.orderBy(
        courses,
        orderBy === 'title' ? ['title', 'year'] : ['year', 'title'],
        orderBy === 'title' ? ['asc', 'desc'] : ['desc', 'asc']
      ),
    });
  }

  render() {
    const { action, courses, orderBy, selected = null, showModal, text, years } = this.state;
    const { courses: allCourses, kernels } = this.props;

    const _t = this.props.intl.formatMessage;

    return (
      <React.Fragment>

        {showModal && action === EnumCourseAction.COPY_FILES &&
          <CourseCopyFilesModal
            course={selected}
            copyFiles={this.props.copyCourseFiles}
            filesystem={this.props.filesystem}
            folder={this.props.selectedFolder}
            toggle={() => this.hideModal()}
            visible={true}>
          </CourseCopyFilesModal>
        }
        {showModal && action === EnumCourseAction.DELETE &&
          <CourseDeleteModal
            course={selected}
            message="course.modal.message.delete.student"
            removeCourse={(id) => this.props.removeCourse(id).then(() => this.search())}
            toggle={() => this.hideModal()}
            visible={true}>
          </CourseDeleteModal>
        }

        <div className="results-lab">
          <section className="main-results-page-content">
            <div className="results-main-content">

              <section className="results-main-sidebar">

                <div className="search-form-wrapper">

                  <form className="landing-search-form">

                    <div className="main-form-content">
                      <input
                        type="text"
                        autoComplete="off"
                        outline="off"
                        className="landing-search-text"
                        name="landing-search-text"
                        placeholder={_t({ id: 'course.search.placeholder' })}
                        value={text}
                        onChange={(e) => this.onTextChanged(e.target.value)}
                        ref={this.textInput}
                      />
                    </div>

                    <button
                      type="submit"
                      name="landing-search-button"
                      className="landing-search-button"
                      onClick={(e) => this.onSearch(e)}
                    >
                      <i className="fa fa-search"></i>
                    </button>

                  </form>
                </div>

                <div className="main-results-advanced-search">

                  <h4 className="header">
                    {_t({ id: 'results.advanced-search' })}
                  </h4>


                  <div className="border-bottom-bar">

                  </div>
                </div>

                {allCourses.length !== 0 &&
                  <CourseAdvancedOptions
                    minOptions={4}
                    toggleYear={this.onYearSelect}
                    years={years}
                  />
                }

              </section>

              <section className="results-main-result-set">

                <div className="breadcrumbs-pagination top">
                  <div className="breadcrumbs">
                    <a className="breadcrumbs-part">Μαθήματα</a>
                  </div>
                </div>

                <div className="main-results-border-bottom">
                  <label className="order-by" htmlFor="order-by">
                    Ταξινόμηση κατά
                    <select name="order-by" id="order-by" value={orderBy} onChange={(e) => this.onOrderChange(e.target.value)}>
                      <option value="title">Τίτλος</option>
                      <option value="year">Έτος Διδασκαλίας</option>
                    </select>
                  </label>
                  <div className="main-results-result-count">
                    Βρέθηκαν {courses.length} Μαθήματα
                  </div>
                </div>

                <div className="result-items">
                  <div className="course-list">
                    {courses.map(c => (
                      <CourseCard
                        kernels={kernels}
                        key={c.id}
                        course={c}
                        handleAction={(action, course) => this.handleAction(action, course)}>
                      </CourseCard>
                    ))}
                  </div>

                </div>

                <div className="main-results-border-bottom">

                </div>

              </section>

            </div>
          </section>
        </div>

      </React.Fragment>
    );
  }

}

const mapStateToProps = (state) => ({
  courses: state.courses.student.courses,
  filesystem: state.filesystem,
  kernels: state.config.kernels,
  selectedFolder: state.filesystem.selectedFolder,
});

const mapDispatchToProps = (dispatch) => bindActionCreators({
  copyCourseFiles,
  getCourses,
  removeCourse,
}, dispatch);


const localizedComponent = injectIntl(CourseStudentExplorer);

export default ReactRedux.connect(mapStateToProps, mapDispatchToProps)(localizedComponent);
