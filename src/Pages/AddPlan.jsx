import { Link } from "react-router-dom";
import React, { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import Swal from "sweetalert2";
import { API_BASE_URL } from "../Url/Url";
import { buildPaymentSuccessState } from "../utils/paymentSuccessState";
import { ToastContainer, toast } from "react-toastify";
import axios from "axios";
import { loadStripe } from "@stripe/stripe-js";
import { useNavigate, useLocation } from "react-router-dom";
import { Elements } from "@stripe/react-stripe-js";
import CheckoutForm from "./CheckoutForm";
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";
import { getPaymentRequestConfig, getRequestConfig } from "../utils/apiHeaders";
import {
  formatSearchBoostLabel,
  formatFeaturedLocationLabels,
  isCompanyProfileHighlightEnabled,
} from "../utils/featuredJobDisplay";
const AddPlan = () => {
  const { t } = useTranslation("global");
  const navigate = useNavigate();
  const location = useLocation();
  const [paymentLoading, setPaymentLoading] = useState(false);
  const [showContactModal, setShowContactModal] = useState(false);
  const [stripePromise, setStripePromise] = useState(null);
  const [plans, setPlans] = useState([]);
  const [currentPlan, setCurrentPlan] = useState(null);
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
  const [contactPlanError, setContactPlanError] = useState("");
  const paymentSubmittingRef = useRef(false);

  const getApiErrorMessage = (error, fallback) =>
    error?.response?.data?.message ||
    error?.response?.data?.error ||
    error?.message ||
    fallback ||
    t("wallet.failedToSendRequest");

  const handleChange = (e) => {
    setContactForm({
      ...contactForm,
      [e.target.name]: e.target.value,
    });
    if (contactPlanError) setContactPlanError("");
  };
  const handleSubmit = async () => {
    if (
      !contactForm.contactPersonName ||
      !contactForm.contactEmail ||
      !contactForm.contactPhone
    ) {
      toast.error(t("header.Please_fill_all_required_fields"));
      return;
    }

    if (!selectedPlan?._id) {
      toast.error(t("wallet.planNotSelected"));
      return;
    }

    try {
      setPaymentLoading(true);
      setContactPlanError("");

      // ✅ Validate pack first
      const validation = await validatePack(selectedPlan._id);

      if (!validation.success) {
        const message = validation.message || t("wallet.packValidationFailed");
        setContactPlanError(message);
        toast.error(message);
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

      if (response.data?.success) {
        toast.success(response.data.message || t("wallet.requestSentSuccess"));

        setShowContactModal(false);
        setContactPlanError("");

        setContactForm({
          contactPersonName: "",
          contactEmail: "",
          contactPhone: "",
          message: "",
        });
        return;
      }

      const message =
        response.data?.message || t("wallet.unableToSendInquiry");
      setContactPlanError(message);
      toast.error(message);
    } catch (error) {
      console.error("Contact pack error:", error);
      const message = getApiErrorMessage(error);
      setContactPlanError(message);
      toast.error(message);
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
        setCurrentPlan(res.data.currentPlan || null);
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
  const showPackProcessError = (message) => {
    Swal.fire({
      title: t("header.Process_Error"),
      text: message || t("wallet.activePackCannotPurchase"),
      icon: "error",
      confirmButtonText: t("header.OK"),
    });
  };

  const opensContactFlow = (plan) =>
    plan?.showButton === "Contact Us" ||
    plan?.canPurchaseOnline === false ||
    plan?.creditApprovalType === "Manual" ||
    !hasActiveGateway;

  const handleBuyNow = async (plan) => {
    if (!plan?.canPurchase) {
      showPackProcessError(
        plan?.purchaseBlockedReason ||
          t("wallet.cannotPurchasePlan"),
      );
      return;
    }

    const validation = await validatePack(plan._id);
    if (!validation.success) {
      showPackProcessError(validation.message);
      return;
    }

    if (opensContactFlow(plan)) {
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
    if (paymentSubmittingRef.current || paymentLoading) return;

    try {
      await new Promise((res) => setTimeout(res, 1000));
      await purchasePack();
      resetPaymentState();
    } catch {
      toast.error(t("wallet.demoPaymentFailed"));
    }
  };
  const handleProceed = async () => {
    if (paymentLoading) return;

    if (!paymentMethod) {
      toast.error(t("wallet.selectPaymentMethodRequired"));
      return;
    }

    const result = await validatePack(selectedPlan._id);

    if (!result.success) {
      showPackProcessError(result.message);
      return;
    }

    setStartPayment(true);
  };

  const fetchActiveGateways = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await axios.get(`${API_BASE_URL}getActivePaymentGateways`, getRequestConfig());

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

  useEffect(() => {
    const selectedPlanId = location.state?.selectedPlanId;
    if (!loading && selectedPlanId && plans.length > 0) {
      const plan = plans.find((item) => item._id === selectedPlanId);
      if (plan) {
        handleBuyNow(plan);
      }
    }
  }, [loading, location.state, plans]);

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
    if (paymentSubmittingRef.current) {
      return { success: false, duplicate: true };
    }

    paymentSubmittingRef.current = true;

    try {
      setPaymentLoading(true);

      if (!selectedPlan?._id) {
        toast.error(t("wallet.noPlanSelected"));
        return { success: false };
      }

      const { paymentMethod, paymentMode, ...rest } = paymentData;
      const res = await axios.post(
        `${API_BASE_URL}company/purchase-pack`,
        {
          packId: selectedPlan._id,
          paymentMethod: paymentMethod ?? paymentMode,
          ...rest,
        },
        getPaymentRequestConfig(),
      );

      if (res.data.success) {
        toast.success(res.data.message);
        resetPaymentState();
        return {
          success: true,
          message: res.data.message,
          data: res.data.data,
        };
      }

      const packMessage = res.data.message || t("checkout.purchaseFailed");
      if (/active pack|cannot purchase another/i.test(packMessage)) {
        showPackProcessError(packMessage);
        return { success: false };
      }

      toast.error(packMessage);
      return { success: false };
    } catch (error) {
      const packMessage = error.response?.data?.message || t("checkout.purchaseFailed");
      if (/active pack|cannot purchase another/i.test(packMessage)) {
        showPackProcessError(packMessage);
        return { success: false };
      }

      toast.error(packMessage);
      return { success: false };
    } finally {
      paymentSubmittingRef.current = false;
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

      return {
        success: false,
        message: res.data.message || t("wallet.packValidationFailed"),
      };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || t("wallet.validationFailed"),
      };
    }
  };
  const paypalGateway = paymentGateways.find(
    (g) => g.gatewayName.toLowerCase() === "paypal",
  );
  const hasActiveGateway = paymentGateways.length > 0;

  const handleManualRequest = async () => {
    try {
      if (!manualType) {
        toast.error(t("wallet.selectCreditType"));
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
        toast.success(t("wallet.manualRechargeSuccess"));

        setShowManualModal(false);
        setManualCvCredits("");
        setManualJobCredits("");
        setManualReason("");
        setManualType("");
      } else {
        toast.error(res.data.message || t("wallet.requestFailed"));
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message || t("wallet.failedToSubmitManual"),
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
                  <h1>{t("wallet.addPlan")}</h1>
                  <ul>
                    <li className="menu-divide-arrow">
                      <Link to="/">{t("header.home")}</Link>
                    </li>
                    <li>{t("wallet.addPlan")}</li>
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
                <h2>{t("wallet.transparentPricing")}</h2>
                <p>{t("wallet.selectBestPlan")}</p>
              </div>
            </div>

            {/* Loading */}
            {loading && (
              <div className="col-12 text-center">
                <p>{t("wallet.loadingPlans")}</p>
              </div>
            )}

            {/* No Plans */}
            {!loading && plans.length === 0 && (
              <div className="col-12 text-center">
                <p>{t("wallet.noActivePlans")}</p>
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
                        <span className="enterprise-badge">{t("wallet.enterprise")}</span>
                        <h3>{plan.packName}</h3>
                        <h2>
                          {plan.amount
                            ? `${plan.currency} ${plan.amount}`
                            : t("wallet.customPricing")}
                        </h2>
                        <p>{t("wallet.tailoredSolutions")}</p>
                      </div>

                      <div className="enterprise-features">
                        <ul>
                          {/* Job Posting */}
                          {(showValue(plan.jobPostingCredits) ||
                            showValue(plan.dailyJobPostingLimit) ||
                            showValue(plan.weeklyJobPostingLimit) ||
                            showValue(plan.monthlyJobPostingLimit)) && (
                            <li>
                              ✔ {t("wallet.jobPosting")}:{" "}
                              {plan.jobPostingCredits === -1
                                ? t("wallet.unlimited")
                                : plan.jobPostingCredits}
                            </li>
                          )}

                          {/* Profile Viewing */}
                          {(showValue(plan.profileViewingCredits) ||
                            showValue(plan.dailyProfileViewingLimit) ||
                            showValue(plan.weeklyProfileViewingLimit) ||
                            showValue(plan.monthlyProfileViewingLimit)) && (
                            <li>
                              ✔ {t("wallet.profileViewing")}:{" "}
                              {plan.profileViewingCredits === -1
                                ? t("wallet.unlimited")
                                : plan.profileViewingCredits}
                            </li>
                          )}

                          {/* Featured Jobs */}
                          {plan.featuredJobsAvailable && plan.maxFeaturedJobs > 0 && (
                            <li>
                              ✔ {t("wallet.featuredJobsDays", {
                                count: plan.maxFeaturedJobs,
                                days: plan.featuredJobDurationDays,
                              })}
                            </li>
                          )}

                          {plan.featuredJobsAvailable &&
                            plan.maxActiveFeaturedJobs > 0 && (
                              <li>
                                ✔ {t("wallet.maxActiveFeaturedJobs", {
                                  count: plan.maxActiveFeaturedJobs,
                                })}
                              </li>
                            )}

                          {/* Featured Locations */}
                          {plan.featuredJobLocations?.length > 0 && (
                            <li>
                              ✔ {t("wallet.locations")}:{" "}
                              {formatFeaturedLocationLabels(plan.featuredJobLocations)}
                            </li>
                          )}

                          {plan.featuredJobsAvailable &&
                            plan.searchBoostScore > 1 &&
                            plan.featuredJobLocations?.includes(
                              "SearchResults",
                            ) && (
                              <li>
                                ✔ {t("wallet.searchBoostScore", {
                                  boost: formatSearchBoostLabel(
                                    plan.searchBoostScore,
                                  ),
                                })}
                              </li>
                            )}

                          {/* Company Highlight */}
                          {isCompanyProfileHighlightEnabled(plan) && (
                            <li>✔ {t("wallet.companyProfileHighlight")}</li>
                          )}

                          {/* Validity */}
                          {plan.validityValue && (
                            <li>
                              ✔ {t("wallet.validity")}: {plan.validityValue}{" "}
                              {plan.validityUnit}
                            </li>
                          )}
                        </ul>
                      </div>

                      <div className="enterprise-btn">
                        <button
                          className="plan-price-btn default-btn btn"
                          disabled={
                            plan?.showButton === "Current Plan" ||
                            (plan?.canPurchase === false &&
                              !opensContactFlow(plan))
                          }
                          title={plan?.purchaseBlockedReason || ""}
                          onClick={() => {
                            if (opensContactFlow(plan)) {
                              setSelectedPlan(plan);
                              setShowContactModal(true);
                              return;
                            }
                            handleBuyNow(plan);
                          }}
                        >
                          {plan?.showButton ||
                            (opensContactFlow(plan)
                              ? t("header.contactUs")
                              : t("wallet.buyNow"))}
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
                          <li>{t("wallet.jobPostCredit")}: {plan.jobPostingCredits}</li>
                        )}
                        {plan.dailyJobPostingLimit > 0 && (
                          <li>
                            {t("wallet.dailyJobPostingLimit")}: {plan.dailyJobPostingLimit}
                          </li>
                        )}
                        {plan.profileViewingCredits > 0 && (
                          <li>
                            {t("wallet.cvViewingCredit")}: {plan.profileViewingCredits}
                          </li>
                        )}
                        {plan.dailyProfileViewingLimit > 0 && (
                          <li>
                            {t("wallet.dailyProfileViewingLimit")}:{" "}
                            {plan.dailyProfileViewingLimit}
                          </li>
                        )}
                        {plan.validityValue > 0 && (
                          <li>
                            {t("wallet.validFor", {
                              value: plan.validityValue,
                              unit: plan.validityUnit,
                            })}
                          </li>
                        )}
                        {plan.featuredJobsAvailable && plan.maxFeaturedJobs > 0 && (
                          <li>
                            {t("wallet.featuredJobsDays", {
                              count: plan.maxFeaturedJobs,
                              days: plan.featuredJobDurationDays,
                            })}
                          </li>
                        )}
                        {plan.featuredJobsAvailable &&
                          plan.maxActiveFeaturedJobs > 0 && (
                            <li>
                              {t("wallet.maxActiveFeaturedJobs", {
                                count: plan.maxActiveFeaturedJobs,
                              })}
                            </li>
                          )}
                        {plan.featuredJobLocations?.length > 0 && (
                          <li>
                            {t("wallet.locations")}:{" "}
                            {formatFeaturedLocationLabels(plan.featuredJobLocations)}
                          </li>
                        )}
                        {plan.featuredJobsAvailable &&
                          plan.searchBoostScore > 1 &&
                          plan.featuredJobLocations?.includes(
                            "SearchResults",
                          ) && (
                            <li>
                              {t("wallet.searchBoostScore", {
                                boost: formatSearchBoostLabel(
                                  plan.searchBoostScore,
                                ),
                              })}
                            </li>
                          )}
                        {isCompanyProfileHighlightEnabled(plan) && (
                          <li>{t("wallet.companyProfileHighlight")}</li>
                        )}
                      </ul>
                    </div>

                    <div className="plan-price-btn-info">
                      {plan?.isCurrentPlan && (
                        <span className="badge bg-success text-white mb-2">
                          {t("wallet.currentPlan")}
                        </span>
                      )}
                      <button
                        className="plan-price-btn default-btn btn"
                        disabled={
                          plan?.showButton === "Current Plan" ||
                          (plan?.canPurchase === false &&
                            !opensContactFlow(plan))
                        }
                        title={plan?.purchaseBlockedReason || ""}
                        onClick={() => {
                          if (opensContactFlow(plan)) {
                            setSelectedPlan(plan);
                            setShowContactModal(true);
                            return;
                          }
                          handleBuyNow(plan);
                        }}
                      >
                        {plan?.showButton ||
                          (opensContactFlow(plan) ? t("header.contactUs") : t("wallet.buyNow"))}
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
                <h5 className="modal-title">{t("checkout.selectPaymentMethod")}</h5>
                <button className="btn-close" onClick={resetPaymentState} />
              </div>

              <div className="modal-body">
                {!startPayment && (
                  <>
                    {paymentGateways.length === 0 && (
                      <p className="text-danger">
                        {t("checkout.noPaymentGateways")}
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
                        submitting={paymentLoading}
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
                        disabled={paymentLoading}
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
                          if (paymentSubmittingRef.current) return;

                          try {
                            const details = await actions.order.capture();

                            const capture =
                              details?.purchase_units?.[0]?.payments
                                ?.captures?.[0];

                            if (!capture || capture.status !== "COMPLETED") {
                              navigate("/payment-failed", {
                                state: { error: t("checkout.paymentNotCompleted") },
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
                                  payment: buildPaymentSuccessState(
                                    result.message,
                                    result.data,
                                    {
                                      amount: capture.amount?.value,
                                      currency: capture.amount?.currency_code,
                                      planName: selectedPlan?.packName,
                                    },
                                  ),
                                },
                              });
                            } else {
                              navigate("/payment-failed", {
                                state: { error: t("checkout.planActivationFailed") },
                              });
                            }
                          } catch (err) {
                            navigate("/payment-failed", {
                              state: {
                                error: t("checkout.paymentFailedCapture"),
                              },
                            });
                          }
                        }}
                        onCancel={() => {
                          navigate("/payment-failed", {
                            state: { error: t("checkout.paymentCancelledByUser") },
                          });
                        }}
                        onError={() => {
                          navigate("/payment-failed", {
                            state: {
                              error: t("checkout.paymentErrorTryAgain"),
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
                    disabled={paymentLoading}
                  >
                    {paymentLoading
                      ? t("checkout.processing")
                      : t("checkout.payWithCmi")}
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
                        {t("checkout.processing")}
                      </>
                    ) : (
                      t("checkout.proceed")
                    )}
                  </button>
                ) : (
                  <button
                    className="btn btn-secondary"
                    onClick={() => setStartPayment(false)}
                  >
                    {t("checkout.back")}
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
                <h5 className="modal-title">{t("header.contactUs")}</h5>
                <button
                  className="btn-close"
                  onClick={() => {
                    setShowContactModal(false);
                    setContactPlanError("");
                  }}
                />
              </div>

              <div className="modal-body">
                {contactPlanError && (
                  <div className="alert alert-danger py-2 px-3 small" role="alert">
                    <i className="fa-solid fa-circle-exclamation me-2" />
                    {contactPlanError}
                  </div>
                )}
                <div className="form-group mb-3">
                  <label>{t("wallet.contactPersonName")}</label>
                  <input
                    type="text"
                    className="form-control"
                    name="contactPersonName"
                    onChange={handleChange}
                  />
                </div>

                <div className="form-group mb-3">
                  <label>{t("header.email")} *</label>
                  <input
                    type="email"
                    className="form-control"
                    name="contactEmail"
                    onChange={handleChange}
                  />
                </div>

                <div className="form-group mb-3">
                  <label>{t("header.phone")} *</label>
                  <input
                    type="text"
                    className="form-control"
                    name="contactPhone"
                    onChange={handleChange}
                  />
                </div>

                <div className="form-group">
                  <label>{t("header.message")}</label>
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
                  onClick={() => {
                    setShowContactModal(false);
                    setContactPlanError("");
                  }}
                >
                  {t("header.Cancel")}
                </button>

                <button
                  className="btn btn-primary"
                  onClick={handleSubmit}
                  disabled={paymentLoading}
                >
                  {paymentLoading ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-2"></span>
                      {t("wallet.sending")}
                    </>
                  ) : (
                    t("wallet.sendRequest")
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
                <h5 className="modal-title">{t("wallet.requestCustomCredits")}</h5>
                <button
                  className="btn-close"
                  onClick={() => setShowManualModal(false)}
                />
              </div>

              <div className="modal-body">
                <div className="mb-3">
                  <label>{t("wallet.creditType")}</label>
                  <select
                    className="form-control"
                    value={manualType}
                    onChange={(e) => setManualType(e.target.value)}
                  >
                    <option value="">{t("wallet.selectCreditsType")}</option>
                    <option value="cv">{t("wallet.cvCreditsOnly")}</option>
                    <option value="job">{t("wallet.jobCreditsOnly")}</option>
                    <option value="both">{t("wallet.bothCredits")}</option>
                  </select>
                </div>

                {/* CV FIELD */}
                {(manualType === "cv" || manualType === "both") && (
                  <div className="mb-3">
                    <label>{t("wallet.cvCredits")}</label>
                    <input
                      type="number"
                      className="form-control"
                      value={manualCvCredits}
                      onChange={(e) => setManualCvCredits(e.target.value)}
                      placeholder={t("wallet.enterCvCredits")}
                    />
                  </div>
                )}

                {/* JOB FIELD */}
                {(manualType === "job" || manualType === "both") && (
                  <div className="mb-3">
                    <label>{t("wallet.jobPostingCredits")}</label>
                    <input
                      type="number"
                      className="form-control"
                      value={manualJobCredits}
                      onChange={(e) => setManualJobCredits(e.target.value)}
                      placeholder={t("wallet.enterJobCredits")}
                    />
                  </div>
                )}

                <div className="mb-3">
                  <label>{t("wallet.reason")}</label>
                  <textarea
                    className="form-control"
                    rows="3"
                    value={manualReason}
                    onChange={(e) => setManualReason(e.target.value)}
                    placeholder={t("wallet.explainCustomCredits")}
                  />
                </div>
              </div>

              <div className="modal-footer">
                <button
                  className="btn btn-secondary"
                  onClick={() => setShowManualModal(false)}
                >
                  {t("header.Cancel")}
                </button>
                <button
                  className="btn btn-primary"
                  // onClick={handleManualRequest}
                  disabled={actionLoading}
                >
                  {actionLoading ? t("wallet.submitting") : t("wallet.submitRequest")}
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
                {t("wallet.requestCustomCreditsEnterprise")}
              </button>
            </div>
          </div>
          <div className="col-lg-12">
            <div className="section-title">
              <h2>{t("wallet.transparentPricing")}</h2>
              <p>{t("wallet.selectBestPlan")}</p>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default AddPlan;
