import React from "react";
import { Link } from "react-router-dom";
import DataTable from "../Conponets/DataTable";

function RecruiterLists() {
    
  return (
    <>
      <div className="main-dashboard-content d-flex flex-column">
        <div className="responsive-content">
          {/* Breadcrumb Area */}
          <div className="breadcrumb-area">
            <h1>Recruiters List</h1>
            <ol className="breadcrumb">
              <li className="item">
                <a href="dashboard.html">Home </a>
              </li>
              <li className="item">
                <i className="fa-solid fa-angle-right" /> Dashboard
              </li>
              <li className="item">
                <i className="fa-solid fa-angle-right" /> Recruiters List
              </li>
            </ol>
          </div>
          {/* End Breadcrumb Area */}
          {/*Start My Profile Area*/}
          <div className="my-profile-area">
            <div className="profile-form-content">
              <h3>Recruiters List</h3>
              <div className="profile-form">
                <div className="row">
                  <div className="col-lg-12 col-md-12">
                    <table className="table table-bordered">
                      <thead>
                        <tr>
                          <th>S.No</th>
                          <th>Recruiter Img</th>
                          <th>Recruiter Name</th>
                          <th>Email</th>
                          <th>Position</th>
                          <th>Phone Number</th>
                          <th>Status</th>
                          <th>Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <th>1</th>
                          <td>
                            <div className="recruiterImg-info">
                              <img
                                src="/jobPortal/assets/images/candidate-img/candidate4.jpg"
                                alt="logo"
                              />
                            </div>
                          </td>
                          <td>
                            <p>Samyara Robert</p>
                          </td>
                          <td>
                            <p>Samyara Robert@gmail.com</p>
                          </td>
                          <td>
                            <p>Staff Member</p>
                          </td>
                          <td>
                            <p>9874563214</p>
                          </td>
                          <td>
                            <div className="recruiter-status-info">
                              <div className="form-check form-switch">
                                <input
                                  className="form-check-input"
                                  type="checkbox"
                                  role="switch"
                                  id="flexSwitchCheckDefault"
                                />
                                <label
                                  className="form-check-label"
                                  htmlFor="flexSwitchCheckDefault"
                                />
                              </div>
                            </div>
                          </td>
                          <td>
                            <div className="action-icon-info">
                              <i className="fa-solid fa-pencil" />
                              <i className="fa-solid fa-trash" />
                            </div>
                          </td>
                        </tr>
                        <tr>
                          <th>2</th>
                          <td>
                            <div className="recruiterImg-info">
                              <img
                                src="/jobPortal/assets/images/candidate-img/candidate1.jpg"
                                alt="logo"
                              />
                            </div>
                          </td>
                          <td>
                            <p>Eric Norto</p>
                          </td>
                          <td>
                            <p>EricNorto@gmail.com</p>
                          </td>
                          <td>
                            <p>Admin And HR</p>
                          </td>
                          <td>
                            <p>9874563214</p>
                          </td>
                          <td>
                            <div className="recruiter-status-info">
                              <div className="form-check form-switch">
                                <input
                                  className="form-check-input"
                                  type="checkbox"
                                  role="switch"
                                  id="flexSwitchCheckDefault"
                                />
                                <label
                                  className="form-check-label"
                                  htmlFor="flexSwitchCheckDefault"
                                />
                              </div>
                            </div>
                          </td>
                          <td>
                            <div className="action-icon-info">
                              <i className="fa-solid fa-pencil" />
                              <i className="fa-solid fa-trash" />
                            </div>
                          </td>
                        </tr>
                        <tr>
                          <th>3</th>
                          <td>
                            <div className="recruiterImg-info">
                              <img
                                src="/jobPortal/assets/images/candidate-img/candidate2.jpg"
                                alt="logo"
                              />
                            </div>
                          </td>
                          <td>
                            <p>Piter Jhon</p>
                          </td>
                          <td>
                            <p>PiterJhon@gmail.com</p>
                          </td>
                          <td>
                            <p>Cordinatore</p>
                          </td>
                          <td>
                            <p>9874563214</p>
                          </td>
                          <td>
                            <div className="recruiter-status-info">
                              <div className="form-check form-switch">
                                <input
                                  className="form-check-input"
                                  type="checkbox"
                                  role="switch"
                                  id="flexSwitchCheckDefault"
                                />
                                <label
                                  className="form-check-label"
                                  htmlFor="flexSwitchCheckDefault"
                                />
                              </div>
                            </div>
                          </td>
                          <td>
                            <div className="action-icon-info">
                              <i className="fa-solid fa-pencil" />
                              <i className="fa-solid fa-trash" />
                            </div>
                          </td>
                        </tr>
                        <tr>
                          <th>4</th>
                          <td>
                            <div className="recruiterImg-info">
                              <img
                                src="/jobPortal/assets/images/candidate-img/candidate3.jpg"
                                alt="logo"
                              />
                            </div>
                          </td>
                          <td>
                            <p>Helen Smith</p>
                          </td>
                          <td>
                            <p>HelenSmith@gmail.com</p>
                          </td>
                          <td>
                            <p>Candidate Research</p>
                          </td>
                          <td>
                            <p>9874563214</p>
                          </td>
                          <td>
                            <div className="recruiter-status-info">
                              <div className="form-check form-switch">
                                <input
                                  className="form-check-input"
                                  type="checkbox"
                                  role="switch"
                                  id="flexSwitchCheckDefault"
                                />
                                <label
                                  className="form-check-label"
                                  htmlFor="flexSwitchCheckDefault"
                                />
                              </div>
                            </div>
                          </td>
                          <td>
                            <div className="action-icon-info">
                              <i className="fa-solid fa-pencil" />
                              <i className="fa-solid fa-trash" />
                            </div>
                          </td>
                        </tr>
                        <tr>
                          <th>5</th>
                          <td>
                            <div className="recruiterImg-info">
                              <img
                                src="/jobPortal/assets/images/candidate-img/candidate4.jpg"
                                alt="logo"
                              />
                            </div>
                          </td>
                          <td>
                            <p>David Park</p>
                          </td>
                          <td>
                            <p>DavidPark@gmail.com</p>
                          </td>
                          <td>
                            <p>Quality Test</p>
                          </td>
                          <td>
                            <p>9874563214</p>
                          </td>
                          <td>
                            <div className="recruiter-status-info">
                              <div className="form-check form-switch">
                                <input
                                  className="form-check-input"
                                  type="checkbox"
                                  role="switch"
                                  id="flexSwitchCheckDefault"
                                />
                                <label
                                  className="form-check-label"
                                  htmlFor="flexSwitchCheckDefault"
                                />
                              </div>
                            </div>
                          </td>
                          <td>
                            <div className="action-icon-info">
                              <i className="fa-solid fa-pencil" />
                              <i className="fa-solid fa-trash" />
                            </div>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          </div>
          {/*End My Profile Area*/}
          <div className="copy-right-area bg-f0f4fc">
            <div className="row">
              <div className="col-lg-6 col-md-6">
                <div className="copyright-left-content">
                  <p>
                    {" "}
                    <span className="copy">© </span>
                    <span id="year" />
                    <span className="template-name"> Connect Work.ma </span> All
                    Rights Reserved
                  </p>
                </div>
              </div>
              <div className="col-lg-6 col-md-6">
                <div className="copyright-right-content">
                  <p>
                    Designed By{" "}
                    <a href="https://hibootstrap.com/" target="_blank">
                      Webnmobapps Solution Pvt. Ltd
                    </a>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default RecruiterLists;
