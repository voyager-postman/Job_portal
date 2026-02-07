import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { TableView } from "../Conponets/DataTable";
import { API_BASE_URL } from "../Url/Url";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function ManagesAssement() {
  const navigate = useNavigate();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const token = localStorage.getItem("token");

  const mapAssessments = (assessments = []) => {
    return assessments.map((assessment) => ({
      _id: assessment._id,
      assessmentName: assessment.assessmentName,
      totalQuestions: assessment.totalQuestions,
      totalDuration: assessment.totalDuration,
      passingPercentage: assessment.passingPercentage,
      questionLevel: assessment.questionLevel,
      questionSource: assessment.questionSource,
      isActive: assessment.isActive,
      createdAt: assessment.createdAt,
    }));
  };

  const fetchTechStacks = async () => {
    try {
      if (!token) {
        toast.error("Token missing. Please login again.");
        return;
      }

      setLoading(true);

      const response = await axios.get(`${API_BASE_URL}/getSkillAssessments`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      console.log("API response:", response.data); // 🔍 DEBUG

      if (response.data?.success) {
        const formattedData = mapAssessments(response.data.data);
        setData(formattedData);
      } else {
        setData([]);
      }
    } catch (error) {
      console.error("Error fetching Skill Assessments:", error);
      toast.error(
        error.response?.data?.message || "Failed to fetch assessments",
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTechStacks();
  }, []);

  const columns = [
    {
      header: "Assessment Name",
      accessorKey: "assessmentName",
    },
    {
      header: "Total Questions",
      accessorKey: "totalQuestions",
    },
    {
      header: "Total Duration (mins)",
      accessorKey: "totalDuration",
    },
    {
      header: "Passing %",
      accessorKey: "passingPercentage",
      cell: ({ row }) => `${row.original.passingPercentage}%`,
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
              title="Edit"
              onClick={() =>
                navigate("/create-assessment", {
                  state: { assessmentId: row.original._id },
                })
              }
            />
            <Link
              to="/assessment-details"
              state={{
                assessmentId: row.original._id,
              }}
            >
              <i className="fa-solid fa-eye"></i>
            </Link>
            <i
              className="fa-solid fa-trash"
              title="Delete"
              onClick={() => handleDelete(row.original._id)}
            />
          </div>
        );
      },
    },
  ];
  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "This assessment will be permanently deleted!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    });

    if (!result.isConfirmed) return;

    try {
      await axios.delete(`${API_BASE_URL}/deleteSkillAssessment/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      Swal.fire("Deleted!", "Assessment deleted successfully.", "success");

      setData((prev) => prev.filter((item) => item._id !== id));
    } catch (error) {
      console.error("Delete error:", error);
      Swal.fire(
        "Error!",
        error.response?.data?.message || "Failed to delete assessment.",
        "error",
      );
    }
  };
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
            <h1>Manage Assessments</h1>
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
                Assessments
              </li>
            </ol>
          </div>
          {/* End Breadcrumb Area */}
          {/*Start My Profile Area*/}
          <div className="my-profile-area">
            <div className="profile-form-content add-recruiters-btn-postion">
              <h3>Assessments</h3>
              <div className="add-recruiters-btn">
                <Link to="/create-assessment" className="default-btn btn">
                  + Add Assessment
                </Link>
              </div>
              <div className="profile-form">
                <div className="row">
                  <div className="col-lg-12 col-md-12">
                    {loading ? (
                      <p>Loading...</p>
                    ) : (
                      <TableView columns={columns} data={data} />
                    )}
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

export default ManagesAssement;
