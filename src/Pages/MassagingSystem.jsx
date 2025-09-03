import { Link } from "react-router-dom";
function MassagingSystem() {
  return (
    <>
      <div className="main-dashboard-content d-flex flex-column">
        <div className="responsive-content">
          {/* Breadcrumb Area */}
          <div className="breadcrumb-area">
            <h1>Messages</h1>
            <ol className="breadcrumb">
              <li className="item">
                <a href="dashboard.html">Home </a>
              </li>
              <li className="item">
                <i className="fa-solid fa-angle-right" /> Dashboard
              </li>
              <li className="item">
                <i className="fa-solid fa-angle-right" />Messages
              </li>
            </ol>
          </div>
          {/* End Breadcrumb Area */}
          {/*Start messaging system start here*/}
          <div className="my-profile-area">
            <div className="profile-form-content">
              <h3>Massage</h3>
              <div className="profile-form">
                <div className="row">
                  <div className="messaging-system-info-area">
                    <div className="messaging-system-tab-area">
                      <div className="messaging-system-heading-info">
                        <h5>Candidate massage</h5>
                        <div className="messaging-system-search-icon">
                          <div className="messaging-system-search">
                            <input
                              className="form-control"
                              type="text"
                              name="search"
                              placeholder="Search....."
                            />
                          </div>
                          <div className="messaging-system-icon">
                            <i className="fa-solid fa-magnifying-glass" />
                          </div>
                        </div>
                      </div>
                      <ul className="nav nav-tabs" role="tablist">
                        <li className="nav-item" role="presentation">
                          <a
                            className="nav-link active"
                            data-bs-toggle="tab"
                            href="#menu1"
                            aria-selected="true"
                            role="tab"
                          >
                            <div className="messaging-system-img-user-info">
                              <div className="messaging-system-user-img">
                                <img
                                  src="assets/images/candidate-img/candidate2.jpg"
                                  alt="image"
                                />
                              </div>
                              <div className="messaging-system-user-info">
                                <h5>Sophia Smith</h5>
                                <p>Software Engineer</p>
                              </div>
                            </div>
                          </a>
                        </li>
                        <li className="nav-item" role="presentation">
                          <a
                            className="nav-link"
                            data-bs-toggle="tab"
                            href="#menu2"
                            aria-selected="false"
                            role="tab"
                          >
                            <div className="messaging-system-img-user-info">
                              <div className="messaging-system-user-img">
                                <img
                                  src="assets/images/candidate-img/candidate2.jpg"
                                  alt="image"
                                />
                              </div>
                              <div className="messaging-system-user-info">
                                <h5>Sophia Smith</h5>
                                <p>Software Engineer</p>
                              </div>
                            </div>
                          </a>
                        </li>
                        <li className="nav-item" role="presentation">
                          <a
                            className="nav-link"
                            data-bs-toggle="tab"
                            href="#menu3"
                            aria-selected="false"
                            role="tab"
                          >
                            <div className="messaging-system-img-user-info">
                              <div className="messaging-system-user-img">
                                <img
                                  src="assets/images/candidate-img/candidate2.jpg"
                                  alt="image"
                                />
                              </div>
                              <div className="messaging-system-user-info">
                                <h5>Sophia Smith</h5>
                                <p>Software Engineer</p>
                              </div>
                            </div>
                          </a>
                        </li>
                      </ul>
                    </div>
                    <div className="messaging-system-chat-box">
                      <div className="messaging-system-heading-info">
                        <div className="messaging-system-img-user-info">
                          <div className="messaging-system-user-img">
                            <img
                              src="assets/images/candidate-img/candidate2.jpg"
                              alt="image"
                            />
                          </div>
                          <div className="messaging-system-user-name">
                            <h5>Sophia Smith</h5>
                            <p>Software Engineer</p>
                          </div>
                        </div>
                      </div>
                      <div className="tab-content">
                        <div
                          className="tab-pane fade show active"
                          id="menu1"
                          role="tabpanel"
                        >
                          <div className="messaging-system-user-messaging">
                            <div className="messaging-system-userImg">
                              <img
                                src="assets/images/candidate-img/candidate2.jpg"
                                alt="image"
                              />
                            </div>
                            <div className="messaging-system-user-message">
                              <div className="messaging-system-message-time">
                                <h6>Sophia Smith</h6>
                                <p>7:45 AM</p>
                              </div>
                              <p>
                                Lorem ipsum dolor sit amet, consectetur
                                adipisicing elit, sed do eiusmod tempor
                              </p>
                            </div>
                          </div>
                          <div className="messaging-system-recruiter-messaging">
                            <div className="messaging-system-user-message bg-color">
                              <div className="messaging-system-recruiter-message-time">
                                <h6>Sophia Smith</h6>
                                <p>7:45 AM</p>
                              </div>
                              <p>
                                Lorem ipsum dolor sit amet, consectetur
                                adipisicing elit, sed do eiusmod tempor
                              </p>
                            </div>
                            <div className="messaging-system-userImg">
                              <img
                                src="assets/images/candidate-img/candidate2.jpg"
                                alt="image"
                              />
                            </div>
                          </div>
                          <div className="messaging-system-user-messaging">
                            <div className="messaging-system-userImg">
                              <img
                                src="assets/images/candidate-img/candidate2.jpg"
                                alt="image"
                              />
                            </div>
                            <div className="messaging-system-user-message">
                              <div className="messaging-system-message-time">
                                <h6>Sophia Smith</h6>
                                <p>7:45 AM</p>
                              </div>
                              <p>
                                Lorem ipsum dolor sit amet, consectetur
                                adipisicing elit, sed do eiusmod tempor
                              </p>
                            </div>
                          </div>
                          <div className="messaging-system-recruiter-messaging">
                            <div className="messaging-system-user-message bg-color">
                              <div className="messaging-system-recruiter-message-time">
                                <h6>Sophia Smith</h6>
                                <p>7:45 AM</p>
                              </div>
                              <p>
                                Lorem ipsum dolor sit amet, consectetur
                                adipisicing elit, sed do eiusmod tempor
                              </p>
                            </div>
                            <div className="messaging-system-userImg">
                              <img
                                src="assets/images/candidate-img/candidate2.jpg"
                                alt="image"
                              />
                            </div>
                          </div>
                        </div>
                        <div
                          className="tab-pane fade"
                          id="menu2"
                          role="tabpanel"
                        >
                          <div className="messaging-system-user-messaging">
                            <div className="messaging-system-userImg">
                              <img
                                src="assets/images/candidate-img/candidate2.jpg"
                                alt="image"
                              />
                            </div>
                            <div className="messaging-system-user-message">
                              <div className="messaging-system-message-time">
                                <h6>Sophia Smith</h6>
                                <p>7:45 AM</p>
                              </div>
                              <p>
                                Lorem ipsum dolor sit amet, consectetur
                                adipisicing elit, sed do eiusmod tempor
                              </p>
                            </div>
                          </div>
                          <div className="messaging-system-recruiter-messaging">
                            <div className="messaging-system-user-message bg-color">
                              <div className="messaging-system-recruiter-message-time">
                                <h6>Sophia Smith</h6>
                                <p>7:45 AM</p>
                              </div>
                              <p>
                                Lorem ipsum dolor sit amet, consectetur
                                adipisicing elit, sed do eiusmod tempor
                              </p>
                            </div>
                            <div className="messaging-system-userImg">
                              <img
                                src="assets/images/candidate-img/candidate2.jpg"
                                alt="image"
                              />
                            </div>
                          </div>
                          <div className="messaging-system-user-messaging">
                            <div className="messaging-system-userImg">
                              <img
                                src="assets/images/candidate-img/candidate2.jpg"
                                alt="image"
                              />
                            </div>
                            <div className="messaging-system-user-message">
                              <div className="messaging-system-message-time">
                                <h6>Sophia Smith</h6>
                                <p>7:45 AM</p>
                              </div>
                              <p>
                                Lorem ipsum dolor sit amet, consectetur
                                adipisicing elit, sed do eiusmod tempor
                              </p>
                            </div>
                          </div>
                          <div className="messaging-system-recruiter-messaging">
                            <div className="messaging-system-user-message bg-color">
                              <div className="messaging-system-recruiter-message-time">
                                <h6>Sophia Smith</h6>
                                <p>7:45 AM</p>
                              </div>
                              <p>
                                Lorem ipsum dolor sit amet, consectetur
                                adipisicing elit, sed do eiusmod tempor
                              </p>
                            </div>
                            <div className="messaging-system-userImg">
                              <img
                                src="assets/images/candidate-img/candidate2.jpg"
                                alt="image"
                              />
                            </div>
                          </div>
                        </div>
                        <div
                          className="tab-pane fade"
                          id="menu3"
                          role="tabpanel"
                        >
                          <div className="messaging-system-user-messaging">
                            <div className="messaging-system-userImg">
                              <img
                                src="assets/images/candidate-img/candidate2.jpg"
                                alt="image"
                              />
                            </div>
                            <div className="messaging-system-user-message">
                              <div className="messaging-system-message-time">
                                <h6>Sophia Smith</h6>
                                <p>7:45 AM</p>
                              </div>
                              <p>
                                Lorem ipsum dolor sit amet, consectetur
                                adipisicing elit, sed do eiusmod tempor
                              </p>
                            </div>
                          </div>
                          <div className="messaging-system-recruiter-messaging">
                            <div className="messaging-system-user-message bg-color">
                              <div className="messaging-system-recruiter-message-time">
                                <h6>Sophia Smith</h6>
                                <p>7:45 AM</p>
                              </div>
                              <p>
                                Lorem ipsum dolor sit amet, consectetur
                                adipisicing elit, sed do eiusmod tempor
                              </p>
                            </div>
                            <div className="messaging-system-userImg">
                              <img
                                src="assets/images/candidate-img/candidate2.jpg"
                                alt="image"
                              />
                            </div>
                          </div>
                          <div className="messaging-system-user-messaging">
                            <div className="messaging-system-userImg">
                              <img
                                src="assets/images/candidate-img/candidate2.jpg"
                                alt="image"
                              />
                            </div>
                            <div className="messaging-system-user-message">
                              <div className="messaging-system-message-time">
                                <h6>Sophia Smith</h6>
                                <p>7:45 AM</p>
                              </div>
                              <p>
                                Lorem ipsum dolor sit amet, consectetur
                                adipisicing elit, sed do eiusmod tempor
                              </p>
                            </div>
                          </div>
                          <div className="messaging-system-recruiter-messaging">
                            <div className="messaging-system-user-message bg-color">
                              <div className="messaging-system-recruiter-message-time">
                                <h6>Sophia Smith</h6>
                                <p>7:45 AM</p>
                              </div>
                              <p>
                                Lorem ipsum dolor sit amet, consectetur
                                adipisicing elit, sed do eiusmod tempor
                              </p>
                            </div>
                            <div className="messaging-system-userImg">
                              <img
                                src="assets/images/candidate-img/candidate2.jpg"
                                alt="image"
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="messaging-system-typeing-send-btn">
                        <textarea
                          className="form-control"
                          placeholder="Write Brief Bio Or Introduction"
                          rows={1}
                          defaultValue={""}
                        />
                        <i className="fa-solid fa-paper-plane" />
                      </div>
                    </div>
                    <div className="messaging-system-interview-scheduling">
                      <div className="messaging-system-heading-info">
                        <h5>Interview Scheduling</h5>
                        <div className="messaging-system-select">
                          <select
                            className="form-select form-control"
                            aria-label="Default2 select example"
                          >
                            <option selected>Select Interview</option>
                            <option value={1}>Development</option>
                            <option value={2}>Information IT</option>
                            <option value={3}>Corporate Job</option>
                          </select>
                        </div>
                      </div>
                      <div className="interview-scheduling-info">
                        <span>
                          <input
                            type="radio"
                            id="html"
                            name="fav_language"
                            defaultValue="HTML"
                          />
                          <label htmlFor="html">Tuesday, 10:00 AM</label>
                        </span>
                        <span>
                          <input
                            type="radio"
                            id="css"
                            name="fav_language"
                            defaultValue="CSS"
                          />
                          <label htmlFor="css">Tuesday, 1:00 PM</label>
                        </span>
                        <span>
                          <input
                            type="radio"
                            id="javascript"
                            name="fav_language"
                            defaultValue="JavaScript"
                          />
                          <label htmlFor="javascript">Wednesday, 2:00 PM</label>
                        </span>
                        <span>
                          <input
                            type="radio"
                            id="javascript"
                            name="fav_language"
                            defaultValue="JavaScript"
                          />
                          <label htmlFor="javascript">Thursday, 4:00 PM</label>
                        </span>
                      </div>
                      <div className="send-invitation-btn">
                        <a href="#" className="default-btn btn">
                          Send Invitation
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          {/*Start messaging system end here*/}
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

export default MassagingSystem;
