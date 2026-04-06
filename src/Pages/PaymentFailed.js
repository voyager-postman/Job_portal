import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { FaTimesCircle } from "react-icons/fa";

const PaymentFailed = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const error = location.state?.error || "Payment Failed";

  return (
    <div className="container mt-5 text-center">
      <div className="mb-4">
        <FaTimesCircle size={90} color="#dc3545" />
        <h2 className="text-danger mt-3 fw-bold">Payment Failed</h2>
      </div>

      <div className="card shadow-sm mt-3 p-4">
        <p className="mb-0 text-muted">{error}</p>
      </div>

      <button
        className="btn btn-danger my-5"
        onClick={() => navigate("/employer-wallet")}
      >
        Try Again
      </button>
    </div>
  );
};

export default PaymentFailed;
