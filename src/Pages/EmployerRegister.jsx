// import React from "react";

// import { Link, useNavigate } from "react-router-dom";
// function Login() {
//   const navigate = useNavigate();
//   const handleRegister = () => {
//     navigate("/register");
//   };
//   return (
//     <>
//       <div className="page-banner-area bg-f0f4fc">
//         <div className="container">
//           <div className="page-banner-content">
//             <h1>Login</h1>
//             <ul>
//               <li>
//                 <Link to="/" className="nav-link">
//                   {" "}
//                   Home
//                 </Link>
//               </li>
//               <li>Login</li>
//             </ul>
//           </div>
//         </div>
//       </div>
//       <div className="login-area ptb-100">
//         <div className="container">
//           <div className="login">
//             <h3>Log In</h3>
//             <form>
//               <div className="form-group">
//                 <input
//                   type="email"
//                   id="email"
//                   className="form-control"
//                   placeholder="Username Or Email Address*"
//                 />
//               </div>
//               <div className="form-group">
//                 <input
//                   type="password"
//                   id="password"
//                   className="form-control"
//                   placeholder="Password*"
//                 />
//               </div>
//               <div className="form-check">
//                 <input
//                   className="form-check-input"
//                   type="checkbox"
//                   defaultValue
//                   id="flexCheckDefault"
//                 />
//                 <label className="form-check-label" htmlFor="flexCheckDefault">
//                   Remember Me
//                 </label>
//               </div>
//               <div className="login-btn-recover-password">
//                 <div className="login-btn">
//                   <button type="submit" className="default-btn btn">
//                     Login
//                   </button>
//                 </div>
//                 <div className="recover-password">
//                   <span className="default-btn btn">
//                     <Link to="/recovery-password">Lost your password?</Link>
//                   </span>
//                 </div>
//               </div>
//               <label>
//                 Don't have an account?{" "}
//                 <span onClick={handleRegister}>Sign in</span>
//               </label>
//             </form>
//           </div>
//         </div>
//       </div>
//     </>
//   );
// }

// export default Login;
import { Link } from "react-router-dom";

function EmployerRegister() {
  return (
    <>
      <div>
        <div className="page-banner-area bg-f0f4fc">
          <div className="container">
            <div className="page-banner-content">
              <h1>Employer Register</h1>
              <ul>
                <li>
                  <a href="index-2.html">Home</a>
                </li>
                <li>Employer Register</li>
              </ul>
            </div>
          </div>
        </div>
        {/*End Page Banner Area*/}
        {/*Start Register Area*/}
        <div className="register-area ptb-100">
          <div className="container">
            <div className="register">
              <h3>Employer Register</h3>
              <form>
                <div className="form-group">
                  <input
                    type="email"
                    id="email2"
                    className="form-control"
                    placeholder="Email Address*"
                  />
                </div>
                <div className="form-group">
                  <input
                    type="password"
                    id="password2"
                    className="form-control"
                    placeholder="Password*"
                  />
                </div>
                <div className="register-terms-Policy-box">
                  <input
                    type="checkbox"
                    id="vehicle1"
                    name="vehicle1"
                    defaultValue="Bike"
                  />
                  <label htmlFor="vehicle1">
                    {" "}
                    I accept the <a href="#">Terms &amp; Condition</a> and{" "}
                    <a href="#">Privacy Policy</a>
                  </label>
                </div>
                <div className="register-and-social-icon-info">
                  <div className="register-btn">
                    <button
                      type="button"
                      onclick="location.href='profile-basic-info.html'"
                      className="default-btn btn"
                    >
                      Register
                    </button>
                  </div>
                  <div className="register-social-icon employer-register">
                    <button className="default-btn btn">
                      <div className="social-icon">
                        <img src="/jobPortal/assets/images/icon/Google-icon.png" />
                      </div>
                      {/* <div class="social-icon-name">
                       Google
                      </div> */}
                    </button>
                  </div>
                </div>
                {/* <div class="register-or-content">
                    <p>OR</p>  
                   </div> */}
                <div className="register-login-text-btn">
                  <p>
                    Already have an account?{" "}
                    <Link to="/employer-login">Sign in</Link>
                  </p>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default EmployerRegister;
