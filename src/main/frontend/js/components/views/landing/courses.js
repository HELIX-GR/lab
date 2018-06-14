import React from "react";


export const Courses = ({ info }) => (
  <div className="courses-container container-fluid">
    <div className="row">

      {info.map((r,key) => (
        <div className="col-md-3 col-sm-6 col-xs-12" key ={key}>
          <div className="course-item">
            <div className="course-lab-icon">
              <a href={r.link.ref}>
                <img src={r.image} alt="" />
              </a>
            </div>
            <h3 className="course-lab-title">
              <a href={r.link.ref} > {r.title}</a>
            </h3>
            <div className="course-lab-description">
              {r.description}
            </div>
          </div>
        </div>)
      )}
    </div>
  </div>

);