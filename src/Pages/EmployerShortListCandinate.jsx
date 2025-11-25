import { Link } from "react-router-dom";
import React, { useEffect, useState } from "react";
import { FaBookmark } from "react-icons/fa";
import AOS from "aos";
import "aos/dist/aos.css";
import axios from "axios";
import { API_BASE_URL, API_IMAGE_URL } from "../Url/Url";
function EmployerShortListCandinate() {
  const [bookmarkedCandidates, setBookmarkedCandidates] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(6); // show 6 candidates per page
  // Calculate index range
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;

  // Current page items
  const currentItems = bookmarkedCandidates.slice(
    indexOfFirstItem,
    indexOfLastItem
  );

  // Total pages
  const totalPages = Math.ceil(bookmarkedCandidates.length / itemsPerPage);

  // Page change handler
  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
      window.scrollTo({ top: 0, behavior: "smooth" }); // optional
    }
  };

  const token = localStorage.getItem("token");

  useEffect(() => {
    AOS.init({ duration: 1200 });
    fetchBookmarkedCandidates(); // load bookmark list
  }, []);
  const fetchBookmarkedCandidates = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}getBookmarked/candidates`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log(res);
      setBookmarkedCandidates(res.data.bookmarks || []);
    } catch (error) {
      console.error("Error fetching bookmarked candidates:", error);
    }
  };
  return (
    <>
      <div className="main-dashboard-content d-flex flex-column">
        <div className="responsive-content">
          {/* Breadcrumb Area */}
          <div className="breadcrumb-area">
            <h1>Employer shortlist candidates</h1>
            <ol className="breadcrumb">
              <li className="item">
                <Link to="/">Home </Link>
              </li>
              <li className="item">
                <Link to="/employer-dashboard">
                  <i className="fa-solid fa-angle-right" /> Dashboard
                </Link>
              </li>
              <li className="item">
                <i className="fa-solid fa-angle-right" /> Employer shortlist
                candidates
              </li>
            </ol>
          </div>
          {/* End Breadcrumb Area */}
          {/*Start Bookmark Jobs Area*/}
          <div className="applied-shorting-content">
            <div className="row align-items-center">
              <div className="col-lg-8 col-md-5">
                <div className="employer-shortlist-candidates-heading">
                  <h4>15 Shortlist Candidates</h4>
                </div>
              </div>
              <div className="col-lg-4 col-md-7">
                <div className="shorting-right-content">
                  <div className="row">
                    <div className="col-6">
                      <select
                        className="form-select form-control"
                        aria-label="Default select example"
                      >
                        <option selected>All Jobs</option>
                        <option value={1}>UI/UX Designer</option>
                        <option value={2}>Magento Developer</option>
                        <option value={3}>App Developer</option>
                        <option value={4}>Product Designer</option>
                        <option value={5}>WordPress Developer</option>
                        <option value={6}>Content Writer</option>
                      </select>
                    </div>
                    <div className="col-6">
                      <select
                        className="form-select form-control"
                        aria-label="Default select example"
                      >
                        <option selected>Show 20</option>
                        <option value={1}>01</option>
                        <option value={2}>02</option>
                        <option value={3}>03</option>
                        <option value={4}>04</option>
                        <option value={5}>05</option>
                        <option value={6}>06</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="row">
            {bookmarkedCandidates.length === 0 && (
              <p>No bookmarked candidates found.</p>
            )}

            {bookmarkedCandidates.map((item, index) => {
              const candidate = item.candidateId;

              return (
                <div
                  className="col-lg-6 col-sm-6"
                  data-aos="fade-up"
                  data-aos-delay={index * 100}
                  key={item._id}
                >
                  <div className="candidate-list-info single-freelancer-card">
                    <Link to={`/candidates-profile-details`}>
                      <div className="row align-items-center">
                        <div className="col-lg-4">
                          <div className="freelancer-img">
                            <img
                              crossorigin="anonymous"
                              src={
                                candidate?.profileImage
                                  ? `${API_IMAGE_URL}${candidate.profileImage}`
                                  : "assets/images/freelancers/freelancers-img-1.jpg"
                              }
                              alt="Profile"
                            />
                          </div>
                        </div>

                        <div className="col-lg-8">
                          <div className="freelancer-content">
                            <h3>
                              {candidate.first_name} {candidate.last_name}
                            </h3>
                            <span>{candidate?.candidateProfile?.career_goals?.DesiredJobTitle||"N/A"}</span>

                            <div className="info">
                              <ul>
                                <li>
                                  <i className="fa-solid fa-location-dot" />{" "}
                                  {candidate.city}
                                </li>
                                <li>
                                  <i className="fa-solid fa-envelope" />{" "}
                                  {candidate.email}
                                </li>
                              </ul>
                            </div>

                            <div className="candidate-list-shortlist-candidates">
                              <i>
                                <FaBookmark />
                              </i>
                            </div>
                          </div>
                        </div>
                      </div>
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
          {totalPages > 1 && (
            <div className="paginations style2 mb-30">
              <ul>
                {/* Prev Button */}
                <li onClick={() => handlePageChange(currentPage - 1)}>
                  <a style={{ cursor: "pointer" }}>
                    <i className="fa-solid fa-angle-left" />
                  </a>
                </li>

                {/* Page Numbers */}
                {Array.from({ length: totalPages }).map((_, i) => (
                  <li key={i} onClick={() => handlePageChange(i + 1)}>
                    <a
                      className={currentPage === i + 1 ? "active" : ""}
                      style={{ cursor: "pointer" }}
                    >
                      {i + 1}
                    </a>
                  </li>
                ))}

                {/* Next Button */}
                <li onClick={() => handlePageChange(currentPage + 1)}>
                  <a style={{ cursor: "pointer" }}>
                    <i className="fa-solid fa-angle-right" />
                  </a>
                </li>
              </ul>
            </div>
          )}

          {/*End Bookmark Jobs Area*/}
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
    </>
  );
}

export default EmployerShortListCandinate;
