import * as React from 'react';
import * as ReactRedux from 'react-redux';
import Dropzone from 'react-dropzone';

import { toast } from 'react-toastify';
import { bindActionCreators } from 'redux';

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
  upload,
} from '../../ducks/course-professor';

class CourseProfessorExplorer extends React.Component {

  render() {
    return null;
  }

}

const mapStateToProps = (state) => ({
  courses: state.courses.professor.courses,
  selectedCourse: state.courses.professor.selectedCourse,
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
  upload,
}, dispatch);


export default ReactRedux.connect(mapStateToProps, mapDispatchToProps)(CourseProfessorExplorer);
