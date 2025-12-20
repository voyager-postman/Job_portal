import axios from "axios";
import React, { useEffect } from "react";
import { API_BASE_URL } from "../Url/Url";
import { ToastContainer, toast } from "react-toastify";
import { useState } from "react";
import { Link } from "react-router-dom";

function ChatMassageSystem() {
  return (
    <>
      <ToastContainer />
      <div className="main-dashboard-content d-flex flex-column">
        <div className="responsive-content">
          {/* Breadcrumb Area */}
          <div className="breadcrumb-area">
            <h1>Messages</h1>
            <ol className="breadcrumb">
              <li className="item">
                <Link to="/">Home </Link>
              </li>
              <li className="item">
                <Link to="/candidate-dashboard">
                  <i className="fa-solid fa-angle-right" /> Dashboard
                </Link>
              </li>
              <li className="item">
                <i className="fa-solid fa-angle-right" /> Messages
              </li>
            </ol>
          </div>
          {/* End Breadcrumb Area */}
          {/* Chat Messaging System Section Start Area */}
          <section className="chat-messaging-system-info">
            <div className="chat-messaging-system-heading">
              <div className="user-message-list-search">
                <div className="user-message-search-box-icon-info">
                  <div className="user-message-search-box">
                    <input type="text" placeholder="Search.." />
                  </div>
                  <div className="user-message-search-box-icon">
                    <i className="fa-solid fa-magnifying-glass" />
                  </div>
                </div>
              </div>
              <div className="user-name-message-dlt-info">
                <div className="user-img-name-status-info">
                  <div className="user-message-img">
                    <img src="assets/images/candidate-img/candidate1.jpg" />
                  </div>
                  <div className="user-name-status">
                    <h6>John Doe</h6>
                    <span>Online</span>
                  </div>
                </div>
                <div className="user-message-dlt">
                  <span>
                    <i className="fa-solid fa-trash" />
                    Delete Conversation
                  </span>
                </div>
              </div>
            </div>
            <div className="user-message-list-massage-detail">
              <div className="user-message-list">
                <ul className="nav nav-tabs" role="tablist">
                  <li className="nav-item" role="presentation">
                    <a
                      className="nav-link active"
                      data-bs-toggle="tab"
                      href="#menu1"
                      aria-selected="false"
                      role="tab"
                    >
                      <div className="user-img-name-chat-count-time-massage">
                        <div className="user-img-chat-count">
                          <img src="assets/images/candidate-img/candidate1.jpg" />
                          <span className="chat-count">1</span>
                        </div>
                        <div className="user-name-chat-time-massage">
                          <div className="user-name-time-info">
                            <h6>John Doe</h6>
                            <p>7 hours ago</p>
                          </div>
                          <div className="user-short-massage">
                            <p>Lorem Ipsum is not simply random</p>
                          </div>
                        </div>
                      </div>
                    </a>
                  </li>
                  <li className="nav-item" role="presentation">
                    <a
                      className="nav-link"
                      data-bs-toggle="tab"
                      href="#menu2"
                      aria-selected="true"
                      role="tab"
                    >
                      <div className="user-img-name-chat-count-time-massage">
                        <div className="user-img-chat-count">
                          <img
                            src="assets/images/dashboard/dashboard-img-1.png"
                            className="rounded-circle"
                            alt="image"
                          />
                          <span className="chat-count">1</span>
                        </div>
                        <div className="user-name-chat-time-massage">
                          <div className="user-name-time-info">
                            <h6>John Doe</h6>
                            <p>7 hours ago</p>
                          </div>
                          <div className="user-short-massage">
                            <p>Lorem Ipsum is not simply random</p>
                          </div>
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
                      <div className="user-img-name-chat-count-time-massage">
                        <div className="user-img-chat-count">
                          <img
                            src="assets/images/dashboard/dashboard-img-1.png"
                            className="rounded-circle"
                            alt="image"
                          />
                          <span className="chat-count">1</span>
                        </div>
                        <div className="user-name-chat-time-massage">
                          <div className="user-name-time-info">
                            <h6>John Doe</h6>
                            <p>7 hours ago</p>
                          </div>
                          <div className="user-short-massage">
                            <p>Lorem Ipsum is not simply random</p>
                          </div>
                        </div>
                      </div>
                    </a>
                  </li>
                  <li className="nav-item" role="presentation">
                    <a
                      className="nav-link"
                      data-bs-toggle="tab"
                      href="#menu4"
                      aria-selected="false"
                      role="tab"
                    >
                      <div className="user-img-name-chat-count-time-massage">
                        <div className="user-img-chat-count">
                          <img
                            src="assets/images/dashboard/dashboard-img-1.png"
                            className="rounded-circle"
                            alt="image"
                          />
                          <span className="chat-count">1</span>
                        </div>
                        <div className="user-name-chat-time-massage">
                          <div className="user-name-time-info">
                            <h6>John Doe</h6>
                            <p>7 hours ago</p>
                          </div>
                          <div className="user-short-massage">
                            <p>Lorem Ipsum is not simply random</p>
                          </div>
                        </div>
                      </div>
                    </a>
                  </li>
                  <li className="nav-item" role="presentation">
                    <a
                      className="nav-link"
                      data-bs-toggle="tab"
                      href="#menu5"
                      aria-selected="false"
                      role="tab"
                    >
                      <div className="user-img-name-chat-count-time-massage">
                        <div className="user-img-chat-count">
                          <img
                            src="assets/images/dashboard/dashboard-img-1.png"
                            className="rounded-circle"
                            alt="image"
                          />
                          <span className="chat-count">1</span>
                        </div>
                        <div className="user-name-chat-time-massage">
                          <div className="user-name-time-info">
                            <h6>John Doe</h6>
                            <p>7 hours ago</p>
                          </div>
                          <div className="user-short-massage">
                            <p>Lorem Ipsum is not simply random</p>
                          </div>
                        </div>
                      </div>
                    </a>
                  </li>
                  <li className="nav-item" role="presentation">
                    <a
                      className="nav-link"
                      data-bs-toggle="tab"
                      href="#menu6"
                      aria-selected="false"
                      role="tab"
                    >
                      <div className="user-img-name-chat-count-time-massage">
                        <div className="user-img-chat-count">
                          <img
                            src="assets/images/dashboard/dashboard-img-1.png"
                            className="rounded-circle"
                            alt="image"
                          />
                          <span className="chat-count">1</span>
                        </div>
                        <div className="user-name-chat-time-massage">
                          <div className="user-name-time-info">
                            <h6>John Doe</h6>
                            <p>7 hours ago</p>
                          </div>
                          <div className="user-short-massage">
                            <p>Lorem Ipsum is not simply random</p>
                          </div>
                        </div>
                      </div>
                    </a>
                  </li>
                  <li className="nav-item" role="presentation">
                    <a
                      className="nav-link"
                      data-bs-toggle="tab"
                      href="#menu7"
                      aria-selected="false"
                      role="tab"
                    >
                      <div className="user-img-name-chat-count-time-massage">
                        <div className="user-img-chat-count">
                          <img
                            src="assets/images/dashboard/dashboard-img-1.png"
                            className="rounded-circle"
                            alt="image"
                          />
                          <span className="chat-count">1</span>
                        </div>
                        <div className="user-name-chat-time-massage">
                          <div className="user-name-time-info">
                            <h6>John Doe</h6>
                            <p>7 hours ago</p>
                          </div>
                          <div className="user-short-massage">
                            <p>Lorem Ipsum is not simply random</p>
                          </div>
                        </div>
                      </div>
                    </a>
                  </li>
                </ul>
              </div>
              <div className="job-seeker-employer-message-detail">
                {/* Tab Panes */}
                <div className="tab-content">
                  <div
                    className="tab-pane fade show active"
                    id="menu1"
                    role="tabpanel"
                  >
                    <div className="user-message-chat-details">
                      <div className="job-seeker-message-name-img-time">
                        <div className="job-seeker-message-img">
                          <img src="assets/images/candidate-img/candidate1.jpg" />
                        </div>
                      </div>
                      <div className="job-seeker-message-detail-text">
                        <div className="job-seeker-message-time">
                          <h6>John Doe</h6>
                          <p>7:45 AM</p>
                        </div>
                        <p>
                          Lorem ipsum dolor sit amet, consectetur adipiscing
                          elit. Donec rutrum congue leo eget malesuada. Vivamus
                          suscipit tortor eget felis porttitor.
                        </p>
                      </div>
                    </div>
                    <div className="user-message-chat-details employer-info-main-area">
                      <div className="job-seeker-message-detail-text">
                        <div className="job-seeker-message-time">
                          <h6>John Doe</h6>
                          <p>7:45 AM</p>
                        </div>
                        <p>
                          Lorem ipsum dolor sit amet, consectetur adipiscing
                          elit. Donec rutrum congue leo eget malesuada. Vivamus
                          suscipit tortor eget felis porttitor.
                        </p>
                      </div>
                      <div className="job-seeker-message-name-img-time">
                        <div className="job-seeker-message-img">
                          <img src="assets/images/candidate-img/candidate1.jpg" />
                        </div>
                      </div>
                    </div>
                    <div className="user-message-chat-details">
                      <div className="job-seeker-message-name-img-time">
                        <div className="job-seeker-message-img">
                          <img src="assets/images/candidate-img/candidate1.jpg" />
                        </div>
                      </div>
                      <div className="job-seeker-message-detail-text">
                        <div className="job-seeker-message-time">
                          <h6>John Doe</h6>
                          <p>7:45 AM</p>
                        </div>
                        <p>
                          Lorem ipsum dolor sit amet, consectetur adipiscing
                          elit. Donec rutrum congue leo eget malesuada. Vivamus
                          suscipit tortor eget felis porttitor.
                        </p>
                      </div>
                    </div>
                    <div className="user-message-chat-details employer-info-main-area">
                      <div className="job-seeker-message-detail-text">
                        <div className="job-seeker-message-time">
                          <h6>John Doe</h6>
                          <p>7:45 AM</p>
                        </div>
                        <p>
                          Lorem ipsum dolor sit amet, consectetur adipiscing
                          elit. Donec rutrum congue leo eget malesuada. Vivamus
                          suscipit tortor eget felis porttitor.
                        </p>
                      </div>
                      <div className="job-seeker-message-name-img-time">
                        <div className="job-seeker-message-img">
                          <img src="assets/images/candidate-img/candidate1.jpg" />
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="tab-pane fade" id="menu2" role="tabpanel">
                    <div className="user-message-chat-details">
                      <div className="job-seeker-message-name-img-time">
                        <div className="job-seeker-message-img">
                          <img src="assets/images/candidate-img/candidate1.jpg" />
                        </div>
                      </div>
                      <div className="job-seeker-message-detail-text">
                        <div className="job-seeker-message-time">
                          <h6>John Doe</h6>
                          <p>7:45 AM</p>
                        </div>
                        <p>
                          Lorem ipsum dolor sit amet, consectetur adipiscing
                          elit. Donec rutrum congue leo eget malesuada. Vivamus
                          suscipit tortor eget felis porttitor.
                        </p>
                      </div>
                    </div>
                    <div className="user-message-chat-details employer-info-main-area">
                      <div className="job-seeker-message-detail-text">
                        <div className="job-seeker-message-time">
                          <h6>John Doe</h6>
                          <p>7:45 AM</p>
                        </div>
                        <p>
                          Lorem ipsum dolor sit amet, consectetur adipiscing
                          elit. Donec rutrum congue leo eget malesuada. Vivamus
                          suscipit tortor eget felis porttitor.
                        </p>
                      </div>
                      <div className="job-seeker-message-name-img-time">
                        <div className="job-seeker-message-img">
                          <img src="assets/images/candidate-img/candidate1.jpg" />
                        </div>
                      </div>
                    </div>
                    <div className="user-message-chat-details">
                      <div className="job-seeker-message-name-img-time">
                        <div className="job-seeker-message-img">
                          <img src="assets/images/candidate-img/candidate1.jpg" />
                        </div>
                      </div>
                      <div className="job-seeker-message-detail-text">
                        <div className="job-seeker-message-time">
                          <h6>John Doe</h6>
                          <p>7:45 AM</p>
                        </div>
                        <p>
                          Lorem ipsum dolor sit amet, consectetur adipiscing
                          elit. Donec rutrum congue leo eget malesuada. Vivamus
                          suscipit tortor eget felis porttitor.
                        </p>
                      </div>
                    </div>
                    <div className="user-message-chat-details employer-info-main-area">
                      <div className="job-seeker-message-detail-text">
                        <div className="job-seeker-message-time">
                          <h6>John Doe</h6>
                          <p>7:45 AM</p>
                        </div>
                        <p>
                          Lorem ipsum dolor sit amet, consectetur adipiscing
                          elit. Donec rutrum congue leo eget malesuada. Vivamus
                          suscipit tortor eget felis porttitor.
                        </p>
                      </div>
                      <div className="job-seeker-message-name-img-time">
                        <div className="job-seeker-message-img">
                          <img src="assets/images/candidate-img/candidate1.jpg" />
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="tab-pane fade" id="menu3" role="tabpanel">
                    <div className="user-message-chat-details">
                      <div className="job-seeker-message-name-img-time">
                        <div className="job-seeker-message-img">
                          <img src="assets/images/candidate-img/candidate1.jpg" />
                        </div>
                      </div>
                      <div className="job-seeker-message-detail-text">
                        <div className="job-seeker-message-time">
                          <h6>John Doe</h6>
                          <p>7:45 AM</p>
                        </div>
                        <p>
                          Lorem ipsum dolor sit amet, consectetur adipiscing
                          elit. Donec rutrum congue leo eget malesuada. Vivamus
                          suscipit tortor eget felis porttitor.
                        </p>
                      </div>
                    </div>
                    <div className="user-message-chat-details employer-info-main-area">
                      <div className="job-seeker-message-detail-text">
                        <div className="job-seeker-message-time">
                          <h6>John Doe</h6>
                          <p>7:45 AM</p>
                        </div>
                        <p>
                          Lorem ipsum dolor sit amet, consectetur adipiscing
                          elit. Donec rutrum congue leo eget malesuada. Vivamus
                          suscipit tortor eget felis porttitor.
                        </p>
                      </div>
                      <div className="job-seeker-message-name-img-time">
                        <div className="job-seeker-message-img">
                          <img src="assets/images/candidate-img/candidate1.jpg" />
                        </div>
                      </div>
                    </div>
                    <div className="user-message-chat-details">
                      <div className="job-seeker-message-name-img-time">
                        <div className="job-seeker-message-img">
                          <img src="assets/images/candidate-img/candidate1.jpg" />
                        </div>
                      </div>
                      <div className="job-seeker-message-detail-text">
                        <div className="job-seeker-message-time">
                          <h6>John Doe</h6>
                          <p>7:45 AM</p>
                        </div>
                        <p>
                          Lorem ipsum dolor sit amet, consectetur adipiscing
                          elit. Donec rutrum congue leo eget malesuada. Vivamus
                          suscipit tortor eget felis porttitor.
                        </p>
                      </div>
                    </div>
                    <div className="user-message-chat-details employer-info-main-area">
                      <div className="job-seeker-message-detail-text">
                        <div className="job-seeker-message-time">
                          <h6>John Doe</h6>
                          <p>7:45 AM</p>
                        </div>
                        <p>
                          Lorem ipsum dolor sit amet, consectetur adipiscing
                          elit. Donec rutrum congue leo eget malesuada. Vivamus
                          suscipit tortor eget felis porttitor.
                        </p>
                      </div>
                      <div className="job-seeker-message-name-img-time">
                        <div className="job-seeker-message-img">
                          <img src="assets/images/candidate-img/candidate1.jpg" />
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="tab-pane fade" id="menu4" role="tabpanel">
                    <div className="user-message-chat-details">
                      <div className="job-seeker-message-name-img-time">
                        <div className="job-seeker-message-img">
                          <img src="assets/images/candidate-img/candidate1.jpg" />
                        </div>
                      </div>
                      <div className="job-seeker-message-detail-text">
                        <div className="job-seeker-message-time">
                          <h6>John Doe</h6>
                          <p>7:45 AM</p>
                        </div>
                        <p>
                          Lorem ipsum dolor sit amet, consectetur adipiscing
                          elit. Donec rutrum congue leo eget malesuada. Vivamus
                          suscipit tortor eget felis porttitor.
                        </p>
                      </div>
                    </div>
                    <div className="user-message-chat-details employer-info-main-area">
                      <div className="job-seeker-message-detail-text">
                        <div className="job-seeker-message-time">
                          <h6>John Doe</h6>
                          <p>7:45 AM</p>
                        </div>
                        <p>
                          Lorem ipsum dolor sit amet, consectetur adipiscing
                          elit. Donec rutrum congue leo eget malesuada. Vivamus
                          suscipit tortor eget felis porttitor.
                        </p>
                      </div>
                      <div className="job-seeker-message-name-img-time">
                        <div className="job-seeker-message-img">
                          <img src="assets/images/candidate-img/candidate1.jpg" />
                        </div>
                      </div>
                    </div>
                    <div className="user-message-chat-details">
                      <div className="job-seeker-message-name-img-time">
                        <div className="job-seeker-message-img">
                          <img src="assets/images/candidate-img/candidate1.jpg" />
                        </div>
                      </div>
                      <div className="job-seeker-message-detail-text">
                        <div className="job-seeker-message-time">
                          <h6>John Doe</h6>
                          <p>7:45 AM</p>
                        </div>
                        <p>
                          Lorem ipsum dolor sit amet, consectetur adipiscing
                          elit. Donec rutrum congue leo eget malesuada. Vivamus
                          suscipit tortor eget felis porttitor.
                        </p>
                      </div>
                    </div>
                    <div className="user-message-chat-details employer-info-main-area">
                      <div className="job-seeker-message-detail-text">
                        <div className="job-seeker-message-time">
                          <h6>John Doe</h6>
                          <p>7:45 AM</p>
                        </div>
                        <p>
                          Lorem ipsum dolor sit amet, consectetur adipiscing
                          elit. Donec rutrum congue leo eget malesuada. Vivamus
                          suscipit tortor eget felis porttitor.
                        </p>
                      </div>
                      <div className="job-seeker-message-name-img-time">
                        <div className="job-seeker-message-img">
                          <img src="assets/images/candidate-img/candidate1.jpg" />
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="tab-pane fade" id="menu5" role="tabpanel">
                    <div className="user-message-chat-details">
                      <div className="job-seeker-message-name-img-time">
                        <div className="job-seeker-message-img">
                          <img src="assets/images/candidate-img/candidate1.jpg" />
                        </div>
                      </div>
                      <div className="job-seeker-message-detail-text">
                        <div className="job-seeker-message-time">
                          <h6>John Doe</h6>
                          <p>7:45 AM</p>
                        </div>
                        <p>
                          Lorem ipsum dolor sit amet, consectetur adipiscing
                          elit. Donec rutrum congue leo eget malesuada. Vivamus
                          suscipit tortor eget felis porttitor.
                        </p>
                      </div>
                    </div>
                    <div className="user-message-chat-details employer-info-main-area">
                      <div className="job-seeker-message-detail-text">
                        <div className="job-seeker-message-time">
                          <h6>John Doe</h6>
                          <p>7:45 AM</p>
                        </div>
                        <p>
                          Lorem ipsum dolor sit amet, consectetur adipiscing
                          elit. Donec rutrum congue leo eget malesuada. Vivamus
                          suscipit tortor eget felis porttitor.
                        </p>
                      </div>
                      <div className="job-seeker-message-name-img-time">
                        <div className="job-seeker-message-img">
                          <img src="assets/images/candidate-img/candidate1.jpg" />
                        </div>
                      </div>
                    </div>
                    <div className="user-message-chat-details">
                      <div className="job-seeker-message-name-img-time">
                        <div className="job-seeker-message-img">
                          <img src="assets/images/candidate-img/candidate1.jpg" />
                        </div>
                      </div>
                      <div className="job-seeker-message-detail-text">
                        <div className="job-seeker-message-time">
                          <h6>John Doe</h6>
                          <p>7:45 AM</p>
                        </div>
                        <p>
                          Lorem ipsum dolor sit amet, consectetur adipiscing
                          elit. Donec rutrum congue leo eget malesuada. Vivamus
                          suscipit tortor eget felis porttitor.
                        </p>
                      </div>
                    </div>
                    <div className="user-message-chat-details employer-info-main-area">
                      <div className="job-seeker-message-detail-text">
                        <div className="job-seeker-message-time">
                          <h6>John Doe</h6>
                          <p>7:45 AM</p>
                        </div>
                        <p>
                          Lorem ipsum dolor sit amet, consectetur adipiscing
                          elit. Donec rutrum congue leo eget malesuada. Vivamus
                          suscipit tortor eget felis porttitor.
                        </p>
                      </div>
                      <div className="job-seeker-message-name-img-time">
                        <div className="job-seeker-message-img">
                          <img src="assets/images/candidate-img/candidate1.jpg" />
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="tab-pane fade" id="menu6" role="tabpanel">
                    <div className="user-message-chat-details">
                      <div className="job-seeker-message-name-img-time">
                        <div className="job-seeker-message-img">
                          <img src="assets/images/candidate-img/candidate1.jpg" />
                        </div>
                      </div>
                      <div className="job-seeker-message-detail-text">
                        <div className="job-seeker-message-time">
                          <h6>John Doe</h6>
                          <p>7:45 AM</p>
                        </div>
                        <p>
                          Lorem ipsum dolor sit amet, consectetur adipiscing
                          elit. Donec rutrum congue leo eget malesuada. Vivamus
                          suscipit tortor eget felis porttitor.
                        </p>
                      </div>
                    </div>
                    <div className="user-message-chat-details employer-info-main-area">
                      <div className="job-seeker-message-detail-text">
                        <div className="job-seeker-message-time">
                          <h6>John Doe</h6>
                          <p>7:45 AM</p>
                        </div>
                        <p>
                          Lorem ipsum dolor sit amet, consectetur adipiscing
                          elit. Donec rutrum congue leo eget malesuada. Vivamus
                          suscipit tortor eget felis porttitor.
                        </p>
                      </div>
                      <div className="job-seeker-message-name-img-time">
                        <div className="job-seeker-message-img">
                          <img src="assets/images/candidate-img/candidate1.jpg" />
                        </div>
                      </div>
                    </div>
                    <div className="user-message-chat-details">
                      <div className="job-seeker-message-name-img-time">
                        <div className="job-seeker-message-img">
                          <img src="assets/images/candidate-img/candidate1.jpg" />
                        </div>
                      </div>
                      <div className="job-seeker-message-detail-text">
                        <div className="job-seeker-message-time">
                          <h6>John Doe</h6>
                          <p>7:45 AM</p>
                        </div>
                        <p>
                          Lorem ipsum dolor sit amet, consectetur adipiscing
                          elit. Donec rutrum congue leo eget malesuada. Vivamus
                          suscipit tortor eget felis porttitor.
                        </p>
                      </div>
                    </div>
                    <div className="user-message-chat-details employer-info-main-area">
                      <div className="job-seeker-message-detail-text">
                        <div className="job-seeker-message-time">
                          <h6>John Doe</h6>
                          <p>7:45 AM</p>
                        </div>
                        <p>
                          Lorem ipsum dolor sit amet, consectetur adipiscing
                          elit. Donec rutrum congue leo eget malesuada. Vivamus
                          suscipit tortor eget felis porttitor.
                        </p>
                      </div>
                      <div className="job-seeker-message-name-img-time">
                        <div className="job-seeker-message-img">
                          <img src="assets/images/candidate-img/candidate1.jpg" />
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="tab-pane fade" id="menu7" role="tabpanel">
                    <div className="user-message-chat-details">
                      <div className="job-seeker-message-name-img-time">
                        <div className="job-seeker-message-img">
                          <img src="assets/images/candidate-img/candidate1.jpg" />
                        </div>
                      </div>
                      <div className="job-seeker-message-detail-text">
                        <div className="job-seeker-message-time">
                          <h6>John Doe</h6>
                          <p>7:45 AM</p>
                        </div>
                        <p>
                          Lorem ipsum dolor sit amet, consectetur adipiscing
                          elit. Donec rutrum congue leo eget malesuada. Vivamus
                          suscipit tortor eget felis porttitor.
                        </p>
                      </div>
                    </div>
                    <div className="user-message-chat-details employer-info-main-area">
                      <div className="job-seeker-message-detail-text">
                        <div className="job-seeker-message-time">
                          <h6>John Doe</h6>
                          <p>7:45 AM</p>
                        </div>
                        <p>
                          Lorem ipsum dolor sit amet, consectetur adipiscing
                          elit. Donec rutrum congue leo eget malesuada. Vivamus
                          suscipit tortor eget felis porttitor.
                        </p>
                      </div>
                      <div className="job-seeker-message-name-img-time">
                        <div className="job-seeker-message-img">
                          <img src="assets/images/candidate-img/candidate1.jpg" />
                        </div>
                      </div>
                    </div>
                    <div className="user-message-chat-details">
                      <div className="job-seeker-message-name-img-time">
                        <div className="job-seeker-message-img">
                          <img src="assets/images/candidate-img/candidate1.jpg" />
                        </div>
                      </div>
                      <div className="job-seeker-message-detail-text">
                        <div className="job-seeker-message-time">
                          <h6>John Doe</h6>
                          <p>7:45 AM</p>
                        </div>
                        <p>
                          Lorem ipsum dolor sit amet, consectetur adipiscing
                          elit. Donec rutrum congue leo eget malesuada. Vivamus
                          suscipit tortor eget felis porttitor.
                        </p>
                      </div>
                    </div>
                    <div className="user-message-chat-details employer-info-main-area">
                      <div className="job-seeker-message-detail-text">
                        <div className="job-seeker-message-time">
                          <h6>John Doe</h6>
                          <p>7:45 AM</p>
                        </div>
                        <p>
                          Lorem ipsum dolor sit amet, consectetur adipiscing
                          elit. Donec rutrum congue leo eget malesuada. Vivamus
                          suscipit tortor eget felis porttitor.
                        </p>
                      </div>
                      <div className="job-seeker-message-name-img-time">
                        <div className="job-seeker-message-img">
                          <img src="assets/images/candidate-img/candidate1.jpg" />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="chat-messaging-typeing-function-btn">
                  <div className="chat-messaging-typeing-box">
                    <textarea
                      className="form-control"
                      placeholder="Write Brief Bio Or Introduction"
                      rows={1}
                      defaultValue={""}
                    />
                  </div>
                  <div className="chat-messaging-typeing-function">
                    <div className="chat-messaging-emoji">
                      <i className="fa-solid fa-face-smile" />
                    </div>
                    <div className="chat-messaging-upload-img">
                      <i className="fa-solid fa-image" />
                    </div>
                    <div className="chat-messaging-upload-file">
                      <i className="fa-solid fa-paperclip" />
                    </div>
                    <div className="chat-messaging-send-btn">
                      <i className="fa-solid fa-paper-plane" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
          {/* Chat Messaging System Section End Area */}
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

export default ChatMassageSystem;
