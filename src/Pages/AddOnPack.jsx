import { Link } from "react-router-dom";
import React, { useEffect, useState } from "react";
import { API_BASE_URL } from "../Url/Url";
import { ToastContainer, toast } from "react-toastify";
import axios from "axios";
import StripeCheckout from "react-stripe-checkout";
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";
// Load Stripe.js

// Initialize Stripe with your publishable key
const AddOnPack = () => {
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState("");
  const [startPayment, setStartPayment] = useState(false);
  useEffect(() => {
    const fetchActivePacks = async () => {
      try {
        const token = localStorage.getItem("token");

        const res = await axios.get(
          `${API_BASE_URL}get/ActiveAddOns
`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (res.data.success) {
          setPlans(res.data.data || []);
        }
      } catch (error) {
        console.error("Failed to fetch plans", error);
      } finally {
        setLoading(false);
      }
    };

    fetchActivePacks();
  }, []);
  const resetPaymentState = () => {
    setShowPaymentModal(false);
    setStartPayment(false);
    setPaymentMethod("");
    setSelectedPlan(null);
  };

  const handleToken = async (token) => {
    // toast("Success ! payment successfully", {
    //   type: "success",
    // });
    await purchasePack();
    resetPaymentState();
  };
  const handleBuyNow = (plan) => {
    setSelectedPlan(plan);
    setPaymentMethod("");
    setShowPaymentModal(true);
  };
  const handleDemoPayment = async () => {
    try {
      await new Promise((res) => setTimeout(res, 1000));
      // toast.success(`Demo Payment Successful via ${paymentMethod}`);
      await purchasePack();
      resetPaymentState();
    } catch {
      toast.error("Demo payment failed");
    }
  };

  const handleProceed = () => {
    if (!paymentMethod) {
      toast.error("Please select payment method");
      return;
    }
    setStartPayment(true);
  };

  const purchasePack = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await axios.post(
        `${API_BASE_URL}company/purchase-pack`,
        { packId: selectedPlan._id },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      toast.success(`Plan purchased successfully: ${res.data.packName}`, {
        autoClose: 5000,
        theme: "colored",
      });

      resetPaymentState(); // close modal + reset states
    } catch (error) {
      console.error("Purchase failed:", error.response || error);

      toast.error(error.response?.data?.message || "Purchase failed");
    }
  };

  //   try {
  //     const token = localStorage.getItem("token");

  //     const res = await axios.post(
  //       `${API_BASE_URL}company/purchase-pack`,
  //       { packId: planId },
  //       {
  //         headers: {
  //           Authorization: `Bearer ${token}`,
  //         },
  //       }
  //     );

  //     console.log("Purchase successful:", res.data);
  //     toast.success(`Plan purchased successfully: ${res.data.packName}`, {
  //       autoClose: 5000,
  //       theme: "colored",
  //     });
  //   } catch (error) {
  //     console.error("Purchase failed:", error.response || error);

  //     toast.error(
  //       `Purchase failed: ${error.response?.data?.message || error.message}`
  //     );
  //   }
  // };
  return (
    <>
      <ToastContainer />
      <section className="inner-banners-info-area">
        <div className="inner-banners-img-area">
          <img
            src="/jobPortal/assets/images/banner/inner-banner-img.jpg"
            alt="breadcrumb Img"
          />
        </div>
        <div className="inner-banners-title-info">
          <div className="container">
            <div className="row">
              <div className="col-lg-12 col-md-12 col-sm-12">
                <div className="inner-page-banner-title">
                  <h2>Add On Plan</h2>
                  <ul>
                    <li className="menu-divide-arrow">
                      <Link to="/">Home</Link>
                    </li>
                    <li>Add On Plan</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      <section className="plan-price-info-area">
        <div className="container">
          <div className="row">
            <div className="col-lg-12">
              <div className="section-title">
                <h2>Transparent Pricing Plan For You</h2>
                <p>Select the best plan that fits your needs</p>
              </div>
            </div>

            {/* Loading */}
            {loading && (
              <div className="col-12 text-center">
                <p>Loading plans...</p>
              </div>
            )}

            {/* No Plans */}
            {!loading && plans.length === 0 && (
              <div className="col-12 text-center">
                <p>No active Add On Plan available</p>
              </div>
            )}

            {/* Plans */}
            {plans.map((plan, index) => (
              <div className="col-lg-4 col-md-4" key={plan._id}>
                <div className="plan-price-box-info-area">
                  <div
                    className={`plan-price-heaing-info ${
                      index === 1
                        ? "card-header-orange"
                        : index === 2
                        ? "card-header-green"
                        : ""
                    }`}
                  >
                    <h4>{plan.name}</h4>
                    <h5>
                      {plan.currency} {plan.price}
                    </h5>
                  </div>

                  <div className="plan-price-detail-info">
                    <ul>
                      <li>Job Post Credit: {plan.jobPostingCredits} Credits</li>
                      <li>
                        Daily Job Posting Limit: {plan.dailyJobPostingLimit}
                      </li>
                      <li>
                        CV Viewing Credit: {plan.profileViewingCredits} Credits
                      </li>
                      <li>
                        Daily Profile Viewing Limit:{" "}
                        {plan.dailyProfileViewingLimit}
                      </li>
                      <li>
                        Valid for {plan.validityValue} {plan.validityUnit}
                      </li>
                    </ul>
                  </div>

                  <div className="plan-price-btn-info">
                    <button
                      className="plan-price-btn default-btn btn"
                      onClick={() => handleBuyNow(plan)}
                    >
                      Buy Now
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      {showPaymentModal && (
        <div
          className="modal fade show d-block"
          style={{ background: "rgba(0,0,0,0.6)" }}
        >
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Select Payment Method</h5>
                <button className="btn-close" onClick={resetPaymentState} />
              </div>

              <div className="modal-body">
                {!startPayment && (
                  <>
                    <div className="form-check mb-2">
                      <input
                        type="radio"
                        className="form-check-input"
                        name="payment"
                        value="Stripe"
                        checked={paymentMethod === "Stripe"}
                        onChange={(e) => setPaymentMethod(e.target.value)}
                      />
                      <label className="form-check-label">Stripe</label>
                    </div>

                    <div className="form-check mb-2">
                      <input
                        type="radio"
                        className="form-check-input"
                        name="payment"
                        value="PayPal"
                        checked={paymentMethod === "PayPal"}
                        onChange={(e) => setPaymentMethod(e.target.value)}
                      />
                      <label className="form-check-label">PayPal</label>
                    </div>

                    <div className="form-check">
                      <input
                        type="radio"
                        className="form-check-input"
                        name="payment"
                        value="CMI"
                        checked={paymentMethod === "CMI"}
                        onChange={(e) => setPaymentMethod(e.target.value)}
                      />
                      <label className="form-check-label">CMI</label>
                    </div>
                  </>
                )}

                {/* STRIPE */}
                {startPayment && paymentMethod === "Stripe" && (
                  <StripeCheckout
                    stripeKey="pk_test_51JGNLWBVnEa8wQ1y8ZGMn9tw57qHCROwaNVr5eplb1UvQsN410gJpXPyNW8yFgNQZeM7twAoAjZ7LosccszLnDMz00pIIh0lL0"
                    token={handleToken}
                    amount={selectedPlan.price * 100}
                    name="Job Portal"
                  >
                    <button className="btn btn-primary w-100">
                      Pay ₹{selectedPlan.price} with Stripe
                    </button>
                  </StripeCheckout>
                )}

                {/* PAYPAL */}
                {startPayment && paymentMethod === "PayPal" && (
                  <PayPalScriptProvider options={{ clientId: "test" }}>
                    <PayPalButtons
                      createOrder={(data, actions) =>
                        actions.order.create({
                          purchase_units: [
                            { amount: { value: selectedPlan.price } },
                          ],
                        })
                      }
                      onApprove={(data, actions) =>
                        actions.order.capture().then(() => {
                          // toast.success("PayPal Payment Successful");
                          purchasePack();
                          resetPaymentState();
                        })
                      }
                    />
                  </PayPalScriptProvider>
                )}

                {/* CMI */}
                {startPayment && paymentMethod === "CMI" && (
                  <button
                    className="btn btn-success w-100"
                    onClick={handleDemoPayment}
                  >
                    Pay with CMI
                  </button>
                )}
              </div>

              <div className="modal-footer">
                {!startPayment ? (
                  <button
                    className="btn btn-primary"
                    disabled={!paymentMethod}
                    onClick={handleProceed}
                  >
                    Proceed
                  </button>
                ) : (
                  <button
                    className="btn btn-secondary"
                    onClick={() => setStartPayment(false)}
                  >
                    Back
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default AddOnPack;
