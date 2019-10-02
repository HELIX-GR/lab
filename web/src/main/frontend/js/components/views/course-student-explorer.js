import * as React from 'react';
import * as ReactRedux from 'react-redux';

import { bindActionCreators } from 'redux';
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
  CourseCard,
  CourseCopyFilesModal,
  CourseDeleteModal,
} from './course-parts';

class CourseStudentExplorer extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      action: null,
      selected: null,
      showModal: false,
    };
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

  componentDidMount() {
    this.props.getCourses()
      .catch(() => {
        toast.error('course.error.load');
      });
  }

  render() {
    const { action, selected = null, showModal } = this.state;
    const { courses = [] } = this.props;

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
            removeCourse={this.props.removeCourse}
            toggle={() => this.hideModal()}
            visible={true}>
          </CourseDeleteModal>
        }

        <div className="results-lab">
          <section className="main-results-page-content">
            <div className="results-main-content">

              <section className="results-main-sidebar">

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
                    <select name="order-by" id="order-by" value="" onChange={(e) => null}>
                      <option value="1">Ημερομηνία Εισαγωγής</option>
                      <option value="2">Έτος Διδασκαλίας</option>
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
  selectedFolder: state.filesystem.selectedFolder,
});

const mapDispatchToProps = (dispatch) => bindActionCreators({
  copyCourseFiles,
  getCourses,
  removeCourse,
}, dispatch);


export default ReactRedux.connect(mapStateToProps, mapDispatchToProps)(CourseStudentExplorer);
