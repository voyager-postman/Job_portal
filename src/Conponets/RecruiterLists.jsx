import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { TableView } from "../Conponets/DataTable";
import { API_BASE_URL } from "../Url/Url";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function RecruiterLists() {
  const navigate = useNavigate();
  const [data, setData] = useState([]);
  const getRecruiterList = () => {
    const token = localStorage.getItem("token");
    axios
      .get(`${API_BASE_URL}getRecruiterList`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        let recruiters = response.data.recruiters || [];

        // ✅ Add static image to each recruiter
        recruiters = recruiters.map((rec) => ({
          ...rec,
          image: "/jobPortal/assets/images/candidate-img/candidate1.jpg", // static image
        }));

        setData(recruiters);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  useEffect(() => {
    getRecruiterList();
  }, []);
  const handleStatusToggle = async (recruiter) => {
    try {
      const token = localStorage.getItem("token");

      const newStatus = recruiter.status === "Active" ? "Inactive" : "Active";

      await axios.post(
        `${API_BASE_URL}updateRecruiterStatus/${recruiter._id}`,
        { status: newStatus },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      toast.success(`Recruiter ${newStatus}`);

      // Refresh list
      getRecruiterList();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update status");
    }
  };

  const handleDelete = (recruiterId) => {
    Swal.fire({
      title: "Are you sure?",
      text: "This recruiter will be deleted permanently!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const token = localStorage.getItem("token");

          await axios.post(
            `${API_BASE_URL}deleteRecruiter/${recruiterId}`,
            {},
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            },
          );

          Swal.fire("Deleted!", "Recruiter deleted successfully.", "success");

          // Refresh list
          getRecruiterList();
        } catch (error) {
          Swal.fire(
            "Error!",
            error.response?.data?.message || "Failed to delete recruiter.",
            "error",
          );
        }
      }
    });
  };

  const columns = [
    {
      accessorKey: "id",
      header: "S.No",
      cell: ({ row }) => row.index + 1, // auto index
    },

    {
      accessorKey: "first_name",
      header: "First Name",
    },
    {
      accessorKey: "last_name",
      header: "Last Name",
    },
    {
      accessorKey: "email",
      header: "Email",
    },

    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => {
        const recruiter = row.original;

        return (
          <div className="recruiter-status-info">
            <div className="form-check form-switch">
              <input
                className="form-check-input"
                type="checkbox"
                role="switch"
                checked={recruiter.status === "Active"}
                onChange={() => handleStatusToggle(recruiter)}
              />
            </div>
          </div>
        );
      },
    },
    {
      accessorKey: "action",
      header: "Action",
      cell: ({ row }) => {
        const recruiter = row.original;

        return (
          <div className="action-icon-info">
            <i
              className="fa-solid fa-pencil"
              style={{ cursor: "pointer", marginRight: "10px" }}
              onClick={() =>
                navigate("/create-recruiters", {
                  state: { recruiterData: recruiter },
                })
              }
            />
            <i
              className="fa-solid fa-trash"
              onClick={() => handleDelete(recruiter._id)}
            />
          </div>
        );
      },
    },
  ];

  return (
    <>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        closeOnClick
        pauseOnHover
        draggable
        theme="light"
      />
      <div className="main-dashboard-content d-flex flex-column">
        <div className="responsive-content">
          {/* Breadcrumb Area */}
          <div className="breadcrumb-area">
            <h1>Manage Recruiters</h1>
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
                Manage Recruiters
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
