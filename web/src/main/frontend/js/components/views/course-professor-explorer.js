import _ from 'lodash';
import * as React from 'react';
import * as ReactRedux from 'react-redux';
import * as PropTypes from 'prop-types';

import Dropzone from 'react-dropzone';

import { bindActionCreators } from 'redux';
import { toast } from 'react-toastify';

import {
  EnumCourseAction,
} from '../../model';

import {
  addCourse,
  addStudentToCourse,
  getCourses,
  getCourseStudents,
  selectCourse,
  selectStudent,
  removeCourse,
  removeStudentFromCourse,
  updateCourse,
  updateStudentRegistration,
  upload,
} from '../../ducks/course-professor';

import {
  CourseAddCard,
  CourseAdminCard,
  CourseAdvancedOptions,
  CourseDeleteModal,
  CourseEditModal,
  CourseSetFolderModal,
  CourseStudentsModal,
} from './course-parts';

class CourseProfessorExplorer extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      action: null,
      courses: [],
      orderBy: 'year',
      selected: null,
      showModal: false,
      text: '',
      years: {},
    };

    this.textInput = React.createRef();

    this.onYearSelect = this.onYearSelect.bind(this);
  }

  static contextTypes = {
    intl: PropTypes.object,
  };

  handleAction(action, course = null) {
    switch (action) {
      case EnumCourseAction.CREATE:
        this.showModal(action);
        break;

      case EnumCourseAction.DELETE:
      case EnumCourseAction.SET_FILES:
      case EnumCourseAction.UPDATE:
        this.showModal(action, course);
        break;

      case EnumCourseAction.SET_STUDENTS: {
        this.props.getCourseStudents(course.id)
          .then(() => {
            this.showModal(action, course);
          })
          .catch(() => {
            toast.error('course.error.load.students');
          });
      }
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

  addCourse(course) {
    return this.props.addCourse(course).then((newCourse) => {

      this.search();

      return newCourse;
    });
  }

  updateCourse(id, course) {
    return this.props.updateCourse(id, course).then((updatedCourse) => {

      this.search();

      return updatedCourse;
    });
  }

  removeCourse(id) {
    const result = this.props.removeCourse(id).then(() => this.search());

    return result;
  }

  addStudentToCourse(courseId, data) {
    const _t = this.context.intl.formatMessage;

    return this.props.addStudentToCourse(courseId, data)
      .then(() => {
        toast.success('Registration created successfully');
      })
      .catch(err => {
        toast.error(_t({ id: `course.error.server.${err.code}` }));

        throw err;
      });
  }

  updateStudentRegistration(courseId, registrationId, data) {
    return this.props.updateStudentRegistration(courseId, registrationId, data)
      .then(() => {
        toast.success('Registration updated successfully');
      })
      .catch(() => {
        toast.error('Failed to update registration');
      });
  }

  removeStudentFromCourse(courseId, registrationId) {
    return this.props.removeStudentFromCourse(courseId, registrationId)
      .then(() => {
        toast.success('Registration deleted successfully');
      })
      .catch(() => {
        toast.error('Failed to delete registration');
      });
  }

  upload(course, file) {
    const { id } = course;

    return this.props.upload(id, file)
      .then(result => {
        if (result.errors.length === 0) {
          toast.success(`${result.count} registration(s) created successfully`);
        } else {
          toast.warn(`${result.count} registration(s) created successfully. ${result.errors.length} error found`);
        }

        return this.props.getCourseStudents(course.id)
          .catch(() => {
            toast.error('course.error.load.students');
            this.hideModal();
          });
      })
      .catch(() => {
        toast.error('Failed to import student registrations');
      });
  }

  render() {
    const { action, courses, orderBy, selected = null, showModal, text, years } = this.state;
    const { courses: allCourses, kernels } = this.props;

    const _t = this.context.intl.formatMessage;

    return (
      <React.Fragment>
        {showModal && (action === EnumCourseAction.CREATE || action === EnumCourseAction.UPDATE) &&
          <CourseEditModal
            addCourse={(course) => this.addCourse(course)}
            course={selected || null}
            kernels={kernels}
            toggle={() => this.hideModal()}
            updateCourse={(id, course) => this.updateCourse(id, course)}
            visible={true}>
          </CourseEditModal>
        }

        {showModal && action === EnumCourseAction.SET_FILES &&
          <CourseSetFolderModal
            course={selected}
            filesystem={this.props.filesystem}
            folder={this.props.selectedFolder}
            toggle={() => this.hideModal()}
            updateCourse={(id, course) => this.updateCourse(id, course)}
            visible={true}>
          </CourseSetFolderModal>
        }

        {showModal && action === EnumCourseAction.DELETE &&
          <CourseDeleteModal
            course={selected}
            message="course.modal.message.delete.professor"
            removeCourse={(id) => this.removeCourse(id)}
            toggle={() => this.hideModal()}
            visible={true}>
          </CourseDeleteModal>
        }

        {showModal && action === EnumCourseAction.SET_STUDENTS &&
          <CourseStudentsModal
            addStudent={(id, registration) => this.addStudentToCourse(id, registration)}
            course={selected}
            getStudents={() => this.handleAction(EnumCourseAction.SET_STUDENTS, selected)}
            removeStudent={(courseId, registrationId) => this.removeStudentFromCourse(courseId, registrationId)}
            students={this.props.students}
            toggle={() => this.hideModal()}
            updateStudent={(courseId, registrationId, data) => this.updateStudentRegistration(courseId, registrationId, data)}
            upload={(course, file) => this.upload(course, file)}
            visible={true}>
          </CourseStudentsModal>
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
                    <CourseAddCard
                      handleAction={(action) => this.handleAction(action)}
                    />
                    {courses.map(c => (
                      <CourseAdminCard
                        kernels={kernels}
                        key={c.id}
                        course={c}
                        handleAction={(action, course) => this.handleAction(action, course)}>
                      </CourseAdminCard>
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
  courses: state.courses.professor.courses,
  filesystem: state.filesystem,
  kernels: state.config.kernels,
  selectedCourse: state.courses.professor.selectedCourse,
  selectedFolder: state.filesystem.selectedFolder,
  students: state.courses.professor.students,
  selectedStudent: state.courses.professor.selectedStudent,
});

const mapDispatchToProps = (dispatch) => bindActionCreators({
  addCourse,
  addStudentToCourse,
  getCourses,
  getCourseStudents,
  selectCourse,
  selectStudent,
  removeCourse,
  removeStudentFromCourse,
  updateCourse,
  updateStudentRegistration,
  upload,
}, dispatch);


export default ReactRedux.connect(mapStateToProps, mapDispatchToProps)(CourseProfessorExplorer);
