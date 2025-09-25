import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import axios from "axios";
import { API_BASE_URL } from "../Url/Url";
import { ToastContainer, toast } from "react-toastify";

function CreateRecruiters() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);

  // handle input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // form submit

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !formData.first_name ||
      !formData.last_name ||
      !formData.email ||
      !formData.password
    ) {
      toast.error("All fields are required!");
      return;
    }

    setLoading(true);

    try {
      const token = localStorage.getItem("token");

      const response = await axios.post(
        `${API_BASE_URL}addRecruiter`,
        {
          first_name: formData.first_name,
          last_name: formData.last_name,
          email: formData.email,
          password: formData.password,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.status === 200 || response.status === 201) {
        toast.success("Recruiter added successfully!");
        setFormData({ first_name: "", last_name: "", email: "", password: "" });

        // ✅ Navigate after success
        navigate("/recruiters-list");
      } else {
        toast.error(response.data?.message || "Something went wrong!");
      }
    } catch (error) {
      console.error("Error adding recruiter:", error);
      toast.error(error.response?.data?.message || "Failed to add recruiter!");
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
                <a href="dashboard.html">Home </a>
              </li>
              <li className="item">
                <i className="fa-solid fa-angle-right" /> Dashboard
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
                  </div>
                  <div className="create-recruiters-btn">
                    <button
                      type="submit"
                      className="default-btn btn"
                      disabled={loading}
                    >
                      {loading ? "Submitting..." : "Submit"}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
          {/*End My Profile Area*/}
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
    </>
  );
}

export default CreateRecruiters;
