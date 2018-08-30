import React from "react";


export const Courses = ({ info }) => (
  <div className="featured-lab-container container-fluid">
    <div className="row">

      {info.map((r, key) => (
        <div className="col-md-3 col-sm-6 col-xs-12" key={key}>
          <div className="lab-item">
            <h3 className="lab-title">
              <a href="#"> {r.title} </a>
            </h3>
            <div className="lab-description">
              {r.description}
            </div>
            <div className='lab-action-link'>
              <a href={r.link.ref}> {r.link.text} </a>
            </div>
          </div>
        </div>)
      )}
    </div>
  </div>

);