import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { FaCheckCircle } from "react-icons/fa";
const PaymentSuccess = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const payment = location.state?.payment;

  if (!payment) {
    return <h3 className="text-center mt-5">No Payment Data Found</h3>;
  }

  return (
    <div className="container mt-5 text-center">
      <div className="text-center">
        <FaCheckCircle size={80} color="#28a745" />
        <h2 className="text-success mt-3">Payment Successful</h2>
      </div>
      <div className="card mt-4 p-4">
        <p>
          <strong>Order ID:</strong> {payment.orderID}
        </p>
        <p>
          <strong>Capture ID:</strong> {payment.captureId}
        </p>
        <p>
          <strong>Amount:</strong> {payment.amount} {payment.currency}
        </p>
        <p>
          <strong>Email:</strong> {payment.payerEmail}
        </p>
        <p>
          <strong>Status:</strong> {payment.status}
        </p>
      </div>

      <button
        className="btn btn-primary my-5"
        onClick={() => navigate("/employer-dashboard")}
      >
        Go To Dashboard
      </button>
    </div>
  );
};

export default PaymentSuccess;
