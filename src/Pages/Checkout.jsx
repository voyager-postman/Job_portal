import React, { useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";

const GATEWAY_CONFIG = {
  paypal: {
    icon: "fa-brands fa-paypal",
    iconClass: "text-primary",
  },
  cmi: {
    icon: "fa-solid fa-credit-card",
    iconClass: "text-success",
  },
  stripe: {
    icon: "fa-brands fa-stripe",
    iconClass: "text-primary",
  },
};

const Checkout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const checkoutState = location.state || {};
  const { paymentMethod = "stripe", pack } = checkoutState;

  useEffect(() => {
    if (!pack) {
      navigate("/employer-wallet", { replace: true });
    }
  }, [pack, navigate]);

  if (!pack) return null;

  const gateway = GATEWAY_CONFIG[paymentMethod] || GATEWAY_CONFIG.stripe;
  const formattedTotal = `${pack.price} ${pack.currency}`;

  return (
    <div className="checkout-page-wrapper">
      <div className="container py-5">
        <div className="row g-5">
          <div className="col-lg-8">
            <div className="checkout-main-card">
              <div className="checkout-header mb-5">
                <h2 className="fw-800 text-dark mb-2">Finalize Your Purchase</h2>
                <p className="text-muted">
                  Complete your transaction to instantly boost your recruitment
                  power.
                </p>
              </div>

              <div className="payment-method-review mb-5">
                <h5 className="section-title mb-4">Payment Method</h5>
                <div className="selected-gateway-display">
                  <div className="gateway-icon-large">
                    <i className={`${gateway.icon} ${gateway.iconClass}`} />
                  </div>
                  <div className="gateway-info">
                    <span className="gateway-name text-uppercase">
                      {paymentMethod}
                    </span>
                    <span className="gateway-status">
                      <i className="fa-solid fa-shield-halved me-1" /> Secure
                      Connection
                    </span>
                  </div>
                  <button
                    type="button"
                    className="btn-change-method ms-auto"
                    onClick={() => navigate("/employer-wallet")}
                  >
                    Change
                  </button>
                </div>
              </div>

              <div className="order-items-review mb-5">
                <h5 className="section-title mb-4">Items in Your Order</h5>
                <div className="review-item-card">
                  <div className="item-icon">
                    <i className="fa-solid fa-gem" />
                  </div>
                  <div className="item-details">
                    <h6 className="fw-bold mb-1">{pack.name}</h6>
                    <div className="d-flex gap-3 small text-muted">
                      {pack.jobCredits != null && (
                        <span>
                          <i className="fa-solid fa-briefcase me-1" />{" "}
                          {pack.jobCredits} Jobs
                        </span>
                      )}
                      {pack.cvCredits != null && (
                        <span>
                          <i className="fa-solid fa-user-tie me-1" />{" "}
                          {pack.cvCredits} CVs
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="item-price ms-auto">{formattedTotal}</div>
                </div>
              </div>

              <div className="trust-badges row g-3 mt-4">
                <div className="col-md-4">
                  <div className="trust-card">
                    <i className="fa-solid fa-lock" />
                    <span>SSL Encrypted</span>
                  </div>
                </div>
                <div className="col-md-4">
                  <div className="trust-card">
                    <i className="fa-solid fa-shield-check" />
                    <span>Safe Payment</span>
                  </div>
                </div>
                <div className="col-md-4">
                  <div className="trust-card">
                    <i className="fa-solid fa-bolt" />
                    <span>Instant Credits</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="col-lg-4">
            <div className="order-summary-sticky">
              <div className="summary-card">
                <h5 className="fw-bold mb-4">Order Summary</h5>
                <div className="summary-row">
                  <span>Subtotal</span>
                  <span>{formattedTotal}</span>
                </div>
                <div className="summary-row">
                  <span>Taxes (VAT)</span>
                  <span>0.00 {pack.currency}</span>
                </div>
                <div className="summary-divider my-4" />
                <div className="summary-total mb-4">
                  <div className="d-flex justify-content-between align-items-center">
                    <span className="total-label">Total Amount</span>
                    <span className="total-val">{formattedTotal}</span>
                  </div>
                </div>
                <button type="button" className="btn-checkout-finalize w-100 mb-3">
                  Confirm & Pay Now
                </button>
                <p className="text-center xsmall text-muted mb-0">
                  By clicking &quot;Confirm &amp; Pay Now&quot;, you agree to our{" "}
                  <Link to="/terms-condition">Terms of Service</Link>.
                </p>
              </div>
              <div className="back-link-wrap mt-4 text-center">
                <Link
                  to="/employer-wallet"
                  className="text-decoration-none text-muted small"
                >
                  <i className="fa-solid fa-arrow-left me-2" /> Back to Wallet
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style
        dangerouslySetInnerHTML={{
          __html: `
        @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;600;800&display=swap');

        .checkout-page-wrapper {
          font-family: 'Outfit', sans-serif;
          background-color: #f8fafc;
          min-height: 100vh;
          padding: 40px 0;
          color: #1e293b;
        }

        .checkout-main-card {
          background: white;
          border-radius: 32px;
          padding: 45px;
          box-shadow: 0 10px 40px rgba(0,0,0,0.03);
          border: 1px solid #f1f5f9;
        }

        .section-title {
          font-size: 14px;
          font-weight: 800;
          color: #1967d2;
          text-transform: uppercase;
          letter-spacing: 1.5px;
        }

        .selected-gateway-display {
          display: flex;
          align-items: center;
          background: #f8fafc;
          border: 1px solid #e2e8f0;
          padding: 24px;
          border-radius: 20px;
          gap: 20px;
        }

        .gateway-icon-large {
          width: 64px;
          height: 64px;
          background: white;
          border-radius: 16px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 32px;
          box-shadow: 0 4px 10px rgba(0,0,0,0.05);
        }

        .gateway-name { font-weight: 800; font-size: 18px; display: block; color: #0f172a; }
        .gateway-status { font-size: 12px; color: #10b981; font-weight: 600; display: flex; align-items: center; }

        .btn-change-method {
          background: white;
          border: 1px solid #e2e8f0;
          padding: 8px 16px;
          border-radius: 10px;
          font-size: 13px;
          font-weight: 700;
          color: #64748b;
          transition: all 0.2s;
        }
        .btn-change-method:hover { background: #f1f5f9; color: #1e293b; }

        .review-item-card {
          display: flex;
          align-items: center;
          padding: 20px;
          border: 1.5px solid #f1f5f9;
          border-radius: 20px;
          gap: 15px;
        }

        .item-icon {
          width: 48px;
          height: 48px;
          background: #eef2ff;
          color: #4f46e5;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 20px;
        }

        .item-price { font-weight: 800; font-size: 18px; color: #1e293b; }

        .trust-card {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 12px;
          background: #f8fafc;
          border-radius: 12px;
          font-size: 12px;
          font-weight: 700;
          color: #64748b;
        }
        .trust-card i { color: #10b981; font-size: 14px; }

        .summary-card {
          background: white;
          border-radius: 32px;
          padding: 35px;
          box-shadow: 0 20px 50px rgba(0,0,0,0.05);
          border: 1px solid #f1f5f9;
          position: sticky;
          top: 40px;
        }

        .summary-row {
          display: flex;
          justify-content: space-between;
          margin-bottom: 15px;
          font-weight: 600;
          color: #64748b;
        }

        .summary-divider { border-top: 1px dashed #e2e8f0; }

        .total-label { font-size: 14px; font-weight: 700; color: #0f172a; text-transform: uppercase; }
        .total-val { font-size: 28px; font-weight: 900; color: #1967d2; letter-spacing: -1px; }

        .btn-checkout-finalize {
          background: #1e293b;
          color: white;
          border: none;
          padding: 18px;
          border-radius: 18px;
          font-weight: 800;
          font-size: 16px;
          transition: all 0.3s;
          box-shadow: 0 10px 25px rgba(30, 41, 59, 0.2);
        }
        .btn-checkout-finalize:hover {
          background: #0f172a;
          transform: translateY(-2px);
          box-shadow: 0 15px 30px rgba(30, 41, 59, 0.3);
        }

        .fw-800 { font-weight: 800; }
        .xsmall { font-size: 11px; }

        @media (max-width: 991px) {
          .checkout-main-card { padding: 30px; }
          .order-summary-sticky { margin-top: 30px; }
        }
      `,
        }}
      />
    </div>
  );
};

export default Checkout;
