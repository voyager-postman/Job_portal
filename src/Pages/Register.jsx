import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import axios from "../utils/axiosInstance"; // path based on your folder structure
import Spinner from "../Conponets/Spinner"; // optional
import { useAuth } from "../context/AuthContext"; // adjust path
import { API_BASE_URL } from "../Url/Url";
function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [agree, setAgree] = useState(false);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const { login } = useAuth();

  const validateForm = () => {
    if (!email || !password) {
      toast.error("Please fill in all required fields");
      return false;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      toast.error("Please enter a valid email address");
      return false;
    }
    if (password.length < 6) {
      toast.error("Password must be at least 6 characters");
      return false;
    }
    if (!agree) {
      toast.error("You must accept the terms and conditions");
      return false;
    }
    return true;
  };

  const handleRegister = async () => {
    if (!validateForm()) return;

    setLoading(true);
    navigate("/login");
    // try {
    //   const response = await axios.post(`${API_BASE_URL}user/register`, {
    //     email,
    //     password,
    //   });
    //   console.log(response);
    //   if (response.status === 200 || response.status === 201) {
    //     toast.success("Registration successful!");
    //     login(); // set auth context / localStorage
    //     navigate("/login");
    //   } else {
    //     toast.error("Something went wrong, please try again.");
    //   }
    // } catch (error) {
    //   console.error("Register error:", error);
    //   toast.error(
    //     error.response?.data?.message || "Registration failed. Try again."
    //   );
    // } finally {
    //   setLoading(false);
    // }
  };

  return (
    <>
      <ToastContainer />
      <div className="page-banner-area bg-f0f4fc">
        <div className="container">
          <div className="page-banner-content">
            <h1>Register</h1>
            <ul>
              <li>
                <Link to="/" className="nav-link">
                  Home
                </Link>
              </li>
              <li>Register</li>
            </ul>
          </div>
        </div>
      </div>

      <div className="register-area ptb-100">
        <div className="container">
          <div className="register">
            <h3>Register</h3>

            <form>
              <div className="form-group">
                <input
                  type="email"
                  className="form-control"
                  placeholder="Email Address*"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>

              <div className="form-group">
                <input
                  type="password"
                  className="form-control"
                  placeholder="Password*"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>

              <div className="register-terms-Policy-box">
                <input
                  type="checkbox"
                  id="terms"
                  checked={agree}
                  onChange={(e) => setAgree(e.target.checked)}
                />
                <label htmlFor="terms">
                  I accept the <a href="#">Terms &amp; Condition</a> and{" "}
                  <a href="#">Privacy Policy</a>
                </label>
              </div>

              <div className="register-and-social-icon-info">
                <div className="register-btn">
                  <button
                    type="button"
                    onClick={handleRegister}
                    className="default-btn btn"
                  >
                    {loading ? "Registering..." : "Register"}
                  </button>
                </div>

                <div className="register-login-text-btn">
                  <p>
                    Already have an account?{" "}
                    <span
                      data-bs-toggle="modal"
                      data-bs-target="#exampleModalLogin"
                      className="text-primary"
                      style={{ cursor: "pointer" }}
                    >
                      <i className="fa-regular fa-user" /> Sign in
                    </span>
                  </p>
                </div>
              </div>
            </form>

            {loading && <Spinner />}
          </div>
        </div>
      </div>
    </>
  );
}

export default Register;
