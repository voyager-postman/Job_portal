import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { API_BASE_URL } from "../Url/Url";
import axios from "axios"


const EmployerWallet = () => {
  const [credits, setCredits] = useState("");
  const [loading, setLoading] = useState(false);
  useEffect(() => {
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
    fetchcreditStatus();
  }, []);
  if (!credits) return null;

  const {
    hasWelcomePack,
    hasPurchasedPack,
    welcomePack,
    purchasedPack,
    usageToday,
    remainingToday,
  } = credits;
  const JobListLoader = () => (
    <div className="text-center py-5">
      <div className="spinner-border text-primary mb-3" role="status" />
      <p>Loading User Wallet, please wait...</p>
    </div>
  );

  return (
    <>
      {/* <!-- Start Main Dashboard Content Wrapper Area --> */}
      <div className="main-dashboard-content d-flex flex-column">
        <div className="responsive-content">
          {/* <!-- Breadcrumb Area --> */}
          <div className="breadcrumb-area">
            <h1>User Wallet</h1>
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
                <i className="fa-solid fa-angle-right"></i> User Wallet
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
                        <span>{credits.fullCredit?.totalJobCredits}</span>
                      </h4>
                      <h4>
                        Total profile viewing credits:{" "}
                        <span>{credits.fullCredit?.totalProfileCredits}</span>
                      </h4>
                    </div>
                    <div className="user-wallet-credit-buy-button">
                      <a
                        href="#"
                        className="credit-buy-btn"
                        data-bs-toggle="modal"
                        data-bs-target="#exampleModal"
                      >
                        Add credits
                      </a>
                      <Link to="/add-plan" className="credit-buy-btn">
                        Add Plan
                      </Link>
                      <Link to="/add-on-pack" className="credit-buy-btn">
                        Add On Pack
                      </Link>
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
                            {/* Jobs Today */}
                            <div className="user-wallet-credit-box">
                              <h3>
                                {usageToday?.jobPostingUsed || 0} /
                                {remainingToday?.jobPostingRemaining || 0}
                              </h3>
                              <h4>Jobs created today</h4>
                              <h4>
                                Daily Job Limit: {welcomePack.dailyJobLimit}
                              </h4>
                              <p>
                                Daily limits reset automatically at midnight
                              </p>
                            </div>

                            {/* Profiles Today */}
                            <div className="user-wallet-credit-box">
                              <h3>
                                {usageToday?.profileViewingUsed || 0} /
                                {remainingToday?.profileViewingRemaining || 0}
                              </h3>
                              <h4>Profiles viewed today</h4>
                              <h4>
                                Daily Profile Limit:{" "}
                                {welcomePack.dailyProfileLimit}
                              </h4>
                              <p>
                                Daily limits reset automatically at midnight
                              </p>
                            </div>

                            {/* Validity */}
                            <div className="user-wallet-credit-box">
                              <h3>{welcomePack.daysLeft} Days</h3>
                              <h4>Validity Period</h4>
                              <p>
                                Expiry:{" "}
                                {new Date(
                                  welcomePack.expiresAt
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
                            {/* Jobs Today */}
                            <div className="user-wallet-credit-box">
                              <h3>
                                {usageToday?.jobPostingUsed || 0} /
                                {remainingToday?.jobPostingRemaining || 0}
                              </h3>
                              <h4>Jobs created today</h4>
                              <h4>
                                Daily Job Limit: {purchasedPack.dailyJobLimit}
                              </h4>
                              <p>
                                Daily limits reset automatically at midnight
                              </p>
                            </div>

                            {/* Profiles Today */}
                            <div className="user-wallet-credit-box">
                              <h3>
                                {usageToday?.profileViewingUsed || 0} /
                                {remainingToday?.profileViewingRemaining || 0}
                              </h3>
                              <h4>Profiles viewed today</h4>
                              <h4>
                                Daily Profile Limit:{" "}
                                {purchasedPack.dailyProfileLimit}
                              </h4>
                              <p>
                                Daily limits reset automatically at midnight
                              </p>
                            </div>

                            {/* Validity */}
                            <div className="user-wallet-credit-box">
                              <h3>{purchasedPack.daysLeft} Days</h3>
                              <h4>Validity Period</h4>
                              <p>
                                Expiry:{" "}
                                {new Date(
                                  purchasedPack.expiresAt
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
                  <div className="accordion-item">
                    <h2 className="accordion-header">
                      <button
                        className="accordion-button collapsed"
                        type="button"
                        data-bs-toggle="collapse"
                        data-bs-target="#adOnPack"
                      >
                        Add on Pack
                        <span className="PlusIcon">
                          <i className="fa-solid fa-plus" />
                        </span>
                        <span className="MinusIcon">
                          <i className="fa-solid fa-minus" />
                        </span>
                      </button>
                    </h2>

                    <div
                      id="adOnPack"
                      className="accordion-collapse collapse"
                      data-bs-parent="#accordionExample"
                    >
                      <div className="accordion-body">
                        <div className="user-wallet-credit-limit">
                          {/* Jobs Today */}
                          <div className="user-wallet-credit-box">
                            <h3>
                              {usageToday?.jobPostingUsed || 0} /
                              {remainingToday?.jobPostingRemaining || 0}
                            </h3>
                            <h4>Jobs created today</h4>
                            <h4>
                              Daily Job Limit: {purchasedPack.dailyJobLimit}
                            </h4>
                            <p>Daily limits reset automatically at midnight</p>
                          </div>

                          {/* Profiles Today */}
                          <div className="user-wallet-credit-box">
                            <h3>
                              {usageToday?.profileViewingUsed || 0} /
                              {remainingToday?.profileViewingRemaining || 0}
                            </h3>
                            <h4>Profiles viewed today</h4>
                            <h4>
                              Daily Profile Limit:{" "}
                              {purchasedPack.dailyProfileLimit}
                            </h4>
                            <p>Daily limits reset automatically at midnight</p>
                          </div>

                          {/* Validity */}
                          <div className="user-wallet-credit-box">
                            <h3>{purchasedPack.daysLeft} Days</h3>
                            <h4>Validity Period</h4>
                            <p>
                              Expiry:{" "}
                              {new Date(
                                purchasedPack.expiresAt
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
                  {/* ===================== NO ACTIVE PLAN ===================== */}
                  {!hasWelcomePack && !hasPurchasedPack && (
                    <div className="user-wallet-credit-limit">
                      <div className="user-wallet-credit-box">
                        <h3>0 / 0</h3>
                        <h4>No Active Plan</h4>
                        <p>Please purchase a plan to continue</p>
                      </div>
                    </div>
                  )}
                </div>
              </section>

              <section className="user-wallet-transaction-list">
                <div className="employer-dashboard-common-heading">
                  <h2>Global credit Transactions Details</h2>
                </div>

                <div className="user-wallet-transaction-tab">
                  <ul className="nav nav-tabs" role="tablist">
                    <li className="nav-item" role="presentation">
                      <a
                        className="nav-link active"
                        id="credit-tab"
                        data-bs-toggle="tab"
                        href="#creditTab"
                        role="tab"
                        aria-controls="creditTab"
                        aria-selected="true"
                      >
                        Credit History
                      </a>
                    </li>
                    <li className="nav-item" role="presentation">
                      <a
                        className="nav-link"
                        id="debit-tab"
                        data-bs-toggle="tab"
                        href="#debitTab"
                        role="tab"
                        aria-controls="debitTab"
                        aria-selected="false"
                      >
                        Debit History
                      </a>
                    </li>
                  </ul>
                </div>

                <div className="tab-content user-wallet-transaction-table">
                  {/* <!-- Credit Tab --> */}
                  <div
                    className="tab-pane fade show active"
                    id="creditTab"
                    role="tabpanel"
                    aria-labelledby="credit-tab"
                  >
                    <table className="table table-bordered table-responsive">
                      <thead>
                        <tr>
                          <th>Sr. No.</th>
                          <th>Credit</th>
                          <th>Transaction Type</th>
                          <th>Date</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td>1</td>
                          <td>10</td>
                          <td>
                            Total Job posting credits <a href="#">View...</a>
                          </td>
                          <td>30-Oct-2025</td>
                        </tr>
                        <tr>
                          <td>2</td>
                          <td>20</td>
                          <td>
                            Total profile viewing credits{" "}
                            <a href="#">View...</a>
                          </td>
                          <td>06-Nov-2025</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>

                  {/* <!-- Debit Tab --> */}
                  <div
                    className="tab-pane fade"
                    id="debitTab"
                    role="tabpanel"
                    aria-labelledby="debit-tab"
                  >
                    <table className="table table-bordered table-responsive">
                      <thead>
                        <tr>
                          <th>Sr. No.</th>
                          <th>Debit</th>
                          <th>Transaction Type</th>
                          <th>Date</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td>1</td>
                          <td>2</td>
                          <td>Job Posting Used</td>
                          <td>09-Nov-2025</td>
                        </tr>
                        <tr>
                          <td>2</td>
                          <td>10</td>
                          <td>Profile Views Used</td>
                          <td>10-Nov-2025</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </section>
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
