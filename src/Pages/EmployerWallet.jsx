import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { API_BASE_URL, API_IMAGE_URL } from "../Url/Url";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";
import "./EmployerWallet.css";
const EmployerWallet = () => {
  const { t, i18n } = useTranslation("global");
  const navigate = useNavigate();
  const [paymentsHistory, setPaymentsHistory] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 10;
  const indexOfLastRow = currentPage * rowsPerPage;
  const indexOfFirstRow = indexOfLastRow - rowsPerPage;
  const currentPayments = paymentsHistory.slice(
    indexOfFirstRow,
    indexOfLastRow,
  );

  const totalPages = Math.ceil(paymentsHistory.length / rowsPerPage);
  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const [creditPage, setCreditPage] = useState(1);
  const creditRowsPerPage = 10;

  const [requestPage, setRequestPage] = useState(1);
  const requestRowsPerPage = 10;

  const [credits, setCredits] = useState(null);
  const [loading, setLoading] = useState(false);
  const [purchaseHistory, setPurchaseHistory] = useState([]);
  const [packsHistory, setPacksHistory] = useState([]);
  const [addOnHistory, setAddOnHistory] = useState([]);
  const [rechargeRequests, setRechargeRequests] = useState([]);
  const [walletTab, setWalletTab] = useState("transactions");
  const [showTopUpModal, setShowTopUpModal] = useState(false);
  const [showUpgradePlanModal, setShowUpgradePlanModal] = useState(false);
  const [showContactModal, setShowContactModal] = useState(false);
  const [selectedContactPlan, setSelectedContactPlan] = useState("");
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [selectedTopUpPack, setSelectedTopUpPack] = useState(null);
  const [showCustomCreditModal, setShowCustomCreditModal] = useState(false);
  const [customCreditType, setCustomCreditType] = useState("BOTH");
  const [customJobCredits, setCustomJobCredits] = useState("");
  const [customCvCredits, setCustomCvCredits] = useState("");
  const [customCreditLoading, setCustomCreditLoading] = useState(false);
  const [availablePlans, setAvailablePlans] = useState([]);
  const [plansLoading, setPlansLoading] = useState(false);
  const [selectedPlanForContact, setSelectedPlanForContact] = useState(null);
  const [hasActiveGateway, setHasActiveGateway] = useState(false);
  const [contactMessage, setContactMessage] = useState("");
  const [companyProfile, setCompanyProfile] = useState(null);
  const [planActionLoading, setPlanActionLoading] = useState(false);
  const fetchcreditStatus = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const response = await axios.get(`${API_BASE_URL}credit-status`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      // console.log(response.data.data);
      setCredits(response.data.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };
  const fetchPurchaseHistory = async () => {
    try {
      const token = localStorage.getItem("token");
      const companyId = localStorage.getItem("companyId");

      const res = await axios.post(
        `${API_BASE_URL}getCompanyPurchaseHistory/${companyId}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      const data = res.data.data;

      console.log("Purchase History API:", data);

      setPacksHistory(data.purchaseHistory?.packs || []);
      setAddOnHistory(data.purchaseHistory?.addOns || []);
      setPaymentsHistory(data.payments || []);
    } catch (error) {
      console.error(error);
    }
  };
  const fetchRechargeRequests = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await axios.get(`${API_BASE_URL}recharge-track`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      console.log("Recharge API Response:", res.data.data); // ðŸ‘ˆ add this
      setRechargeRequests(res.data.data || []);
    } catch (error) {
      console.error(error);
    }
  };
  const fetchCompanyProfile = async () => {
    try {
      const user = JSON.parse(localStorage.getItem("user") || "{}");
      const companyId = user?.companyId || localStorage.getItem("companyId");
      const token = localStorage.getItem("token");

      if (!companyId) return;

      const response = await axios.get(
        `${API_BASE_URL}GetCompanyById/${companyId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );

      if (response.data.success && response.data.company) {
        setCompanyProfile(response.data.company);
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchcreditStatus();
    fetchPurchaseHistory();
    fetchRechargeRequests();
    fetchActiveGateways();
    fetchCompanyProfile();
  }, []);

  const fetchAvailablePlans = async () => {
    try {
      setPlansLoading(true);
      const token = localStorage.getItem("token");
      const res = await axios.get(`${API_BASE_URL}active/packs`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.data.success) {
        setAvailablePlans(res.data.data || []);
      }
    } catch (error) {
      console.error("Failed to fetch plans", error);
    } finally {
      setPlansLoading(false);
    }
  };

  const fetchActiveGateways = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(`${API_BASE_URL}getActivePaymentGateways`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.data.success) {
        setHasActiveGateway(
          (res.data.data || []).some((gateway) => gateway.isActive),
        );
      }
    } catch (error) {
      console.error("Gateway fetch error:", error);
    }
  };

  useEffect(() => {
    if (showUpgradePlanModal) {
      fetchAvailablePlans();
    }
  }, [showUpgradePlanModal]);
  const JobListLoader = () => (
    <div className="text-center py-5">
      <div className="spinner-border text-primary mb-3" role="status" />
      <p> {t("header.Loading_User_Wallet_please_wait")}</p>
    </div>
  );
  const creditTransactions = [...packsHistory, ...addOnHistory];
  const creditIndexLast = creditPage * creditRowsPerPage;
  const creditIndexFirst = creditIndexLast - creditRowsPerPage;

  const currentCreditTransactions = creditTransactions.slice(
    creditIndexFirst,
    creditIndexLast,
  );

  const creditTotalPages = Math.ceil(
    creditTransactions.length / creditRowsPerPage,
  );

  const handleCreditPageChange = (page) => {
    setCreditPage(page);
  };
  const requestIndexLast = requestPage * requestRowsPerPage;
  const requestIndexFirst = requestIndexLast - requestRowsPerPage;

  const currentRechargeRequests = rechargeRequests.slice(
    requestIndexFirst,
    requestIndexLast,
  );

  const requestTotalPages = Math.ceil(
    rechargeRequests.length / requestRowsPerPage,
  );

  const handleRequestPageChange = (page) => {
    setRequestPage(page);
  };

  const formatWalletDate = (date) =>
    date
      ? new Date(date).toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      })
      : "-";

  const formatShortDate = (date) =>
    date ? new Date(date).toLocaleDateString("en-US") : "-";

  const calcCreditProgress = (remaining, total) => {
    if (total === -1 || !total) return 100;
    return Math.min(100, Math.round((remaining / total) * 100));
  };

  const calcUsageProgress = (used, limit) => {
    if (limit === -1 || !limit) return 0;
    return Math.min(100, Math.round((used / limit) * 100));
  };

  const {
    hasWelcomePack,
    hasPurchasedPack,
    welcomePack,
    purchasedPack,
    usageToday,
  } = credits || {};

  const jobCreditData = credits?.fullCredit?.jobCredits || {};
  const profileCreditData = credits?.fullCredit?.profileCredits || {};
  const jobRemaining =
    jobCreditData.remaining ??
    Math.max(0, (jobCreditData.total ?? 0) - (jobCreditData.used ?? 0));
  const jobTotal = jobCreditData.total ?? 0;
  const profileRemaining =
    profileCreditData.remaining ??
    Math.max(0, (profileCreditData.total ?? 0) - (profileCreditData.used ?? 0));
  const profileTotal = profileCreditData.total ?? 0;

  const activePack =
    hasPurchasedPack && purchasedPack
      ? purchasedPack
      : hasWelcomePack
        ? welcomePack
        : null;

  const currentPlanName = activePack?.packName || "No Active Plan";
  const jobsUsedToday =
    usageToday?.jobPostingUsed ?? activePack?.jobUsedToday ?? 0;
  const cvUsedToday =
    usageToday?.profileViewingUsed ?? activePack?.profileUsedToday ?? 0;
  const dailyJobLimit = activePack?.dailyJobLimit ?? 0;
  const dailyProfileLimit = activePack?.dailyProfileLimit ?? 0;
  const planDaysLeft = activePack?.daysLeft ?? 0;
  const planExpiresAt = activePack?.expiresAt;

  const activePacksFromHistory = packsHistory.filter((pack) => pack.isActive);
  const activePackCards =
    activePacksFromHistory.length > 0
      ? activePacksFromHistory.map((pack) => ({
        id: pack._id,
        name: pack.paymentTransactionId?.planName || "Pack",
        totalJobs: pack.jobPostingCredits,
        totalCvs: pack.profileViewingCredits,
        dailyJobs: pack.dailyJobPostingLimit,
        dailyCvs: pack.dailyProfileViewingLimit,
        startedAt: pack.createdAt || pack.activatedAt,
        expiresAt: pack.expiresAt,
      }))
      : [
        ...(hasWelcomePack && welcomePack
          ? [
            {
              id: "welcome",
              name: "Welcome Pack",
              totalJobs: welcomePack.jobCreditsTotal,
              totalCvs: welcomePack.profileCreditsTotal,
              dailyJobs: welcomePack.dailyJobLimit,
              dailyCvs: welcomePack.dailyProfileLimit,
              startedAt: welcomePack.startedAt || welcomePack.createdAt,
              expiresAt: welcomePack.expiresAt,
            },
          ]
          : []),
        ...(hasPurchasedPack && purchasedPack
          ? [
            {
              id: purchasedPack.companyPackId || "purchased",
              name: purchasedPack.packName,
              totalJobs: purchasedPack.jobCreditsTotal,
              totalCvs: purchasedPack.profileCreditsTotal,
              dailyJobs: purchasedPack.dailyJobLimit,
              dailyCvs: purchasedPack.dailyProfileLimit,
              startedAt: purchasedPack.startedAt || purchasedPack.createdAt,
              expiresAt: purchasedPack.expiresAt,
            },
          ]
          : []),
      ];

  const activeAddOns = addOnHistory.filter((item) => item.isActive);
  const addedJobsTotal = activeAddOns.reduce(
    (sum, item) => sum + (item.totalJobCredits ?? 0),
    0,
  );
  const addedCvsTotal = activeAddOns.reduce(
    (sum, item) => sum + (item.totalProfileCredits ?? 0),
    0,
  );
  const manualRechargeRequests = rechargeRequests.filter(
    (req) => req.type === "MANUAL_CREDITS",
  );
  const currentManualRequests = manualRechargeRequests.slice(
    requestIndexFirst,
    requestIndexLast,
  );
  const manualRequestTotalPages = Math.ceil(
    manualRechargeRequests.length / requestRowsPerPage,
  );

  const getTransactionCredits = (item) => {
    const isPack = item.paymentTransactionId?.planType === "Pack";
    return {
      jobs: isPack ? item.jobPostingCredits : (item.totalJobCredits ?? 0),
      profiles: isPack
        ? item.profileViewingCredits
        : (item.totalProfileCredits ?? 0),
      dailyJobs: isPack ? item.dailyJobPostingLimit : null,
      dailyCvs: isPack ? item.dailyProfileViewingLimit : null,
      isPack,
    };
  };

  const renderCreditAmount = (value) =>
    value === -1 ? "Unlimited" : (value ?? 0);

  const getPlanPeriod = (plan) =>
    plan?.validityUnit ? `/${plan.validityUnit}` : "/Plan";

  const isManualPlan = (plan) =>
    plan?.creditApprovalType === "Manual" || plan?.isCustom === true;

  const showPlanValue = (value) => value !== undefined && value !== 0;

  const getCompanyLogoUrl = () => {
    const logo =
      companyProfile?.logo || localStorage.getItem("profileImage") || "";
    if (!logo) return "/jobPortal/assets/images/userIcon.png";
    return logo.startsWith("http") ? logo : `${API_IMAGE_URL}${logo}`;
  };

  const getContactDetails = () => {
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    const firstName =
      localStorage.getItem("first_name") || user?.first_name || "";
    const lastName = localStorage.getItem("last_name") || user?.last_name || "";
    const phoneNumber = companyProfile?.phone?.number || "";
    const countryCode = companyProfile?.phone?.countryCode || "";

    return {
      contactPersonName:
        `${firstName} ${lastName}`.trim() ||
        companyProfile?.brandName ||
        "Company User",
      contactEmail:
        localStorage.getItem("user_email") || user?.email || "",
      contactPhone: phoneNumber
        ? `${countryCode ? `+${countryCode} ` : ""}${phoneNumber}`.trim()
        : "",
    };
  };

  const validatePack = async (packId) => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.post(
        `${API_BASE_URL}packs/validate`,
        { packId },
        {
          headers: { Authorization: `Bearer ${token}` },
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

  const openContactModal = (plan) => {
    setSelectedPlanForContact(plan);
    setSelectedContactPlan(plan?.packName || "Plan");
    setContactMessage(
      `I am interested in the ${plan?.packName}. Please contact me to discuss details...`,
    );
    setShowContactModal(true);
  };

  const closeContactModal = () => {
    setShowContactModal(false);
    setSelectedContactPlan("");
    setSelectedPlanForContact(null);
    setContactMessage("");
  };

  const handlePlanBuy = (plan) => {
    closeUpgradePlanModal();
    navigate("/add-plan", { state: { selectedPlanId: plan._id } });
  };

  const handleContactPlanSubmit = async () => {
    if (!contactMessage.trim()) {
      toast.error("Please enter your message");
      return;
    }

    const contactDetails = getContactDetails();
    if (!contactDetails.contactPersonName || !contactDetails.contactEmail) {
      toast.error("Company contact details not found. Please update your profile.");
      return;
    }

    if (!selectedPlanForContact?._id) {
      toast.error("Plan not selected");
      return;
    }

    try {
      setPlanActionLoading(true);

      const validation = await validatePack(selectedPlanForContact._id);
      if (!validation.success) {
        return;
      }

      const token = localStorage.getItem("token");
      const response = await axios.post(
        `${API_BASE_URL}contactForPack`,
        {
          packId: selectedPlanForContact._id,
          contactPersonName: contactDetails.contactPersonName,
          contactEmail: contactDetails.contactEmail,
          contactPhone: contactDetails.contactPhone,
          message: contactMessage.trim(),
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        },
      );

      if (response.data.success) {
        toast.success(response.data.message || "Request sent successfully");
        closeContactModal();
        closeUpgradePlanModal();
      } else {
        toast.error(response.data.message || "Request failed");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to send request");
    } finally {
      setPlanActionLoading(false);
    }
  };

  const closeUpgradePlanModal = () => {
    setShowUpgradePlanModal(false);
    closeContactModal();
  };

  const openPaymentModal = (pack) => {
    setSelectedTopUpPack(pack);
    setShowPaymentModal(true);
  };

  const closePaymentModal = () => {
    setShowPaymentModal(false);
    setSelectedTopUpPack(null);
  };

  const closeTopUpModal = () => {
    setShowTopUpModal(false);
    closePaymentModal();
    closeCustomCreditModal();
  };

  const closeCustomCreditModal = () => {
    setShowCustomCreditModal(false);
    setCustomCreditType("BOTH");
    setCustomJobCredits("");
    setCustomCvCredits("");
  };

  const handleCustomCreditSubmit = async () => {
    const jobCredits =
      customCreditType === "CV" ? 0 : Number(customJobCredits || 0);
    const cvCredits =
      customCreditType === "JOB" ? 0 : Number(customCvCredits || 0);

    if (customCreditType === "JOB" && !jobCredits) {
      toast.error("Please enter job posting credits");
      return;
    }
    if (customCreditType === "CV" && !cvCredits) {
      toast.error("Please enter CV viewing credits");
      return;
    }
    if (customCreditType === "BOTH" && !jobCredits && !cvCredits) {
      toast.error("Please enter at least one credit amount");
      return;
    }

    try {
      setCustomCreditLoading(true);
      const token = localStorage.getItem("token");

      const res = await axios.post(
        `${API_BASE_URL}createManualRechargeRequest`,
        {
          jobCreditsRequested: jobCredits,
          profileCreditsRequested: cvCredits,
          message: "",
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );

      if (res.data.success) {
        toast.success("Manual recharge request submitted successfully");
        closeCustomCreditModal();
        closeTopUpModal();
        fetchRechargeRequests();
        setWalletTab("manual");
      } else {
        toast.error(res.data.message || "Request failed");
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to submit manual request",
      );
    } finally {
      setCustomCreditLoading(false);
    }
  };

  const handleSelectPayment = (paymentMethod) => {
    if (!selectedTopUpPack) return;

    closeTopUpModal();
    navigate("/checkout", {
      state: {
        paymentMethod,
        pack: selectedTopUpPack,
      },
    });
  };

  return (
    <>
      {/* <!-- Start Main Dashboard Content Wrapper Area --> */}
      <div className="main-dashboard-content d-flex flex-column">
        <div className="responsive-content">
          <div className="wallet-page-header">
            <div className="wallet-page-header-left">
              <h1 className="wallet-page-title">{t("header.My_Wallet")}</h1>
              <span className="wallet-header-divider">|</span>
              <ol className="wallet-inline-breadcrumb">
                <li>
                  <Link to="/employer-dashboard">{t("header.dashboard")}</Link>
                </li>
                <li className="active">Wallet</li>
              </ol>
            </div>
            <button
              type="button"
              className="btn-buy-primary"
              onClick={() => setShowUpgradePlanModal(true)}
            >
              <i className="fa-solid fa-plus me-2" />
              Upgrade Plan
            </button>
          </div>

          {loading || !credits ? (
            <JobListLoader />
          ) : (
            <>
              <div className="row g-4 mb-5">
                <div className="col-xl-3 col-md-6">
                  <div className="glass-card kpi-card blue-glow h-100">
                    <div className="kpi-icon-wrap bg-blue-subtle text-primary">
                      <i className="fa-solid fa-briefcase" />
                    </div>
                    <div className="kpi-content">
                      <span className="kpi-label">Job Posting Credits</span>
                      <div className="kpi-value">
                        {jobTotal === -1 ? (
                          "Unlimited"
                        ) : (
                          <>
                            {jobRemaining}
                            <span className="kpi-total">/ {jobTotal}</span>
                          </>
                        )}
                        <span
                          className="live-indicator-dot"
                          title="Live status"
                        />
                      </div>
                      <div className="kpi-progress">
                        <div
                          className="progress-bar bg-primary fluid-progress"
                          style={{
                            width: `${calcCreditProgress(jobRemaining, jobTotal)}%`,
                          }}
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="col-xl-3 col-md-6">
                  <div className="glass-card kpi-card orange-glow h-100">
                    <div className="kpi-icon-wrap bg-orange-subtle text-orange">
                      <i className="fa-solid fa-user-tie" />
                    </div>
                    <div className="kpi-content">
                      <span className="kpi-label">CV Viewing Credits</span>
                      <div className="kpi-value">
                        {profileTotal === -1 ? (
                          "Unlimited"
                        ) : (
                          <>
                            {profileRemaining}
                            <span className="kpi-total">/ {profileTotal}</span>
                          </>
                        )}
                        <span
                          className="live-indicator-dot orange"
                          title="Live status"
                        />
                      </div>
                      <div className="kpi-progress">
                        <div
                          className="progress-bar bg-orange fluid-progress"
                          style={{
                            width: `${calcCreditProgress(profileRemaining, profileTotal)}%`,
                          }}
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="col-xl-3 col-md-6">
                  <div className="glass-card kpi-card green-glow h-100">
                    <div className="kpi-icon-wrap bg-success-subtle text-success">
                      <i className="fa-solid fa-bolt" />
                    </div>
                    <div className="kpi-content">
                      <div className="d-flex justify-content-between align-items-center mb-1">
                        <span className="kpi-label">Activity Today</span>
                        {activePack && (
                          <span
                            className="badge bg-info-subtle text-info xsmall"
                            style={{ fontSize: "0.6rem" }}
                          >
                            {currentPlanName}
                          </span>
                        )}
                      </div>
                      <div className="d-flex flex-column gap-2">
                        <div className="activity-item">
                          <div className="d-flex justify-content-between small mb-1">
                            <span className="text-muted">Jobs Posts</span>
                            <span className="fw-bold">
                              {jobsUsedToday} /{" "}
                              {dailyJobLimit === -1
                                ? "Unlimited"
                                : dailyJobLimit}
                            </span>
                          </div>
                          <div
                            className="progress mini-progress"
                            style={{ height: "4px" }}
                          >
                            <div
                              className="progress-bar bg-success"
                              style={{
                                width: `${calcUsageProgress(
                                  jobsUsedToday,
                                  dailyJobLimit,
                                )}%`,
                              }}
                            />
                          </div>
                        </div>
                        <div className="activity-item">
                          <div className="d-flex justify-content-between small mb-1">
                            <span className="text-muted">CV Views</span>
                            <span className="fw-bold">
                              {cvUsedToday} /{" "}
                              {dailyProfileLimit === -1
                                ? "Unlimited"
                                : dailyProfileLimit}
                            </span>
                          </div>
                          <div
                            className="progress mini-progress"
                            style={{ height: "4px" }}
                          >
                            <div
                              className="progress-bar bg-info"
                              style={{
                                width: `${calcUsageProgress(
                                  cvUsedToday,
                                  dailyProfileLimit,
                                )}%`,
                              }}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="col-xl-3 col-md-6">
                  <div className="glass-card kpi-card dark-glow h-100">
                    <div className="kpi-icon-wrap bg-dark-subtle text-dark">
                      <i className="fa-solid fa-hourglass-half" />
                    </div>
                    <div className="kpi-content">
                      <span className="kpi-label">Plan Validity</span>
                      <div className="kpi-value h3 mb-1">
                        {planDaysLeft}
                        <span className="small fs-6 fw-normal text-muted">
                          {" "}
                          Days Left
                        </span>
                      </div>
                      <div className="small text-muted xsmall">
                        Ends: {formatWalletDate(planExpiresAt)}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="active-plan-minimal-banner mb-5">
                <div className="d-flex justify-content-between align-items-center flex-wrap gap-4">
                  <div className="plan-main-info">
                    <span className="plan-badge-label">Current Plan</span>
                    <h4 className="plan-name-display mb-0">
                      {currentPlanName}
                    </h4>
                  </div>
                  <div className="plan-details-row d-flex gap-5">
                    <div className="plan-detail-item">
                      <span className="detail-label">Ad Credits</span>
                      <span className="detail-value">
                        {renderCreditAmount(
                          activePack?.jobCreditsTotal ?? jobTotal,
                        )}
                      </span>
                    </div>
                    <div className="plan-detail-item">
                      <span className="detail-label">
                        Access to the CV database
                      </span>
                      <span className="detail-value">
                        {renderCreditAmount(
                          activePack?.profileCreditsTotal ?? profileTotal,
                        )}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="row g-4 mb-5">
                <div className="col-lg-6">
                  <div className="premium-card h-100">
                    <div className="card-header-premium">
                      <h5 className="mb-0 fw-bold">
                        Active Subscription Packs
                      </h5>
                      <span className="badge-total">
                        {activePackCards.length} Active
                      </span>
                    </div>
                    <div className="card-body p-4">
                      {activePackCards.length === 0 ? (
                        <div className="text-center text-muted py-4">
                          <p className="mb-3">No active subscription packs</p>
                          <button
                            className="btn btn-primary btn-sm"
                            onClick={() => navigate("/add-plan")}
                          >
                            View Plans
                          </button>
                        </div>
                      ) : (
                        <div className="row g-3">
                          {activePackCards.map((pack) => (
                            <div className="col-md-12" key={pack.id}>
                              <div className="sub-pack-card">
                                <div className="sub-pack-title">
                                  {pack.name}
                                </div>
                                <div className="sub-pack-stats">
                                  <div className="stat-row">
                                    <span className="stat-label">
                                      Total Jobs
                                    </span>
                                    <span className="stat-val">
                                      {renderCreditAmount(pack.totalJobs)}
                                    </span>
                                  </div>
                                  <div className="stat-row">
                                    <span className="stat-label">
                                      Total CVs
                                    </span>
                                    <span className="stat-val">
                                      {renderCreditAmount(pack.totalCvs)}
                                    </span>
                                  </div>
                                  <div className="stat-separator my-2" />
                                  <div className="stat-row">
                                    <span className="stat-label">
                                      Daily Jobs Limit
                                    </span>
                                    <span className="stat-val text-muted">
                                      {renderCreditAmount(pack.dailyJobs)}
                                    </span>
                                  </div>
                                  <div className="stat-row">
                                    <span className="stat-label">
                                      Daily CVs Limit
                                    </span>
                                    <span className="stat-val text-muted">
                                      {renderCreditAmount(pack.dailyCvs)}
                                    </span>
                                  </div>
                                </div>
                                <div className="mt-3 pt-3 border-top xsmall">
                                  <div className="d-flex justify-content-between mb-1">
                                    <span className="text-muted">Started:</span>
                                    <span className="fw-bold">
                                      {formatShortDate(pack.startedAt)}
                                    </span>
                                  </div>
                                  <div className="d-flex justify-content-between">
                                    <span className="text-muted">Ends:</span>
                                    <span className="fw-bold text-danger">
                                      {formatShortDate(pack.expiresAt)}
                                    </span>
                                  </div>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <div className="col-lg-6">
                  <div className="premium-card h-100">
                    <div className="card-header-premium">
                      <h5 className="mb-0 fw-bold">Manual Credit</h5>
                    </div>
                    <div className="card-body p-4">
                      <div className="sub-pack-card border-info-subtle">
                        <div className="sub-pack-title text-primary">
                          Summary of Active Add-ons
                        </div>
                        <div className="sub-pack-stats">
                          <div className="stat-row">
                            <span className="stat-label">Added Jobs</span>
                            <span className="stat-val text-primary">
                              +{addedJobsTotal}
                            </span>
                          </div>
                          <div className="stat-row">
                            <span className="stat-label">Added CVs</span>
                            <span className="stat-val text-orange">
                              +{addedCvsTotal}
                            </span>
                          </div>
                        </div>
                        <div className="mt-3 pt-3 border-top xsmall text-muted">
                          Total from {activeAddOns.length} active recharge(s)
                        </div>
                      </div>
                      <div className="mt-4 pt-2 text-center">
                        <button
                          type="button"
                          className="btn-topup-outline w-100"
                          onClick={() => setShowTopUpModal(true)}
                        >
                          <i className="fa-solid fa-plus-circle me-2" />
                          Request Credit Top-up
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="col-12">
                  <div className="premium-tabs-nav mb-4">
                    <button
                      type="button"
                      className={`tab-btn ${walletTab === "transactions" ? "active" : ""}`}
                      onClick={() => setWalletTab("transactions")}
                    >
                      <i className="fa-solid fa-list-check me-2" /> Transaction
                      History
                    </button>
                    <button
                      type="button"
                      className={`tab-btn ${walletTab === "recharge" ? "active" : ""}`}
                      onClick={() => setWalletTab("recharge")}
                    >
                      <i className="fa-solid fa-clock-rotate-left me-2" />{" "}
                      Recharge Track
                    </button>
                    <button
                      type="button"
                      className={`tab-btn ${walletTab === "payments" ? "active" : ""}`}
                      onClick={() => setWalletTab("payments")}
                    >
                      <i className="fa-solid fa-credit-card me-2" /> Recent
                      Payments
                    </button>
                    <button
                      type="button"
                      className={`tab-btn ${walletTab === "manual" ? "active" : ""}`}
                      onClick={() => setWalletTab("manual")}
                    >
                      <i className="fa-solid fa-hand-holding-hand me-2" />{" "}
                      Manual Requests
                    </button>
                  </div>

                  <div className="premium-card">
                    <div className="table-responsive-premium">
                      <div className="card-header-premium border-0">
                        <h5 className="mb-0 fw-bold">
                          {walletTab === "transactions" &&
                            "Transaction History"}
                          {walletTab === "recharge" && "Recharge Track"}
                          {walletTab === "payments" && "Recent Payments"}
                          {walletTab === "manual" && "Manual Requests"}
                        </h5>
                      </div>

                      {walletTab === "transactions" && (
                        <>
                          <table className="table-premium">
                            <thead>
                              <tr>
                                <th>Type</th>
                                <th>Plan Name</th>
                                <th>Jobs</th>
                                <th>CV Views</th>
                                <th>Daily Jobs</th>
                                <th>Daily CV</th>
                                <th>Date</th>
                              </tr>
                            </thead>
                            <tbody>
                              {currentCreditTransactions.length === 0 ? (
                                <tr>
                                  <td colSpan="7" className="text-center py-4">
                                    No transaction history found
                                  </td>
                                </tr>
                              ) : (
                                currentCreditTransactions.map((item) => {
                                  const tx = getTransactionCredits(item);
                                  const isPack =
                                    item.paymentTransactionId?.planType ===
                                    "Pack";
                                  return (
                                    <tr key={item._id}>
                                      <td>
                                        <span
                                          className={`pill-badge ${isPack ? "pill-blue" : "pill-info"}`}
                                        >
                                          {isPack ? "Pack" : "AddOn"}
                                        </span>
                                      </td>
                                      <td className="fw-bold text-dark">
                                        {item.paymentTransactionId?.planName ||
                                          "-"}
                                      </td>
                                      <td>
                                        <span className="text-primary fw-bold">
                                          {renderCreditAmount(tx.jobs)}
                                        </span>
                                      </td>
                                      <td>
                                        <span className="text-orange-premium fw-bold">
                                          {renderCreditAmount(tx.profiles)}
                                        </span>
                                      </td>
                                      <td className="small">
                                        {tx.isPack
                                          ? renderCreditAmount(tx.dailyJobs)
                                          : "-"}
                                      </td>
                                      <td className="small">
                                        {tx.isPack
                                          ? renderCreditAmount(tx.dailyCvs)
                                          : "-"}
                                      </td>
                                      <td className="small text-muted">
                                        {formatWalletDate(
                                          item.createdAt ||
                                          item.paymentTransactionId
                                            ?.paymentDate,
                                        )}
                                      </td>
                                    </tr>
                                  );
                                })
                              )}
                            </tbody>
                          </table>
                          {creditTotalPages > 1 && (
                            <div className="paginations mb-30">
                              <ul>
                                <li>
                                  <a
                                    href="#"
                                    onClick={(e) => {
                                      e.preventDefault();
                                      if (creditPage > 1)
                                        handleCreditPageChange(creditPage - 1);
                                    }}
                                  >
                                    <i className="fa-solid fa-angle-left" />
                                  </a>
                                </li>
                                {Array.from(
                                  { length: creditTotalPages },
                                  (_, i) => (
                                    <li key={i + 1}>
                                      <a
                                        href="#"
                                        className={
                                          creditPage === i + 1 ? "active" : ""
                                        }
                                        onClick={(e) => {
                                          e.preventDefault();
                                          handleCreditPageChange(i + 1);
                                        }}
                                      >
                                        {i + 1}
                                      </a>
                                    </li>
                                  ),
                                )}
                                <li>
                                  <a
                                    href="#"
                                    onClick={(e) => {
                                      e.preventDefault();
                                      if (creditPage < creditTotalPages)
                                        handleCreditPageChange(creditPage + 1);
                                    }}
                                  >
                                    <i className="fa-solid fa-angle-right" />
                                  </a>
                                </li>
                              </ul>
                            </div>
                          )}
                        </>
                      )}

                      {walletTab === "recharge" && (
                        <>
                          <div className="premium-card">
                            <div className="table-responsive-premium">
                              <div className="card-header-premium border-0 flex-column align-items-start gap-3">
                                <div className="d-flex justify-content-between w-100 align-items-center">
                                  <h5 className="mb-0 fw-bold">
                                    Recharge Request Track
                                  </h5>
                                  <button className="btn btn-sm btn-outline-secondary rounded-pill px-3">
                                    <i className="fa-solid fa-rotate-left me-1" />{" "}
                                    Reset Filter
                                  </button>
                                </div>
                                <div className="modern-filter-bar d-flex flex-wrap gap-4 align-items-end bg-white p-4 rounded-5 shadow-sm w-100 border border-light">
                                  <div className="filter-item flex-grow-1">
                                    <label className="filter-label">
                                      <i className="fa-solid fa-calendar-days me-2 text-primary" />
                                      From Date
                                    </label>
                                    <div className="input-with-icon">
                                      <input
                                        className="premium-filter-input"
                                        type="date"
                                        defaultValue
                                      />
                                    </div>
                                  </div>
                                  <div className="filter-item flex-grow-1">
                                    <label className="filter-label">
                                      <i className="fa-solid fa-calendar-check me-2 text-primary" />
                                      To Date
                                    </label>
                                    <div className="input-with-icon">
                                      <input
                                        className="premium-filter-input"
                                        type="date"
                                        defaultValue
                                      />
                                    </div>
                                  </div>
                                  <div className="filter-item flex-grow-1 position-relative">
                                    <label className="filter-label">
                                      <i className="fa-solid fa-layer-group me-2 text-primary" />
                                      Status
                                    </label>
                                    <div className="naddi-custom-select active">
                                      <div className="selected-value">
                                        <span>
                                          <i className="fa-solid fa-list-ul me-2" />{" "}
                                          All Requests
                                        </span>
                                        <i className="fa-solid fa-chevron-down ms-auto arrow-icon rotate" />
                                      </div>
                                      <div className="naddi-options-menu">
                                        <div className="naddi-option">
                                          All Requests
                                        </div>
                                        <div className="naddi-option text-warning">
                                          <i className="fa-solid fa-clock me-2" />{" "}
                                          Pending
                                        </div>
                                        <div className="naddi-option text-success">
                                          <i className="fa-solid fa-circle-check me-2" />{" "}
                                          Approved
                                        </div>
                                        <div className="naddi-option text-danger">
                                          <i className="fa-solid fa-circle-xmark me-2" />{" "}
                                          Rejected
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                  <div className="filter-actions d-flex align-items-center gap-3">
                                    <div className="results-counter bg-primary-subtle text-primary px-3 py-2 rounded-4 fw-bold small">
                                      11 found
                                    </div>
                                  </div>
                                </div>
                              </div>
                              <table className="table-premium">
                                <thead>
                                  <tr>
                                    <th>Request Details</th>
                                    <th>Job Postings</th>
                                    <th>View Profiles</th>
                                    <th>Status</th>
                                    <th>Created Date</th>
                                  </tr>
                                </thead>
                                <tbody>
                                  <tr>
                                    <td>
                                      <div className="fw-bold text-dark">
                                        MANUAL_CREDITS : Manual Credits
                                      </div>
                                    </td>
                                    <td>
                                      <span className="badge bg-primary-subtle-premium text-primary-premium px-3 py-2 rounded-pill fw-bold">
                                        +5
                                      </span>
                                    </td>
                                    <td>
                                      <span className="badge bg-orange-subtle-premium text-orange-premium px-3 py-2 rounded-pill fw-bold">
                                        +0
                                      </span>
                                    </td>
                                    <td>
                                      <span className="status-pill pending">
                                        Your request is pending approval
                                      </span>
                                    </td>
                                    <td className="small text-muted">
                                      5/26/2026
                                    </td>
                                  </tr>
                                  <tr>
                                    <td>
                                      <div className="fw-bold text-dark">
                                        MANUAL_CREDITS : Manual Credits
                                      </div>
                                    </td>
                                    <td>
                                      <span className="badge bg-primary-subtle-premium text-primary-premium px-3 py-2 rounded-pill fw-bold">
                                        +5
                                      </span>
                                    </td>
                                    <td>
                                      <span className="badge bg-orange-subtle-premium text-orange-premium px-3 py-2 rounded-pill fw-bold">
                                        +0
                                      </span>
                                    </td>
                                    <td>
                                      <span className="status-pill pending">
                                        Your request is pending approval
                                      </span>
                                    </td>
                                    <td className="small text-muted">
                                      5/26/2026
                                    </td>
                                  </tr>
                                  <tr>
                                    <td>
                                      <div className="fw-bold text-dark">
                                        MANUAL_CREDITS : Manual Credits
                                      </div>
                                    </td>
                                    <td>
                                      <span className="badge bg-primary-subtle-premium text-primary-premium px-3 py-2 rounded-pill fw-bold">
                                        +0
                                      </span>
                                    </td>
                                    <td>
                                      <span className="badge bg-orange-subtle-premium text-orange-premium px-3 py-2 rounded-pill fw-bold">
                                        +50
                                      </span>
                                    </td>
                                    <td>
                                      <span className="status-pill pending">
                                        Your request is pending approval
                                      </span>
                                    </td>
                                    <td className="small text-muted">
                                      5/21/2026
                                    </td>
                                  </tr>
                                  <tr>
                                    <td>
                                      <div className="fw-bold text-dark">
                                        MANUAL_CREDITS : Manual Credits
                                      </div>
                                    </td>
                                    <td>
                                      <span className="badge bg-primary-subtle-premium text-primary-premium px-3 py-2 rounded-pill fw-bold">
                                        +5
                                      </span>
                                    </td>
                                    <td>
                                      <span className="badge bg-orange-subtle-premium text-orange-premium px-3 py-2 rounded-pill fw-bold">
                                        +0
                                      </span>
                                    </td>
                                    <td>
                                      <span className="status-pill pending">
                                        Your request is pending approval
                                      </span>
                                    </td>
                                    <td className="small text-muted">
                                      5/21/2026
                                    </td>
                                  </tr>
                                  <tr>
                                    <td>
                                      <div className="fw-bold text-dark">
                                        MANUAL_CREDITS : Manual Credits
                                      </div>
                                    </td>
                                    <td>
                                      <span className="badge bg-primary-subtle-premium text-primary-premium px-3 py-2 rounded-pill fw-bold">
                                        +5
                                      </span>
                                    </td>
                                    <td>
                                      <span className="badge bg-orange-subtle-premium text-orange-premium px-3 py-2 rounded-pill fw-bold">
                                        +0
                                      </span>
                                    </td>
                                    <td>
                                      <span className="status-pill pending">
                                        Your request is pending approval
                                      </span>
                                    </td>
                                    <td className="small text-muted">
                                      5/20/2026
                                    </td>
                                  </tr>
                                  <tr>
                                    <td>
                                      <div className="fw-bold text-dark">
                                        MANUAL_CREDITS : Manual Credits
                                      </div>
                                    </td>
                                    <td>
                                      <span className="badge bg-primary-subtle-premium text-primary-premium px-3 py-2 rounded-pill fw-bold">
                                        +5
                                      </span>
                                    </td>
                                    <td>
                                      <span className="badge bg-orange-subtle-premium text-orange-premium px-3 py-2 rounded-pill fw-bold">
                                        +0
                                      </span>
                                    </td>
                                    <td>
                                      <span className="status-pill pending">
                                        Your request is pending approval
                                      </span>
                                    </td>
                                    <td className="small text-muted">
                                      5/19/2026
                                    </td>
                                  </tr>
                                  <tr>
                                    <td>
                                      <div className="fw-bold text-dark">
                                        MANUAL_CREDITS : Manual Credits
                                      </div>
                                    </td>
                                    <td>
                                      <span className="badge bg-primary-subtle-premium text-primary-premium px-3 py-2 rounded-pill fw-bold">
                                        +5
                                      </span>
                                    </td>
                                    <td>
                                      <span className="badge bg-orange-subtle-premium text-orange-premium px-3 py-2 rounded-pill fw-bold">
                                        +0
                                      </span>
                                    </td>
                                    <td>
                                      <span className="status-pill pending">
                                        Your request is pending approval
                                      </span>
                                    </td>
                                    <td className="small text-muted">
                                      5/14/2026
                                    </td>
                                  </tr>
                                  <tr>
                                    <td>
                                      <div className="fw-bold text-dark">
                                        PACK : STANDARD PACK
                                      </div>
                                    </td>
                                    <td>
                                      <span className="badge bg-primary-subtle-premium text-primary-premium px-3 py-2 rounded-pill fw-bold">
                                        +10
                                      </span>
                                    </td>
                                    <td>
                                      <span className="badge bg-orange-subtle-premium text-orange-premium px-3 py-2 rounded-pill fw-bold">
                                        +100
                                      </span>
                                    </td>
                                    <td>
                                      <span className="status-pill approved">
                                        Recharge validated – credits added
                                      </span>
                                    </td>
                                    <td className="small text-muted">
                                      4/30/2026
                                    </td>
                                  </tr>
                                  <tr>
                                    <td>
                                      <div className="fw-bold text-dark">
                                        ADDON : Manual Credits
                                      </div>
                                    </td>
                                    <td>
                                      <span className="badge bg-primary-subtle-premium text-primary-premium px-3 py-2 rounded-pill fw-bold">
                                        +0
                                      </span>
                                    </td>
                                    <td>
                                      <span className="badge bg-orange-subtle-premium text-orange-premium px-3 py-2 rounded-pill fw-bold">
                                        +50
                                      </span>
                                    </td>
                                    <td>
                                      <span className="status-pill pending">
                                        Your request is pending approval
                                      </span>
                                    </td>
                                    <td className="small text-muted">
                                      4/1/2026
                                    </td>
                                  </tr>
                                  <tr>
                                    <td>
                                      <div className="fw-bold text-dark">
                                        ADDON : Manual Credits
                                      </div>
                                    </td>
                                    <td>
                                      <span className="badge bg-primary-subtle-premium text-primary-premium px-3 py-2 rounded-pill fw-bold">
                                        +0
                                      </span>
                                    </td>
                                    <td>
                                      <span className="badge bg-orange-subtle-premium text-orange-premium px-3 py-2 rounded-pill fw-bold">
                                        +50
                                      </span>
                                    </td>
                                    <td>
                                      <span className="status-pill approved">
                                        Recharge validated – credits added
                                      </span>
                                    </td>
                                    <td className="small text-muted">
                                      3/27/2026
                                    </td>
                                  </tr>
                                  <tr>
                                    <td>
                                      <div className="fw-bold text-dark">
                                        PACK : STANDARD PACK
                                      </div>
                                    </td>
                                    <td>
                                      <span className="badge bg-primary-subtle-premium text-primary-premium px-3 py-2 rounded-pill fw-bold">
                                        +10
                                      </span>
                                    </td>
                                    <td>
                                      <span className="badge bg-orange-subtle-premium text-orange-premium px-3 py-2 rounded-pill fw-bold">
                                        +100
                                      </span>
                                    </td>
                                    <td>
                                      <span className="status-pill pending">
                                        Payment done – waiting for admin
                                        approval
                                      </span>
                                    </td>
                                    <td className="small text-muted">
                                      3/27/2026
                                    </td>
                                  </tr>
                                </tbody>
                              </table>
                            </div>
                          </div>
                          {requestTotalPages > 1 && (
                            <div className="paginations mb-30">
                              <ul>
                                <li>
                                  <a
                                    href="#"
                                    onClick={(e) => {
                                      e.preventDefault();
                                      if (requestPage > 1)
                                        handleRequestPageChange(
                                          requestPage - 1,
                                        );
                                    }}
                                  >
                                    <i className="fa-solid fa-angle-left" />
                                  </a>
                                </li>
                                {Array.from(
                                  { length: requestTotalPages },
                                  (_, i) => (
                                    <li key={i + 1}>
                                      <a
                                        href="#"
                                        className={
                                          requestPage === i + 1 ? "active" : ""
                                        }
                                        onClick={(e) => {
                                          e.preventDefault();
                                          handleRequestPageChange(i + 1);
                                        }}
                                      >
                                        {i + 1}
                                      </a>
                                    </li>
                                  ),
                                )}
                                <li>
                                  <a
                                    href="#"
                                    onClick={(e) => {
                                      e.preventDefault();
                                      if (requestPage < requestTotalPages)
                                        handleRequestPageChange(
                                          requestPage + 1,
                                        );
                                    }}
                                  >
                                    <i className="fa-solid fa-angle-right" />
                                  </a>
                                </li>
                              </ul>
                            </div>
                          )}
                        </>
                      )}

                      {walletTab === "payments" && (
                        <>
                          <div className="premium-card">
                            <div className="table-responsive-premium">
                              <div className="card-header-premium border-0">
                                <h5 className="mb-0 fw-bold">
                                  Payment History
                                </h5>
                              </div>
                              <table className="table-premium">
                                <thead>
                                  <tr>
                                    <th>Plan / Item</th>
                                    <th>Amount</th>
                                    <th>Status</th>
                                    <th>Date</th>
                                  </tr>
                                </thead>
                                <tbody>
                                  <tr>
                                    <td className="fw-bold text-dark">
                                      STANDARD PACK
                                    </td>
                                    <td className="fw-bold text-success">
                                      100 DH
                                    </td>
                                    <td>
                                      <span className="pill-badge pill-blue">
                                        Successful
                                      </span>
                                    </td>
                                    <td className="small text-muted">
                                      4/30/2026
                                    </td>
                                  </tr>
                                  <tr>
                                    <td className="fw-bold text-dark">
                                      CV Viewing Add-on
                                    </td>
                                    <td className="fw-bold text-success">
                                      20 DH
                                    </td>
                                    <td>
                                      <span className="pill-badge pill-blue">
                                        Successful
                                      </span>
                                    </td>
                                    <td className="small text-muted">
                                      3/27/2026
                                    </td>
                                  </tr>
                                  <tr>
                                    <td className="fw-bold text-dark">
                                      Job Posting Add-on
                                    </td>
                                    <td className="fw-bold text-success">
                                      10 DH
                                    </td>
                                    <td>
                                      <span className="pill-badge pill-blue">
                                        Successful
                                      </span>
                                    </td>
                                    <td className="small text-muted">
                                      3/27/2026
                                    </td>
                                  </tr>
                                  <tr>
                                    <td className="fw-bold text-dark">
                                      Job Posting Add-on
                                    </td>
                                    <td className="fw-bold text-success">
                                      10 DH
                                    </td>
                                    <td>
                                      <span className="pill-badge pill-blue">
                                        Successful
                                      </span>
                                    </td>
                                    <td className="small text-muted">
                                      3/27/2026
                                    </td>
                                  </tr>
                                  <tr>
                                    <td className="fw-bold text-dark">
                                      STANDARD PACK
                                    </td>
                                    <td className="fw-bold text-success">
                                      100 DH
                                    </td>
                                    <td>
                                      <span className="pill-badge pill-blue">
                                        Successful
                                      </span>
                                    </td>
                                    <td className="small text-muted">
                                      3/27/2026
                                    </td>
                                  </tr>
                                </tbody>
                              </table>
                            </div>
                          </div>
                          {totalPages > 1 && (
                            <div className="paginations mb-30">
                              <ul>
                                <li>
                                  <a
                                    href="#"
                                    onClick={(e) => {
                                      e.preventDefault();
                                      if (currentPage > 1)
                                        handlePageChange(currentPage - 1);
                                    }}
                                  >
                                    <i className="fa-solid fa-angle-left" />
                                  </a>
                                </li>
                                {Array.from({ length: totalPages }, (_, i) => (
                                  <li key={i + 1}>
                                    <a
                                      href="#"
                                      className={
                                        currentPage === i + 1 ? "active" : ""
                                      }
                                      onClick={(e) => {
                                        e.preventDefault();
                                        handlePageChange(i + 1);
                                      }}
                                    >
                                      {i + 1}
                                    </a>
                                  </li>
                                ))}
                                <li>
                                  <a
                                    href="#"
                                    onClick={(e) => {
                                      e.preventDefault();
                                      if (currentPage < totalPages)
                                        handlePageChange(currentPage + 1);
                                    }}
                                  >
                                    <i className="fa-solid fa-angle-right" />
                                  </a>
                                </li>
                              </ul>
                            </div>
                          )}
                        </>
                      )}

                      {walletTab === "manual" && (
                        <>
                          <div className="premium-card">
                            <div className="table-responsive-premium">
                              <div className="card-header-premium border-0">
                                <h5 className="mb-0 fw-bold">
                                  Manual Add-ons History
                                </h5>
                              </div>
                              <table className="table-premium">
                                <thead>
                                  <tr>
                                    <th>Ref ID</th>
                                    <th>Added Jobs</th>
                                    <th>Added CVs</th>
                                    <th>State</th>
                                    <th>Assigned Date</th>
                                  </tr>
                                </thead>
                                <tbody>
                                  <tr>
                                    <td className="small font-monospace">
                                      3F232FFA
                                    </td>
                                    <td className="text-primary fw-bold">+5</td>
                                    <td className="text-orange-premium fw-bold">
                                      +0
                                    </td>
                                    <td>
                                      <span className="status-pill approved">
                                        Active
                                      </span>
                                    </td>
                                    <td className="small text-muted">
                                      3/27/2026
                                    </td>
                                  </tr>
                                  <tr>
                                    <td className="small font-monospace">
                                      5FC0F453
                                    </td>
                                    <td className="text-primary fw-bold">+5</td>
                                    <td className="text-orange-premium fw-bold">
                                      +0
                                    </td>
                                    <td>
                                      <span className="status-pill approved">
                                        Active
                                      </span>
                                    </td>
                                    <td className="small text-muted">
                                      3/27/2026
                                    </td>
                                  </tr>
                                  <tr>
                                    <td className="small font-monospace">
                                      F29DF2D0
                                    </td>
                                    <td className="text-primary fw-bold">+0</td>
                                    <td className="text-orange-premium fw-bold">
                                      +50
                                    </td>
                                    <td>
                                      <span className="status-pill approved">
                                        Active
                                      </span>
                                    </td>
                                    <td className="small text-muted">
                                      3/27/2026
                                    </td>
                                  </tr>
                                </tbody>
                              </table>
                            </div>
                          </div>
                          {manualRequestTotalPages > 1 && (
                            <div className="paginations mb-30">
                              <ul>
                                <li>
                                  <a
                                    href="#"
                                    onClick={(e) => {
                                      e.preventDefault();
                                      if (requestPage > 1)
                                        handleRequestPageChange(
                                          requestPage - 1,
                                        );
                                    }}
                                  >
                                    <i className="fa-solid fa-angle-left" />
                                  </a>
                                </li>
                                {Array.from(
                                  { length: manualRequestTotalPages },
                                  (_, i) => (
                                    <li key={i + 1}>
                                      <a
                                        href="#"
                                        className={
                                          requestPage === i + 1 ? "active" : ""
                                        }
                                        onClick={(e) => {
                                          e.preventDefault();
                                          handleRequestPageChange(i + 1);
                                        }}
                                      >
                                        {i + 1}
                                      </a>
                                    </li>
                                  ),
                                )}
                                <li>
                                  <a
                                    href="#"
                                    onClick={(e) => {
                                      e.preventDefault();
                                      if (requestPage < manualRequestTotalPages)
                                        handleRequestPageChange(
                                          requestPage + 1,
                                        );
                                    }}
                                  >
                                    <i className="fa-solid fa-angle-right" />
                                  </a>
                                </li>
                              </ul>
                            </div>
                          )}
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}
          {/* Your Job Posts Info */}
          <div className="copy-right-area bg-f0f4fc">
            <div className="row">
              <div className="col-lg-6 col-md-6">
                <div className="copyright-left-content">
                  <p>
                    {" "}
                    <span className="copy">Â© </span>
                    <span id="year" />
                    <span className="template-name"> Connect Work.ma </span> All
                    Rights Reserved
                  </p>
                </div>
              </div>
              <div className="col-lg-6 col-md-6">
                <div className="copyright-right-content">
                  <p>
                    Designed By{" "}
                    <a href="https://hibootstrap.com/" target="_blank">
                      Webnmobapps Solution Pvt. Ltd
                    </a>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {showTopUpModal && (
        <div
          className="custom-modal-overlay"
          onClick={() => closeTopUpModal()}
        >
          <div
            className="custom-modal-content topup-modal-content"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="modal-header-premium">
              <h4 className="fw-bold mb-0">Select a Top-up Pack</h4>
              <button
                type="button"
                className="btn-close-custom"
                onClick={() => closeTopUpModal()}
              >
                <i className="fa-solid fa-xmark" />
              </button>
            </div>
            <div className="modal-body-premium p-4">
              <div className="row g-3 justify-content-center">
                <div className="col-lg-4 col-md-6 d-flex">
                  <div className="addon-selection-card w-100">
                    <div className="d-flex justify-content-between align-items-start mb-3">
                      <div className="addon-icon">
                        <i className="fa-solid fa-briefcase" />
                      </div>
                      <div className="addon-price">
                        10 <span className="small">MAD</span>
                      </div>
                    </div>
                    <h6 className="fw-bold text-dark mb-2">
                      Job Posting Add-on
                    </h6>
                    <div className="addon-details mb-4">
                      <div className="d-flex justify-content-between small mb-1">
                        <span className="text-muted">Job Credits:</span>
                        <span className="fw-bold">+5</span>
                      </div>
                      <div className="d-flex justify-content-between small">
                        <span className="text-muted">Mode:</span>
                        <span className="badge bg-light text-dark">Manual</span>
                      </div>
                    </div>
                    <button
                      type="button"
                      className="btn-select-addon w-100 d-flex align-items-center justify-content-center"
                    >
                      Manuel Request
                    </button>
                  </div>
                </div>
                <div className="col-lg-4 col-md-6 d-flex">
                  <div className="addon-selection-card w-100">
                    <div className="d-flex justify-content-between align-items-start mb-3">
                      <div className="addon-icon">
                        <i className="fa-solid fa-user-tie" />
                      </div>
                      <div className="addon-price">
                        20 <span className="small">MAD</span>
                      </div>
                    </div>
                    <h6 className="fw-bold text-dark mb-2">
                      CV Viewing Add-on
                    </h6>
                    <div className="addon-details mb-4">
                      <div className="d-flex justify-content-between small mb-1">
                        <span className="text-muted">CV Credits:</span>
                        <span className="fw-bold">+50</span>
                      </div>
                      <div className="d-flex justify-content-between small">
                        <span className="text-muted">Mode:</span>
                        <span className="badge bg-light text-dark">Manual</span>
                      </div>
                    </div>
                    <button
                      type="button"
                      className="btn-select-addon w-100 d-flex align-items-center justify-content-center"
                    >
                      Manuel Request
                    </button>
                  </div>
                </div>
                <div className="col-lg-4 col-md-6 d-flex">
                  <div className="addon-selection-card w-100">
                    <div className="d-flex justify-content-between align-items-start mb-3">
                      <div className="addon-icon">
                        <i className="fa-solid fa-layer-group" />
                      </div>
                      <div className="addon-price">
                        5000 <span className="small">MAD</span>
                      </div>
                    </div>
                    <h6 className="fw-bold text-dark mb-2">job and profile</h6>
                    <div className="addon-details mb-4">
                      <div className="d-flex justify-content-between small mb-1">
                        <span className="text-muted">Job Credits:</span>
                        <span className="fw-bold">+100</span>
                      </div>
                      <div className="d-flex justify-content-between small mb-1">
                        <span className="text-muted">CV Credits:</span>
                        <span className="fw-bold">+200</span>
                      </div>
                      <div className="d-flex justify-content-between small">
                        <span className="text-muted">Mode:</span>
                        <span className="badge bg-light text-dark">Online</span>
                      </div>
                    </div>
                    <button
                      type="button"
                      className="btn-select-addon w-100 d-flex align-items-center justify-content-center"
                      onClick={() =>
                        openPaymentModal({
                          name: "job and profile",
                          price: "5000",
                          currency: "MAD",
                          jobCredits: 100,
                          cvCredits: 200,
                        })
                      }
                    >
                      Buy
                    </button>
                  </div>
                </div>
              </div>
              <div className="mt-4 pt-4 border-top text-center">
                <p className="text-muted small mb-3">
                  Need a specific amount of credits?
                </p>
                <button
                  type="button"
                  className="btn-custom-trigger"
                  onClick={() => setShowCustomCreditModal(true)}
                >
                  <i className="fa-solid fa-wand-magic-sparkles me-2" /> Request
                  Custom Credit
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      {showUpgradePlanModal && (
        <div
          className="custom-modal-overlay"
          onClick={() => closeUpgradePlanModal()}
        >
          <div
            className="custom-modal-content packs-modal-content"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="modal-header-creative text-center p-5 pb-4">
              <div>
                <h3 className="mb-1 fw-800">Elevate Your Hiring Power</h3>
                <p className="text-muted small mb-0">
                  Choose a professional plan designed for modern recruitment
                  excellence
                </p>
              </div>
              <button
                type="button"
                className="btn-close-creative"
                onClick={() => closeUpgradePlanModal()}
              >
                <i className="fa-solid fa-xmark" />
              </button>
            </div>
            <div className="modal-body p-0">
              <div className="p-4 p-lg-5">
                {plansLoading ? (
                  <div className="text-center py-5">
                    <div
                      className="spinner-border text-primary mb-3"
                      role="status"
                    />
                    <p className="text-muted mb-0">Loading plans...</p>
                  </div>
                ) : availablePlans.length === 0 ? (
                  <div className="text-center py-5 text-muted">
                    No active plans available
                  </div>
                ) : (
                  <div className="row g-4 justify-content-center">
                    {availablePlans.map((plan, index) => {
                      const isEnterprise = plan.isCustom === true;
                      const isProCard =
                        isEnterprise || index === availablePlans.length - 1;
                      const manual =
                        isManualPlan(plan) || !hasActiveGateway;

                      return (
                        <div className="col-lg-4 col-md-6" key={plan._id}>
                          <div
                            className={`refined-pack-card h-100 d-flex flex-column ${isProCard ? "refined-pro-pack" : ""}`}
                          >
                            {isEnterprise && (
                              <div className="refined-badge">
                                Entreprise Elite
                              </div>
                            )}
                            <div className="refined-card-top">
                              <h4 className="refined-name">{plan.packName}</h4>
                              <div className="refined-price">
                                <span className="refined-curr">
                                  {plan.currency || "MAD"}
                                </span>
                                <span className="refined-val">
                                  {plan.amount ?? "Custom"}
                                </span>
                                <span className="refined-period">
                                  {getPlanPeriod(plan)}
                                </span>
                              </div>
                            </div>
                            <div className="refined-features-list flex-grow-1">
                              {showPlanValue(plan.jobPostingCredits) && (
                                <div className="refined-feature-item">
                                  <i className="fa-solid fa-check" />
                                  <div className="refined-feature-info">
                                    <span className="refined-feature-label">
                                      Job Postings
                                    </span>
                                    <span className="refined-feature-count">
                                      {renderCreditAmount(
                                        plan.jobPostingCredits,
                                      )}
                                    </span>
                                  </div>
                                </div>
                              )}
                              {showPlanValue(plan.profileViewingCredits) && (
                                <div className="refined-feature-item">
                                  <i className="fa-solid fa-check" />
                                  <div className="refined-feature-info">
                                    <span className="refined-feature-label">
                                      CV Unlocks
                                    </span>
                                    <span className="refined-feature-count">
                                      {renderCreditAmount(
                                        plan.profileViewingCredits,
                                      )}
                                    </span>
                                  </div>
                                </div>
                              )}
                              {showPlanValue(plan.dailyJobPostingLimit) && (
                                <div className="refined-feature-item border-top pt-3 mt-1">
                                  <i className="fa-solid fa-clock-rotate-left" />
                                  <div className="refined-feature-info">
                                    <span className="refined-feature-label">
                                      Daily Posting Limit
                                    </span>
                                    <span className="refined-feature-count">
                                      {renderCreditAmount(
                                        plan.dailyJobPostingLimit,
                                      )}
                                    </span>
                                  </div>
                                </div>
                              )}
                              {showPlanValue(plan.dailyProfileViewingLimit) && (
                                <div className="refined-feature-item">
                                  <i className="fa-solid fa-eye" />
                                  <div className="refined-feature-info">
                                    <span className="refined-feature-label">
                                      Daily CV Limit
                                    </span>
                                    <span className="refined-feature-count">
                                      {renderCreditAmount(
                                        plan.dailyProfileViewingLimit,
                                      )}
                                    </span>
                                  </div>
                                </div>
                              )}
                            </div>
                            <div className="refined-card-bottom mt-auto">
                              <button
                                type="button"
                                className={`refined-action-btn ${isProCard ? "refined-btn-pro" : ""}`}
                                onClick={() =>
                                  manual
                                    ? openContactModal(plan)
                                    : handlePlanBuy(plan)
                                }
                              >
                                {manual ? "Contact Us" : "Buy Now"}
                              </button>
                              <p className="refined-terms mt-3 text-center">
                                No hidden fees. Full access included.
                              </p>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
      {showContactModal && (
        <div
          className="custom-modal-overlay"
          onClick={() => closeContactModal()}
        >
          <div
            className="custom-modal-content packs-modal-content"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="modal-header-creative text-center p-5 pb-4">
              <div>
                <h3 className="mb-1 fw-800">
                  Contact: {selectedContactPlan}
                </h3>
                <p className="text-muted small mb-0">
                  Our specialized sales team is ready to tailor this plan for
                  your specific enterprise needs
                </p>
              </div>
              <button
                type="button"
                className="btn-close-creative"
                onClick={() => closeContactModal()}
              >
                <i className="fa-solid fa-arrow-left" />
              </button>
            </div>
            <div className="modal-body p-0">
              <div className="contact-form-v2-container">
                <div className="company-header-v2">
                  <div className="company-logo-v2">
                    <img
                      crossOrigin="anonymous"
                      alt="Company Logo"
                      className="logo-img-v2"
                      src={getCompanyLogoUrl()}
                    />
                  </div>
                  <div className="text-center mt-3">
                    <h2 className="text-dark fw-800 mb-1">
                      {companyProfile?.brandName || "Company Name"}
                    </h2>
                    <p className="text-muted small mb-0">
                      <i className="fa-solid fa-envelope me-2" />
                      {localStorage.getItem("user_email") || ""}
                    </p>
                  </div>
                </div>
                <div className="p-4 p-lg-5 pt-0">
                  <div
                    className="mx-auto"
                    style={{ maxWidth: "600px", width: "100%" }}
                  >
                    <div className="form-group mb-4">
                      <label className="filter-label text-dark">
                        Your Message
                      </label>
                      <textarea
                        className="form-control premium-textarea"
                        rows={5}
                        placeholder={`I am interested in the ${selectedContactPlan}. Please contact me to discuss details...`}
                        value={contactMessage}
                        onChange={(e) => setContactMessage(e.target.value)}
                      />
                    </div>
                    <div className="d-flex gap-4">
                      <button
                        type="button"
                        className="refined-secondary-btn w-100"
                        onClick={() => closeContactModal()}
                      >
                        Back to Plans
                      </button>
                      <button
                        type="button"
                        className="refined-primary-btn w-100 d-flex align-items-center justify-content-center"
                        onClick={handleContactPlanSubmit}
                        disabled={planActionLoading}
                      >
                        {planActionLoading ? "Sending..." : "Send Inquiry"}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      {showPaymentModal && selectedTopUpPack && (
        <div
          className="custom-modal-overlay"
          onClick={() => closePaymentModal()}
        >
          <div
            className="custom-modal-content topup-modal-content"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="modal-header-premium">
              <h4 className="fw-bold mb-0">Select Payment Method</h4>
              <button
                type="button"
                className="btn-close-custom"
                onClick={() => closePaymentModal()}
              >
                <i className="fa-solid fa-xmark" />
              </button>
            </div>
            <div className="modal-body-premium p-4">
              <div className="payment-gateway-selection">
                <div className="selected-plan-summary mb-4">
                  <span className="small text-muted d-block">Purchasing:</span>
                  <span className="fw-bold text-dark fs-5">
                    {selectedTopUpPack.name}
                  </span>
                  <span className="badge bg-primary-subtle text-primary ms-2">
                    {selectedTopUpPack.price} {selectedTopUpPack.currency}
                  </span>
                </div>
                <div className="row g-3">
                  <div className="col-md-6">
                    <div
                      className="gateway-card"
                      role="button"
                      tabIndex={0}
                      onClick={() => handleSelectPayment("paypal")}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" || e.key === " ") {
                          e.preventDefault();
                          handleSelectPayment("paypal");
                        }
                      }}
                    >
                      <div className="gateway-logo">
                        <i className="fa-brands fa-paypal fs-2 text-primary" />
                      </div>
                      <span className="fw-bold text-dark text-uppercase">
                        paypal
                      </span>
                      <i className="fa-solid fa-chevron-right ms-auto text-muted small" />
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div
                      className="gateway-card"
                      role="button"
                      tabIndex={0}
                      onClick={() => handleSelectPayment("cmi")}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" || e.key === " ") {
                          e.preventDefault();
                          handleSelectPayment("cmi");
                        }
                      }}
                    >
                      <div className="gateway-logo">
                        <i className="fa-solid fa-credit-card fs-2 text-success" />
                      </div>
                      <span className="fw-bold text-dark text-uppercase">
                        cmi
                      </span>
                      <i className="fa-solid fa-chevron-right ms-auto text-muted small" />
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div
                      className="gateway-card"
                      role="button"
                      tabIndex={0}
                      onClick={() => handleSelectPayment("stripe")}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" || e.key === " ") {
                          e.preventDefault();
                          handleSelectPayment("stripe");
                        }
                      }}
                    >
                      <div className="gateway-logo">
                        <i className="fa-brands fa-stripe fs-2 text-primary" />
                      </div>
                      <span className="fw-bold text-dark text-uppercase">
                        stripe
                      </span>
                      <i className="fa-solid fa-chevron-right ms-auto text-muted small" />
                    </div>
                  </div>
                </div>
                <div className="mt-5">
                  <button
                    type="button"
                    className="btn-cancel-custom w-100"
                    onClick={() => closePaymentModal()}
                  >
                    Back to Packs
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      {showCustomCreditModal && (
        <div
          className="custom-modal-overlay"
          onClick={() => closeCustomCreditModal()}
        >
          <div
            className="custom-modal-content topup-modal-content"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="modal-header-premium">
              <h4 className="fw-bold mb-0">Request Custom Credits</h4>
              <button
                type="button"
                className="btn-close-custom"
                onClick={() => closeCustomCreditModal()}
              >
                <i className="fa-solid fa-xmark" />
              </button>
            </div>
            <div className="modal-body-premium p-4">
              <div className="custom-request-form">
                <div className="mb-4">
                  <label className="form-label-premium">Credit Type</label>
                  <select
                    className="form-select-premium"
                    value={customCreditType}
                    onChange={(e) => setCustomCreditType(e.target.value)}
                  >
                    <option value="CV">CV Credit Only</option>
                    <option value="JOB">Job Posting Credit Only</option>
                    <option value="BOTH">Both (CV Credit, Job Posting)</option>
                  </select>
                </div>
                <div className="row g-3 mb-4">
                  {(customCreditType === "JOB" || customCreditType === "BOTH") && (
                    <div className="col-md-6">
                      <label className="form-label-premium">
                        Job Posting Credits
                      </label>
                      <input
                        className="form-control-premium"
                        placeholder="Enter amount"
                        type="number"
                        min="0"
                        value={customJobCredits}
                        onChange={(e) => setCustomJobCredits(e.target.value)}
                      />
                    </div>
                  )}
                  {(customCreditType === "CV" || customCreditType === "BOTH") && (
                    <div className="col-md-6">
                      <label className="form-label-premium">
                        CV Viewing Credits
                      </label>
                      <input
                        className="form-control-premium"
                        placeholder="Enter amount"
                        type="number"
                        min="0"
                        value={customCvCredits}
                        onChange={(e) => setCustomCvCredits(e.target.value)}
                      />
                    </div>
                  )}
                </div>
                <div className="d-flex gap-3 mt-5">
                  <button
                    type="button"
                    className="btn-cancel-custom w-100"
                    onClick={() => closeCustomCreditModal()}
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    className="btn-submit-custom w-100"
                    onClick={handleCustomCreditSubmit}
                    disabled={customCreditLoading}
                  >
                    {customCreditLoading ? "Submitting..." : "Submit Request"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      {/* <!-- End Main Dashboard Content Wrapper Area --> */}
    </>
  );
};

export default EmployerWallet;
