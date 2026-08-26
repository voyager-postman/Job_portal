import React, { useState, useEffect } from "react";
import axios from "axios";
import { API_BASE_URL } from "../Url/Url";
import { useLocation, Link, useNavigate } from "react-router-dom";
import { API_IMAGE_URL } from "../Url/Url";
import { ToastContainer, toast } from "react-toastify";
import { openProtectedDocument } from "../utils/protectedFile";
import { useTranslation } from "react-i18next";
import { getRequestConfig } from "../utils/apiHeaders";
import { resolveMediaUrl } from "../utils/companyLogo";

function CandinateProfileDetails() {
  const { t } = useTranslation("global");
  const location = useLocation();
  const navigate = useNavigate();
  const { userId } = location.state || {};
  console.log(userId);
  const [candidate, setCandidate] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [rating, setRating] = useState(0); // selected rating
  const [hover, setHover] = useState(0); // star hover effect
  const [review, setReview] = useState("");
  const [reviews, setReviews] = useState([]);
  const from = location.state?.from || {};

  const breadcrumbLabel =
    from === "/bookmark-candidate"
      ? t("breadcrumbs.bookmark_candidates")
      : t("breadcrumbs.candidate_search");

  useEffect(() => {
    if (userId) {
      fetchCandidateDetails(userId);
    }
  }, [userId]);

  const fetchCandidateDetails = async (id) => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const res = await axios.post(
        `${API_BASE_URL}getCandidateDetails/${id}`,
        {},
        getRequestConfig(),
      );
      console.log(res.data?.data);
      setCandidate(res.data?.data); // store the candidate details
    } catch (err) {
      console.error("Error fetching candidate details:", err);
    } finally {
      setLoading(false);
    }
  };
  const cleanImageUrl = (url) => resolveMediaUrl(url) || "";

  const getReviewsByUser = async (userId) => {
    try {
      const token = localStorage.getItem("token");

      const res = await axios.get(`${API_BASE_URL}getReviews/${userId}`, getRequestConfig());

      setReviews(res.data?.data || []);
    } catch (err) {
      console.error("Error fetching reviews:", err);
    }
  };
  useEffect(() => {
    if (userId) {
      getReviewsByUser(userId);
    }
  }, [userId]);
  const renderStars = (rating) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <i
          key={i}
          className={i <= rating ? "fa-solid fa-star" : "fa-regular fa-star"}
        ></i>,
      );
    }
    return <div className="rating-stars">{stars}</div>;
  };

  const truncateText = (text, limit = 100) => {
    if (!text) return "";
    return text.length > limit ? text.substring(0, limit) + "..." : text;
  };
  const handleUnlockContact = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.post(
        `${API_BASE_URL}viewCandidate/${candidate?.userId?._id}`,
        {},
        getRequestConfig(),
      );

      if (!response.data.success) {
        toast.error(response.data.message);
        if (response.data.is_exhausted === 1) {
          setTimeout(() => navigate("/add-plan"), 2000);
        }
        return;
      }

      const refreshed = await axios.post(
        `${API_BASE_URL}getCandidateDetails/${candidate?.userId?._id}`,
        {},
        getRequestConfig(),
      );
      setCandidate(refreshed.data?.data);
    } catch (error) {
      const message = error.response?.data?.message;
      const exhausted = error.response?.data?.is_exhausted;
      toast.error(message || "Something went wrong");
      if (exhausted === 1) {
        setTimeout(() => navigate("/add-plan"), 2000);
      }
    }
  };

  const handleDownloadCV = async () => {
    const resumes = candidate?.resumeUrls;

    if (!resumes || resumes.length === 0) {
      toast.info("No CV uploaded by candidate", {
        position: "top-right",
        autoClose: 3000,
      });
      return;
    }

    const latestResume = resumes[resumes.length - 1];
    await openProtectedDocument(latestResume?.url || latestResume, {
      token: localStorage.getItem("token"),
      toast,
      context: "recruiter",
      fileKind: "resumes",
    });
  };

  const JobListLoader = () => (
    <div className="text-center py-5">
      <div className="spinner-border text-primary mb-3" role="status" />
      <p>Loading BookMark Candidates, please wait...</p>
    </div>
  );
  return (
    <>
      <ToastContainer />

      <section className="inner-breadcrumb-main-area ">
        <div className="container">
          <div className="row">
            <div className="col-lg-12 col-sm-12">
              <div className="breadcrumb-main-list-area mt-0">
                <h4>Candidate Details</h4>
                <ul>
                  <li>
                    <Link to="/">{t("header.home")}</Link>
                    <i className="fa-solid fa-angle-right"></i>
                  </li>
                  <li>
                    <Link to="/employer-dashboard">{t("header.dashboard")}</Link>
                    <i className="fa-solid fa-angle-right"></i>
                  </li>
                  <li>
                    <Link to={from}>{breadcrumbLabel}</Link>
                    <i className="fa-solid fa-angle-right"></i>
                  </li>
                  <li>Candidate Details</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="candidates-details-banner-area candidate-banner-info bg-f0f4fc">
        <div className="container">
          <div className="row align-items-center">
            <div className="col-lg-7 col-md-8">
              <div className="candidates-details-left-content">
                <div className="candidates-img">
                  <img
                    crossOrigin="anonymous"
                    src={
                      cleanImageUrl(candidate?.userId?.profileImage) ||
                      "assets/images/userIcon.png"
                    }
                    alt="Image"
                    loading="lazy"
                    decoding="async"
                  />
                </div>
                <div className="candidates-content">
                  <div className="candidate-profile-details-info">
                    <h3>
                      <strong>Name:</strong>{" "}
                      <span>
                        {candidate?.userId?.first_name
                          ?.toLowerCase()
                          .replace(/^\w/, (c) => c.toUpperCase()) ||
                          "Not Provided"}{" "}
                        {candidate?.userId?.last_name
                          ?.toLowerCase()
                          .replace(/^\w/, (c) => c.toUpperCase())}
                      </span>
                    </h3>
                    <h3>
                      <strong>Position:</strong>{" "}
                      <span>
                        {candidate?.aboutRole?.jobTitle
                          ?.toLowerCase()
                          .replace(/^\w/, (c) => c.toUpperCase()) ||
                          "Not Provided"}{" "}
                      </span>
                    </h3>
                    <h3>
                      <strong>Email:</strong>{" "}
                      {candidate?.isUnlocked
                        ? candidate?.userId?.email || "Not Provided"
                        : "Hidden until unlocked"}
                    </h3>
                    <h3>
                      <strong>Contact:</strong>{" "}
                      {candidate?.isUnlocked
                        ? candidate?.userId?.countryCode
                          ? `+${candidate.userId.countryCode} ${
                              candidate?.userId?.phone || ""
                            }`
                          : candidate?.userId?.phone || "Not Provided"
                        : "Hidden until unlocked"}
                    </h3>
                    <h3>
                      <strong>Address:</strong>{" "}
                      {candidate?.userId?.city
                        ?.toLowerCase()
                        .replace(/^\w/, (c) => c.toUpperCase()) ||
                        "Not Provided"}{" "}
                    </h3>
                    {/* <h3>
                      <strong>Chat:</strong>{" "}
                      <span
                        style={{
                          padding: "2px 5px",
                          borderRadius: "5px",
                          fontSize: "12px",
                          fontWeight: "700",
                          display: "inline-block",
                          letterSpacing: "0.5px",
                          background: "#f05a1c",
                          color: "#fff",
                        }}
                      >
                        <Link
                          to="/messaging-system"
                          state={{ jobId: candidate?.userId?._id }}
                          style={{
                            color: "#fff",
                          }}
                        >
                          Send Message
                        </Link>
                      </span>
                    </h3> */}
                  </div>
                </div>
              </div>
            </div>
            <div className="col-lg-5 col-md-4">
              <div className="candidate-profile-dcv-btn">
                {candidate?.isUnlocked ? (
                  <button
                    type="button"
                    className="default-btn btn"
                    onClick={handleDownloadCV}
                  >
                    {t("header.Download_CV")}
                  </button>
                ) : (
                  <button
                    type="button"
                    className="default-btn btn"
                    onClick={handleUnlockContact}
                  >
                    View / Reveal contact
                  </button>
                )}
              </div>
              <div className="candidates-share-content">
                <h4>Social Media</h4>
                <ul>
                  <li>
                    <a href={candidate?.links?.portfolio} target="_blank">
                      <i className="fa-solid fa-globe" />
                    </a>
                  </li>
                  <li>
                    <a href={candidate?.links?.github} target="_blank">
                      <i className="fa-brands fa-github" />
                    </a>
                  </li>
                  <li>
                    <a href={candidate?.links?.linkedin} target="_blank">
                      <i className="fa-brands fa-linkedin-in" />
                    </a>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="candidates-details-area pt-100 pb-70">
        <div className="container">
          <div className="row">
            <div className="col-lg-8">
              <div className="candidates-details-content">
                <div className="about-content candidate-profile-summary">
                  <h3>{t("header.Professional_Summary")}</h3>
                  <p>{candidate?.professionalSummary}</p>
                </div>
                <div className="candidate-profile-divider-line" />
                <div className="candidate-profile-detail-info candidate-profile-summary">
                  <h3>Career Goals</h3>
                  <h5>Desired Job Title</h5>
                  <p>
                    {(candidate?.career_goals?.DesiredJobTitle || "")
                      .toString()
                      .toLowerCase()
                      .replace(/^\w/, (c) => c.toUpperCase()) || "Not Provided"}
                  </p>
                  <h5>Desired Employment Type</h5>
                  <p>
                    {(candidate?.career_goals?.DesiredEmploymentType || "")
                      .toString()
                      .toLowerCase()
                      .replace(/^\w/, (c) => c.toUpperCase()) || "Not Provided"}
                  </p>
                  <h5>Desired Occupation Type</h5>
                  <p>
                    {(candidate?.career_goals?.DesiredOccupationType || "")
                      .toString()
                      .toLowerCase()
                      .replace(/^\w/, (c) => c.toUpperCase()) || "Not Provided"}
                  </p>
                  <div className="candidate-profile-divider-line" />
                  <h3>Other Preferences</h3>
                  {candidate?.career_goals ? (
                    <>
                      <h5>Eligible to work in</h5>
                      <p>{candidate.eligibleToWorkInFrance ? "France" : "-"}</p>

                      <h5>Minimum Desired Salary (Gross)</h5>
                      {candidate.career_goals.MinimumDesiredSalary ? (
                        <p>
                          {candidate.career_goals.MinimumDesiredSalary.currency}{" "}
                          {candidate.career_goals.MinimumDesiredSalary.amount} /{" "}
                          {candidate.career_goals.MinimumDesiredSalary.type}
                        </p>
                      ) : (
                        <p>Not specified</p>
                      )}

                      <h5>Looking for a new job opportunity?</h5>
                      <p>
                        {candidate.career_goals.jobSearchStatus ||
                          "Not specified"}
                      </p>
                    </>
                  ) : (
                    <p>No career goals specified</p>
                  )}
                </div>
                <div className="candidate-profile-divider-line" />
                <div className="candidate-profile-detail-info candidate-profile-summary">
                  <h3>About your role</h3>
                  <h5>Job Title</h5>
                  <p>
                    {candidate?.aboutRole?.jobTitle
                      ?.toLowerCase()
                      .replace(/^\w/, (c) => c.toUpperCase()) ||
                      "Not Provided"}{" "}
                  </p>
                  <h5>Years of experience</h5>
                  <p>{candidate?.aboutRole?.yearOfExperience} Years</p>
                  <h5>Job category</h5>
                  <p>
                    {candidate?.aboutRole?.jobCategory
                      ?.toLowerCase()
                      .replace(/^\w/, (c) => c.toUpperCase()) ||
                      "Not Provided"}{" "}
                  </p>
                </div>
                <div className="candidate-profile-divider-line" />
                {/* <div className="works-experience candidate-profile-summary">
                  <h3>Experience</h3>
                  <h5>Website Designer</h5>
                  <p>Feb 2020 - Until now</p>
                  <h5>Agriculture PVT LTD</h5>
                  <p>United States, TN, Cordova, Frence Creek Cv S Full-time</p>
                  <h5>Description</h5>
                  <p>
                    We are a dynamic agricultural products, farming, and service
                    company committed to meeting the diverse needs of farmers,
                    wholesale markets, traders, exportersWe are a dynamic
                    agricultural products, farming, and service company
                    committed to meeting the diverse needs of farmers, wholesale
                    markets, traders, exportersWe are a dynamic agricultural
                    products, farming, and service company committed to meeting
                    the diverse needs of farmers, wholesale markets, traders,
                    exporters
                  </p>
                  <h3>Position Salary(Gross)</h3>
                  <h5>Salary</h5>
                  <p>2000 $</p>
                  <h5>Payroll frequency</h5>
                  <p>Monthly</p>
                </div> */}
                <div className="works-experience candidate-profile-summary">
                  <h3>{t("header.Work_Experience")}</h3>
                  {candidate?.workHistory &&
                  candidate.workHistory.length > 0 ? (
                    candidate.workHistory.map((work) => {
                      const startDate = new Date(work.startDate);
                      const endDate = work.currentlyWorkingHere
                        ? "Until now"
                        : new Date(work.endDate);
                      return (
                        <div key={work._id} className="work-history-item">
                          {/* Job Title */}
                          <h5>
                            {work.jobTitle
                              ?.toLowerCase()
                              .replace(/^\w/, (c) => c.toUpperCase()) ||
                              "Not Provided"}{" "}
                          </h5>

                          {/* Duration */}
                          <p>
                            {startDate.toISOString().split("T")[0]} -{" "}
                            {work.currentlyWorkingHere
                              ? "Present"
                              : endDate
                                ? endDate.toISOString().split("T")[0]
                                : ""}
                          </p>

                          {!work?.keep_employer_anonymous && (
                            <p>
                              <i className="fa-regular fa-building" />{" "}
                              {work.companyName}
                            </p>
                          )}
                          <p>{work.EmploymentType}</p>
                          <label>Years of Experience</label>
                          <p>{work.yearOfExperience}</p>
                          {/* Company Info */}
                          {!work.keep_employer_anonymous && (
                            <>
                              <h5>{work.companyName}</h5>
                              <p>
                                {work.workLocation || "Location not specified"},{" "}
                                {work.EmploymentType ||
                                  "Employment type not specified"}
                              </p>
                            </>
                          )}
                          {/* Job Description */}
                          {work.Description && (
                            <>
                              <h5>Achievements</h5>
                              <p>{work.Description}</p>
                            </>
                          )}
                          {work.workLocation && (
                            <>
                              <h5>Work Location</h5>
                              <p>{work.workLocation}</p>
                            </>
                          )}

                          {/* Salary Section */}
                          {work.currentSalary && (
                            <>
                              <h3>Position Salary (Gross)</h3>
                              <h5>Salary</h5>
                              <p>
                                {work.currentSalary.amount}{" "}
                                {work.currentSalary.currency}
                              </p>
                              <h5>Payroll frequency</h5>
                              <p>{work.currentSalary.payrollFrequency}</p>
                            </>
                          )}
                          <div className="divder-line-info-otherCompany" />
                        </div>
                      );
                    })
                  ) : (
                    <p>No work experience available</p>
                  )}
                </div>

                <div className="candidate-profile-divider-line" />
                <div className="education candidate-profile-summary">
                  <h3>Education</h3>
                  {candidate?.education && candidate.education.length > 0 ? (
                    candidate.education.map((work, index) => {
                      const startDate = new Date(work.startDate);
                      const endDateObj = work.currentlyStudyingHere
                        ? null
                        : new Date(work.endDate);

                      return (
                        <div key={work._id}>
                          <div className="work-history-item">
                            <h5>Degree</h5>
                            <p>
                              {work.degree
                                ?.toLowerCase()
                                .replace(/^\w/, (c) => c.toUpperCase()) ||
                                "Not Provided"}
                            </p>

                            <h5>University</h5>
                            <p>
                              {work.University?.toLowerCase().replace(
                                /^\w/,
                                (c) => c.toUpperCase(),
                              ) || "Not Provided"}
                            </p>

                            <h5>Start Date</h5>
                            <p>
                              {startDate.toLocaleString("default", {
                                day: "2-digit",
                                month: "short",
                                year: "numeric",
                              })}
                            </p>

                            <h5>End Date</h5>
                            <p>
                              {work.currentlyStudyingHere ? (
                                "Until now"
                              ) : (
                                <>
                                  {endDateObj.toLocaleString("default", {
                                    month: "short",
                                  })}{" "}
                                  {endDateObj.getFullYear()}
                                </>
                              )}
                            </p>
                          </div>

                          {/* Divider only between items, not after the last */}
                          {index !== candidate.education.length - 1 && (
                            <div className="candidate-profile-divider-line" />
                          )}
                        </div>
                      );
                    })
                  ) : (
                    <p>No education information available</p>
                  )}
                </div>
                <div className="skill-content candidate-profile-summary">
                  <h3>Skills</h3>
                  <div className="candidate-profile-skill-info">
                    <ul>
                      {candidate?.skills && candidate.skills.length > 0 ? (
                        candidate.skills.map((skill, index) => (
                          <li key={index}>{skill}</li>
                        ))
                      ) : (
                        <li>No skills listed</li>
                      )}
                    </ul>
                  </div>
                </div>
                <div className="candidate-profile-divider-line" />
                <div className="languages candidate-profile-summary">
                  <h3>{t("header.Languages")}</h3>
                  {candidate?.languages && candidate.languages.length > 0 ? (
                    candidate.languages.map((lang) => (
                      <div key={lang._id}>
                        <h5>{lang.language}</h5>
                        <p>{lang.proficiency}</p>
                      </div>
                    ))
                  ) : (
                    <p>No languages listed</p>
                  )}
                </div>
                <div className="candidate-profile-divider-line" />
                <div className="languages candidate-profile-summary">
                  <h3>Certificates</h3>
                  {candidate?.certificates &&
                  candidate.certificates.length > 0 ? (
                    candidate.certificates.map((cert) => (
                      <div key={cert._id}>
                        <h5>
                          {cert.title
                            .toLowerCase()
                            .replace(/^\w/, (c) => c.toUpperCase()) ||
                            "Not Provided"}
                        </h5>
                        <p>
                          Issue Date: {new Date(cert.issueDate).getFullYear()}
                        </p>
                      </div>
                    ))
                  ) : (
                    <p>No certificates available</p>
                  )}
                </div>
                <div className="candidate-profile-divider-line" />
                <div className="candidate-profile-review-heading">
                  <h3>Reviews</h3>
                </div>

                {reviews.length > 0 ? (
                  reviews.map((item, index) => {
                    const name =
                      item?.senderCompany?.brandName ||
                      item?.sender?.first_name ||
                      "Anonymous";

                    const profileImage = item?.senderCompany?.logo
                      ? `${API_IMAGE_URL}${item.senderCompany.logo}`
                      : "/jobPortal/assets/images/dashboard/images1.png";

                    return (
                      <div className="comment-detail-main-area" key={index}>
                        {/* USER IMAGE */}
                        <div className="user-img-main-area">
                          <img
                            crossOrigin="anonymous"
                            src={profileImage}
                            alt="user"
                            onError={(e) =>
                              (e.target.src =
                                "/jobPortal/assets/images/dashboard/images1.png")
                            }
                            loading="lazy"
                            decoding="async"
                          />
                        </div>

                        {/* CONTENT */}
                        <div className="user-content-main-area">
                          {/* Reviewer Name */}
                          <h5>{name}</h5>

                          {/* ⭐ STAR RATING */}
                          <div className="star-rating">
                            {renderStars(item?.rating)}
                          </div>

                          {/* Date */}
                          <h6>{new Date(item?.createdAt).toLocaleString()}</h6>

                          {/* Message */}
                          <p>{truncateText(item?.message, 100)}</p>
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <p>No reviews found.</p>
                )}
              </div>
            </div>
            <div className="col-lg-4">
              <div className="sidebar">
                <div className="candidate-profile-summary single-sidebar-widget job-overview">
                  <h3>Candidate Informations</h3>
                  <ul>
                    <li>
                      <span> Experience :</span>
                      {candidate?.aboutRole?.yearOfExperience || 0} Years
                    </li>
                    <li>
                      {/* <span>Current salary :</span>$2000 */}
                      <span>Phone No.:</span>
                      {candidate?.isUnlocked
                        ? candidate?.userId?.phone || "Not Provided"
                        : "Hidden until unlocked"}
                    </li>
                    <li>
                      <span>Education level :</span>
                      {candidate?.education[0]?.degree
                        .toLowerCase()
                        .replace(/^\w/, (c) => c.toUpperCase()) ||
                        "Not Provided"}{" "}
                    </li>
                    <li>
                      <span>Year of birth : </span>
                      {candidate?.userId?.date_of_birth
                        ? new Date(
                            candidate.userId.date_of_birth,
                          ).toLocaleDateString("en-GB")
                        : "Not Provided"}
                    </li>
                    <li>
                      <span>Location :</span>
                      {candidate?.userId?.city
                        .toLowerCase()
                        .replace(/^\w/, (c) => c.toUpperCase()) ||
                        "Not Provided"}{" "}
                    </li>
                    <li>
                      <span>Job category :</span>
                      {candidate?.aboutRole?.jobCategory || "Not Provided"}
                    </li>
                    <li>
                      <span>Gender :</span>
                      {candidate?.userId?.gender || "Not Provided"}
                    </li>
                    <li>
                      <span>Language :</span>
                      {candidate?.languages?.length > 0
                        ? candidate.languages
                            .map((lang) => lang.language)
                            .join(", ")
                        : "Not Provided"}
                    </li>
                  </ul>
                </div>
                <div className="candidate-profile-summary single-sidebar-widget download">
                  {candidate?.isUnlocked ? (
                    <button
                      type="button"
                      className="default-btn btn"
                      onClick={handleDownloadCV}
                    >
                      {t("header.Download_CV")}
                    </button>
                  ) : (
                    <button
                      type="button"
                      className="default-btn btn"
                      onClick={handleUnlockContact}
                    >
                      View / Reveal contact
                    </button>
                  )}
                </div>
              </div>

              <div className="contact-candidate-form">
                <div className="candidate-profile-submit-btn">
                  <button
                    type="button"
                    className="default-btn btn"
                    onClick={() => setShowModal(true)}
                  >
                    Rating
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {showModal && (
        <div className="custom-modal-overlay">
          <div className="custom-modal">
            <div className="modal-header">
              <h5>{t("header.Add_Review")}</h5>
              <span className="modal-close" onClick={() => setShowModal(false)}>
                &times;
              </span>
            </div>

            {/* ⭐ Star Rating */}
            <div className="star-rating-modal">
              {[1, 2, 3, 4, 5].map((star) => (
                <i
                  key={star}
                  className={
                    star <= (hover || rating)
                      ? "fa-solid fa-star"
                      : "fa-regular fa-star"
                  }
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHover(star)}
                  onMouseLeave={() => setHover(0)}
                />
              ))}
            </div>

            {/* Review Textarea */}
            <textarea
              className="form-control"
              placeholder={t("header.Write_Message")}
              rows={6}
              value={review}
              onChange={(e) => setReview(e.target.value)}
            />

            {/* Submit */}
            <button
              className="default-btn btn w-100 mt-3"
              onClick={async () => {
                if (!rating) return toast.error(t("header.Please_select_a_rating"));
                if (!review.trim())
                  return toast.error(t("jobs.review_cannot_be_empty"));

                const token = localStorage.getItem("token");

                try {
                  const res = await axios.post(
                    `${API_BASE_URL}addReview`,
                    {
                      receiver: candidate?.userId, // 👉 Receiver = candidate userId
                      message: review,
                      rating: rating,
                    },
                    {
                      headers: {
                        Authorization: `Bearer ${token}`,
                      },
                    },
                  );
                  getReviewsByUser(userId);
                  toast.success(t("header.Review_submitted_successfully"));
                  setShowModal(false);
                  setReview("");
                  setRating(0);
                } catch (error) {
                  console.error("Error submitting review:", error);
                  toast.error(t("header.Failed_to_submit_review"));
                }
              }}
            >
              {t("header.Submit_Review")}
            </button>
          </div>
        </div>
      )}
    </>
  );
}

export default CandinateProfileDetails;
