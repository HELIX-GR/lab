import React from "react";


export const JumpotronLab = ({ startnow, target }) => (
  <div className="jumbotron text-align-center">
    <div>
      <h1 className="display-4">Welcome to Helix Lab!</h1>
      <p className="lead">Interactive coding in your browser|</p>
      <hr className="my-4" />
      <p>Free, in the cloud, powered by Jupyter</p>
      <p className="lead">
        <a className="btn btn-primary btn-lg" onClick={startnow} role="button">Start Now</a>
      </p>
      <p className="lead">
        <a className="btn btn-primary btn-lg" target="_blank" href={target} role="button">Go to my server</a>
      </p>
    </div>
  </div>);
