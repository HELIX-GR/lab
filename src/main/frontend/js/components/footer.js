import React from "react";
import { Link } from 'react-router-dom'

export const LabFooter = () => (
  <footer id="footer" className="lab-footer">
    <div className="footer-content" >
      <div className="footer-column logo">
        <a href="#">
          <img src="images/Helix-logo-White-on-Black.svg" alt="" />
        </a>
      </div>
      <div className="footer-column about">
        <h3 className="footer-column-title">
          About
        </h3>
        <ul>
          <li><a href="#">Αρχική</a></li>
          <li><a href="#">Το έργο</a></li>
          <li><a href="#">Επικοινωνία</a></li>
          <li><a href="#">Όροι χρήσης</a></li>
        </ul>
      </div>
      <div className="footer-column research">
        <h3 className="footer-column-title">
          Έρευνα
        </h3>
        <ul>
          <li><a href="#">Data</a></li>
          <li><a href="#">Publications</a></li>
          <li><a href="#">Lab</a></li>
          <li><a href="#">Θεματικές</a></li>
          <li><a href="#">Οργανισμοί</a></li>
        </ul>
      </div>
      <div className="footer-column partners">
        <h3 className="footer-column-title">
          Συνεργάτες
        </h3>
      </div>
      <div className="copyright-notes">
        © 2018 Helix. All rights reserved.
      </div>
    </div>
  </footer>
);
