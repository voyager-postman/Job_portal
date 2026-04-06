import { Link } from "react-router-dom";
import React, { useEffect, useState } from "react";
import { API_BASE_URL } from "../Url/Url";
import { ToastContainer, toast } from "react-toastify";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";

import CheckoutForm1 from "./CheckoutForm1";

import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";
// Load Stripe.js

// Initialize Stripe with your publishable key
const AddOnPack = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [actionLoading, setActionLoading] = useState(false);
  const { packId } = location.state || {};
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState("Stripe");
  const [paymentGateways, setPaymentGateways] = useState([]);
  const [stripePromise, setStripePromise] = useState(null);
  const [startPayment, setStartPayment] = useState(false);
  const [showManualModal, setShowManualModal] = useState(false);
  const [manualCredits, setManualCredits] = useState("");
  const [manualType, setManualType] = useState("");
  const [showContactModal, setShowContactModal] = useState(false);

  const [manualCvCredits, setManualCvCredits] = useState("");
  const [manualJobCredits, setManualJobCredits] = useState("");
  const [manualReason, setManualReason] = useState("");
  const [contactForm, setContactForm] = useState({
    contactPersonName: "",
    contactEmail: "",
    contactPhone: "",
    message: "",
  });

  const handleChange = (e) => {
    setContactForm({
      ...contactForm,
      [e.target.name]: e.target.value,
    });
  };
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
        },
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
  const handleManualRequest = async () => {
    try {
      if (!manualType) {
        toast.error("Please select credit type");
        return;
      }

      setActionLoading(true);

      const token = localStorage.getItem("token");

      const payload = {
        jobCreditsRequested: manualType === "cv" ? 0 : Number(manualJobCredits),
        profileCreditsRequested:
          manualType === "job" ? 0 : Number(manualCvCredits),
        message: manualReason || "",
      };

      const res = await axios.post(
        `${API_BASE_URL}createManualRechargeRequest`,
        payload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      if (res.data.success) {
        toast.success("Manual recharge request submitted successfully");

        setShowManualModal(false);
        setManualCvCredits("");
        setManualJobCredits("");
        setManualReason("");
        setManualType("");
      } else {
        toast.error(res.data.message || "Request failed");
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to submit manual request",
      );
    } finally {
      setActionLoading(false);
    }
  };
  // const handleManualRequest = async () => {
  //   try {
  //     if (!manualType) {
  //       toast.error("Please select credit type");
  //       return;
  //     }

  //     if (
  //       (manualType === "cv" && !manualCvCredits) ||
  //       (manualType === "job" && !manualJobCredits) ||
  //       (manualType === "both" && (!manualCvCredits || !manualJobCredits))
  //     ) {
  //       toast.error("Please enter required credit amounts");
  //       return;
  //     }

  //     const token = localStorage.getItem("token");

  //     const payload = {
  //       jobCreditsRequested: manualType === "cv" ? 0 : Number(manualJobCredits),

  //       profileCreditsRequested:
  //         manualType === "job" ? 0 : Number(manualCvCredits),

  //       message: manualReason || "",
  //     };

  //     const res = await axios.post(
  //       `${API_BASE_URL}createManualRechargeRequest`,
  //       payload,
  //       {
  //         headers: {
  //           Authorization: `Bearer ${token}`,
  //         },
  //       },
  //     );

  //     if (res.data.success) {
  //       toast.success("Manual recharge request submitted successfully");

  //       setShowManualModal(false);
  //       setManualCvCredits("");
  //       setManualJobCredits("");
  //       setManualReason("");
  //       setManualType("");
  //     } else {
  //       toast.error(res.data.message || "Request failed");
  //     }
  //   } catch (error) {
  //     console.error("Manual request error:", error);

  //     toast.error(
  //       error.response?.data?.message || "Failed to submit manual request",
  //     );
  //   }
  // };
  const resetPaymentState = () => {
    setShowPaymentModal(false);
    setStartPayment(false);
    setPaymentMethod("Stripe"); // keep default instead of empty
    setSelectedPlan(null);
  };
  const handleBuyNow = (plan) => {
    // If no payment gateway → open contact modal
    if (!hasActiveGateway) {
      setSelectedPlan(plan);
      setShowContactModal(true);
      return;
    }

    setSelectedPlan(plan);

    if (paymentGateways.length > 0) {
      setPaymentMethod(paymentGateways[0].gatewayName.toLowerCase());
    }

    setShowPaymentModal(true);
  };
  // const handleBuyNow = (plan) => {
  //   setSelectedPlan(plan);

  //   if (paymentGateways.length > 0) {
  //     setPaymentMethod(paymentGateways[0].gatewayName); // ✅ first auto selected
  //   }

  //   setShowPaymentModal(true);
  // };
  const fetchActiveGateways = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await axios.get(`${API_BASE_URL}getActivePaymentGateways`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.data.success) {
        const active = res.data.data.filter((g) => g.isActive);

        setPaymentGateways(active);

        if (active.length > 0) {
          const first = active[0];

          // ✅ Auto select first gateway
          setPaymentMethod(first.gatewayName.toLowerCase());

          // ✅ Stripe dynamic init
          const stripeGateway = active.find(
            (g) => g.gatewayName.toLowerCase() === "stripe",
          );

          if (stripeGateway?.publishableKey) {
            setStripePromise(loadStripe(stripeGateway.publishableKey));
          }
        }
      }
    } catch (error) {
      console.error("Gateway fetch error:", error);
    }
  };
  useEffect(() => {
    fetchActivePacks();
    fetchActiveGateways();
  }, []);
  const handleDemoPayment = async () => {
    try {
      setActionLoading(true);

      await new Promise((res) => setTimeout(res, 1000));

      await purchasePack();

      resetPaymentState();
    } catch {
      toast.error("Demo payment failed");
    } finally {
      setActionLoading(false);
    }
  };
  // const handleDemoPayment = async () => {
  //   try {
  //     await new Promise((res) => setTimeout(res, 1000));
  //     // toast.success(`Demo Payment Successful via ${paymentMethod}`);
  //     await purchasePack();
  //     resetPaymentState();
  //   } catch {
  //     toast.error("Demo payment failed");
  //   }
  // };
  const handleSubmit = async () => {
    if (
      !contactForm.contactPersonName ||
      !contactForm.contactEmail ||
      !contactForm.contactPhone
    ) {
      toast.error("Please fill all required fields");
      return;
    }

    try {
      setActionLoading(true);

      const token = localStorage.getItem("token");

      const payload = {
        addOnId: selectedPlan._id,
        ...contactForm,
      };

      const response = await axios.post(
        `${API_BASE_URL}requestAddOnRecharge`,
        payload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      if (response.data.success) {
        toast.success(response.data.message || "Request sent successfully");

        setShowContactModal(false);

        setContactForm({
          contactPersonName: "",
          contactEmail: "",
          contactPhone: "",
          message: "",
        });
      } else {
        toast.error(response.data.message || "Request failed");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to send request");
    } finally {
      setActionLoading(false);
    }
  };
  // const handleSubmit = async () => {
  //   if (
  //     !contactForm.contactPersonName ||
  //     !contactForm.contactEmail ||
  //     !contactForm.contactPhone
  //   ) {
  //     toast.error("Please fill all required fields");
  //     return;
  //   }

  //   if (!selectedPlan?._id) {
  //     toast.error("Plan not selected");
  //     return;
  //   }

  //   try {
  //     const token = localStorage.getItem("token");

  //     const payload = {
  //       addOnId: selectedPlan._id,
  //       contactPersonName: contactForm.contactPersonName,
  //       contactEmail: contactForm.contactEmail,
  //       contactPhone: contactForm.contactPhone,
  //       message: contactForm.message || "",
  //     };

  //     const response = await axios.post(
  //       `${API_BASE_URL}requestAddOnRecharge`,
  //       payload,
  //       {
  //         headers: {
  //           Authorization: `Bearer ${token}`,
  //           "Content-Type": "application/json",
  //         },
  //       },
  //     );

  //     if (response.data.success) {
  //       toast.success(response.data.message || "Request sent successfully");

  //       setShowContactModal(false);

  //       setContactForm({
  //         contactPersonName: "",
  //         contactEmail: "",
  //         contactPhone: "",
  //         message: "",
  //       });
  //     } else {
  //       toast.error(response.data.message || "Request failed");
  //     }
  //   } catch (error) {
  //     console.error("Contact pack error:", error);
  //     toast.error(error.response?.data?.message || "Failed to send request");
  //   }
  // };
  const handleProceed = () => {
    if (!paymentMethod) {
      toast.error("Please select payment method");
      return;
    }
    setStartPayment(true);
  };
  const purchasePack = async (paymentData = {}) => {
    try {
      const token = localStorage.getItem("token");

      const res = await axios.post(
        `${API_BASE_URL}purchase-CompanyAddOn`,
        {
          addOnId: selectedPlan._id,
          companyPackId: packId,
          ...paymentData, // ✅ dynamic payment fields
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      return {
        success: res.data.success,
        message: res.data.message,
      };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || "Something went wrong",
      };
    }
  };
  console.log(selectedPlan);
  const paypalGateway = paymentGateways.find(
    (g) => g.gatewayName.toLowerCase() === "paypal",
  );

  const hasActiveGateway = paymentGateways.length > 0;
  // const paypalGateway = paymentGateways.find(
  //   (g) => g.gatewayName.toLowerCase() === "paypal",
  // );
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
            <div className="row mb-4">
              <div className="col-lg-12 text-end">
                <button
                  className="btn btn-outline-dark"
                  onClick={() => setShowManualModal(true)}
                >
                  Request Custom Credits (Enterprise)
                </button>
              </div>
            </div>
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
              <div className="col-lg-4 col-md-6 mb-4" key={plan._id}>
                <div className="card plan-card shadow-sm border-0 h-100 d-flex flex-column">
                  {/* Header */}
                  <div
                    className={`plan-price-heaing-info ${
                      index === 1
                        ? "card-header-orange"
                        : index === 2
                          ? "card-header-green"
                          : ""
                    }`}
                  >
                    <h5 className="fw-bold">{plan.name}</h5>

                    <h2 className="plan-price">
                      {plan.currency} {plan.price}
                    </h2>

                    {plan?.paymentMode === "Manual" && (
                      <span className="badge bg-warning text-dark mt-2">
                        Enterprise
                      </span>
                    )}
                  </div>

                  {/* Body */}
                  <div className="card-body flex-grow-1">
                    {(plan?.jobPostingCredits > 0 ||
                      plan?.profileViewingCredits > 0) && (
                      <ul className="list-unstyled plan-features">
                        {plan?.jobPostingCredits > 0 && (
                          <li>
                            <i className="fa fa-briefcase text-primary me-2"></i>
                            <strong>{plan.jobPostingCredits}</strong> Job
                            Posting Credits
                          </li>
                        )}

                        {plan?.profileViewingCredits > 0 && (
                          <li>
                            <i className="fa fa-user text-success me-2"></i>
                            <strong>{plan.profileViewingCredits}</strong> CV
                            Viewing Credits
                          </li>
                        )}
                      </ul>
                    )}
                  </div>

                  {/* Footer */}
                  <div className="plan-price-btn-info">
                    <button
                      className="plan-price-btn default-btn btn"
                      onClick={() => {
                        if (
                          plan?.paymentMode === "Manual" ||
                          !hasActiveGateway
                        ) {
                          setSelectedPlan(plan);
                          setShowContactModal(true);
                        } else {
                          handleBuyNow(plan);
                        }
                      }}
                      // onClick={() => {
                      //   if (plan?.paymentMode === "Manual") {
                      //     setSelectedPlan(plan);
                      //     setShowContactModal(true);
                      //   } else {
                      //     handleBuyNow(plan);
                      //   }
                      // }}
                    >
                      {/* {plan?.paymentMode === "Manual"
                        ? "Contact Us"
                        : "Buy Now"} */}
                      {plan?.paymentMode === "Manual" || !hasActiveGateway
                        ? "Contact Us"
                        : "Buy Now"}
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
                    {paymentGateways.length === 0 && (
                      <p className="text-danger">
                        No payment gateways available
                      </p>
                    )}

                    {paymentGateways.map((gateway) => (
                      <div className="form-check mb-2" key={gateway._id}>
                        <input
                          type="radio"
                          className="form-check-input"
                          id={gateway.gatewayName}
                          name="payment"
                          value={gateway.gatewayName.toLowerCase()}
                          checked={
                            paymentMethod === gateway.gatewayName.toLowerCase()
                          }
                          onChange={(e) => setPaymentMethod(e.target.value)}
                        />
                        <label
                          className="form-check-label"
                          htmlFor={gateway.gatewayName}
                        >
                          {gateway.gatewayName.toUpperCase()}
                        </label>
                      </div>
                    ))}
                  </>
                )}

                {/* STRIPE */}
                {startPayment &&
                  paymentMethod === "stripe" &&
                  stripePromise && (
                    <Elements stripe={stripePromise}>
                      <CheckoutForm1
                        selectedPlan={selectedPlan}
                        purchasePack={purchasePack}
                        resetPaymentState={resetPaymentState}
                      />
                    </Elements>
                  )}

                {/* PAYPAL */}
                {startPayment &&
                  paymentMethod === "paypal" &&
                  paypalGateway?.clientId && (
                    <PayPalScriptProvider
                      options={{
                        "client-id": paypalGateway.clientId,
                        currency: selectedPlan?.currency || "USD",
                        intent: "capture",
                        disableFunding: ["card"],
                      }}
                    >
                      <PayPalButtons
                        style={{ layout: "vertical" }}
                        createOrder={(data, actions) => {
                          return actions.order.create({
                            intent: "CAPTURE",
                            purchase_units: [
                              {
                                amount: {
                                  currency_code:
                                    selectedPlan?.currency || "USD",
                                  value: Number(selectedPlan.price).toFixed(2),
                                },
                              },
                            ],
                          });
                        }}
                        onApprove={async (data, actions) => {
                          try {
                            const details = await actions.order.capture();

                            const capture =
                              details?.purchase_units?.[0]?.payments
                                ?.captures?.[0];

                            if (!capture || capture.status !== "COMPLETED") {
                              navigate("/payment-failed", {
                                state: { error: "Payment not completed." },
                              });
                              return;
                            }

                            const result = await purchasePack({
                              paymentMode: "PayPal",
                              orderID: details.id,
                              captureId: capture.id,
                              payerEmail: details.payer?.email_address,
                              amount: capture.amount?.value,
                              currency: capture.amount?.currency_code,
                              status: capture.status,
                            });

                            if (result?.success) {
                              navigate("/payment-success", {
                                state: {
                                  payment: {
                                    orderID: details.id,
                                    captureId: capture.id,
                                    amount: capture.amount?.value,
                                    currency: capture.amount?.currency_code,
                                    payerEmail: details.payer?.email_address,
                                    status: capture.status,
                                  },
                                },
                              });
                            } else {
                              navigate("/payment-failed", {
                                state: { error: "Plan activation failed." },
                              });
                            }
                          } catch {
                            navigate("/payment-failed", {
                              state: {
                                error: "Payment failed during capture.",
                              },
                            });
                          }
                        }}
                        onCancel={() => {
                          navigate("/payment-failed", {
                            state: { error: "Payment cancelled by user." },
                          });
                        }}
                        onError={() => {
                          navigate("/payment-failed", {
                            state: {
                              error:
                                "Payment error occurred. Please try again.",
                            },
                          });
                        }}
                      />
                    </PayPalScriptProvider>
                  )}
                {/* CMI */}
                {startPayment && paymentMethod === "CMI" && (
                  <button
                    className="btn btn-success w-100"
                    onClick={handleDemoPayment}
                    disabled={actionLoading}
                  >
                    {actionLoading ? "Processing..." : "Pay with CMI"}
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
      {showManualModal && (
        <div
          className="modal fade show d-block"
          style={{ background: "rgba(0,0,0,0.6)" }}
        >
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Request Custom Credits</h5>
                <button
                  className="btn-close"
                  onClick={() => setShowManualModal(false)}
                />
              </div>

              <div className="modal-body">
                <div className="mb-3">
                  <label>Credit Type</label>
                  <select
                    className="form-control"
                    value={manualType}
                    onChange={(e) => setManualType(e.target.value)}
                  >
                    <option value="">Select Credits Type</option>
                    <option value="cv">CV Credits Only</option>
                    <option value="job">Job Posting Credits Only</option>
                    <option value="both">Both (CV + Job Posting)</option>
                  </select>
                </div>

                {/* CV FIELD */}
                {(manualType === "cv" || manualType === "both") && (
                  <div className="mb-3">
                    <label>CV Credits</label>
                    <input
                      type="number"
                      className="form-control"
                      value={manualCvCredits}
                      onChange={(e) => setManualCvCredits(e.target.value)}
                      placeholder="Enter CV credits"
                    />
                  </div>
                )}

                {/* JOB FIELD */}
                {(manualType === "job" || manualType === "both") && (
                  <div className="mb-3">
                    <label>Job Posting Credits</label>
                    <input
                      type="number"
                      className="form-control"
                      value={manualJobCredits}
                      onChange={(e) => setManualJobCredits(e.target.value)}
                      placeholder="Enter Job credits"
                    />
                  </div>
                )}

                <div className="mb-3">
                  <label>Reason</label>
                  <textarea
                    className="form-control"
                    rows="3"
                    value={manualReason}
                    onChange={(e) => setManualReason(e.target.value)}
                    placeholder="Explain why you need custom credits"
                  />
                </div>
              </div>

              <div className="modal-footer">
                <button
                  className="btn btn-secondary"
                  onClick={() => setShowManualModal(false)}
                >
                  Cancel
                </button>
                <button
                  className="btn btn-primary"
                  onClick={handleManualRequest}
                  disabled={actionLoading}
                >
                  {actionLoading ? "Submitting..." : "Submit Request"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      {showContactModal && (
        <div
          className="modal fade show d-block"
          style={{ background: "rgba(0,0,0,0.6)" }}
        >
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Contact Us</h5>
                <button
                  className="btn-close"
                  onClick={() => setShowContactModal(false)}
                />
              </div>

              <div className="modal-body">
                <div className="form-group mb-3">
                  <label>Contact Person Name *</label>
                  <input
                    type="text"
                    className="form-control"
                    name="contactPersonName"
                    onChange={handleChange}
                  />
                </div>

                <div className="form-group mb-3">
                  <label>Email *</label>
                  <input
                    type="email"
                    className="form-control"
                    name="contactEmail"
                    onChange={handleChange}
                  />
                </div>

                <div className="form-group mb-3">
                  <label>Phone *</label>
                  <input
                    type="text"
                    className="form-control"
                    name="contactPhone"
                    onChange={handleChange}
                  />
                </div>

                <div className="form-group">
                  <label>Message</label>
                  <textarea
                    className="form-control"
                    name="message"
                    rows="3"
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div className="modal-footer">
                <button
                  className="btn btn-secondary"
                  onClick={() => setShowContactModal(false)}
                >
                  Cancel
                </button>

                <button
                  className="btn btn-primary"
                  onClick={handleSubmit}
                  disabled={actionLoading}
                >
                  {actionLoading ? "Sending..." : "Send Request"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default AddOnPack;
