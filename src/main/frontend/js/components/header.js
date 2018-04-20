import React from "react";
import { Link } from 'react-router-dom'

export const LabHeader = ({onclicks, username}) => (
  <div>
    <nav className="navbar navbar-dark bg-dark fized-top">
      <div className="container">
      <a className="navbar-brand" href="#">
      <font size='7' color='#333333'>HELIX</font>	
      <font size='10' color='#1081ca'>LAB</font>	
      {/*  <img src="images/lablogo.png" width="130" height="45" class="d-inline-block align-top" alt=""/> */}
        Notebooks <small>Preview</small>
      </a>
      <a className="nav-link active justify-content-end"  href='#' onClick={() =>(onclicks(true))} > { username ? username : 'Sign in' } </a>
      </div>
    </nav>
    <div className="bg-dark">
    <ul className="nav container bg-dark" >
      <li className="nav-item">
        <a className="nav-link active" href="#">Notebooks</a>
      </li>
      <li className="nav-item">
        <Link  className="nav-link" to={'/filesystem'}> My Files </Link>
      </li>
      <li className="nav-item">
        <Link  className="nav-link" to={'/abouthelix'}> About </Link>
      </li>
      <li className="nav-item">
        <Link  className="nav-link disabled"  onClick={e => e.preventDefault()} to={'/soon'}> Soon </Link>
      </li>
    </ul>
    </div>
  </div>);
