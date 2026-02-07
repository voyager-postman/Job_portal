import React from "react";
import { Link } from "react-router-dom";

const CategoryManagement = () => {
  return (
    <>
      <div className="main-dashboard-content d-flex flex-column">
        <div className="responsive-content">
          {/* Breadcrumb Area */}
          <div className="breadcrumb-area">
            <h1>Manage Assesment</h1>
            <ol className="breadcrumb">
              <li className="item">
                <Link to="/">Home </Link>
              </li>
              <li className="item">
                <Link to="/employer-dashboard">
                  <i className="fa-solid fa-angle-right" /> Dashboard
                </Link>
              </li>
              <li className="item">
                <i className="fa-solid fa-angle-right" />
                Manage Assesment
              </li>
            </ol>
          </div>
        </div>
      </div>
    </>
  );
};

export default CategoryManagement;
