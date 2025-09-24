import { useState ,useEffect} from "react";
import { MdEmail } from "react-icons/md";
import { useLocation } from "react-router-dom";
import axios from "axios";
import { API_BASE_URL } from "../Url/Url";
import { ToastContainer, toast } from "react-toastify";
import { useNavigate, Link } from "react-router-dom";

const VerifyEmail = () => {
  const location = useLocation();
  const navigate = useNavigate();
 const { email, showToast } = location.state || {};
  const [loading, setLoading] = useState(false);
   useEffect(() => {
    if (showToast) {
      toast.info("Please check your email for verification.");
    }
  }, [showToast]);
  const handleResendVerification = async () => {
    if (!email) {
      toast.error("Email is required to resend verification.");
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post(
        `${API_BASE_URL}resendVerificationEmail`,
        { email }
      );

      const { success, message } = response.data;

      if (success) {
        console.log("<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<");

        toast.success("Verification email resent successfully!");
      } else {
        if (message == "Email already verified") {
          console.log(">>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>");
          toast.success(message);
          // Redirect to login (or profile if logged in)
          navigate("/");
        } else {
          toast.error(message || "Failed to resend verification email.");
        }
      }
    } catch (error) {
      console.error("Resend verification error:", error);
      // Handle 400 or other HTTP errors
      toast.error(
        error.response?.data?.message || "Error resending verification email."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <ToastContainer />
      <div className="verify-container">
        <div className="verify-card">
          <div className="icon-wrapper">
            <span className="mail-icon">
              <MdEmail />
            </span>
          </div>
          <h2>Please verify your email</h2>
          <p>You're almost there! We sent an email to</p>
          <p className="email">{email}</p>
          <p>
            Just click on the link in that email to complete your signup. If you
            don't see it, you may need to <strong>check your spam</strong>{" "}
            folder.
          </p>
          <p>Still can't find the email? No problem.</p>
          <div className="personal-info-btn">
            <button
              className="default-btn btn"
              onClick={handleResendVerification}
              disabled={loading}
            >
              {loading ? "Sending..." : "Resend Verification Email"}
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default VerifyEmail;
