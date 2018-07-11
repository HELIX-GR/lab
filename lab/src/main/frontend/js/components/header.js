import React from "react";
import { Link } from 'react-router-dom';
import ServerStatus from '../helpers/server-status';

export const LabHeader = ({ onclicks, username, admin }) => (
  <nav className=" navbar-white fized-top">
    <div className="row">

      <div className="col container-fluid">
        <a className="navbar-brand" href="#">
          <img src="images/lablogo.png" className="d-inline-block align-top logo" alt="" />
        </a>
      </div>

      <div className="col container-fluid left-align">

        <ul className="nav container-fluid justify-content-end" >
          <li className="nav-item">
            <a className="nav-link active" href="/"><font color="#724EF8">Data</font></a>
          </li>
          <li className="nav-item">
            <a className="nav-link active" href="/"><font color="#724EF8">Pubs</font></a>
          </li>
          <li className="nav-item">
            <div className="dropdown">
              <a className="nav-link active" id="dropdownMenu2" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false"> <font color="#724EF8">Lab</font></a>
              <div className="dropdown-menu" aria-labelledby="dropdownMenu2">
                <button className="dropdown-item" type="button"> <Link className="nav-link" to={'/filesystem'}> My Files </Link></button>
              </div>
            </div>
          </li>

          <li className="nav-item">
            <Link className="nav-link" to={'/abouthelix'}><font color="#724EF8">About</font></Link>
          </li>
          {admin ?
            <li className="nav-item">
              <Link className="nav-link " to={'/admin'}> Admin </Link>
            </li> : null
          }
          <li className="nav-item">
            <a className="nav-link active justify-content-end" href='#' onClick={() => (onclicks(true))} > {username ? username : 'Sign in'} </a>
          </li>
        </ul>
        {//username ? <ServerStatus /> : null
        }
      </div>
    </div >
  </nav>

);
