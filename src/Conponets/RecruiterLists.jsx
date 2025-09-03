import React, { useMemo } from "react";
import { Link } from "react-router-dom";
import { TableView } from "../Conponets/DataTable";
function RecruiterLists() {
  const columns = [
    {
      accessorKey: "id",
      header: "S.No",
      cell: ({ row }) => row.index + 1, // auto index
    },
    {
      accessorKey: "image",
      header: "Img",
      cell: ({ row }) => (
        <div className="recruiterImg-info">
          <img
            src={row.original.image}
            alt="logo"
            width={40}
            height={40}
            style={{ borderRadius: "50%" }}
          />
        </div>
      ),
    },
    {
      accessorKey: "name",
      header: "Recruiter",
    },
    {
      accessorKey: "email",
      header: "Email",
    },
    {
      accessorKey: "position",
      header: "Position",
    },
    {
      accessorKey: "phone",
      header: "Number",
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: () => (
        <div className="recruiter-status-info">
          <div className="form-check form-switch">
            <input className="form-check-input" type="checkbox" role="switch" />
          </div>
        </div>
      ),
    },
    {
      accessorKey: "action",
      header: "Action",
      cell: () => (
        <div className="action-icon-info">
          <i
            className="fa-solid fa-pencil"
            style={{ cursor: "pointer", marginRight: "10px" }}
          />
          <i className="fa-solid fa-trash" style={{ cursor: "pointer" }} />
        </div>
      ),
    },
  ];

  // ✅ Static Data
  const data = [
    {
      id: 1,
      image: "/jobPortal/assets/images/candidate-img/candidate1.jpg",
      name: "Samyara Robert",
      email: "samyara.robert@gmail.com",
      position: "Staff Member",
      phone: "9874563214",
    },
    {
      id: 2,
      image: "/jobPortal/assets/images/candidate-img/candidate2.jpg",
      name: "John Smith",
      email: "john.smith@gmail.com",
      position: "HR Manager",
      phone: "9876543210",
    },
    {
      id: 3,
      image: "/jobPortal/assets/images/candidate-img/candidate3.jpg",
      name: "Emma Watson",
      email: "emma.watson@gmail.com",
      position: "Recruiter",
      phone: "9123456789",
    },
    {
      id: 4,
      image: "/jobPortal/assets/images/candidate-img/candidate4.jpg",
      name: "Robert Brown",
      email: "robert.brown@gmail.com",
      position: "Staff Member",
      phone: "9988776655",
    },
    {
      id: 5,
      image: "/jobPortal/assets/images/candidate-img/candidate1.jpg",
      name: "Sophia Johnson",
      email: "sophia.johnson@gmail.com",
      position: "Team Lead",
      phone: "9871234567",
    },
    {
      id: 6,
      image: "/jobPortal/assets/images/candidate-img/candidate2.jpg",
      name: "Liam Williams",
      email: "liam.williams@gmail.com",
      position: "Software Engineer",
      phone: "9765432109",
    },
    {
      id: 7,
      image: "/jobPortal/assets/images/candidate-img/candidate3.jpg",
      name: "Olivia Martinez",
      email: "olivia.martinez@gmail.com",
      position: "Designer",
      phone: "9456123789",
    },
    {
      id: 8,
      image: "/jobPortal/assets/images/candidate-img/candidate4.jpg",
      name: "James Anderson",
      email: "james.anderson@gmail.com",
      position: "Staff Member",
      phone: "9870098765",
    },
    {
      id: 9,
      image: "/jobPortal/assets/images/candidate-img/candidate1.jpg",
      name: "Isabella Taylor",
      email: "isabella.taylor@gmail.com",
      position: "Recruiter",
      phone: "9567843210",
    },
    {
      id: 10,
      image: "/jobPortal/assets/images/candidate-img/candidate2.jpg",
      name: "Mason Lee",
      email: "mason.lee@gmail.com",
      position: "HR Assistant",
      phone: "9345678123",
    },
    {
      id: 11,
      image: "/jobPortal/assets/images/candidate-img/candidate3.jpg",
      name: "Mia Davis",
      email: "mia.davis@gmail.com",
      position: "Coordinator",
      phone: "9012345678",
    },
    {
      id: 12,
      image: "/jobPortal/assets/images/candidate-img/candidate4.jpg",
      name: "Ethan White",
      email: "ethan.white@gmail.com",
      position: "Recruiter",
      phone: "9234567890",
    },
    {
      id: 13,
      image: "/jobPortal/assets/images/candidate-img/candidate1.jpg",
      name: "Charlotte Harris",
      email: "charlotte.harris@gmail.com",
      position: "Staff Member",
      phone: "9123987654",
    },
    {
      id: 14,
      image: "/jobPortal/assets/images/candidate-img/candidate2.jpg",
      name: "Benjamin Clark",
      email: "benjamin.clark@gmail.com",
      position: "HR Manager",
      phone: "9345098761",
    },
    {
      id: 15,
      image: "/jobPortal/assets/images/candidate-img/candidate3.jpg",
      name: "Amelia Lewis",
      email: "amelia.lewis@gmail.com",
      position: "Software Engineer",
      phone: "9785612345",
    },
    {
      id: 16,
      image: "/jobPortal/assets/images/candidate-img/candidate4.jpg",
      name: "Lucas Walker",
      email: "lucas.walker@gmail.com",
      position: "Designer",
      phone: "9654321789",
    },
    {
      id: 17,
      image: "/jobPortal/assets/images/candidate-img/candidate1.jpg",
      name: "Harper Hall",
      email: "harper.hall@gmail.com",
      position: "Recruiter",
      phone: "9543216789",
    },
    {
      id: 18,
      image: "/jobPortal/assets/images/candidate-img/candidate2.jpg",
      name: "Henry Allen",
      email: "henry.allen@gmail.com",
      position: "Team Lead",
      phone: "9234785612",
    },
    {
      id: 19,
      image: "/jobPortal/assets/images/candidate-img/candidate3.jpg",
      name: "Evelyn Young",
      email: "evelyn.young@gmail.com",
      position: "Staff Member",
      phone: "9874567891",
    },
    {
      id: 20,
      image: "/jobPortal/assets/images/candidate-img/candidate4.jpg",
      name: "Alexander King",
      email: "alexander.king@gmail.com",
      position: "HR Assistant",
      phone: "9765123489",
    },
  ];

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
            <div className="profile-form-content add-recruiters-btn-postion">
              <h3>Recruiters List</h3>
              <div className="add-recruiters-btn">
                <Link to="/create-recruiters" className="default-btn btn">
                  Add Recruiters
                </Link>
              </div>
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

export default RecruiterLists;
