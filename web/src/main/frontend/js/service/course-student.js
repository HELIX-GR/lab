import actions from './api/fetch-actions';

export default {

  getCourses: () => {
    return actions.get('/action/user/courses');
  },

  removeCourse: (id, token) => {
    return actions.delete(`/action/user/course/${id}`, token);
  },

  copyCourseFiles: (id, target, token) => {
    return actions.post(`/action/user/course/${id}/file-copy`, token, { target });
  },

};
