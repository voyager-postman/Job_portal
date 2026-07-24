import React, { useEffect, useRef, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { API_BASE_URL, API_IMAGE_URL } from "../Url/Url";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";
import "./EmployerWallet.css";
import { getRequestConfig } from "../utils/apiHeaders";
import {
  formatCreditAmount,
  getPackDaysLeft,
  getPackExpiryDate,
  hasNoPackExpiry,
  hasUnlimitedCredits,
  isCreditValueUnlimited,
} from "../utils/packCreditDisplay";
import {
  formatFeaturedLocationLabels,
  formatSearchBoostLabel,
  getActiveFeaturedJobsCount,
  getFeaturedJobsUsedCount,
  hasFeaturedJobsFeature,
  isCompanyProfileHighlightEnabled,
  normalizePackFeaturedInfo,
} from "../utils/featuredJobDisplay";

const DEFAULT_COMPANY_LOGO =
  "/jobPortal/assets/images/dashboard/images1.png";

const EmployerWallet = () => {
  const { t, i18n } = useTranslation("global");
  const navigate = useNavigate();
  const location = useLocation();
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
  const [walletData, setWalletData] = useState(null);
  const [transactionRows, setTransactionRows] = useState([]);
  const [manualRequestRows, setManualRequestRows] = useState([]);
  const [rechargeRequests, setRechargeRequests] = useState([]);
  const [rechargeFromDate, setRechargeFromDate] = useState("");
  const [rechargeToDate, setRechargeToDate] = useState("");
  const [rechargeStatus, setRechargeStatus] = useState("all");
  const [rechargeStatusOpen, setRechargeStatusOpen] = useState(false);
  const rechargeStatusRef = useRef(null);
  const [walletTab, setWalletTab] = useState("transactions");
  const [showTopUpModal, setShowTopUpModal] = useState(false);
  const [showRestrictedAccessModal, setShowRestrictedAccessModal] =
    useState(false);
  const [showPackErrorModal, setShowPackErrorModal] = useState(false);
  const [packErrorMessage, setPackErrorMessage] = useState("");
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
  const [addOnPlans, setAddOnPlans] = useState([]);
  const [canPurchaseAddOns, setCanPurchaseAddOns] = useState(true);
  const [addOnPurchaseBlockedReason, setAddOnPurchaseBlockedReason] =
    useState("");
  const [addOnsLoading, setAddOnsLoading] = useState(false);
  const [plansLoading, setPlansLoading] = useState(false);
  const [selectedPlanForContact, setSelectedPlanForContact] = useState(null);
  const [manualAddOnLoading, setManualAddOnLoading] = useState(false);
  const [showManualSuccessModal, setShowManualSuccessModal] = useState(false);
  const [manualSuccessMessage, setManualSuccessMessage] = useState("");
  const [hasActiveGateway, setHasActiveGateway] = useState(false);
  const [contactMessage, setContactMessage] = useState("");
  const [contactPlanError, setContactPlanError] = useState("");
  const [companyProfile, setCompanyProfile] = useState(null);
  const [loadingPlanId, setLoadingPlanId] = useState(null);
  const [contactSubmitLoading, setContactSubmitLoading] = useState(false);
  const [selectingPayment, setSelectingPayment] = useState(false);
  const walletRefreshHandledRef = useRef(null);

  const fetchcreditStatus = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}credit-status`, getRequestConfig());
      setCredits(response.data.data);
    } catch (error) {
      console.error(error);
    }
  };
  const fetchEmployerWallet = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}employer-wallet`, getRequestConfig());

      if (res.data.success) {
        setWalletData(res.data);
        setTransactionRows(res.data.sections?.transactionHistory?.rows || []);
        setRechargeRequests(res.data.sections?.rechargeTrack?.rows || []);
        setPaymentsHistory(res.data.sections?.recentPayments?.rows || []);
        setManualRequestRows(res.data.sections?.manualRequests?.rows || []);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const refreshWalletData = async () => {
    await Promise.all([
      fetchEmployerWallet(),
      fetchcreditStatus(),
      fetchActiveAddOns(),
      fetchCompanyProfile(),
    ]);
  };

  const peekWalletRefreshFlag = () => {
    try {
      const raw = sessionStorage.getItem("employerWalletRefresh");
      if (!raw) return null;
      return JSON.parse(raw);
    } catch {
      return null;
    }
  };

  const clearWalletRefreshFlag = () => {
    try {
      sessionStorage.removeItem("employerWalletRefresh");
    } catch {
      // ignore
    }
  };

  const fetchRechargeTrack = async (
    fromDate = rechargeFromDate,
    toDate = rechargeToDate,
    status = rechargeStatus,
  ) => {
    try {
      const token = localStorage.getItem("token");
      const params = new URLSearchParams();
      if (fromDate) params.append("fromDate", fromDate);
      if (toDate) params.append("toDate", toDate);
      if (status && status !== "all") params.append("status", status);

      const query = params.toString();
      const res = await axios.get(
        `${API_BASE_URL}recharge-track${query ? `?${query}` : ""}`,
        getRequestConfig(),
      );
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
        getRequestConfig(),
      );

      if (response.data.success && response.data.company) {
        setCompanyProfile(response.data.company);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const showPackProcessError = (message) => {
    setPackErrorMessage(
      message ||
      "You already have an active pack. Cannot purchase another one.",
    );
    setShowUpgradePlanModal(false);
    closeContactModal();
    closeTopUpModal();
    setShowPackErrorModal(true);
  };

  useEffect(() => {
    if (location.state?.packError) {
      showPackProcessError(location.state.packError);
      navigate(location.pathname, { replace: true, state: {} });
      return;
    }

    const reopenPayment = location.state?.reopenCheckoutPayment;
    const refreshFromState =
      location.state?.walletRefresh ||
      location.state?.purchaseSuccessMessage ||
      location.state?.purchaseSuccess;
    const refreshFlag = peekWalletRefreshFlag();
    const shouldRefresh = Boolean(refreshFromState || refreshFlag);

    if (!shouldRefresh && !reopenPayment) return;

    const successMessage =
      (typeof location.state?.purchaseSuccessMessage === "string" &&
        location.state.purchaseSuccessMessage) ||
      (typeof location.state?.purchaseSuccess === "string" &&
        location.state.purchaseSuccess) ||
      refreshFlag?.message ||
      "";

    const handleKey = `${location.key || ""}|${successMessage}|${reopenPayment?.pack?.id || ""}`;

    if (walletRefreshHandledRef.current === handleKey) {
      clearWalletRefreshFlag();
      navigate(location.pathname, { replace: true, state: {} });
      return;
    }
    walletRefreshHandledRef.current = handleKey;

    let cancelled = false;

    const run = async () => {
      if (shouldRefresh) {
        await refreshWalletData();
        clearWalletRefreshFlag();
        if (!cancelled && successMessage) {
          toast.success(successMessage);
        }
      }

      if (!cancelled && reopenPayment?.pack) {
        setSelectedTopUpPack({
          id: reopenPayment.pack.id,
          name: reopenPayment.pack.name,
          price: reopenPayment.pack.price,
          currency: reopenPayment.pack.currency || "MAD",
          purchaseType: reopenPayment.purchaseType || "pack",
        });
        setShowPaymentModal(true);
      }

      if (!cancelled) {
        navigate(location.pathname, { replace: true, state: {} });
      }
    };

    run();

    return () => {
      cancelled = true;
    };
  }, [location.state, location.pathname, location.key, navigate]);

  useEffect(() => {
    const loadWallet = async () => {
      setLoading(true);
      await Promise.all([
        fetchEmployerWallet(),
        fetchcreditStatus(),
        fetchActiveGateways(),
        fetchCompanyProfile(),
        fetchActiveAddOns(),
      ]);
      setLoading(false);
    };
    loadWallet();
  }, []);

  const fetchAvailablePlans = async () => {
    try {
      setPlansLoading(true);
      const token = localStorage.getItem("token");
      const res = await axios.get(`${API_BASE_URL}active/packs`, getRequestConfig());
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
      const res = await axios.get(`${API_BASE_URL}getActivePaymentGateways`, getRequestConfig());
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

  const fetchActiveAddOns = async () => {
    try {
      setAddOnsLoading(true);
      const token = localStorage.getItem("token");
      const res = await axios.get(`${API_BASE_URL}get/ActiveAddOns`, getRequestConfig());
      if (res.data.success) {
        setCanPurchaseAddOns(res.data.canPurchaseAddOns !== false);
        setAddOnPurchaseBlockedReason(
          res.data.addOnPurchaseBlockedReason || "",
        );
        setAddOnPlans(res.data.data || []);
      }
    } catch (error) {
      console.error("Failed to fetch add-ons", error);
    } finally {
      setAddOnsLoading(false);
    }
  };

  useEffect(() => {
    if (showTopUpModal) {
      fetchActiveAddOns();
      fetchCompanyProfile();
    }
  }, [showTopUpModal]);

  const RECHARGE_STATUS_OPTIONS = [
    { value: "all", label: "All Requests" },
    { value: "pending", label: "Pending" },
    { value: "approved", label: "Approved" },
    { value: "rejected", label: "Rejected" },
  ];

  const rechargeStatusLabel =
    RECHARGE_STATUS_OPTIONS.find((o) => o.value === rechargeStatus)?.label ||
    "All Requests";

  const applyRechargeFilter = (fromDate, toDate, status) => {
    if (status === "all" && !fromDate && !toDate) {
      setRechargeRequests(walletData?.sections?.rechargeTrack?.rows || []);
      return;
    }
    fetchRechargeTrack(fromDate, toDate, status);
  };

  const handleRechargeStatusChange = (status) => {
    setRechargeStatus(status);
    setRechargeStatusOpen(false);
    applyRechargeFilter(rechargeFromDate, rechargeToDate, status);
  };

  const resetRechargeFilter = () => {
    setRechargeFromDate("");
    setRechargeToDate("");
    setRechargeStatus("all");
    setRechargeStatusOpen(false);
    setRechargeRequests(walletData?.sections?.rechargeTrack?.rows || []);
  };

  const getRechargeStatusClass = (status = "") => {
    const text = String(status).toLowerCase();
    if (text.includes("rejected")) return "rejected";
    if (
      text.includes("validated") ||
      text.includes("credits added") ||
      text.includes("approved")
    ) {
      return "approved";
    }
    return "pending";
  };

  const formatRechargeCredit = (value) => {
    if (value === undefined || value === null || value === "") return "+0";
    const text = String(value);
    if (text.startsWith("+") || text.startsWith("-")) return text;
    return `+${text}`;
  };

  const formatRechargeDate = (value) => value || "N/A";

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        rechargeStatusRef.current &&
        !rechargeStatusRef.current.contains(event.target)
      ) {
        setRechargeStatusOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (walletTab !== "recharge") {
      setRechargeStatusOpen(false);
    }
  }, [walletTab]);
  const JobListLoader = () => (
    <div className="text-center py-5">
      <div className="spinner-border text-primary mb-3" role="status" />
      <p> {t("header.Loading_User_Wallet_please_wait")}</p>
    </div>
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

  const getPackStartDate = (pack, fallbackPlan = null) =>
    pack?.startedAt ||
    pack?.startDate ||
    pack?.createdAt ||
    fallbackPlan?.startedAt ||
    fallbackPlan?.startDate ||
    null;

  const getPackEndDate = (pack, fallbackPlan = null) =>
    getPackExpiryDate(pack, fallbackPlan);

  const isUnlimitedValue = isCreditValueUnlimited;

  const calcCreditProgress = (remaining, total) => {
    // Unlimited credits → full bar
    if (isUnlimitedValue(total) || isUnlimitedValue(remaining)) return 100;

    const totalNum = Number(total);
    const remainingNum = Number(remaining);

    // No credits purchased / invalid total → empty bar
    if (!Number.isFinite(totalNum) || totalNum <= 0) return 0;
    if (!Number.isFinite(remainingNum) || remainingNum <= 0) return 0;

    return Math.min(100, Math.max(0, Math.round((remainingNum / totalNum) * 100)));
  };

  const calcUsageProgress = (used, limit) => {
    if (isUnlimitedValue(limit) || !limit) return 0;
    return Math.min(100, Math.round((used / limit) * 100));
  };

  const {
    hasWelcomePack,
    hasPurchasedPack,
    welcomePack,
    purchasedPack,
    remainingUsage,
    remainingToday,
  } = credits || {};

  const fmtCredit = (n) => formatCreditAmount(n);
  const fmtKpiCredit = (n) => formatCreditAmount(n, { compact: true });

  const formatTodayUsageText = (text) => {
    if (text == null) return text;
    if (typeof text !== "string") return formatTodayUsageText(String(text));
    const parts = text.split("/");
    if (parts.length < 2) return text;
    const usedPart = parts[0].trim();
    const limitPart = parts.slice(1).join("/").trim();
    const formattedLimit =
      limitPart === "Unlimited" || limitPart === "∞" || isUnlimitedValue(limitPart)
        ? "∞"
        : limitPart;
    return `${usedPart} / ${formattedLimit}`;
  };
  const walletCreditSummary = walletData?.creditSummary;
  const walletCurrentPlan = walletData?.currentPlan;

  const jobRemainingNum =
    walletCreditSummary?.totalJobCreditsRemaining ??
    credits?.fullCredit?.jobCredits?.remaining ??
    0;
  const jobTotalNum =
    walletCreditSummary?.totalJobCreditsPurchased ??
    credits?.fullCredit?.jobCredits?.total ??
    0;
  const profileRemainingNum =
    walletCreditSummary?.totalCvCreditsRemaining ??
    credits?.fullCredit?.profileCredits?.remaining ??
    0;
  const profileTotalNum =
    walletCreditSummary?.totalCvCreditsPurchased ??
    credits?.fullCredit?.profileCredits?.total ??
    0;

  const jobRemaining = fmtCredit(jobRemainingNum);
  const jobTotal = fmtCredit(jobTotalNum);
  const profileRemaining = fmtCredit(profileRemainingNum);
  const profileTotal = fmtCredit(profileTotalNum);

  const activePack =
    hasPurchasedPack && purchasedPack
      ? purchasedPack
      : hasWelcomePack && !hasPurchasedPack
        ? welcomePack
        : null;

  const packFeaturedInfo = normalizePackFeaturedInfo(activePack);
  const showFeaturedJobsInBanner = hasFeaturedJobsFeature(packFeaturedInfo);
  const showCompanyProfileHighlightInBanner =
    isCompanyProfileHighlightEnabled(packFeaturedInfo);
  const featuredJobsUsedCount = getFeaturedJobsUsedCount(
    packFeaturedInfo.featuredJobsUsed,
  );
  const activeFeaturedJobsCount = getActiveFeaturedJobsCount(packFeaturedInfo);

  const currentPlanName =
    walletCurrentPlan?.packName || activePack?.packName || "No Active Plan";
  const dailyJobLimit = activePack?.dailyJobLimit ?? 0;
  const dailyProfileLimit = activePack?.dailyProfileLimit ?? 0;
  const jobsTodayText = formatTodayUsageText(
    remainingUsage?.jobsToday ??
    `${activePack?.jobUsedToday ?? 0} / ${isUnlimitedValue(dailyJobLimit) ? "∞" : dailyJobLimit}`,
  );
  const profilesTodayText = formatTodayUsageText(
    remainingUsage?.profilesToday ??
    `${activePack?.profileUsedToday ?? 0} / ${isUnlimitedValue(dailyProfileLimit) ? "∞" : dailyProfileLimit}`,
  );

  const parseTodayUsage = (text) => {
    if (!text || typeof text !== "string") return { used: 0, limit: 0 };
    const [usedPart, limitPart] = text.split("/").map((part) => part.trim());
    return {
      used: Number.parseInt(usedPart, 10) || 0,
      limit:
        limitPart === "Unlimited" ||
          limitPart === "∞" ||
          isUnlimitedValue(limitPart)
          ? -1
          : Number.parseInt(limitPart, 10) || 0,
    };
  };

  const jobsTodayUsage = parseTodayUsage(jobsTodayText);
  const profilesTodayUsage = parseTodayUsage(profilesTodayText);

  const renderTodayUsageDisplay = (usage) => (
    <>
      {usage.used} /{" "}
      {usage.limit === -1 ? (
        <i className="fa-solid fa-infinity" title="Unlimited" />
      ) : (
        usage.limit
      )}
    </>
  );

  // Always prefer the truly active pack. purchasedPack can still be a truthy
  // object when inactive (daysLeft: null), which wrongly shows "0 Days Left"
  // while a welcome pack with daysLeft is active.
  const planDisplayPack = activePack;
  const packHasNoExpiry = hasNoPackExpiry(planDisplayPack);
  const planDaysLeft = getPackDaysLeft(planDisplayPack);
  const planExpiresAt = packHasNoExpiry
    ? null
    : getPackEndDate(planDisplayPack, walletCurrentPlan) ||
      credits?.earliestExpiry ||
      null;

  // A pack is considered expired when the backend reports active === false or
  // expired === true on the *active* pack (welcome or purchased).
  const packForStatus = activePack;
  const isPackExpired =
    Boolean(packForStatus) &&
    (packForStatus?.active === false ||
      packForStatus?.expired === true ||
      walletCurrentPlan?.active === false);

  const hasActivePackForTopUp =
    !isPackExpired &&
    (walletCurrentPlan?.active === true || Boolean(activePack));

  const handleRequestCreditTopUp = () => {
    if (!showAddonCreditSection) return;
    if (!hasActivePackForTopUp) {
      setShowRestrictedAccessModal(true);
      return;
    }
    setShowTopUpModal(true);
  };

  const normalizeActiveAddOn = (item, index = 0) => ({
    id: item?._id || item?.id || item?.addOnId || `addon-${index}`,
    name: item?.name || item?.planName || item?.addOnName || "Add-on",
    totalJobCredits:
      item?.totalJobCredits ??
      item?.jobPostingCredits ??
      item?.jobs ??
      item?.jobCredits ??
      0,
    totalProfileCredits:
      item?.totalProfileCredits ??
      item?.profileViewingCredits ??
      item?.cvViews ??
      item?.profileCredits ??
      0,
    packStatus: item?.packStatus || "",
    // Add-ons expire together with the pack. Treat packStatus "Expired" as
    // inactive so expired add-on credits are never counted/used.
    isActive:
      item?.isActive !== false &&
      String(item?.packStatus || "").toLowerCase() !== "expired",
  });

  const manualCreditData = walletData?.manualCredit;

  const activeAddOns = (() => {
    const directList = [
      walletData?.activeAddOns,
      manualCreditData?.activeAddOns,
      manualCreditData?.items,
      manualCreditData?.rows,
      walletData?.sections?.manualCredit?.rows,
    ].find((list) => Array.isArray(list) && list.length > 0);

    if (directList?.length) {
      return directList
        .map((item, index) => normalizeActiveAddOn(item, index))
        .filter((item) => item.isActive);
    }

    return transactionRows
      .filter((item) => /addon/i.test(item?.type || ""))
      .map((item, index) =>
        normalizeActiveAddOn(
          {
            _id: item._id || item.id,
            planName: item.planName,
            jobs: item.jobs,
            cvViews: item.cvViews,
            packStatus: item.packStatus,
            isActive: item.isActive,
          },
          index,
        ),
      )
      .filter((item) => item.isActive);
  })();

  const addedJobsTotal =
    manualCreditData?.addedJobCredits ??
    manualCreditData?.addedJobs ??
    walletCreditSummary?.addOnJobCredits ??
    walletCreditSummary?.addonJobCreditsTotal ??
    activeAddOns.reduce((sum, item) => sum + (item.totalJobCredits || 0), 0);

  const addedCvsTotal =
    manualCreditData?.addedCvCredits ??
    manualCreditData?.addedCvs ??
    manualCreditData?.addedProfileCredits ??
    walletCreditSummary?.addOnCvCredits ??
    walletCreditSummary?.addonProfileCreditsTotal ??
    activeAddOns.reduce((sum, item) => sum + (item.totalProfileCredits || 0), 0);

  const activeAddOnCount =
    manualCreditData?.activeCount ??
    manualCreditData?.activeRechargeCount ??
    activeAddOns.length;

  const hasActiveAddOnCredits =
    activeAddOnCount > 0 || addedJobsTotal > 0 || addedCvsTotal > 0;

  const hasUnlimitedPlanCredits =
    hasUnlimitedCredits(purchasedPack || activePack) ||
    walletCurrentPlan?.isUnlimited === true;

  const showAddonCreditSection =
    !hasUnlimitedPlanCredits && canPurchaseAddOns;

  // Manual Requests tab should also be visible on unlimited packs (where the
  // add-on purchase/credit sections are otherwise hidden).
  const showManualRequestsTab =
    showAddonCreditSection || hasUnlimitedPlanCredits;

  useEffect(() => {
    if (!showManualRequestsTab && walletTab === "manual") {
      setWalletTab("transactions");
    }
  }, [showManualRequestsTab, walletTab]);

  // Pack-only totals for subscription display — exclude add-on credits.
  const subscriptionPackJobs =
    activePack?.jobCreditsTotal ??
    walletCurrentPlan?.jobCreditsTotal ??
    Math.max(
      0,
      (walletCreditSummary?.totalJobCreditsPurchased ?? 0) - (addedJobsTotal || 0),
    );
  const subscriptionPackCvs =
    activePack?.profileCreditsTotal ??
    walletCurrentPlan?.profileCreditsTotal ??
    Math.max(
      0,
      (walletCreditSummary?.totalCvCreditsPurchased ?? 0) - (addedCvsTotal || 0),
    );

  const activePackCards = walletCurrentPlan?.active
    ? [
      {
        id: "current",
        name: walletCurrentPlan.packName,
        totalJobs: fmtCredit(subscriptionPackJobs),
        totalCvs: fmtCredit(subscriptionPackCvs),
        dailyJobs: activePack?.dailyJobLimit,
        dailyCvs: activePack?.dailyProfileLimit,
        startedAt: getPackStartDate(activePack, walletCurrentPlan),
        expiresAt: getPackEndDate(activePack, walletCurrentPlan),
        cancelExpiry: activePack?.cancelExpiry === true,
      },
    ]
    : hasPurchasedPack && purchasedPack
      ? [
        {
          id: purchasedPack.companyPackId || "purchased",
          name: purchasedPack.packName,
          totalJobs: purchasedPack.jobCreditsTotal,
          totalCvs: purchasedPack.profileCreditsTotal,
          dailyJobs: purchasedPack.dailyJobLimit,
          dailyCvs: purchasedPack.dailyProfileLimit,
          startedAt: getPackStartDate(purchasedPack),
          expiresAt: getPackEndDate(purchasedPack),
          cancelExpiry: purchasedPack.cancelExpiry === true,
          isUnlimited: purchasedPack.isUnlimited === true,
        },
      ]
      : hasWelcomePack && welcomePack
        ? [
          {
            id: "welcome",
            name: "Welcome Pack",
            totalJobs: welcomePack.jobCreditsTotal,
            totalCvs: welcomePack.profileCreditsTotal,
            dailyJobs: welcomePack.dailyJobLimit,
            dailyCvs: welcomePack.dailyProfileLimit,
            startedAt: getPackStartDate(welcomePack),
            expiresAt: getPackEndDate(welcomePack),
            cancelExpiry: welcomePack.cancelExpiry === true,
          },
        ]
        : [];

  const currentManualRequests = manualRequestRows.slice(
    requestIndexFirst,
    requestIndexLast,
  );
  const manualRequestTotalPages = Math.ceil(
    manualRequestRows.length / requestRowsPerPage,
  );

  const getTransactionCredits = (item) => {
    if (item.jobs !== undefined || item.cvViews !== undefined) {
      return {
        jobs: item.jobs,
        profiles: item.cvViews,
        dailyJobs: item.dailyJobs,
        dailyCvs: item.dailyCv,
        isPack: item.type === "Pack",
        planName: item.planName,
        date: item.date,
        isCurrentPlan: item.isCurrentPlan,
        packStatus: item.packStatus || "",
      };
    }
    const isPack = item.paymentTransactionId?.planType === "Pack";
    return {
      jobs: isPack ? item.jobPostingCredits : (item.totalJobCredits ?? 0),
      profiles: isPack
        ? item.profileViewingCredits
        : (item.totalProfileCredits ?? 0),
      dailyJobs: isPack ? item.dailyJobPostingLimit : null,
      dailyCvs: isPack ? item.dailyProfileViewingLimit : null,
      isPack,
      planName: item.paymentTransactionId?.planName,
      date: item.createdAt || item.paymentTransactionId?.paymentDate,
      isCurrentPlan: false,
      packStatus: item.packStatus || "",
    };
  };

  const isWelcomePackOnly = Boolean(
    hasWelcomePack && welcomePack && !hasPurchasedPack,
  );

  const creditTransactions = transactionRows;

  const creditIndexLast = creditPage * creditRowsPerPage;
  const creditIndexFirst = creditIndexLast - creditRowsPerPage;

  const currentCreditTransactions = creditTransactions.slice(
    creditIndexFirst,
    creditIndexLast,
  );

  const creditTotalPages = Math.ceil(
    creditTransactions.length / creditRowsPerPage,
  );

  const showTransactionsTab = !isWelcomePackOnly;
  const showPaymentsTab =
    paymentsHistory.length > 0 || Boolean(hasPurchasedPack);
  const showRechargeTab =
    rechargeRequests.length > 0 ||
    manualRequestRows.length > 0 ||
    Boolean(hasPurchasedPack);
  const showWalletActivitySection =
    showTransactionsTab ||
    showRechargeTab ||
    showPaymentsTab ||
    showManualRequestsTab;

  useEffect(() => {
    if (walletTab === "transactions" && !showTransactionsTab) {
      if (showRechargeTab) setWalletTab("recharge");
      else if (showPaymentsTab) setWalletTab("payments");
      else if (showManualRequestsTab) setWalletTab("manual");
    }
    if (walletTab === "payments" && !showPaymentsTab) {
      setWalletTab(showTransactionsTab ? "transactions" : "manual");
    }
    if (walletTab === "recharge" && !showRechargeTab) {
      setWalletTab(showTransactionsTab ? "transactions" : "manual");
    }
  }, [
    walletTab,
    showTransactionsTab,
    showPaymentsTab,
    showRechargeTab,
    showManualRequestsTab,
  ]);

  const renderCreditAmount = (value, pack = null) => {
    if (pack?.isUnlimited === true) return "Unlimited";
    return formatCreditAmount(value);
  };

  const getPlanPeriod = (plan) =>
    plan?.validityUnit ? `/${plan.validityUnit}` : "/Plan";

  const isManualPlan = (plan) =>
    plan?.creditApprovalType === "Manual" || plan?.isCustom === true;

  const opensContactFlow = (plan) =>
    plan?.showButton === "Contact Us" ||
    plan?.canPurchaseOnline === false ||
    isManualPlan(plan) ||
    !hasActiveGateway;

  const isCurrentPlanButton = (plan) =>
    plan?.showButton === "Current Plan" || plan?.isCurrentPlan === true;

  const getPlanButtonLabel = (plan) => {
    if (isCurrentPlanButton(plan)) return "Current Plan";
    if (plan?.showButton) return plan.showButton;
    if (opensContactFlow(plan)) return "Contact Us";
    return "Buy Now";
  };

  const showPlanValue = (value) =>
    value !== undefined &&
    value !== null &&
    (value !== 0 || isUnlimitedValue(value));

  const getCompanyLogoUrl = () => {
    const logo =
      companyProfile?.logo || localStorage.getItem("profileImage") || "";
    if (!logo || logo === "null" || logo === "undefined") {
      return DEFAULT_COMPANY_LOGO;
    }
    return logo.startsWith("http") ? logo : `${API_IMAGE_URL}${logo}`;
  };

  const handleCompanyLogoError = (event) => {
    event.currentTarget.onerror = null;
    event.currentTarget.src = DEFAULT_COMPANY_LOGO;
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
    // packs/validate API temporarily disabled
    return { success: true, data: { packId } };

    /* try {
      const token = localStorage.getItem("token");
      const res = await axios.post(
        `${API_BASE_URL}packs/validate`,
        { packId },
        getRequestConfig(),
      );

      if (res.data.success) {
        return { success: true, data: res.data.data };
      }

      return {
        success: false,
        message: res.data.message || "Pack validation failed",
      };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || "Validation failed",
      };
    } */
  };

  const openContactModal = (plan) => {
    setSelectedPlanForContact(plan);
    setSelectedContactPlan(plan?.packName || "Plan");
    setContactMessage(
      `I am interested in the ${plan?.packName}. Please contact me to discuss details...`,
    );
    setContactPlanError("");
    setShowContactModal(true);
  };

  const closeContactModal = () => {
    setShowContactModal(false);
    setSelectedContactPlan("");
    setSelectedPlanForContact(null);
    setContactMessage("");
    setContactPlanError("");
  };

  const getApiErrorMessage = (error, fallback = "Failed to send request") =>
    error?.response?.data?.message ||
    error?.response?.data?.error ||
    error?.message ||
    fallback;

  const handleUpgradePlanAction = async (plan, contactFlow, currentPlanBtn) => {
    if (currentPlanBtn) return;

    try {
      setLoadingPlanId(plan._id);

      const validation = await validatePack(plan._id);
      if (!validation.success) {
        showPackProcessError(validation.message);
        return;
      }

      if (contactFlow) {
        openContactModal(plan);
        return;
      }

      if (plan?.canPurchase === false) {
        showPackProcessError(
          plan?.purchaseBlockedReason ||
          "You cannot purchase this plan at the moment.",
        );
        return;
      }

      closeUpgradePlanModal();
      openPaymentModal({
        id: plan._id,
        name: plan.packName,
        price: plan.amount,
        currency: plan.currency || "MAD",
        purchaseType: "pack",
      });
    } finally {
      setLoadingPlanId(null);
    }
  };

  const isAddOnManualPack = (addon) =>
    addon?.paymentMode?.toLowerCase() === "manual" ||
    addon?.canPurchaseOnline === false ||
    addon?.showButton === "Manuel Request" ||
    addon?.showButton === "Manual Request" ||
    addon?.showButton === "Contact Us";

  const getAddOnButtonLabel = (addon) => {
    if (isAddOnNotAvailable(addon)) return "Not Available";
    if (isAddOnManualPack(addon)) return "Manual Request";
    return "Buy";
  };

  const isAddOnNotAvailable = (addon) =>
    addon?.showButton === "Not Available";

  const isAddOnButtonDisabled = (addon) => {
    if (customCreditLoading || manualAddOnLoading) return true;
    if (isAddOnNotAvailable(addon)) return true;
    // Manual/contact add-ons stay enabled even when canPurchase is false
    // (that flag only blocks online buy, not the manual request flow).
    if (isAddOnManualPack(addon)) return false;
    return addon?.canPurchase === false;
  };

  const showManualRequestSuccess = () => {
    setManualSuccessMessage("Manual recharge request submitted successfully");
    setShowManualSuccessModal(true);
  };

  const handleManualAddOnRequest = async (addon) => {
    if (!addon?._id) return;

    const contactDetails = getContactDetails();
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    const contactPersonName =
      contactDetails.contactPersonName ||
      companyProfile?.brandName ||
      "Company User";
    const contactEmail =
      contactDetails.contactEmail ||
      localStorage.getItem("user_email") ||
      user?.email ||
      "";
    const contactPhone =
      contactDetails.contactPhone ||
      user?.phone ||
      user?.mobile ||
      localStorage.getItem("phone") ||
      "";

    if (!contactEmail) {
      toast.error("Email not found. Please update your profile.");
      return;
    }

    try {
      setManualAddOnLoading(true);
      const token = localStorage.getItem("token");

      const payload = {
        addOnId: addon._id,
        contactPersonName,
        contactEmail,
        contactPhone,
        message: `Manual request for ${addon.name}`,
      };

      const response = await axios.post(
        `${API_BASE_URL}requestAddOnRecharge`,
        payload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        },
      );

      if (response.data.success) {
        closeTopUpModal();
        await Promise.all([fetchEmployerWallet(), fetchcreditStatus()]);
        setWalletTab("manual");
        showManualRequestSuccess();
      } else {
        toast.error(response.data.message || "Request failed");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to send request");
    } finally {
      setManualAddOnLoading(false);
    }
  };

  const handleAddOnSelect = (addon) => {
    if (isAddOnNotAvailable(addon)) return;

    if (isAddOnManualPack(addon)) {
      handleManualAddOnRequest(addon);
      return;
    }

    if (addon?.canPurchase === false) return;

    openPaymentModal({
      id: addon._id,
      name: addon.name,
      price: addon.price,
      currency: addon.currency || "MAD",
      purchaseType: "addon",
    });
  };

  const handleContactPlanSubmit = async () => {
    if (!contactMessage.trim()) {
      toast.error("Please enter your message");
      return;
    }

    const contactDetails = getContactDetails();
    // contactPersonName is no longer required (backend auto-fills it from the
    // logged-in user). Only the email is required to send the inquiry.
    if (!contactDetails.contactEmail) {
      toast.error("Company contact email not found. Please update your profile.");
      return;
    }

    if (!selectedPlanForContact?._id) {
      toast.error("Plan not selected");
      return;
    }

    try {
      setContactSubmitLoading(true);
      setContactPlanError("");

      const validation = await validatePack(selectedPlanForContact._id);
      if (!validation.success) {
        showPackProcessError(validation.message);
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

      if (response.data?.success) {
        toast.success(response.data.message || "Request sent successfully");
        closeContactModal();
        closeUpgradePlanModal();
        await refreshWalletData();
        setWalletTab("manual");
        return;
      }

      const message =
        response.data?.message || "Unable to send your inquiry. Please try again.";
      setContactPlanError(message);
      toast.error(message);
    } catch (error) {
      const message = getApiErrorMessage(error);
      setContactPlanError(message);
      toast.error(message);
    } finally {
      setContactSubmitLoading(false);
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
        getRequestConfig(),
      );

      if (res.data.success) {
        closeCustomCreditModal();
        closeTopUpModal();
        await Promise.all([fetchEmployerWallet(), fetchcreditStatus()]);
        setWalletTab("manual");
        showManualRequestSuccess();
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

  const handleSelectPayment = async (paymentMethod) => {
    if (selectingPayment || !selectedTopUpPack) return;

    setSelectingPayment(true);

    try {
      if (
        selectedTopUpPack.purchaseType === "pack" &&
        selectedTopUpPack.id
      ) {
        const validation = await validatePack(selectedTopUpPack.id);
        if (!validation.success) {
          showPackProcessError(validation.message);
          setSelectingPayment(false);
          return;
        }
      }

      closeTopUpModal();
      closePaymentModal();
      navigate("/checkout", {
        state: {
          paymentMethod,
          pack: selectedTopUpPack,
          purchaseType: selectedTopUpPack.purchaseType || "addon",
          returnTo: "/employer-wallet",
        },
      });
    } catch {
      setSelectingPayment(false);
    }
  };

  return (
    <>
      {/* <!-- Start Main Dashboard Content Wrapper Area --> */}
      <div className="main-dashboard-content employer-wallet-page d-flex flex-column">
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

          {loading || (!credits && !walletData) ? (
            <JobListLoader />
          ) : (
            <>
              <div className="row wallet-kpi-row g-4 mb-5">
                <div className="col-xl-3 col-md-6 d-flex">
                  <div className="glass-card kpi-card kpi-card-jobs h-100">
                    <div className="kpi-icon-wrap kpi-icon-blue">
                      <i className="fa-solid fa-briefcase" />
                    </div>
                    <div className="kpi-content">
                      <span className="kpi-label">Job Posting Credits</span>
                      <div className="kpi-value">
                        {fmtKpiCredit(jobRemainingNum)}
                        <span className="kpi-total">
                          / {fmtKpiCredit(jobTotalNum)}
                        </span>
                        <span
                          className="live-indicator-dot live-indicator-dot-blue"
                          title="Live status"
                        />
                      </div>
                      <div className="kpi-progress kpi-progress-blue">
                        <div
                          className="kpi-progress-fill"
                          style={{
                            width: `${calcCreditProgress(jobRemainingNum, jobTotalNum)}%`,
                          }}
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="col-xl-3 col-md-6 d-flex">
                  <div className="glass-card kpi-card kpi-card-cvs h-100">
                    <div className="kpi-icon-wrap kpi-icon-gray">
                      <i className="fa-solid fa-user-tie" />
                    </div>
                    <div className="kpi-content">
                      <span className="kpi-label">CV Viewing Credits</span>
                      <div className="kpi-value">
                        {fmtKpiCredit(profileRemainingNum)}
                        <span className="kpi-total">
                          / {fmtKpiCredit(profileTotalNum)}
                        </span>
                        <span
                          className="live-indicator-dot live-indicator-dot-orange"
                          title="Live status"
                        />
                      </div>
                      <div className="kpi-progress kpi-progress-orange">
                        <div
                          className="kpi-progress-fill"
                          style={{
                            width: `${calcCreditProgress(profileRemainingNum, profileTotalNum)}%`,
                          }}
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="col-xl-3 col-md-6 d-flex">
                  <div className="glass-card kpi-card kpi-card-activity h-100">
                    <div className="kpi-icon-wrap kpi-icon-green">
                      <i className="fa-solid fa-bolt" />
                    </div>
                    <div className="kpi-content">
                      <div className="kpi-label-row">
                        <span className="kpi-label mb-0">Activity Today</span>
                        {activePack && (
                          <span className="kpi-plan-badge">{currentPlanName}</span>
                        )}
                      </div>
                      <div className="kpi-activity-rows">
                        <div className="kpi-activity-row">
                          <span className="kpi-activity-label">Jobs Posts</span>
                          <span className="kpi-activity-val">
                            {renderTodayUsageDisplay(jobsTodayUsage)}
                          </span>
                        </div>
                        <div className="kpi-activity-row">
                          <span className="kpi-activity-label">CV Views</span>
                          <span className="kpi-activity-val">
                            {renderTodayUsageDisplay(profilesTodayUsage)}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="col-xl-3 col-md-6 d-flex">
                  <div className="glass-card kpi-card kpi-card-validity h-100">
                    <div className="kpi-icon-wrap kpi-icon-gray">
                      <i className="fa-solid fa-hourglass-half" />
                    </div>
                    <div className="kpi-content">
                      <span className="kpi-label">Plan Validity</span>
                      {packHasNoExpiry ? (
                        <div className="kpi-validity-value">
                          <span className="kpi-value-number">Unlimited</span>
                          <span className="kpi-value-suffix"> (no expiry)</span>
                        </div>
                      ) : (
                        <>
                          <div className="kpi-validity-value">
                            <span className="kpi-value-number">
                              {planDaysLeft ?? 0}
                            </span>
                            <span className="kpi-value-suffix"> Days Left</span>
                          </div>
                          <div className="kpi-expiry-date">
                            Ends: {formatWalletDate(planExpiresAt)}
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {isPackExpired && (
                <div className="alert alert-danger d-flex align-items-center justify-content-between flex-wrap gap-3 mb-4">
                  <span>
                    <i className="fa-solid fa-triangle-exclamation me-2" />
                    Pack expired
                    {!packHasNoExpiry && planExpiresAt
                      ? ` on ${formatWalletDate(planExpiresAt)}`
                      : ""}{" "}
                    — renew to continue using credits and add-ons.
                  </span>
                  <button
                    type="button"
                    className="btn btn-sm btn-danger"
                    onClick={() => setShowUpgradePlanModal(true)}
                  >
                    Renew / Buy Pack
                  </button>
                </div>
              )}

              <div className="active-plan-minimal-banner mb-5">
                <div className="active-plan-inner">
                  <div className="plan-main-info">
                    <span className="plan-section-label">Current Plan</span>
                    <h2 className="plan-name-display">{currentPlanName}</h2>
                  </div>
                  <div className="plan-metrics-group">
                    <div className="plan-detail-item">
                      <span className="detail-label">Ad Credits</span>
                      <span className="detail-value detail-value-blue">
                        {hasUnlimitedPlanCredits
                          ? "Unlimited"
                          : renderCreditAmount(subscriptionPackJobs)}
                      </span>
                    </div>
                    <div className="plan-detail-item">
                      <span className="detail-label">
                        Access to the CV database
                      </span>
                      <span className="detail-value detail-value-blue">
                        {hasUnlimitedPlanCredits
                          ? "Unlimited"
                          : renderCreditAmount(subscriptionPackCvs)}
                      </span>
                    </div>
                    {showFeaturedJobsInBanner && (
                      <div className="plan-detail-item plan-detail-item-featured">
                        <span className="detail-label">
                          {t("jobs.featured_job")}
                        </span>
                        <span className="detail-value detail-value-featured">
                          {activeFeaturedJobsCount} /{" "}
                          {packFeaturedInfo.maxActiveFeaturedJobs}{" "}
                          {t("jobs.featured_active_short")} ·{" "}
                          {featuredJobsUsedCount} /{" "}
                          {packFeaturedInfo.maxFeaturedJobs}{" "}
                          {t("jobs.featured_used_short")}
                        </span>
                      </div>
                    )}
                    {showCompanyProfileHighlightInBanner && (
                      <div className="plan-detail-item">
                        <span className="detail-label">
                          {t("wallet.companyProfileHighlight")}
                        </span>
                        <span className="detail-value detail-value-blue">
                          {t("jobs.featured_enabled")}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="row g-4 mb-5">
                <div
                  className={
                    showAddonCreditSection ? "col-lg-6" : "col-12"
                  }
                >
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
                        <div className="wallet-section-empty">
                          <div className="wallet-empty-illustration wallet-empty-illustration-pack">
                            <svg
                              viewBox="0 0 120 90"
                              fill="none"
                              xmlns="http://www.w3.org/2000/svg"
                              aria-hidden="true"
                            >
                              <path
                                d="M12 34L60 14L108 34V72C108 74.2 106.2 76 104 76H16C13.8 76 12 74.2 12 72V34Z"
                                stroke="#C7D2FE"
                                strokeWidth="2"
                                fill="#EEF2FF"
                              />
                              <path
                                d="M12 34L60 54L108 34"
                                stroke="#A5B4FC"
                                strokeWidth="2"
                              />
                              <circle cx="34" cy="22" r="4" fill="#C7D2FE" />
                              <rect
                                x="78"
                                y="12"
                                width="10"
                                height="10"
                                rx="2"
                                fill="#DDD6FE"
                              />
                              <path
                                d="M52 8L56 18H46L52 8Z"
                                fill="#BFDBFE"
                              />
                            </svg>
                          </div>
                          <p className="wallet-empty-text">
                            No active subscription packs found.
                          </p>
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
                                      {renderCreditAmount(pack.totalJobs, pack)}
                                    </span>
                                  </div>
                                  <div className="stat-row">
                                    <span className="stat-label">
                                      Total CVs
                                    </span>
                                    <span className="stat-val">
                                      {renderCreditAmount(pack.totalCvs, pack)}
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
                                      {pack.cancelExpiry
                                        ? "Unlimited (no expiry)"
                                        : formatShortDate(pack.expiresAt)}
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

                {showAddonCreditSection && (
                  <div className="col-lg-6">
                    <div className="premium-card h-100">
                      <div className="card-header-premium">
                        <h5 className="mb-0 fw-bold">Manual Credit</h5>
                      </div>
                      <div className="card-body p-4">
                        {!hasActiveAddOnCredits ? (
                          <div className="wallet-section-empty">
                            <div className="wallet-empty-illustration wallet-empty-illustration-addon">
                              <i className="fa-solid fa-chart-pie" />
                            </div>
                            <p className="wallet-empty-text">
                              No active addon credits found.
                            </p>
                            <button
                              type="button"
                              className="btn-topup-outline w-100"
                              onClick={handleRequestCreditTopUp}
                            >
                              <i className="fa-solid fa-plus-circle me-2" />
                              Request Credit Top-up
                            </button>
                          </div>
                        ) : (
                          <>
                            <div className="sub-pack-card border-info-subtle">
                              <div className="sub-pack-title text-primary">
                                Summary of Active Add-ons
                              </div>
                              <div className="sub-pack-stats">
                                <div className="stat-row">
                                  <span className="stat-label">Added Jobs</span>
                                  <span className="stat-val text-primary">
                                    +{renderCreditAmount(addedJobsTotal)}
                                  </span>
                                </div>
                                <div className="stat-row">
                                  <span className="stat-label">Added CVs</span>
                                  <span className="stat-val text-orange">
                                    +{renderCreditAmount(addedCvsTotal)}
                                  </span>
                                </div>
                              </div>
                              <div className="mt-3 pt-3 border-top xsmall text-muted">
                                Total from {activeAddOnCount} active recharge(s)
                              </div>
                            </div>

                            <div className="mt-4 pt-2 text-center">
                              <button
                                type="button"
                                className="btn-topup-outline w-100"
                                onClick={handleRequestCreditTopUp}
                              >
                                <i className="fa-solid fa-plus-circle me-2" />
                                Request Credit Top-up
                              </button>
                            </div>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {showWalletActivitySection && (
                  <div className="col-12">
                    <div className="premium-tabs-nav mb-4">
                      {showTransactionsTab && (
                        <button
                          type="button"
                          className={`tab-btn ${walletTab === "transactions" ? "active" : ""}`}
                          onClick={() => setWalletTab("transactions")}
                        >
                          <i className="fa-solid fa-list-check me-2" /> Transaction
                          History
                        </button>
                      )}
                      {showRechargeTab && (
                        <button
                          type="button"
                          className={`tab-btn ${walletTab === "recharge" ? "active" : ""}`}
                          onClick={() => setWalletTab("recharge")}
                        >
                          <i className="fa-solid fa-clock-rotate-left me-2" />{" "}
                          Recharge Track
                        </button>
                      )}
                      {showPaymentsTab && (
                        <button
                          type="button"
                          className={`tab-btn ${walletTab === "payments" ? "active" : ""}`}
                          onClick={() => setWalletTab("payments")}
                        >
                          <i className="fa-solid fa-credit-card me-2" /> Recent
                          Payments
                        </button>
                      )}
                      {showManualRequestsTab && (
                        <button
                          type="button"
                          className={`tab-btn ${walletTab === "manual" ? "active" : ""}`}
                          onClick={() => setWalletTab("manual")}
                        >
                          <i className="fa-solid fa-hand-holding-hand me-2" />{" "}
                          Manual Requests
                        </button>
                      )}
                    </div>

                    <div className="premium-card">
                      <div className="table-responsive-premium">
                        {walletTab === "transactions" && (
                          <div className="card-header-premium border-0">
                            <h5 className="mb-0 fw-bold">Transaction History</h5>
                          </div>
                        )}

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
                                  currentCreditTransactions.map((item, index) => {
                                    const tx = getTransactionCredits(item);
                                    const isPack =
                                      item.type === "Pack" || tx.isPack;
                                    return (
                                      <tr key={item._id || `tx-${index}`}>
                                        <td>
                                          <span
                                            className={`pill-badge ${isPack ? "pill-blue" : "pill-info"}`}
                                          >
                                            {item.type || (isPack ? "Pack" : "AddOn")}
                                          </span>
                                          {item.isCurrentPlan && (
                                            <span className="badge bg-success-subtle text-success ms-2 small">
                                              Current Plan
                                            </span>
                                          )}
                                          {String(tx.packStatus).toLowerCase() ===
                                            "expired" && (
                                              <span className="badge bg-danger-subtle text-danger ms-2 small">
                                                Expired
                                              </span>
                                            )}
                                        </td>
                                        <td className="fw-bold text-dark">
                                          {tx.planName || "-"}
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
                                          {item.date ||
                                            formatWalletDate(tx.date)}
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
                                    <button
                                      type="button"
                                      className="btn btn-sm btn-outline-secondary rounded-pill px-3"
                                      onClick={resetRechargeFilter}
                                    >
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
                                          value={rechargeFromDate}
                                          onChange={(e) => {
                                            const value = e.target.value;
                                            setRechargeFromDate(value);
                                            applyRechargeFilter(
                                              value,
                                              rechargeToDate,
                                              rechargeStatus,
                                            );
                                          }}
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
                                          value={rechargeToDate}
                                          onChange={(e) => {
                                            const value = e.target.value;
                                            setRechargeToDate(value);
                                            applyRechargeFilter(
                                              rechargeFromDate,
                                              value,
                                              rechargeStatus,
                                            );
                                          }}
                                        />
                                      </div>
                                    </div>
                                    <div className="filter-item flex-grow-1 position-relative">
                                      <label className="filter-label">
                                        <i className="fa-solid fa-layer-group me-2 text-primary" />
                                        Status
                                      </label>
                                      <div
                                        ref={rechargeStatusRef}
                                        className={`naddi-custom-select ${rechargeStatusOpen ? "active" : ""}`}
                                      >
                                        <div
                                          className="selected-value"
                                          role="button"
                                          tabIndex={0}
                                          onClick={() =>
                                            setRechargeStatusOpen((open) => !open)
                                          }
                                          onKeyDown={(e) => {
                                            if (
                                              e.key === "Enter" ||
                                              e.key === " "
                                            ) {
                                              e.preventDefault();
                                              setRechargeStatusOpen((open) => !open);
                                            }
                                          }}
                                        >
                                          <span>
                                            <i className="fa-solid fa-list-ul me-2" />{" "}
                                            {rechargeStatusLabel}
                                          </span>
                                          <i className="fa-solid fa-chevron-down ms-auto arrow-icon rotate" />
                                        </div>
                                        <div className="naddi-options-menu">
                                          <div
                                            className="naddi-option"
                                            role="button"
                                            tabIndex={0}
                                            onClick={() =>
                                              handleRechargeStatusChange("all")
                                            }
                                          >
                                            All Requests
                                          </div>
                                          <div
                                            className="naddi-option text-warning"
                                            role="button"
                                            tabIndex={0}
                                            onClick={() =>
                                              handleRechargeStatusChange("pending")
                                            }
                                          >
                                            <i className="fa-solid fa-clock me-2" />{" "}
                                            Pending
                                          </div>
                                          <div
                                            className="naddi-option text-success"
                                            role="button"
                                            tabIndex={0}
                                            onClick={() =>
                                              handleRechargeStatusChange("approved")
                                            }
                                          >
                                            <i className="fa-solid fa-circle-check me-2" />{" "}
                                            Approved
                                          </div>
                                          <div
                                            className="naddi-option text-danger"
                                            role="button"
                                            tabIndex={0}
                                            onClick={() =>
                                              handleRechargeStatusChange("rejected")
                                            }
                                          >
                                            <i className="fa-solid fa-circle-xmark me-2" />{" "}
                                            Rejected
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                    <div className="filter-actions d-flex align-items-center gap-3">
                                      <div className="results-counter bg-primary-subtle text-primary px-3 py-2 rounded-4 fw-bold small">
                                        {rechargeRequests.length} found
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
                                    {currentRechargeRequests.length === 0 ? (
                                      <tr>
                                        <td colSpan="5" className="text-center py-4">
                                          No recharge requests found
                                        </td>
                                      </tr>
                                    ) : (
                                      currentRechargeRequests.map((item, index) => (
                                        <tr key={item._id || `recharge-${index}`}>
                                          <td>
                                            <div className="fw-bold text-dark">
                                              {item.requestDetails || "N/A"}
                                            </div>
                                          </td>
                                          <td>
                                            <span className="badge bg-primary-subtle-premium text-primary-premium px-3 py-2 rounded-pill fw-bold">
                                              {formatRechargeCredit(item.jobPostings)}
                                            </span>
                                          </td>
                                          <td>
                                            <span className="badge bg-orange-subtle-premium text-orange-premium px-3 py-2 rounded-pill fw-bold">
                                              {formatRechargeCredit(item.viewProfiles)}
                                            </span>
                                          </td>
                                          <td>
                                            <span
                                              className={`status-pill ${getRechargeStatusClass(item.status)}`}
                                            >
                                              {item.status || "N/A"}
                                            </span>
                                          </td>
                                          <td className="small text-muted">
                                            {formatRechargeDate(item.createdDate)}
                                          </td>
                                        </tr>
                                      ))
                                    )}
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
                                      <th>Type</th>
                                      <th>Plan Name</th>
                                      <th>Amount</th>
                                      <th>Method</th>
                                      <th>Status</th>
                                      <th>Date</th>
                                    </tr>
                                  </thead>
                                  <tbody>
                                    {currentPayments.length === 0 ? (
                                      <tr>
                                        <td colSpan="6" className="text-center py-4">
                                          No payments found
                                        </td>
                                      </tr>
                                    ) : (
                                      currentPayments.map((item, index) => (
                                        <tr key={item._id || `payment-${index}`}>
                                          <td>
                                            <span className="pill-badge pill-blue">
                                              {item.type}
                                            </span>
                                          </td>
                                          <td className="fw-bold text-dark">
                                            {item.planName}
                                          </td>
                                          <td className="fw-bold text-success">
                                            {item.amount}
                                          </td>
                                          <td className="small">{item.paymentMethod}</td>
                                          <td>
                                            <span className="pill-badge pill-blue">
                                              {item.status}
                                            </span>
                                          </td>
                                          <td className="small text-muted">
                                            {item.date}
                                          </td>
                                        </tr>
                                      ))
                                    )}
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
                                      <th>Request Details</th>
                                      <th>Job Postings</th>
                                      <th>View Profiles</th>
                                      <th>Status</th>
                                      <th>Created Date</th>
                                    </tr>
                                  </thead>
                                  <tbody>
                                    {currentManualRequests.length === 0 ? (
                                      <tr>
                                        <td colSpan="5" className="text-center py-4">
                                          No manual requests found
                                        </td>
                                      </tr>
                                    ) : (
                                      currentManualRequests.map((item, index) => (
                                        <tr key={item._id || `manual-${index}`}>
                                          <td>
                                            <div className="fw-bold text-dark">
                                              {item.requestDetails || "N/A"}
                                            </div>
                                          </td>
                                          <td>
                                            <span className="badge bg-primary-subtle-premium text-primary-premium px-3 py-2 rounded-pill fw-bold">
                                              {formatRechargeCredit(item.jobPostings)}
                                            </span>
                                          </td>
                                          <td>
                                            <span className="badge bg-orange-subtle-premium text-orange-premium px-3 py-2 rounded-pill fw-bold">
                                              {formatRechargeCredit(item.viewProfiles)}
                                            </span>
                                          </td>
                                          <td>
                                            <span
                                              className={`status-pill ${getRechargeStatusClass(item.status)}`}
                                            >
                                              {item.status || "N/A"}
                                            </span>
                                          </td>
                                          <td className="small text-muted">
                                            {formatRechargeDate(item.createdDate)}
                                          </td>
                                        </tr>
                                      ))
                                    )}
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
                )}
              </div>
            </>
          )}
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
      {showManualSuccessModal && (
        <div
          className="wallet-manual-success-overlay"
          onClick={() => setShowManualSuccessModal(false)}
        >
          <div
            className="wallet-manual-success-modal"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="wallet-manual-success-body">
              <div className="wallet-manual-success-icon">
                <i className="fa-solid fa-check" />
              </div>
              <h4 className="wallet-manual-success-title">Request Submitted</h4>
              <p className="wallet-manual-success-message">
                {manualSuccessMessage}
              </p>
              <button
                type="button"
                className="wallet-manual-success-btn"
                onClick={() => setShowManualSuccessModal(false)}
              >
                OK
              </button>
            </div>
          </div>
        </div>
      )}
      {showPackErrorModal && (
        <div
          className="wallet-process-error-overlay"
          onClick={() => setShowPackErrorModal(false)}
        >
          <div
            className="wallet-process-error-modal"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="wallet-process-error-body">
              <div className="wallet-process-error-icon">
                <i className="fa-solid fa-xmark" />
              </div>
              <h4 className="wallet-process-error-title">
                {t("header.Process_Error")}
              </h4>
              <p className="wallet-process-error-message">{packErrorMessage}</p>
              <button
                type="button"
                className="wallet-process-error-btn"
                onClick={() => setShowPackErrorModal(false)}
              >
                OK
              </button>
            </div>
          </div>
        </div>
      )}
      {showRestrictedAccessModal && (
        <div
          className="custom-modal-overlay"
          onClick={() => setShowRestrictedAccessModal(false)}
        >
          <div
            className="custom-modal-content wallet-restricted-modal"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="wallet-restricted-body">
              <div className="wallet-restricted-icon">
                <i className="fa-solid fa-circle-info" />
              </div>
              <h4 className="wallet-restricted-title">
                {t("header.Restricted_Access")}
              </h4>
              <p className="wallet-restricted-message">
                {t("header.Restricted_Access_Message")}
              </p>
              <button
                type="button"
                className="wallet-restricted-btn"
                onClick={() => setShowRestrictedAccessModal(false)}
              >
                OK
              </button>
            </div>
          </div>
        </div>
      )}
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
              {addOnsLoading ? (
                <div className="text-center py-4">
                  <div className="spinner-border text-primary" role="status" />
                </div>
              ) : !canPurchaseAddOns ? (
                <div className="text-center py-4 text-muted">
                  {addOnPurchaseBlockedReason ||
                    "Add-ons are not available on your current plan"}
                </div>
              ) : (
                <div className="row g-3 justify-content-center">
                  {addOnPlans.length === 0 ? (
                    <div className="col-12 text-center text-muted py-4">
                      No active add-on packs available
                    </div>
                  ) : (
                    addOnPlans.map((addon) => {
                      const hasJobs = addon.jobPostingCredits > 0;
                      const hasCvs = addon.profileViewingCredits > 0;
                      const iconClass = hasJobs && hasCvs
                        ? "fa-layer-group"
                        : hasJobs
                          ? "fa-briefcase"
                          : "fa-user-tie";

                      return (
                        <div className="col-lg-4 col-md-6 d-flex" key={addon._id}>
                          <div className="addon-selection-card w-100 d-flex flex-column">
                            <div className="d-flex justify-content-between align-items-start mb-3">
                              <div className="addon-icon">
                                <i className={`fa-solid ${iconClass}`} />
                              </div>
                              <div className="addon-price">
                                {addon.price}{" "}
                                <span className="small">
                                  {addon.currency || "MAD"}
                                </span>
                              </div>
                            </div>
                            <h6 className="fw-bold text-dark mb-2">
                              {addon.name}
                            </h6>
                            <div className="addon-details mb-4 flex-grow-1">
                              {hasJobs && (
                                <div className="d-flex justify-content-between small mb-1">
                                  <span className="text-muted">Job Credits:</span>
                                  <span className="fw-bold">
                                    +{addon.jobPostingCredits}
                                  </span>
                                </div>
                              )}
                              {hasCvs && (
                                <div className="d-flex justify-content-between small mb-1">
                                  <span className="text-muted">CV Credits:</span>
                                  <span className="fw-bold">
                                    +{addon.profileViewingCredits}
                                  </span>
                                </div>
                              )}
                              <div className="d-flex justify-content-between small">
                                <span className="text-muted">Mode:</span>
                                <span className="fw-bold text-dark">
                                  {addon.paymentMode || "Online"}
                                </span>
                              </div>
                            </div>
                            <button
                              type="button"
                              className={`btn-select-addon w-100 d-flex align-items-center justify-content-center${manualAddOnLoading && isAddOnManualPack(addon)
                                ? " is-loading"
                                : ""
                                }`}
                              disabled={isAddOnButtonDisabled(addon)}
                              title={
                                isAddOnManualPack(addon)
                                  ? ""
                                  : addon.purchaseBlockedReason || ""
                              }
                              onClick={() => handleAddOnSelect(addon)}
                            >
                              {manualAddOnLoading && isAddOnManualPack(addon)
                                ? "Sending..."
                                : getAddOnButtonLabel(addon)}
                            </button>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              )}
              <div className="mt-4 pt-4 border-top text-center">
                <p className="text-muted small mb-3">
                  Need a specific amount of credits?
                </p>
                <button
                  type="button"
                  className="btn-custom-trigger"
                  onClick={() => setShowCustomCreditModal(true)}
                >
                  <i className="fa-solid fa-percent me-2" /> Request Custom
                  Credit
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      {showUpgradePlanModal && !showContactModal && (
        <div
          className="custom-modal-overlay"
          onClick={() => closeUpgradePlanModal()}
        >
          <div
            className="custom-modal-content packs-modal-content upgrade-plans-modal"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="modal-header-creative text-center">
              <div className="upgrade-plans-modal-header">
                <h3 className="upgrade-plans-title">Elevate Your Hiring Power</h3>
                <p className="upgrade-plans-subtitle mb-0">
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
            <div className="modal-body upgrade-plans-modal-body p-0">
              <div className="upgrade-plans-grid-wrap">
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
                  <div className="row g-4 justify-content-center upgrade-plans-grid">
                    {availablePlans.map((plan, index) => {
                      const isProCard =
                        index === availablePlans.length - 1;
                      const contactFlow = opensContactFlow(plan);
                      const currentPlanBtn = isCurrentPlanButton(plan);
                      const hasJobCredits = showPlanValue(plan.jobPostingCredits);
                      const hasCvCredits = showPlanValue(
                        plan.profileViewingCredits,
                      );
                      const hasDailyJobs = showPlanValue(
                        plan.dailyJobPostingLimit,
                      );
                      const hasDailyCvs = showPlanValue(
                        plan.dailyProfileViewingLimit,
                      );
                      const hasFeatured =
                        plan.featuredJobsAvailable && plan.maxFeaturedJobs > 0;
                      const hasLocations = plan.featuredJobLocations?.length > 0;
                      const hasSearchBoost =
                        plan.featuredJobsAvailable &&
                        plan.searchBoostScore > 1 &&
                        plan.featuredJobLocations?.includes("SearchResults");
                      const hasCompanyProfileHighlight =
                        isCompanyProfileHighlightEnabled(plan);
                      const hasPrimaryFeatures = hasJobCredits || hasCvCredits;
                      const hasSecondaryFeatures =
                        hasDailyJobs ||
                        hasDailyCvs ||
                        hasFeatured ||
                        hasLocations ||
                        hasSearchBoost ||
                        hasCompanyProfileHighlight;

                      return (
                        <div
                          className={`col-lg-4 col-md-6 ${availablePlans.length === 1 ? "col-xl-5" : ""}`}
                          key={plan._id}
                        >
                          <div
                            className={`refined-pack-card h-100 d-flex flex-column ${isProCard ? "refined-pro-pack" : "refined-standard-pack"}`}
                          >
                            <div className="refined-card-top">
                              {isProCard && (
                                <h4 className="refined-name">{plan.packName}</h4>
                              )}
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
                              {hasJobCredits && (
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
                              {hasCvCredits && (
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
                              {hasPrimaryFeatures && hasSecondaryFeatures && (
                                <div
                                  className="refined-features-divider"
                                  aria-hidden="true"
                                />
                              )}
                              {hasDailyJobs && (
                                <div className="refined-feature-item">
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
                              {hasDailyCvs && (
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
                              {hasFeatured && (
                                <div className="refined-feature-item">
                                  <i className="fa-solid fa-star" />
                                  <div className="refined-feature-info">
                                    <span className="refined-feature-label">
                                      {t("jobs.featured_job")}
                                    </span>
                                    <span className="refined-feature-count">
                                      {plan.maxFeaturedJobs} ·{" "}
                                      {plan.maxActiveFeaturedJobs}{" "}
                                      {t("jobs.featured_active_short")}
                                    </span>
                                  </div>
                                </div>
                              )}
                              {hasLocations && (
                                <div className="refined-feature-item refined-feature-item--locations">
                                  <i className="fa-solid fa-location-dot" />
                                  <div className="refined-feature-info">
                                    <span className="refined-feature-label">
                                      {t("wallet.locations")}
                                    </span>
                                    <span className="refined-feature-count">
                                      {formatFeaturedLocationLabels(
                                        plan.featuredJobLocations,
                                      )}
                                    </span>
                                  </div>
                                </div>
                              )}
                              {hasSearchBoost && (
                                <div className="refined-feature-item">
                                  <i className="fa-solid fa-arrow-trend-up" />
                                  <div className="refined-feature-info">
                                    <span className="refined-feature-label">
                                      {t("jobs.featured_search_boost_label")}
                                    </span>
                                    <span className="refined-feature-count">
                                      {formatSearchBoostLabel(
                                        plan.searchBoostScore,
                                      )}
                                    </span>
                                  </div>
                                </div>
                              )}
                              {hasCompanyProfileHighlight && (
                                <div className="refined-feature-item">
                                  <i className="fa-solid fa-building" />
                                  <div className="refined-feature-info">
                                    <span className="refined-feature-label">
                                      {t("wallet.companyProfileHighlight")}
                                    </span>
                                    <span className="refined-feature-count">
                                      {t("jobs.featured_enabled")}
                                    </span>
                                  </div>
                                </div>
                              )}
                            </div>
                            <div className="refined-card-bottom mt-auto">
                              <button
                                type="button"
                                className={`refined-action-btn ${isProCard ? "refined-btn-pro" : ""} ${currentPlanBtn ? "refined-action-btn-current" : ""} ${loadingPlanId === plan._id ? "is-loading" : ""}`}
                                title={plan.purchaseBlockedReason || ""}
                                disabled={
                                  currentPlanBtn ||
                                  (plan.canPurchase === false && !contactFlow) ||
                                  loadingPlanId === plan._id
                                }
                                onClick={() =>
                                  handleUpgradePlanAction(
                                    plan,
                                    contactFlow,
                                    currentPlanBtn,
                                  )
                                }
                              >
                                {loadingPlanId === plan._id
                                  ? "Please wait..."
                                  : getPlanButtonLabel(plan)}
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
          className="custom-modal-overlay wallet-contact-overlay"
          onClick={() => closeContactModal()}
        >
          <div
            className="custom-modal-content packs-modal-content wallet-contact-modal"
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
                      onError={handleCompanyLogoError}
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
                      {contactPlanError && (
                        <div
                          className="alert alert-danger py-2 px-3 small mb-3"
                          role="alert"
                        >
                          <i className="fa-solid fa-circle-exclamation me-2" />
                          {contactPlanError}
                        </div>
                      )}
                      <textarea
                        className="form-control premium-textarea"
                        rows={5}
                        placeholder={`I am interested in the ${selectedContactPlan}. Please contact me to discuss details...`}
                        value={contactMessage}
                        onChange={(e) => {
                          setContactMessage(e.target.value);
                          if (contactPlanError) setContactPlanError("");
                        }}
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
                        disabled={contactSubmitLoading}
                      >
                        {contactSubmitLoading ? "Sending..." : "Send Inquiry"}
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
                      className={`gateway-card${selectingPayment ? " opacity-50 pe-none" : ""}`}
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
                      className={`gateway-card${selectingPayment ? " opacity-50 pe-none" : ""}`}
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
                      className={`gateway-card${selectingPayment ? " opacity-50 pe-none" : ""}`}
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
                        placeholder="Enter Credits Number"
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
                        placeholder="Enter Credits Number"
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
