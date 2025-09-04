import React, { useMemo } from "react";
import { Link } from "react-router-dom";
import { TableView } from "../Conponets/DataTable";
function ActivityTimeline() {
  const columns = [
    {
      accessorKey: "id",
      header: "S.No",
      cell: ({ row }) => row.index + 1, // auto index
    },
    {
      accessorKey: "loginDate",
      header: "Login Date",
      
    },
    {
      accessorKey: "loginTime",
      header: "Login Time",
    },
    {
      accessorKey: "pageName",
      header: "Page Name",
    },
    {
      accessorKey: "eventName",
      header: "Event Name",
    },
    {
      accessorKey: "logoutDate",
      header: "Logout Date",
    },
    {
      accessorKey: "logoutTime",
      header: "Logout Time",
     
    },
  
  ];

  // ✅ Static Data
const data = [
  {
    id: 1,
    loginDate: "21-8-2025",
    loginTime: "08:00 AM",
    pageName: "Dashboard",
    eventName: "Login",
    logoutDate: "21-8-2025",
    logoutTime: "09:00 AM",
  },
  {
    id: 2,
    loginDate: "21-8-2025",
    loginTime: "08:10 AM",
    pageName: "Reports",
    eventName: "Viewed Report",
    logoutDate: "21-8-2025",
    logoutTime: "08:50 AM",
  },
  {
    id: 3,
    loginDate: "21-8-2025",
    loginTime: "08:20 AM",
    pageName: "Settings",
    eventName: "Updated Profile",
    logoutDate: "21-8-2025",
    logoutTime: "09:10 AM",
  },
  {
    id: 4,
    loginDate: "21-8-2025",
    loginTime: "08:30 AM",
    pageName: "Home",
    eventName: "Login",
    logoutDate: "21-8-2025",
    logoutTime: "08:45 AM",
  },
  {
    id: 5,
    loginDate: "21-8-2025",
    loginTime: "08:40 AM",
    pageName: "Analytics",
    eventName: "Viewed Graph",
    logoutDate: "21-8-2025",
    logoutTime: "09:30 AM",
  },
  {
    id: 6,
    loginDate: "21-8-2025",
    loginTime: "08:50 AM",
    pageName: "Profile",
    eventName: "Changed Password",
    logoutDate: "21-8-2025",
    logoutTime: "09:45 AM",
  },
  {
    id: 7,
    loginDate: "21-8-2025",
    loginTime: "09:00 AM",
    pageName: "Login",
    eventName: "Login",
    logoutDate: "21-8-2025",
    logoutTime: "09:50 AM",
  },
  {
    id: 8,
    loginDate: "21-8-2025",
    loginTime: "09:10 AM",
    pageName: "Dashboard",
    eventName: "Viewed Notifications",
    logoutDate: "21-8-2025",
    logoutTime: "10:00 AM",
  },
  {
    id: 9,
    loginDate: "21-8-2025",
    loginTime: "09:20 AM",
    pageName: "Reports",
    eventName: "Downloaded PDF",
    logoutDate: "21-8-2025",
    logoutTime: "09:55 AM",
  },
  {
    id: 10,
    loginDate: "21-8-2025",
    loginTime: "09:30 AM",
    pageName: "Logout",
    eventName: "Logout",
    logoutDate: "21-8-2025",
    logoutTime: "09:30 AM",
  },
  {
    id: 11,
    loginDate: "21-8-2025",
    loginTime: "09:40 AM",
    pageName: "Settings",
    eventName: "Changed Email",
    logoutDate: "21-8-2025",
    logoutTime: "10:10 AM",
  },
  {
    id: 12,
    loginDate: "21-8-2025",
    loginTime: "09:50 AM",
    pageName: "Home",
    eventName: "Login",
    logoutDate: "21-8-2025",
    logoutTime: "10:30 AM",
  },
  {
    id: 13,
    loginDate: "21-8-2025",
    loginTime: "10:00 AM",
    pageName: "Analytics",
    eventName: "Viewed Chart",
    logoutDate: "21-8-2025",
    logoutTime: "10:40 AM",
  },
  {
    id: 14,
    loginDate: "21-8-2025",
    loginTime: "10:10 AM",
    pageName: "Profile",
    eventName: "Uploaded Photo",
    logoutDate: "21-8-2025",
    logoutTime: "10:50 AM",
  },
  {
    id: 15,
    loginDate: "21-8-2025",
    loginTime: "10:20 AM",
    pageName: "Reports",
    eventName: "Viewed Report",
    logoutDate: "21-8-2025",
    logoutTime: "10:55 AM",
  },
  {
    id: 16,
    loginDate: "21-8-2025",
    loginTime: "10:30 AM",
    pageName: "Dashboard",
    eventName: "Clicked Widget",
    logoutDate: "21-8-2025",
    logoutTime: "11:00 AM",
  },
  {
    id: 17,
    loginDate: "21-8-2025",
    loginTime: "10:40 AM",
    pageName: "Logout",
    eventName: "Logout",
    logoutDate: "21-8-2025",
    logoutTime: "10:40 AM",
  },
  {
    id: 18,
    loginDate: "21-8-2025",
    loginTime: "10:50 AM",
    pageName: "Home",
    eventName: "Login",
    logoutDate: "21-8-2025",
    logoutTime: "11:20 AM",
  },
  {
    id: 19,
    loginDate: "21-8-2025",
    loginTime: "11:00 AM",
    pageName: "Profile",
    eventName: "Updated Address",
    logoutDate: "21-8-2025",
    logoutTime: "11:30 AM",
  },
  {
    id: 20,
    loginDate: "21-8-2025",
    loginTime: "11:10 AM",
    pageName: "Analytics",
    eventName: "Viewed Report",
    logoutDate: "21-8-2025",
    logoutTime: "11:40 AM",
  },
];


  return (
    <>
      <div className="main-dashboard-content d-flex flex-column">
        <div className="responsive-content">
          {/* Breadcrumb Area */}
          <div className="breadcrumb-area">
            <h1>Activity timeline</h1>
            <ol className="breadcrumb">
              <li className="item">
                <a href="dashboard.html">Home </a>
              </li>
              <li className="item">
                <i className="fa-solid fa-angle-right" /> Dashboard
              </li>
              <li className="item">
                <i className="fa-solid fa-angle-right" />  Activity timeline
              </li>
            </ol>
          </div>
          {/* End Breadcrumb Area */}
          {/*Start My Profile Area*/}
          <div className="my-profile-area">
            <div className="profile-form-content add-recruiters-btn-postion">
              <h3>Andy Smith log view</h3>
             
              <div className="profile-form">
                <div className="row">
                  <div className="col-lg-12 col-md-12">
                    <TableView columns={columns} data={data} />
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

export default ActivityTimeline;
