import axios from "axios";
import React, { useEffect } from "react";
import { API_BASE_URL } from "../Url/Url";
import { ToastContainer, toast } from "react-toastify";
import { useState } from "react";

function ActivityTimeline() {
  return (
    <>
      <ToastContainer />
      <div className="main-dashboard-content d-flex flex-column">
        <div className="responsive-content">
          {/* Breadcrumb Area */}
          <div className="breadcrumb-area">
            <h1>Activity timeline</h1>
            <ol className="breadcrumb">
              <li className="item">
                <a href="dashboard.html">Home</a>
              </li>
              <li className="item">
                <i className="fa-solid fa-angle-right" /> Dashboard
              </li>
              <li className="item">
                <i className="fa-solid fa-angle-right" /> Activity timeline
              </li>
            </ol>
          </div>
          {/* End Breadcrumb Area */}
          {/* Activity timeline section start here */}
          <section className="activity-timeline-info-area">
            <div className="activity-timeline-info-list">
              <h5>Andy Smith log view</h5>
              <table className="table table-bordered">
                <thead>
                  <tr>
                    <th>S.No</th>
                    <th>Login Date</th>
                    <th>Login Time</th>
                    <th>Page Name</th>
                    <th>Event Name</th>
                    <th>Logout Date</th>
                    <th>Logout Time</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>1</td>
                    <td>21-8-2025</td>
                    <td>08:00 AM</td>
                    <td>Dashboard</td>
                    <td>Login</td>
                    <td>21-8-2025</td>
                    <td>09:00 AM</td>
                  </tr>
                  <tr>
                    <td>2</td>
                    <td>21-8-2025</td>
                    <td>08:10 AM</td>
                    <td>Reports</td>
                    <td>Viewed Report</td>
                    <td>21-8-2025</td>
                    <td>08:50 AM</td>
                  </tr>
                  <tr>
                    <td>3</td>
                    <td>21-8-2025</td>
                    <td>08:20 AM</td>
                    <td>Settings</td>
                    <td>Updated Profile</td>
                    <td>21-8-2025</td>
                    <td>09:10 AM</td>
                  </tr>
                  <tr>
                    <td>4</td>
                    <td>21-8-2025</td>
                    <td>08:30 AM</td>
                    <td>Home</td>
                    <td>Login</td>
                    <td>21-8-2025</td>
                    <td>08:45 AM</td>
                  </tr>
                  <tr>
                    <td>5</td>
                    <td>21-8-2025</td>
                    <td>08:40 AM</td>
                    <td>Analytics</td>
                    <td>Viewed Graph</td>
                    <td>21-8-2025</td>
                    <td>09:30 AM</td>
                  </tr>
                  <tr>
                    <td>6</td>
                    <td>21-8-2025</td>
                    <td>08:50 AM</td>
                    <td>Profile</td>
                    <td>Changed Password</td>
                    <td>21-8-2025</td>
                    <td>09:45 AM</td>
                  </tr>
                  <tr>
                    <td>7</td>
                    <td>21-8-2025</td>
                    <td>09:00 AM</td>
                    <td>Login</td>
                    <td>Login</td>
                    <td>21-8-2025</td>
                    <td>09:50 AM</td>
                  </tr>
                  <tr>
                    <td>8</td>
                    <td>21-8-2025</td>
                    <td>09:10 AM</td>
                    <td>Dashboard</td>
                    <td>Viewed Notifications</td>
                    <td>21-8-2025</td>
                    <td>10:00 AM</td>
                  </tr>
                  <tr>
                    <td>9</td>
                    <td>21-8-2025</td>
                    <td>09:20 AM</td>
                    <td>Reports</td>
                    <td>Downloaded PDF</td>
                    <td>21-8-2025</td>
                    <td>09:55 AM</td>
                  </tr>
                  <tr>
                    <td>10</td>
                    <td>21-8-2025</td>
                    <td>09:30 AM</td>
                    <td>Logout</td>
                    <td>Logout</td>
                    <td>21-8-2025</td>
                    <td>09:30 AM</td>
                  </tr>
                  <tr>
                    <td>11</td>
                    <td>21-8-2025</td>
                    <td>09:40 AM</td>
                    <td>Settings</td>
                    <td>Changed Email</td>
                    <td>21-8-2025</td>
                    <td>10:10 AM</td>
                  </tr>
                  <tr>
                    <td>12</td>
                    <td>21-8-2025</td>
                    <td>09:50 AM</td>
                    <td>Home</td>
                    <td>Login</td>
                    <td>21-8-2025</td>
                    <td>10:30 AM</td>
                  </tr>
                  <tr>
                    <td>13</td>
                    <td>21-8-2025</td>
                    <td>10:00 AM</td>
                    <td>Analytics</td>
                    <td>Viewed Chart</td>
                    <td>21-8-2025</td>
                    <td>10:40 AM</td>
                  </tr>
                  <tr>
                    <td>14</td>
                    <td>21-8-2025</td>
                    <td>10:10 AM</td>
                    <td>Profile</td>
                    <td>Uploaded Photo</td>
                    <td>21-8-2025</td>
                    <td>10:50 AM</td>
                  </tr>
                  <tr>
                    <td>15</td>
                    <td>21-8-2025</td>
                    <td>10:20 AM</td>
                    <td>Reports</td>
                    <td>Viewed Report</td>
                    <td>21-8-2025</td>
                    <td>10:55 AM</td>
                  </tr>
                  <tr>
                    <td>16</td>
                    <td>21-8-2025</td>
                    <td>10:30 AM</td>
                    <td>Dashboard</td>
                    <td>Clicked Widget</td>
                    <td>21-8-2025</td>
                    <td>11:00 AM</td>
                  </tr>
                  <tr>
                    <td>17</td>
                    <td>21-8-2025</td>
                    <td>10:40 AM</td>
                    <td>Logout</td>
                    <td>Logout</td>
                    <td>21-8-2025</td>
                    <td>10:40 AM</td>
                  </tr>
                  <tr>
                    <td>18</td>
                    <td>21-8-2025</td>
                    <td>10:50 AM</td>
                    <td>Home</td>
                    <td>Login</td>
                    <td>21-8-2025</td>
                    <td>11:20 AM</td>
                  </tr>
                  <tr>
                    <td>19</td>
                    <td>21-8-2025</td>
                    <td>11:00 AM</td>
                    <td>Profile</td>
                    <td>Updated Address</td>
                    <td>21-8-2025</td>
                    <td>11:30 AM</td>
                  </tr>
                  <tr>
                    <td>20</td>
                    <td>21-8-2025</td>
                    <td>11:10 AM</td>
                    <td>Analytics</td>
                    <td>Viewed Report</td>
                    <td>21-8-2025</td>
                    <td>11:40 AM</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>
          {/* Activity timeline section end here */}
          {/* footer section start here */}
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

export default ActivityTimeline;
