import { Link, useNavigate, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
// import axios from "axios";
import { API_BASE_URL } from "../Url/Url";
import { ToastContainer, toast } from "react-toastify";
import axios from "axios"

function CreateRecruiters() {
  const location = useLocation();
  const editData = location.state?.recruiterData;
  const isEditMode = Boolean(editData);

  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    if (isEditMode) {
      setFormData({
        first_name: editData.first_name || "",
        last_name: editData.last_name || "",
        email: editData.email || "",
        password: "", // keep empty for security
      });
    }
  }, [isEditMode, editData]);
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.first_name || !formData.last_name || !formData.email) {
      toast.error("All fields are required!");
      return;
    }

    if (!isEditMode && !formData.password) {
      toast.error("Password is required!");
      return;
    }

    setLoading(true);

    try {
      const token = localStorage.getItem("token");

      const url = isEditMode
        ? `${API_BASE_URL}updateRecruiter/${editData._id}`
        : `${API_BASE_URL}addRecruiter`;

      const payload = isEditMode
        ? {
            first_name: formData.first_name,
            last_name: formData.last_name,
            email: formData.email,
          }
        : formData;

      await axios.post(url, payload, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      toast.success(
        isEditMode
          ? "Recruiter updated successfully!"
          : "Recruiter added successfully!"
      );

      navigate("/recruiters-list");
    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <ToastContainer />
      <div className="main-dashboard-content d-flex flex-column">
        <div className="responsive-content">
          {/* Breadcrumb Area */}
          <div className="breadcrumb-area">
            <h1>Create Recruiters</h1>
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
                <i className="fa-solid fa-angle-right" /> Create Recruiters
              </li>
            </ol>
          </div>
          {/* End Breadcrumb Area */}
          {/*Start My Profile Area*/}
          <div className="my-profile-area">
            <div className="profile-form-content">
              <h3>Create Recruiters</h3>
              <div className="profile-form">
                <form onSubmit={handleSubmit}>
                  <div className="row">
                    <div className="col-lg-6 col-md-6">
                      <div className="form-group">
                        <label>First name</label>
                        <input
                          className="form-control"
                          type="text"
                          name="first_name"
                          placeholder="First name"
                          value={formData.first_name}
                          onChange={handleChange}
                        />
                      </div>
                    </div>
                    <div className="col-lg-6 col-md-6">
                      <div className="form-group">
                        <label>Last name</label>
                        <input
                          className="form-control"
                          type="text"
                          name="last_name"
                          placeholder="Last name"
                          value={formData.last_name}
                          onChange={handleChange}
                        />
                      </div>
                    </div>
                    <div className="col-lg-6 col-md-6">
                      <div className="form-group">
                        <label>Email</label>
                        <input
                          className="form-control"
                          type="email"
                          name="email"
                          placeholder="Email"
                          value={formData.email}
                          onChange={handleChange}
                        />
                      </div>
                    </div>
                    {!isEditMode && (
                      <div className="col-lg-6 col-md-6">
                        <div className="form-group">
                          <label>Password</label>
                          <input
                            className="form-control"
                            type="password"
                            name="password"
                            placeholder="Password"
                            value={formData.password}
                            onChange={handleChange}
                          />
                        </div>
                      </div>
                    )}
                  </div>
                  <div className="create-recruiters-btn">
                    <button
                      type="submit"
                      className="default-btn btn"
                      disabled={loading}
                    >
                      {loading
                        ? "Submitting..."
                        : isEditMode
                        ? "Update Recruiter"
                        : "Create Recruiter"}
                    </button>
                  </div>
                </form>
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

export default CreateRecruiters;
