import React, { useState, useEffect } from "react";
import axios from "axios";
import { API_BASE_URL } from "../Url/Url";
import { useLocation } from "react-router-dom";
import { API_IMAGE_URL } from "../Url/Url";
import { toast } from "react-toastify";

function CandinateProfileDetails() {
  const location = useLocation();
  const { userId } = location.state || {};
  console.log(userId);
  const [candidate, setCandidate] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [rating, setRating] = useState(0); // selected rating
  const [hover, setHover] = useState(0); // star hover effect
  const [review, setReview] = useState("");
  const [reviews, setReviews] = useState([]);
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
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      console.log(res.data?.data[0]);
      setCandidate(res.data?.data[0]); // store the candidate details
    } catch (err) {
      console.error("Error fetching candidate details:", err);
    } finally {
      setLoading(false);
    }
  };
  const cleanImageUrl = (url) => {
    if (!url) return "";

    // Case: wrong URL like "/uploads/https://..."
    if (url.includes("uploads/https")) {
      return url.substring(url.indexOf("https"));
    }

    // Case: full external URL
    if (url.startsWith("http")) {
      return url;
    }

    // Case: local upload (relative path)
    return `${API_IMAGE_URL}${url}`;
  };

  const getReviewsByUser = async (userId) => {
    try {
      const token = localStorage.getItem("token");

      const res = await axios.get(`${API_BASE_URL}getReviews/${userId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

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
        ></i>
      );
    }
    return stars;
  };
  const truncateText = (text, limit = 100) => {
    if (!text) return "";
    return text.length > limit ? text.substring(0, limit) + "..." : text;
  };

  return (
    <>
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
                      "assets/images/candidate-img/candidate1.jpg"
                    }
                    alt="Image"
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
                      {candidate?.userId?.email || "Not Provided"}
                    </h3>
                    <h3>
                      <strong>Contact:</strong>{" "}
                      {candidate?.userId?.phone || "Not Provided"}
                    </h3>
                    <h3>
                      <strong>Address:</strong>{" "}
                      {candidate?.userId?.city
                        ?.toLowerCase()
                        .replace(/^\w/, (c) => c.toUpperCase()) ||
                        "Not Provided"}{" "}
                    </h3>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-lg-5 col-md-4">
              <div className="candidate-profile-dcv-btn">
                <a href="#" className="default-btn btn">
                  Download CV
                </a>
              </div>
              <div className="candidates-share-content">
                <h4>Social Media</h4>
                <ul>
                  <li>
                    <a href={candidate?.userId?.googleId} target="_blank">
                      <i className="fa-solid fa-globe" />
                    </a>
                  </li>
                  <li>
                    <a href={candidate?.userId?.githubId} target="_blank">
                      <i className="fa-brands fa-github" />
                    </a>
                  </li>
                  <li>
                    <a href={candidate?.userId?.linkedinId} target="_blank">
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
                  <h3>Professional Summary</h3>
                  <p>{candidate?.professionalSummary}</p>
                </div>
                <div className="candidate-profile-divider-line" />
                <div className="candidate-profile-detail-info candidate-profile-summary">
                  <h3>Career Goals</h3>
                  <h5>Desired Job Title</h5>
                  <p>
                    {candidate?.career_goals?.DesiredJobTitle?.toLowerCase().replace(
                      /^\w/,
                      (c) => c.toUpperCase()
                    ) || "Not Provided"}{" "}
                  </p>
                  <h5>Desired Employment Type</h5>
                  <p>
                    {candidate?.career_goals?.DesiredEmploymentType?.toLowerCase().replace(
                      /^\w/,
                      (c) => c.toUpperCase()
                    ) || "Not Provided"}{" "}
                  </p>
                  <h5>Desired Occupation Type</h5>
                  <p>
                    {candidate?.career_goals?.DesiredOccupationType?.toLowerCase().replace(
                      /^\w/,
                      (c) => c.toUpperCase()
                    ) || "Not Provided"}{" "}
                  </p>
                  <div className="candidate-profile-divider-line" />
                  <h3>Other Preferences</h3>
                  {candidate?.career_goals ? (
                    <>
                      <h5>Eligible to work in</h5>
                      <p>
                        {candidate.career_goals.DesiredOccupationType?.toLowerCase().replace(
                          /^\w/,
                          (c) => c.toUpperCase()
                        ) || "Not Provided"}{" "}
                      </p>

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
                  <h3>Experience</h3>
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
                            {startDate.toLocaleString("default", {
                              month: "short",
                            })}{" "}
                            {startDate.getFullYear()} -{" "}
                            {work.currentlyWorkingHere
                              ? "Until now"
                              : `${endDate.toLocaleString("default", {
                                  month: "short",
                                })} ${endDate.getFullYear?.() || ""}`}
                          </p>

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
                              <h5>Description</h5>
                              <p>{work.Description}</p>
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
                                (c) => c.toUpperCase()
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

                  {/* <h5>Degree</h5>
                  <p>B.Tech</p>
                  <h5>University</h5>
                  <p>IGNU</p>
                  <h5>Start Date</h5>
                  <p>05 / 2020</p>
                  <h5>End Date</h5>
                  <p>Until now</p> */}
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
                  <h3>Languages</h3>
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

                {/* <div className="candidate-profile-divider-line" /> */}
                {/* <div className="add-review">
                  <h3>Add Review</h3>
                  <div className="review-form">
                    <form>
                      <div className="row">
                        <div className="col-lg-12">
                          <div className="form-group">
                            <textarea
                              className="form-control"
                              placeholder="Write Message"
                              rows={6}
                              defaultValue={""}
                            />
                          </div>
                        </div>
                      </div>
                      <div className="candidate-profile-submit-btn">
                        <button type="submit" className="default-btn btn">
                          Submit A Review
                        </button>
                      </div>
                    </form>
                  </div>
                </div> */}
              </div>
            </div>
            <div className="col-lg-4">
              <div className="sidebar">
                <div className="candidate-profile-summary single-sidebar-widget job-overview">
                  <h3>Candidate Informations</h3>
                  <ul>
                    <li>
                      <span>Experience :</span>
                      {candidate?.aboutRole?.yearOfExperience || 0} Years
                    </li>
                    <li>
                      {/* <span>Current salary :</span>$2000 */}
                      <span>Phone No.:</span>
                      {candidate?.userId?.phone || "Not Provided"}
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
                            candidate.userId.date_of_birth
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
                  <a href="#" className="default-btn btn">
                    Download CV
                  </a>
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
              <h5>Add Review</h5>
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
              placeholder="Write Message"
              rows={6}
              value={review}
              onChange={(e) => setReview(e.target.value)}
            />

            {/* Submit */}
            <button
              className="default-btn btn w-100 mt-3"
              onClick={async () => {
                if (!rating) return toast.error("Please select a rating!");
                if (!review.trim())
                  return toast.error("Review cannot be empty!");

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
                    }
                  );
                  getReviewsByUser(userId);
                  toast.success("Review submitted successfully!");
                  setShowModal(false);
                  setReview("");
                  setRating(0);
                } catch (error) {
                  console.error("Error submitting review:", error);
                  toast.error("Failed to submit review");
                }
              }}
            >
              Submit Review
            </button>
          </div>
        </div>
      )}
    </>
  );
}

export default CandinateProfileDetails;
