import { Link } from "react-router-dom";
import React, { useEffect, useState } from "react";
import { API_BASE_URL } from "../Url/Url";
import { ToastContainer, toast } from "react-toastify";
import axios from "axios";
import { loadStripe } from "@stripe/stripe-js";
import { useNavigate } from "react-router-dom";
import { Elements } from "@stripe/react-stripe-js";
import CheckoutForm from "./CheckoutForm";
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";
const AddPlan = () => {
  const navigate = useNavigate();
  const [paymentLoading, setPaymentLoading] = useState(false);
  const [showContactModal, setShowContactModal] = useState(false);
  const [stripePromise, setStripePromise] = useState(null);
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [paymentGateways, setPaymentGateways] = useState([]);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState("");
  const [startPayment, setStartPayment] = useState(false);
  const [showManualModal, setShowManualModal] = useState(false);
  const [manualType, setManualType] = useState("");
  const [manualCvCredits, setManualCvCredits] = useState("");
  const [manualJobCredits, setManualJobCredits] = useState("");
  const [manualReason, setManualReason] = useState("");
  const [actionLoading, setActionLoading] = useState(false);
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
  const handleSubmit = async () => {
    if (
      !contactForm.contactPersonName ||
      !contactForm.contactEmail ||
      !contactForm.contactPhone
    ) {
      toast.error("Please fill all required fields");
      return;
    }

    if (!selectedPlan?._id) {
      toast.error("Plan not selected");
      return;
    }

    try {
      setPaymentLoading(true);

      // ✅ Validate pack first
      const validation = await validatePack(selectedPlan._id);

      if (!validation.success) {
        setPaymentLoading(false);
        return;
      }

      const token = localStorage.getItem("token");

      const payload = {
        packId: selectedPlan._id,
        contactPersonName: contactForm.contactPersonName,
        contactEmail: contactForm.contactEmail,
        contactPhone: contactForm.contactPhone,
        message: contactForm.message || "",
      };

      const response = await axios.post(
        `${API_BASE_URL}contactForPack`,
        payload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
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
      console.error("Contact pack error:", error);
      toast.error(error.response?.data?.message || "Failed to send request");
    } finally {
      setPaymentLoading(false);
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
  //       packId: selectedPlan._id,
  //       contactPersonName: contactForm.contactPersonName,
  //       contactEmail: contactForm.contactEmail,
  //       contactPhone: contactForm.contactPhone,
  //       message: contactForm.message || "",
  //     };

  //     const response = await axios.post(
  //       `${API_BASE_URL}contactForPack`,
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
  const fetchActivePacks = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await axios.get(`${API_BASE_URL}active/packs`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.data.success) {
        setPlans(res.data.data || []);
      }
    } catch (error) {
      console.error("Failed to fetch plans", error);
    } finally {
      setLoading(false);
    }
  };

  const resetPaymentState = () => {
    setShowPaymentModal(false);
    setStartPayment(false);
    setPaymentMethod("");
    setSelectedPlan(null);
  };
  const handleBuyNow = (plan) => {
    // If no gateway → switch to Contact Us
    if (!hasActiveGateway) {
      setSelectedPlan(plan);
      setShowContactModal(true);
      return;
    }

    setSelectedPlan(plan);
    setPaymentMethod(paymentGateways[0].gatewayName.toLowerCase());
    setShowPaymentModal(true);
  };
  // const handleBuyNow = (plan) => {
  //   if (!hasActiveGateway) {
  //     toast.info("Online payment is currently unavailable.");
  //     return;
  //   }

  //   setSelectedPlan(plan);
  //   setPaymentMethod(paymentGateways[0].gatewayName.toLowerCase());
  //   setShowPaymentModal(true);
  // };
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
  const handleProceed = async () => {
    if (paymentLoading) return;

    if (!paymentMethod) {
      toast.error("Please select payment method");
      return;
    }

    const result = await validatePack(selectedPlan._id);

    if (!result.success) return;

    setStartPayment(true);
  };

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

          // ✅ First gateway auto selected
          setPaymentMethod(first.gatewayName.toLowerCase());
          // ✅ Initialize Stripe dynamically
          const stripeGateway = active.find((g) => g.gatewayName === "stripe");

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

  //   try {
  //     const token = localStorage.getItem("token");

  //     if (!selectedPlan?._id) {
  //       toast.error("No plan selected");
  //       return { success: false };
  //     }

  //     const res = await axios.post(
  //       `${API_BASE_URL}company/purchase-pack`,
  //       {
  //         packId: selectedPlan._id,
  //         paymentMethod: paymentData.paymentMethod,
  //         ...paymentData,
  //       },
  //       {
  //         headers: {
  //           Authorization: `Bearer ${token}`,
  //         },
  //       },
  //     );

  //     if (res.data.success) {
  //       // ✅ Show dynamic API message
  //       toast.success(res.data.message);

  //       resetPaymentState();
  //       return { success: true };
  //     } else {
  //       toast.error(res.data.message || "Purchase failed");
  //       return { success: false };
  //     }
  //   } catch (error) {
  //     console.error("Purchase failed:", error.response || error);

  //     toast.error(error.response?.data?.message || "Purchase failed");
  //     return { success: false };
  //   }
  // };
  const purchasePack = async (paymentData = {}) => {
    try {
      setPaymentLoading(true);

      const token = localStorage.getItem("token");

      if (!selectedPlan?._id) {
        toast.error("No plan selected");
        return { success: false };
      }

      const res = await axios.post(
        `${API_BASE_URL}company/purchase-pack`,
        {
          packId: selectedPlan._id,
          paymentMethod: paymentData.paymentMethod,
          ...paymentData,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      if (res.data.success) {
        toast.success(res.data.message);
        resetPaymentState();
        return { success: true };
      } else {
        toast.error(res.data.message || "Purchase failed");
        return { success: false };
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Purchase failed");
      return { success: false };
    } finally {
      setPaymentLoading(false);
    }
  };
  const validatePack = async (packId) => {
    try {
      const token = localStorage.getItem("token");

      const res = await axios.post(
        `${API_BASE_URL}packs/validate`,
        { packId },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      if (res.data.success) {
        return { success: true, data: res.data.data };
      }

      toast.error(res.data.message || "Pack validation failed");
      return { success: false };
    } catch (error) {
      toast.error(error.response?.data?.message || "Validation failed");
      return { success: false };
    }
  };
  const paypalGateway = paymentGateways.find(
    (g) => g.gatewayName.toLowerCase() === "paypal",
  );
  const hasActiveGateway = paymentGateways.length > 0;

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
                  <h2>Add Plan</h2>
                  <ul>
                    <li className="menu-divide-arrow">
                      <Link to="/">Home</Link>
                    </li>
                    <li>Add Plan</li>
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
            {/* <div className="col-lg-12 text-end">
              <button
                className="btn btn-outline-dark"
                onClick={() => setShowManualModal(true)}
              >
                Request Custom Credits (Enterprise)
              </button>
            </div> */}
            <div className="col-lg-12 mb-3">
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
                <p>No active plans available</p>
              </div>
            )}

            {/* Plans */}

            {plans.map((plan, index) => {
              const isCustomPlan = plan.isCustom === true;

              // Helper to determine if value should be displayed
              const showValue = (val) => val !== undefined && val !== 0;
              if (isCustomPlan) {
                return (
                  <div className="col-lg-4 col-md-4" key={plan._id}>
                    <div className="enterprise-card mt-2">
                      <div className="enterprise-top">
                        <span className="enterprise-badge">Enterprise</span>
                        <h3>{plan.packName}</h3>
                        <h2>
                          {plan.amount
                            ? `${plan.currency} ${plan.amount}`
                            : "Custom Pricing"}
                        </h2>
                        <p>Tailored solutions for large companies</p>
                      </div>

                      <div className="enterprise-features">
                        <ul>
                          {/* Job Posting */}
                          {(showValue(plan.jobPostingCredits) ||
                            showValue(plan.dailyJobPostingLimit) ||
                            showValue(plan.weeklyJobPostingLimit) ||
                            showValue(plan.monthlyJobPostingLimit)) && (
                            <li>
                              ✔ Job Posting:{" "}
                              {plan.jobPostingCredits === -1
                                ? "Unlimited"
                                : plan.jobPostingCredits}
                            </li>
                          )}

                          {/* Profile Viewing */}
                          {(showValue(plan.profileViewingCredits) ||
                            showValue(plan.dailyProfileViewingLimit) ||
                            showValue(plan.weeklyProfileViewingLimit) ||
                            showValue(plan.monthlyProfileViewingLimit)) && (
                            <li>
                              ✔ Profile Viewing:{" "}
                              {plan.profileViewingCredits === -1
                                ? "Unlimited"
                                : plan.profileViewingCredits}
                            </li>
                          )}

                          {/* Featured Jobs */}
                          {plan.maxFeaturedJobs > 0 && (
                            <li>
                              ✔ Featured Jobs: {plan.maxFeaturedJobs} (
                              {plan.featuredJobDurationDays} Days)
                            </li>
                          )}

                          {/* Featured Locations */}
                          {plan.featuredJobLocations?.length > 0 && (
                            <li>
                              ✔ Locations:{" "}
                              {plan.featuredJobLocations.join(", ")}
                            </li>
                          )}

                          {/* Company Highlight */}
                          {plan.companyProfileHighlightEnabled && (
                            <li>✔ Company Profile Highlight</li>
                          )}

                          {/* Validity */}
                          {plan.validityValue && (
                            <li>
                              ✔ Validity: {plan.validityValue}{" "}
                              {plan.validityUnit}
                            </li>
                          )}
                        </ul>
                      </div>

                      <div className="enterprise-btn">
                        <button
                          className="plan-price-btn default-btn btn"
                          onClick={() => {
                            if (plan?.creditApprovalType === "Manual") {
                              setSelectedPlan(plan);
                              setShowContactModal(true);
                            } else {
                              handleBuyNow(plan);
                            }
                          }}
                        >
                          {plan?.creditApprovalType === "Manual" ||
                          !hasActiveGateway
                            ? "Contact Us"
                            : "Buy Now"}
                        </button>
                      </div>
                    </div>
                  </div>
                );
              }

              // ==============================
              // 🟢 NORMAL ONLINE PLANS
              // ==============================
              return (
                <div className="col-lg-4 col-md-4 " key={plan._id}>
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
                      <h4>{plan.packName}</h4>
                      <h5>
                        {plan.currency} {plan.amount}
                      </h5>
                    </div>

                    <div className="plan-price-detail-info">
                      <ul>
                        {plan.jobPostingCredits > 0 && (
                          <li>Job Post Credit: {plan.jobPostingCredits}</li>
                        )}
                        {plan.dailyJobPostingLimit > 0 && (
                          <li>
                            Daily Job Posting Limit: {plan.dailyJobPostingLimit}
                          </li>
                        )}
                        {plan.profileViewingCredits > 0 && (
                          <li>
                            CV Viewing Credit: {plan.profileViewingCredits}
                          </li>
                        )}
                        {plan.dailyProfileViewingLimit > 0 && (
                          <li>
                            Daily Profile Viewing Limit:{" "}
                            {plan.dailyProfileViewingLimit}
                          </li>
                        )}
                        {plan.validityValue > 0 && (
                          <li>
                            Valid for {plan.validityValue} {plan.validityUnit}
                          </li>
                        )}
                      </ul>
                    </div>

                    <div className="plan-price-btn-info">
                      <button
                        className="plan-price-btn default-btn btn"
                        onClick={() => {
                          if (plan?.creditApprovalType === "Manual") {
                            setSelectedPlan(plan);
                            setShowContactModal(true);
                          } else {
                            handleBuyNow(plan);
                          }
                        }}
                      >
                        {plan?.creditApprovalType === "Manual" ||
                        !hasActiveGateway
                          ? "Contact Us"
                          : "Buy Now"}
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
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
                  paymentMethod.toLowerCase() === "stripe" &&
                  stripePromise && (
                    <Elements stripe={stripePromise}>
                      <CheckoutForm
                        selectedPlan={selectedPlan}
                        purchasePack={purchasePack}
                      />
                    </Elements>
                  )}

                {/* PAYPAL */}
                {startPayment &&
                  paymentMethod.toLowerCase() === "paypal" &&
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
                                  value: Number(selectedPlan.amount).toFixed(2),
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
                              paymentMethod: "PayPal",
                              orderID: details.id,
                              captureId: capture.id,
                              amount: capture.amount?.value,
                              currency: capture.amount?.currency_code,
                              payerEmail: details.payer?.email_address,
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
                          } catch (err) {
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
                  >
                    Pay with CMI
                  </button>
                )}
              </div>

              <div className="modal-footer">
                {!startPayment ? (
                  <button
                    className="btn btn-primary"
                    disabled={!paymentMethod || paymentLoading}
                    onClick={handleProceed}
                  >
                    {paymentLoading ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2"></span>
                        Processing...
                      </>
                    ) : (
                      "Proceed"
                    )}
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
                  disabled={paymentLoading}
                >
                  {paymentLoading ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-2"></span>
                      Sending...
                    </>
                  ) : (
                    "Send Request"
                  )}
                </button>
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
                  // onClick={handleManualRequest}
                  disabled={actionLoading}
                >
                  {actionLoading ? "Submitting..." : "Submit Request"}
                </button>
              </div>
            </div>
          </div>
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
        </div>
      )}
    </>
  );
};

export default AddPlan;
