import React from "react";


export const LabHeader = () => (
  <div>
    <nav className="navbar navbar-dark bg-dark fized-top">
      <div className="container">
      <a className="navbar-brand" href="#">
      <font size='7' color='#333333'>HELIX</font>	
      <font size='10' color='#1081ca'>LAB</font>	
      {/*  <img src="images/lablogo.png" width="130" height="45" class="d-inline-block align-top" alt=""/> */}
        Notebooks <small>Preview</small>
      </a>
      <a className="nav-link active justify-content-end" href="#" data-toggle="modal" data-target="#exampleModalCenter">Sign In</a>
      </div>
    </nav>
    <div className="bg-dark">
    <ul className="nav container bg-dark" >
      <li className="nav-item">
        <a className="nav-link active" href="#">Notebooks</a>
      </li>
      <li className="nav-item">
        <a className="nav-link" href="#">Get Started</a>
      </li>
      <li className="nav-item">
        <a className="nav-link" href="#">About</a>
      </li>
      <li className="nav-item">
        <a className="nav-link disabled" href="#">Soon</a>
      </li>
    </ul>
    </div>
  </div>);
