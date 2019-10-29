import actions from './api/fetch-actions';

export default {

  getCourses: () => {
    return actions.get('/action/courses');
  },

  addCourse: (course, token) => {
    return actions.post('/action/course', token, course);
  },

  updateCourse: (id, course, token) => {
    return actions.post(`/action/course/${id}`, token, course);
  },

  removeCourse: (id, token) => {
    return actions.delete(`/action/course/${id}`, token);
  },

  getStudents: (id) => {
    return actions.get(`/action/course/${id}/registrations`);
  },

  addStudentToCourse: (id, registration, token) => {
    return actions.post(`/action/course/${id}/registration`, token, registration);
  },

  updateStudentRegistration: (courseId, registrationId, registration, token) => {
    return actions.post(`/action/course/${courseId}/registration/${registrationId}`, token, registration);
  },

  removeStudentFromCourse: (courseId, registrationId, token) => {
    return actions.delete(`/action/course/${courseId}/registration/${registrationId}`, token);
  },

  upload: (id, file, token) => {
    const form = new FormData();
    form.append('file', file);

    return actions.submit(`/action/course/${id}/registrations/upload`, token, form);
  },

  syncCourseRolesAndKernel: (id, token) => {
    return actions.post(`/action/course/${id}/sync`, token, {});
  },

};
