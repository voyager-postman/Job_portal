import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { API_BASE_URL } from "../Url/Url";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const EmployerWallet = () => {
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
      console.log("Recharge API Response:", res.data.data); // 👈 add this
      setRechargeRequests(res.data.data || []);
    } catch (error) {
      console.error(error);
    }
  };
  useEffect(() => {
    fetchcreditStatus();
    fetchPurchaseHistory();
    fetchRechargeRequests();
  }, []);
  const creditHistory = purchaseHistory?.filter(
    (item) => item.type === "credit",
  );

  const debitHistory = purchaseHistory?.filter((item) => item.type === "debit");
  if (!credits) return null;

  const {
    hasWelcomePack,
    hasPurchasedPack,
    welcomePack,
    hasAddOns,
    purchasedPack,
    usageToday,
    remainingToday,
    addOns,
  } = credits;
  const JobListLoader = () => (
    <div className="text-center py-5">
      <div className="spinner-border text-primary mb-3" role="status" />
      <p>Loading User Wallet, please wait...</p>
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
  return (
    <>
      {/* <!-- Start Main Dashboard Content Wrapper Area --> */}
      <div className="main-dashboard-content d-flex flex-column">
        <div className="responsive-content">
          {/* <!-- Breadcrumb Area --> */}
          <div className="breadcrumb-area">
            <h1>My Wallet</h1>
            <ol className="breadcrumb">
              <li className="item">
                <Link to="/">Home </Link>
              </li>
              <li className="item">
                <Link to="/employer-dashboard">
                  {" "}
                  <i className="fa-solid fa-angle-right" /> Dashboard{" "}
                </Link>
              </li>
              <li className="item">
                <Link to="/employer-wallet">
                  <i className="fa-solid fa-angle-right"></i>My Wallet
                </Link>
              </li>
            </ol>
          </div>
          {/* <!-- End Breadcrumb Area --> */}
          {loading ? (
            <JobListLoader />
          ) : (
            <>
              {/* <!-- employer dashboard user wallet start here --> */}
              <section className="employer-dashboard-info-area">
                <div className="employer-dashboard-common-heading subscription-plan-name">
                  <h2>Global credit balances</h2>
                  <span>Initial Base Plan</span>
                </div>
              </section>

              <section className="user-wallet-credit-button-info">
                <div className="user-wallet-credit-box-info">
                  <div className="user-wallet-credit-button">
                    <div className="user-wallet-credit">
                      <h4>
                        Total Job posting credits:{" "}
                        <span>
                          {credits.fullCredit?.jobCredits?.total === -1
                            ? "Unlimited"
                            : `${credits.fullCredit?.jobCredits?.used || 0}/${
                                credits.fullCredit?.jobCredits?.total || 0
                              }`}
                        </span>
                      </h4>

                      <h4>
                        Total profile viewing credits:{" "}
                        <span>
                          {credits.fullCredit?.profileCredits?.total === -1
                            ? "Unlimited"
                            : `${credits.fullCredit?.profileCredits?.used || 0}/${
                                credits.fullCredit?.profileCredits?.total || 0
                              }`}
                        </span>
                      </h4>
                      {/* <h4>
                        Total Featured Job credits:{" "}
                        <span>
                          {credits.fullCredit?.featuredJobCredits?.total === -1
                            ? "Unlimited"
                            : `${credits.fullCredit?.featuredJobCredits?.used || 0}/${
                                credits.fullCredit?.featuredJobCredits?.total ||
                                0
                              }`}
                        </span>
                      </h4> */}
                    </div>
                    <div className="user-wallet-credit-buy-button">
                      <Link to="/add-plan" className="credit-buy-btn">
                        Add Plan
                      </Link>
                      {hasPurchasedPack && (
                        <Link
                          to="/add-on-pack"
                          state={{ packId: purchasedPack?.companyPackId }}
                          className="credit-buy-btn"
                        >
                          Add On Pack
                        </Link>
                      )}
                    </div>
                  </div>
                </div>

                <div className="add-credits-modal-info">
                  {/* <!-- Modal --> */}
                  <div
                    className="modal fade"
                    id="exampleModal"
                    tabindex="-1"
                    aria-labelledby="exampleModalLabel"
                    aria-hidden="true"
                  >
                    <div className="modal-dialog">
                      <div className="modal-content">
                        <div className="modal-header">
                          <h1
                            className="modal-title fs-5"
                            id="exampleModalLabel"
                          >
                            Add Credits
                          </h1>
                          <button
                            type="button"
                            className="btn-close"
                            data-bs-dismiss="modal"
                            aria-label="Close"
                          ></button>
                        </div>
                        <div className="modal-body">
                          <div className="form-group">
                            <label>Credits Type</label>
                            <select
                              name="cars"
                              className="form-select form-control"
                              aria-label="Default2 select example"
                              id="Industry"
                            >
                              <option value="volvo">Select Credits Type</option>
                              <option value="volvo">Job Post Credits</option>
                              <option value="saab">Profile View Credits</option>
                            </select>
                          </div>
                          <form className="add-credits-input-btn">
                            <div className="form-group">
                              <label>Add Credits</label>
                              <input
                                className="form-control"
                                type="text"
                                id="first-name"
                                name="first_name"
                                placeholder="Add Credits"
                                required
                              />
                            </div>
                          </form>
                        </div>
                        <div className="modal-footer">
                          <a href="#" className="buy-plan-btn">
                            Request
                          </a>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </section>
              <section className="user-wallet-credit-limit-info">
                <div className="accordion" id="accordionExample">
                  {/* ===================== WELCOME PACK ===================== */}
                  {hasWelcomePack && welcomePack && (
                    <div className="accordion-item">
                      <h2 className="accordion-header">
                        <button
                          className="accordion-button collapsed"
                          type="button"
                          data-bs-toggle="collapse"
                          data-bs-target="#welcomePack"
                        >
                          Welcome Pack
                          <span className="PlusIcon">
                            <i className="fa-solid fa-plus" />
                          </span>
                          <span className="MinusIcon">
                            <i className="fa-solid fa-minus" />
                          </span>
                        </button>
                      </h2>

                      <div
                        id="welcomePack"
                        className="accordion-collapse collapse"
                        data-bs-parent="#accordionExample"
                      >
                        <div className="accordion-body">
                          <div className="user-wallet-credit-limit">
                            {/* Job Credits */}
                            <div className="user-wallet-credit-box">
                              <h3>
                                {welcomePack.jobCreditsTotal -
                                  welcomePack.jobCreditsRemaining}{" "}
                                / {welcomePack.jobCreditsTotal}
                              </h3>
                              <h4>Total Job Credits</h4>
                              <p>
                                Remaining: {welcomePack.jobCreditsRemaining}
                              </p>
                            </div>

                            {/* Profile Credits */}
                            <div className="user-wallet-credit-box">
                              <h3>
                                {" "}
                                {welcomePack.profileCreditsTotal -
                                  welcomePack.profileCreditsRemaining}{" "}
                                / {welcomePack.profileCreditsTotal}
                              </h3>
                              <h4>Total Profile Credits</h4>
                              <p>
                                Remaining: {welcomePack.profileCreditsRemaining}
                              </p>
                            </div>

                            {/* Jobs Today */}
                            <div className="user-wallet-credit-box">
                              <h3>
                                {welcomePack.jobUsedToday} /{" "}
                                {welcomePack.dailyJobLimit}
                              </h3>
                              <h4>Jobs Created Today</h4>
                              <p>
                                Daily limits reset automatically at midnight
                              </p>
                            </div>

                            {/* Profiles Today */}
                            <div className="user-wallet-credit-box">
                              <h3>
                                {welcomePack.profileUsedToday} /{" "}
                                {welcomePack.dailyProfileLimit}
                              </h3>
                              <h4>Profiles Viewed Today</h4>
                              <p>
                                Daily limits reset automatically at midnight
                              </p>
                            </div>

                            {/* Validity */}
                            <div className="user-wallet-credit-box">
                              <h3>{welcomePack.daysLeft} Days</h3>
                              <h4>Pack Validity</h4>
                              <p>
                                Expiry:{" "}
                                {new Date(
                                  welcomePack.expiresAt,
                                ).toLocaleDateString("en-GB", {
                                  day: "2-digit",
                                  month: "short",
                                  year: "numeric",
                                })}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* ===================== PURCHASED PACK ===================== */}
                  {hasPurchasedPack && purchasedPack && (
                    <>
                      <div className="accordion-item">
                        <h2 className="accordion-header">
                          <button
                            className="accordion-button collapsed"
                            type="button"
                            data-bs-toggle="collapse"
                            data-bs-target="#purchasedPack"
                          >
                            {purchasedPack.packName}
                            <span className="PlusIcon">
                              <i className="fa-solid fa-plus" />
                            </span>
                            <span className="MinusIcon">
                              <i className="fa-solid fa-minus" />
                            </span>
                          </button>
                        </h2>

                        <div
                          id="purchasedPack"
                          className="accordion-collapse collapse"
                          data-bs-parent="#accordionExample"
                        >
                          <div className="accordion-body">
                            <div className="user-wallet-credit-limit">
                              {/* Job Credits */}
                              <div className="user-wallet-credit-box">
                                <h3>
                                  {" "}
                                  <h3>
                                    {purchasedPack.jobCreditsTotal === -1
                                      ? "Unlimited"
                                      : `${purchasedPack.jobCreditsTotal - purchasedPack.jobCreditsRemaining}/${purchasedPack.jobCreditsTotal}`}
                                  </h3>
                                  <h4>Total Job Credits</h4>
                                  <p>
                                    Remaining:{" "}
                                    {purchasedPack.jobCreditsRemaining === -1
                                      ? "Unlimited"
                                      : purchasedPack.jobCreditsRemaining}
                                  </p>
                                </h3>
                              </div>

                              {/* Profile Credits */}
                              <div className="user-wallet-credit-box">
                                <h3>
                                  {purchasedPack.profileCreditsTotal === -1
                                    ? "Unlimited"
                                    : `${purchasedPack.profileCreditsTotal - purchasedPack.profileCreditsRemaining}/${purchasedPack.profileCreditsTotal}`}
                                </h3>

                                <h4>Total Profile Credits</h4>

                                <p>
                                  Remaining:{" "}
                                  {purchasedPack.profileCreditsRemaining === -1
                                    ? "Unlimited"
                                    : purchasedPack.profileCreditsRemaining}
                                </p>
                              </div>

                              {/* Daily Usage */}
                              <div className="user-wallet-credit-box">
                                <h3>
                                  {purchasedPack.dailyJobLimit === -1
                                    ? "Unlimited"
                                    : `${purchasedPack.jobUsedToday}/${purchasedPack.dailyJobLimit}`}
                                </h3>
                                <h4>Jobs Created Today</h4>
                                <p>Daily limit resets at midnight</p>
                              </div>

                              {/* Daily Profile Usage */}
                              <div className="user-wallet-credit-box">
                                <h3>
                                  {purchasedPack.dailyProfileLimit === -1
                                    ? "Unlimited"
                                    : `${purchasedPack.profileUsedToday}/${purchasedPack.dailyProfileLimit}`}
                                </h3>
                                <h4>Profiles Viewed Today</h4>
                                <p>Daily limit resets at midnight</p>
                              </div>

                              {/* Validity */}
                              <div className="user-wallet-credit-box">
                                <h3>{purchasedPack.daysLeft} Days</h3>
                                <h4>Pack Validity</h4>
                                <p>
                                  Expiry:{" "}
                                  {new Date(
                                    purchasedPack.expiresAt,
                                  ).toLocaleDateString("en-GB", {
                                    day: "2-digit",
                                    month: "short",
                                    year: "numeric",
                                  })}
                                </p>
                              </div>
                              {/* Featured Job Credits */}
                              {/* Featured Jobs */}
                              {purchasedPack.features?.hasFeaturedJobs && (
                                <div className="user-wallet-credit-box">
                                  <h3>
                                    {purchasedPack.features.featuredJobsUsed}/
                                    {purchasedPack.features.maxFeaturedJobs}
                                  </h3>

                                  <h4>Featured Job Slots</h4>

                                  <p>
                                    Remaining:{" "}
                                    {purchasedPack.features.maxFeaturedJobs -
                                      purchasedPack.features.featuredJobsUsed}
                                  </p>

                                  <p>
                                    Duration:{" "}
                                    {
                                      purchasedPack.features
                                        .featuredJobDurationDays
                                    }{" "}
                                    Days
                                  </p>

                                  <p>
                                    Locations:{" "}
                                    {purchasedPack.features.featuredJobLocations.join(
                                      ", ",
                                    )}
                                  </p>
                                </div>
                              )}

                              {/* Company Profile Highlight */}
                              {purchasedPack.features?.hasProfileHighlight && (
                                <div className="user-wallet-credit-box">
                                  <h3>Enabled</h3>

                                  <h4>Company Profile Highlight</h4>

                                  <p>
                                    Your Company Profile Will Appear Highlighted
                                    To Candidates.
                                  </p>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </>
                  )}
                  {/* ===================== ADD-ON PACK ===================== */}

                  {/* ===================== NO ACTIVE PLAN ===================== */}
                  {!hasWelcomePack && !hasPurchasedPack && !hasAddOns && (
                    <div className="accordion-item">
                      <h2 className="accordion-header">
                        <button
                          className="accordion-button"
                          type="button"
                          data-bs-toggle="collapse"
                          data-bs-target="#noPlan"
                        >
                          No Active Plan
                        </button>
                      </h2>

                      <div
                        id="noPlan"
                        className="accordion-collapse collapse show"
                        data-bs-parent="#accordionExample"
                      >
                        <div className="accordion-body">
                          <div className="no-plan-wrapper text-center p-4">
                            <div className="mb-3">
                              <i className="fa-solid fa-credit-card fa-3x text-primary"></i>
                            </div>

                            <h4 className="mb-2">
                              You don’t have an active subscription
                            </h4>

                            <p className="text-muted mb-4">
                              Purchase a plan to start posting jobs and viewing
                              profiles.
                            </p>

                            <div className="d-flex justify-content-center gap-3 flex-wrap">
                              <button
                                className="btn btn-primary px-4"
                                onClick={() => navigate("/add-plan")}
                              >
                                View Plans
                              </button>

                              <button
                                className="btn btn-outline-secondary px-4"
                                onClick={() => navigate("/add-on-pack")}
                              >
                                Request Custom Credits
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </section>
              {currentCreditTransactions.length > 0 && (
                <section className="user-wallet-transaction-list">
                  <div className="employer-dashboard-common-heading">
                    <h2>Credit Transaction History</h2>
                  </div>

                  <div className="tab-content user-wallet-transaction-table">
                    <div className="tab-pane fade show active">
                      <div className="table-responsive">
                        <table className="table table-bordered">
                          <thead>
                            <tr>
                              <th>S.No</th>
                              <th>Plan Type</th>
                              <th>Plan Name</th>
                              <th>Credits</th>
                              <th>Daily Limits</th>
                              <th>Status</th>
                            </tr>
                          </thead>

                          <tbody>
                            {packsHistory.length === 0 &&
                            addOnHistory.length === 0 ? (
                              <tr>
                                <td colSpan="5" className="text-center">
                                  No transaction history found
                                </td>
                              </tr>
                            ) : (
                              <>
                                {/* PACK HISTORY */}
                                {/* {currentCreditTransactions.map(
                                  (item, index) => (
                                    <tr key={item._id}>
                                      <td>{item.paymentTransactionId?._id}</td>
                                      <td>
                                        {item.paymentTransactionId?.planType}
                                      </td>
                                      <td>
                                        {item.paymentTransactionId?.planName}
                                      </td>
                                      <td>{item.jobPostingCredits}</td>
                                      <td>{item.dailyJobPostingLimit}</td>
                                      <td>{item.profileViewingCredits}</td>
                                      <td>{item.dailyProfileViewingLimit}</td>
                                      <td>
                                        {" "}
                                        <span
                                          className={`badge ${
                                            item.activationStatus === "Pending"
                                              ? "bg-warning"
                                              : item.activationStatus ===
                                                  "Active"
                                                ? "bg-success"
                                                : "bg-secondary"
                                          }`}
                                        >
                                          {item.activationStatus || "Success"}
                                        </span>
                                      </td>
                                    </tr>
                                  ),
                                )} */}
                                {currentCreditTransactions.map(
                                  (item, index) => {
                                    const isPack =
                                      item.paymentTransactionId?.planType ===
                                      "Pack";

                                    return (
                                      <tr key={item._id}>
                                        <td>{index + 1}</td>

                                        <td>
                                          {item.paymentTransactionId?.planType}
                                        </td>

                                        <td>
                                          {item.paymentTransactionId?.planName}
                                        </td>

                                        {/* Credits */}
                                        <td>
                                          {(() => {
                                            const jobCredits = isPack
                                              ? item.jobPostingCredits
                                              : (item.totalJobCredits ?? 0);

                                            const profileCredits = isPack
                                              ? item.profileViewingCredits
                                              : (item.totalProfileCredits ?? 0);

                                            const jobDisplay =
                                              jobCredits === -1
                                                ? "∞"
                                                : jobCredits;
                                            const profileDisplay =
                                              profileCredits === -1
                                                ? "∞"
                                                : profileCredits;

                                            return (
                                              <span
                                                title={`Job Posting Credits: ${
                                                  jobCredits === -1
                                                    ? "Unlimited"
                                                    : jobCredits
                                                } | CV Viewing Credits: ${
                                                  profileCredits === -1
                                                    ? "Unlimited"
                                                    : profileCredits
                                                }`}
                                                style={{ cursor: "pointer" }}
                                              >
                                                {jobDisplay}p / {profileDisplay}
                                                v
                                              </span>
                                            );
                                          })()}
                                        </td>

                                        {/* Daily Limits */}
                                        <td>
                                          {isPack
                                            ? (() => {
                                                const jobLimit =
                                                  item.dailyJobPostingLimit ??
                                                  0;
                                                const profileLimit =
                                                  item.dailyProfileViewingLimit ??
                                                  0;

                                                const jobDisplay =
                                                  jobLimit === -1
                                                    ? "∞"
                                                    : jobLimit;
                                                const profileDisplay =
                                                  profileLimit === -1
                                                    ? "∞"
                                                    : profileLimit;

                                                return (
                                                  <span
                                                    title={`Daily Job Posting Limit: ${
                                                      jobLimit === -1
                                                        ? "Unlimited"
                                                        : jobLimit
                                                    } | Daily CV Viewing Limit: ${
                                                      profileLimit === -1
                                                        ? "Unlimited"
                                                        : profileLimit
                                                    }`}
                                                    style={{
                                                      cursor: "pointer",
                                                      fontWeight: 500,
                                                    }}
                                                  >
                                                    {jobDisplay}p /{" "}
                                                    {profileDisplay}v
                                                  </span>
                                                );
                                              })()
                                            : "-"}
                                        </td>

                                        <td>
                                          <span
                                            className={`badge ${
                                              item.isActive
                                                ? "bg-success"
                                                : "bg-warning"
                                            }`}
                                          >
                                            {item.isActive
                                              ? "Active"
                                              : "Pending"}
                                          </span>
                                        </td>
                                      </tr>
                                    );
                                  },
                                )}
                              </>
                            )}
                          </tbody>
                        </table>
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
                      </div>
                    </div>
                  </div>
                </section>
              )}
              {currentRechargeRequests.length > 0 && (
                <section className="user-wallet-transaction-list">
                  <div className="employer-dashboard-common-heading">
                    <h2>Recharge Requests</h2>
                  </div>

                  <div className="table-responsive">
                    <table className="table table-bordered">
                      <thead>
                        <tr>
                          <th>#</th>
                          <th>Request Type</th>
                          <th>Requested Credits / Pack</th>
                          <th>Message</th>
                          <th>Status</th>
                          <th>Date</th>
                        </tr>
                      </thead>

                      <tbody>
                        {currentRechargeRequests.length === 0 ? (
                          <tr>
                            <td colSpan="7" className="text-center">
                              No recharge requests found
                            </td>
                          </tr>
                        ) : (
                          currentRechargeRequests.map((req, index) => (
                            <tr key={index}>
                              <td>{index + 1}</td>

                              {/* Request Type */}
                              <td>{req.type || "-"}</td>

                              {/* Requested Credits / Pack */}
                              <td>
                                {req.type === "PACK" && (
                                  <>
                                    <strong>Pack:</strong> {req.packName || "-"}
                                    <br />
                                    <strong>Job:</strong>{" "}
                                    {req.totalJobCredits ??
                                      req.jobCreditsRequested ??
                                      "-"}
                                    <br />
                                    <strong>CV:</strong>{" "}
                                    {req.totalProfileCredits ??
                                      req.profileCreditsRequested ??
                                      "-"}
                                  </>
                                )}

                                {req.type === "ADDON" && (
                                  <>
                                    <strong>Add-on:</strong>{" "}
                                    {req.addOnName || "-"}
                                    <br />
                                    <strong>Job:</strong>{" "}
                                    {req.totalJobCredits ?? "-"}
                                    <br />
                                    <strong>CV:</strong>{" "}
                                    {req.totalProfileCredits ?? "-"}
                                  </>
                                )}

                                {req.type === "MANUAL_CREDITS" && (
                                  <>
                                    Job: {req.jobCreditsRequested || "-"}
                                    <br />
                                    CV: {req.profileCreditsRequested || "-"}
                                  </>
                                )}
                              </td>

                              {/* Transaction ID */}

                              {/* Message */}
                              <td>{req.message || "-"}</td>

                              {/* Status */}
                              <td>
                                <span
                                  className={`badge ${
                                    req.status
                                      ?.toLowerCase()
                                      .includes("credits added")
                                      ? "bg-success"
                                      : "bg-warning text-dark"
                                  }`}
                                >
                                  {req.status || "Pending"}
                                </span>
                              </td>
                              {/* Date */}
                              <td>
                                {new Date(
                                  req.createdAt || req.requestedAt,
                                ).toLocaleDateString("en-GB")}
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                    <div className="paginations mb-30">
                      <ul>
                        <li>
                          <a
                            href="#"
                            onClick={(e) => {
                              e.preventDefault();
                              if (requestPage > 1)
                                handleRequestPageChange(requestPage - 1);
                            }}
                          >
                            <i className="fa-solid fa-angle-left" />
                          </a>
                        </li>

                        {Array.from({ length: requestTotalPages }, (_, i) => (
                          <li key={i + 1}>
                            <a
                              href="#"
                              className={requestPage === i + 1 ? "active" : ""}
                              onClick={(e) => {
                                e.preventDefault();
                                handleRequestPageChange(i + 1);
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
                              if (requestPage < requestTotalPages)
                                handleRequestPageChange(requestPage + 1);
                            }}
                          >
                            <i className="fa-solid fa-angle-right" />
                          </a>
                        </li>
                      </ul>
                    </div>
                  </div>
                </section>
              )}
              {currentPayments.length > 0 && (
                <section>
                  <div className="employer-dashboard-common-heading">
                    <h2>Payment History</h2>
                  </div>

                  <table className="table">
                    <thead>
                      <tr>
                        <th>#</th>
                        <th>Transaction ID</th>
                        <th>Plan</th>
                        <th>Amount</th>
                        <th>Payment Method</th>
                        <th>Status</th>
                        <th>Date</th>
                        <th>Invoice</th>
                      </tr>
                    </thead>

                    <tbody>
                      {currentPayments.length > 0 ? (
                        currentPayments.map((payment, index) => (
                          <tr key={payment._id}>
                            <td>{indexOfFirstRow + index + 1}</td>

                            {/* Transaction ID */}
                            <td>{payment._id}</td>

                            {/* Plan Name + Type */}
                            <td>
                              {payment.planName}
                              <br />
                              <small className="text-muted">
                                {payment.planType}
                              </small>
                            </td>

                            {/* Amount */}
                            <td>
                              {payment.currency} {payment.amount}
                            </td>

                            {/* Payment Method */}
                            <td>{payment.paymentMethod}</td>

                            {/* Status */}
                            <td>
                              <span
                                className={`badge ${
                                  payment.status === "Success"
                                    ? "bg-success"
                                    : "bg-secondary"
                                }`}
                              >
                                {payment.status}
                              </span>
                            </td>

                            {/* Date */}
                            <td>
                              {new Date(payment.paymentDate).toLocaleDateString(
                                "en-GB",
                              )}
                            </td>

                            {/* Invoice */}
                            <td>
                              {payment.invoice?._id ? (
                                <span
                                  style={{
                                    cursor: "pointer",
                                    color: "#0d6efd",
                                  }}
                                  onClick={() =>
                                    navigate(
                                      `/view-invoice/${payment.invoice._id}`,
                                    )
                                  }
                                  title="View Invoice"
                                >
                                  <i className="fa-solid fa-eye"></i>
                                </span>
                              ) : (
                                <span className="text-muted">N/A</span>
                              )}
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td
                            colSpan="8"
                            className="text-center text-muted py-4"
                          >
                            No payment history found
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                  <div className="paginations mb-30">
                    <ul>
                      {/* Previous button */}
                      <li>
                        <a
                          href="#"
                          onClick={(e) => {
                            e.preventDefault();
                            if (currentPage > 1)
                              handlePageChange(currentPage - 1);
                          }}
                          className={currentPage === 1 ? "disabled" : ""}
                        >
                          <i className="fa-solid fa-angle-left" />
                        </a>
                      </li>

                      {/* Page numbers */}
                      {Array.from({ length: totalPages }, (_, i) => (
                        <li key={i + 1}>
                          <a
                            href="#"
                            className={currentPage === i + 1 ? "active" : ""}
                            onClick={(e) => {
                              e.preventDefault();
                              handlePageChange(i + 1);
                            }}
                          >
                            {i + 1}
                          </a>
                        </li>
                      ))}

                      {/* Next button */}
                      <li>
                        <a
                          href="#"
                          onClick={(e) => {
                            e.preventDefault();
                            if (currentPage < totalPages)
                              handlePageChange(currentPage + 1);
                          }}
                          className={
                            currentPage === totalPages ? "disabled" : ""
                          }
                        >
                          <i className="fa-solid fa-angle-right" />
                        </a>
                      </li>
                    </ul>
                  </div>
                </section>
              )}
            </>
          )}
          {/* Your Job Posts Info */}
          <div className="copy-right-area bg-f0f4fc">
            <div className="row">
              <div className="col-lg-6 col-md-6">
                <div className="copyright-left-content">
                  <p>
                    {" "}
                    <span className="copy">© </span>
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
      {/* <!-- End Main Dashboard Content Wrapper Area --> */}
    </>
  );
};

export default EmployerWallet;
