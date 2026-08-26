import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { toast } from "react-toastify";
import { useTranslation } from "react-i18next";
import {
  createSupportTicket,
  fetchMyTickets,
  fetchMyTicketById,
  replyToMyTicket,
  trackPublicTicket,
} from "../utils/ticketApi";
import PageSEO from "../components/PageSEO";
import "./SupportTickets.css";

const CATEGORIES = [
  { value: "Technical", label: "Technical Issue" },
  { value: "Account", label: "Account & Verification" },
  { value: "JobApplication", label: "Job Application Issue" },
  { value: "Billing", label: "Billing & Payment" },
  { value: "General", label: "General Inquiry" },
];

const PRIORITIES = [
  { value: "Low", label: "Low", class: "priority-low" },
  { value: "Medium", label: "Medium", class: "priority-medium" },
  { value: "High", label: "High", class: "priority-high" },
  { value: "Urgent", label: "Urgent", class: "priority-urgent" },
];

export default function SupportTickets() {
  const { t } = useTranslation("global");
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const initialTab = searchParams.get("tab") || "raise";

  const [activeTab, setActiveTab] = useState(initialTab);
  const isAuthenticated = Boolean(localStorage.getItem("token"));

  // Form State (Raise Ticket)
  const [ticketForm, setTicketForm] = useState({
    name: localStorage.getItem("first_name")
      ? `${localStorage.getItem("first_name")} ${localStorage.getItem("last_name") || ""}`.trim()
      : "",
    email: localStorage.getItem("email") || "",
    phone: localStorage.getItem("phone") || "",
    category: "Technical",
    priority: "Medium",
    subject: "",
    description: "",
  });
  const [attachments, setAttachments] = useState([]);
  const [submitting, setSubmitting] = useState(false);
  const [createdTicketResult, setCreatedTicketResult] = useState(null);

  // My Tickets State
  const [myTickets, setMyTickets] = useState([]);
  const [loadingTickets, setLoadingTickets] = useState(false);
  const [statusFilter, setStatusFilter] = useState("All");

  // Public Track State
  const [trackForm, setTrackForm] = useState({
    ticketNumber: "",
    email: "",
  });
  const [trackingLoading, setTrackingLoading] = useState(false);
  const [trackedTicket, setTrackedTicket] = useState(null);

  // Modal / Thread State
  const [activeThreadTicket, setActiveThreadTicket] = useState(null);
  const [threadLoading, setThreadLoading] = useState(false);
  const [replyMessage, setReplyMessage] = useState("");
  const [replySubmitting, setReplySubmitting] = useState(false);

  const fileInputRef = useRef(null);

  // Load My Tickets when tab active
  useEffect(() => {
    if (activeTab === "my_tickets" && isAuthenticated) {
      loadMyTickets();
    }
  }, [activeTab, statusFilter, isAuthenticated]);

  const loadMyTickets = async () => {
    setLoadingTickets(true);
    try {
      const params = {};
      if (statusFilter !== "All") {
        params.status = statusFilter;
      }
      const res = await fetchMyTickets(params);
      if (res.data?.success || Array.isArray(res.data?.data) || Array.isArray(res.data)) {
        const list = res.data?.data || res.data || [];
        setMyTickets(Array.isArray(list) ? list : []);
      } else {
        setMyTickets([]);
      }
    } catch (err) {
      console.error("Error fetching my tickets:", err);
      // fallback empty list
      setMyTickets([]);
    } finally {
      setLoadingTickets(false);
    }
  };

  // Handle Form Change
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setTicketForm((prev) => ({ ...prev, [name]: value }));
  };

  // File Upload Handlers
  const handleFileSelect = (e) => {
    const files = Array.from(e.target.files || []);
    if (files.length + attachments.length > 5) {
      toast.warning("Maximum 5 file attachments allowed");
      return;
    }
    setAttachments((prev) => [...prev, ...files]);
  };

  const handleRemoveFile = (index) => {
    setAttachments((prev) => prev.filter((_, i) => i !== index));
  };

  // Submit New Ticket
  const handleSubmitTicket = async (e) => {
    e.preventDefault();
    if (!ticketForm.name || !ticketForm.email || !ticketForm.subject || !ticketForm.description) {
      toast.error("Please fill in all required fields");
      return;
    }

    setSubmitting(true);
    try {
      const res = await createSupportTicket(ticketForm, attachments);
      const ticketData = res.data?.data || res.data || {};
      setCreatedTicketResult(ticketData);
      toast.success(res.data?.message || "Support ticket created successfully!");

      // Reset form
      setTicketForm({
        name: localStorage.getItem("first_name") || "",
        email: localStorage.getItem("email") || "",
        phone: localStorage.getItem("phone") || "",
        category: "Technical",
        priority: "Medium",
        subject: "",
        description: "",
      });
      setAttachments([]);
      if (fileInputRef.current) fileInputRef.current.value = "";
    } catch (err) {
      console.error("Error creating ticket:", err);
      const msg = err.response?.data?.message || "Failed to create support ticket. Please try again.";
      toast.error(msg);
    } finally {
      setSubmitting(false);
    }
  };

  // Track Public Ticket
  const handleTrackSubmit = async (e) => {
    e.preventDefault();
    if (!trackForm.ticketNumber || !trackForm.email) {
      toast.error("Please enter both Ticket Number and Email");
      return;
    }

    setTrackingLoading(true);
    setTrackedTicket(null);
    try {
      const res = await trackPublicTicket(trackForm.ticketNumber.trim(), trackForm.email.trim());
      if (res.data?.data || res.data?.ticketNumber) {
        setTrackedTicket(res.data?.data || res.data);
      } else {
        toast.error("No ticket found with the provided details.");
      }
    } catch (err) {
      console.error("Error tracking ticket:", err);
      toast.error(err.response?.data?.message || "Ticket not found or email does not match.");
    } finally {
      setTrackingLoading(false);
    }
  };

  // Open Thread View
  const handleOpenThread = async (ticket) => {
    setActiveThreadTicket(ticket);
    setReplyMessage("");
    if (ticket._id) {
      setThreadLoading(true);
      try {
        const res = await fetchMyTicketById(ticket._id);
        if (res.data?.data) {
          setActiveThreadTicket(res.data.data);
        }
      } catch (err) {
        console.error("Error loading ticket detail:", err);
      } finally {
        setThreadLoading(false);
      }
    }
  };

  const isTicketClosed = (status = "") => String(status).toLowerCase().trim() === "closed";

  // Send Reply
  const handleSendReply = async (e) => {
    e.preventDefault();
    if (!replyMessage.trim() || !activeThreadTicket?._id) {
      return;
    }

    if (isTicketClosed(activeThreadTicket?.status)) {
      toast.warning("This ticket is Closed. Replies are disabled.");
      return;
    }

    setReplySubmitting(true);
    try {
      const res = await replyToMyTicket(activeThreadTicket._id, replyMessage.trim());
      toast.success(res.data?.message || "Reply sent successfully");
      setReplyMessage("");

      // Update active ticket thread in modal
      if (res.data?.data) {
        setActiveThreadTicket(res.data.data);
      } else {
        // reload thread
        const updated = await fetchMyTicketById(activeThreadTicket._id);
        if (updated.data?.data) setActiveThreadTicket(updated.data.data);
      }
      if (activeTab === "my_tickets") loadMyTickets();
    } catch (err) {
      console.error("Error sending reply:", err);
      toast.error(err.response?.data?.message || "Failed to send reply");
    } finally {
      setReplySubmitting(false);
    }
  };

  const getStatusBadge = (status = "Open") => {
    const s = String(status).toLowerCase().replace(/\s+/g, "");
    if (s.includes("progress")) return <span className="badge-status badge-status-inprogress">In Progress</span>;
    if (s.includes("pending")) return <span className="badge-status badge-status-pending">Pending</span>;
    if (s.includes("resolved")) return <span className="badge-status badge-status-resolved">Resolved</span>;
    if (s.includes("closed")) return <span className="badge-status badge-status-closed">Closed</span>;
    return <span className="badge-status badge-status-open">Open</span>;
  };

  const getPriorityBadge = (priority = "Medium") => {
    const p = String(priority).toLowerCase();
    if (p === "urgent") return <span className="badge-priority badge-priority-urgent">Urgent</span>;
    if (p === "high") return <span className="badge-priority badge-priority-high">High</span>;
    if (p === "low") return <span className="badge-priority badge-priority-low">Low</span>;
    return <span className="badge-priority badge-priority-medium">Medium</span>;
  };

  return (
    <div className="support-tickets-page-wrapper">
      <PageSEO
        title="Support Tickets & Help Desk | Connect Work"
        description="Raise a support ticket, track issue resolution, or follow up with our customer support team."
      />

      {/* Standard Portal Banner */}
      <section className="inner-banners-info-area">
        <div className="inner-banners-img-area">
          <img
            src="/jobPortal/assets/images/banner/inner-banner-img.jpg"
            alt="Support Tickets"
            loading="lazy"
            decoding="async"
          />
        </div>
        <div className="inner-banners-title-info">
          <div className="container">
            <div className="row">
              <div className="col-lg-12 col-md-12 col-sm-12">
                <div className="inner-page-banner-title">
                  <h1>Help Desk & Support Tickets</h1>
                  <ul>
                    <li className="menu-divide-arrow">
                      <Link to="/">{t("header.home") || "Home"}</Link>
                    </li>
                    <li>Support Tickets</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content Area */}
      <div className="support-tickets-area ptb-100">
        <div className="container">
          {/* Tab Navigation */}
          <div className="support-nav-tabs">
            <button
              type="button"
              className={`support-tab-item ${activeTab === "raise" ? "active" : ""}`}
              onClick={() => {
                setActiveTab("raise");
                setCreatedTicketResult(null);
              }}
            >
              <i className="fa-solid fa-plus-circle" />
              <span>Raise a Ticket</span>
            </button>

            <button
              type="button"
              className={`support-tab-item ${activeTab === "my_tickets" ? "active" : ""}`}
              onClick={() => setActiveTab("my_tickets")}
            >
              <i className="fa-solid fa-list-check" />
              <span>My Tickets</span>
            </button>

            <button
              type="button"
              className={`support-tab-item ${activeTab === "track" ? "active" : ""}`}
              onClick={() => setActiveTab("track")}
            >
              <i className="fa-solid fa-magnifying-glass" />
              <span>Track Ticket</span>
            </button>
          </div>

        {/* Main Content Area */}
        <div className="support-main-card">
          {/* TAB 1: RAISE A TICKET */}
          {activeTab === "raise" && (
            <div>
              {createdTicketResult ? (
                <div className="ticket-success-alert">
                  <i className="fa-solid fa-circle-check fa-3x text-success mb-3" />
                  <h3>Support Ticket Created Successfully!</h3>
                  <p className="text-muted mb-2">
                    Your issue has been logged with our support team. Please keep your ticket number for reference:
                  </p>
                  <div className="ticket-ref-box">
                    {createdTicketResult.ticketNumber || createdTicketResult._id}
                  </div>
                  <p className="small text-muted">
                    We have sent a confirmation email to <strong>{ticketForm.email || "your email address"}</strong>.
                  </p>
                  <div className="mt-4 d-flex justify-content-center gap-3">
                    <button
                      type="button"
                      className="btn btn-outline-primary"
                      onClick={() => setCreatedTicketResult(null)}
                    >
                      Submit Another Ticket
                    </button>
                    <button
                      type="button"
                      className="btn btn-primary"
                      onClick={() => {
                        if (isAuthenticated) {
                          setActiveTab("my_tickets");
                        } else {
                          setTrackForm({
                            ticketNumber: createdTicketResult.ticketNumber || "",
                            email: ticketForm.email || "",
                          });
                          setActiveTab("track");
                        }
                      }}
                    >
                      View / Track Ticket
                    </button>
                  </div>
                </div>
              ) : (
                <div>
                  <div className="section-header">
                    <h2>Submit a Support Request</h2>
                    <p>Provide details about your issue and our team will get back to you promptly.</p>
                  </div>

                  <form className="support-form" onSubmit={handleSubmitTicket}>
                    <div className="row">
                      <div className="col-md-4 form-group">
                        <label>Your Name *</label>
                        <input
                          type="text"
                          name="name"
                          className="form-control"
                          placeholder="Full Name"
                          value={ticketForm.name}
                          onChange={handleInputChange}
                          required
                        />
                      </div>
                      <div className="col-md-4 form-group">
                        <label>Email Address *</label>
                        <input
                          type="email"
                          name="email"
                          className="form-control"
                          placeholder="name@example.com"
                          value={ticketForm.email}
                          onChange={handleInputChange}
                          required
                        />
                      </div>
                      <div className="col-md-4 form-group">
                        <label>Phone Number (Optional)</label>
                        <input
                          type="tel"
                          name="phone"
                          className="form-control"
                          placeholder="+1 (555) 000-0000"
                          value={ticketForm.phone}
                          onChange={handleInputChange}
                        />
                      </div>
                    </div>

                    <div className="row">
                      <div className="col-md-6 form-group">
                        <label>Category *</label>
                        <select
                          name="category"
                          className="form-select"
                          value={ticketForm.category}
                          onChange={handleInputChange}
                        >
                          {CATEGORIES.map((cat) => (
                            <option key={cat.value} value={cat.value}>
                              {cat.label}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div className="col-md-6 form-group">
                        <label>Priority Level</label>
                        <div className="priority-selector-group">
                          {PRIORITIES.map((p) => (
                            <div key={p.value} className="priority-option">
                              <input
                                type="radio"
                                id={`prio-${p.value}`}
                                name="priority"
                                value={p.value}
                                checked={ticketForm.priority === p.value}
                                onChange={handleInputChange}
                              />
                              <label htmlFor={`prio-${p.value}`} className={p.class}>
                                {p.label}
                              </label>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="form-group">
                      <label>Subject / Issue Title *</label>
                      <input
                        type="text"
                        name="subject"
                        className="form-control"
                        placeholder="Brief summary of your inquiry or problem"
                        value={ticketForm.subject}
                        onChange={handleInputChange}
                        required
                      />
                    </div>

                    <div className="form-group">
                      <label>Detailed Description *</label>
                      <textarea
                        name="description"
                        className="form-control"
                        rows="5"
                        placeholder="Please describe the issue in detail, including any error messages or steps to reproduce..."
                        value={ticketForm.description}
                        onChange={handleInputChange}
                        required
                      />
                    </div>

                    <div className="form-group">
                      <label>File Attachments (Optional - Max 5 files)</label>
                      <div
                        className="file-upload-area"
                        onClick={() => fileInputRef.current?.click()}
                      >
                        <i className="fa-solid fa-cloud-arrow-up" />
                        <p>Click here to attach screenshots, logs, or documents (PDF, PNG, JPG, DOCX)</p>
                        <input
                          ref={fileInputRef}
                          type="file"
                          multiple
                          onChange={handleFileSelect}
                          style={{ display: "none" }}
                          accept="image/*,.pdf,.doc,.docx,.txt"
                        />
                      </div>

                      {attachments.length > 0 && (
                        <div className="selected-files-list">
                          {attachments.map((file, idx) => (
                            <span key={idx} className="file-tag">
                              <i className="fa-solid fa-paperclip" />
                              {file.name} ({(file.size / 1024).toFixed(0)} KB)
                              <button
                                type="button"
                                className="remove-file-btn"
                                onClick={() => handleRemoveFile(idx)}
                              >
                                &times;
                              </button>
                            </span>
                          ))}
                        </div>
                      )}
                    </div>

                    <div className="mt-4">
                      <button
                        type="submit"
                        className="btn-submit-ticket"
                        disabled={submitting}
                      >
                        {submitting ? (
                          <>
                            <span className="spinner-border spinner-border-sm me-2" role="status" />
                            Submitting Ticket...
                          </>
                        ) : (
                          <>
                            <i className="fa-solid fa-paper-plane" />
                            Submit Support Ticket
                          </>
                        )}
                      </button>
                    </div>
                  </form>
                </div>
              )}
            </div>
          )}

          {/* TAB 2: MY TICKETS */}
          {activeTab === "my_tickets" && (
            <div>
              {!isAuthenticated ? (
                <div className="text-center py-5">
                  <i className="fa-solid fa-lock fa-3x text-muted mb-3" />
                  <h3>Sign In to View Your Tickets</h3>
                  <p className="text-muted max-w-md mx-auto mb-4">
                    Please log in to your Candidate or Employer account to view and manage all your submitted support tickets.
                  </p>
                  <div className="d-flex justify-content-center gap-3">
                    <Link to="/login" className="btn btn-primary px-4">
                      Candidate Login
                    </Link>
                    <Link to="/employer-login" className="btn btn-outline-primary px-4">
                      Employer Login
                    </Link>
                  </div>
                </div>
              ) : (
                <div>
                  <div className="section-header d-flex justify-content-between align-items-center flex-wrap gap-3">
                    <div>
                      <h2>My Support Tickets</h2>
                      <p>View all tickets submitted from your account and reply to the support team.</p>
                    </div>
                    <button
                      type="button"
                      className="btn btn-sm btn-outline-primary"
                      onClick={loadMyTickets}
                    >
                      <i className="fa-solid fa-rotate-right me-1" /> Refresh
                    </button>
                  </div>

                  {/* Filter Pills */}
                  <div className="tickets-filters-bar">
                    <div className="status-filter-pills">
                      {["All", "Open", "In Progress", "Pending", "Resolved", "Closed"].map((st) => (
                        <button
                          key={st}
                          type="button"
                          className={`pill-filter ${statusFilter === st ? "active" : ""}`}
                          onClick={() => setStatusFilter(st)}
                        >
                          {st}
                        </button>
                      ))}
                    </div>
                  </div>

                  {loadingTickets ? (
                    <div className="text-center py-5">
                      <div className="spinner-border text-primary" role="status" />
                      <p className="mt-2 text-muted">Loading your tickets...</p>
                    </div>
                  ) : myTickets.length === 0 ? (
                    <div className="text-center py-5">
                      <i className="fa-regular fa-folder-open fa-3x text-muted mb-3" />
                      <h4>No Tickets Found</h4>
                      <p className="text-muted">You haven't submitted any support tickets under this filter.</p>
                      <button
                        type="button"
                        className="btn btn-primary mt-2"
                        onClick={() => setActiveTab("raise")}
                      >
                        Raise a New Ticket
                      </button>
                    </div>
                  ) : (
                    <div className="tickets-table-responsive">
                      <table className="tickets-table">
                        <thead>
                          <tr>
                            <th>Ticket ID</th>
                            <th>Subject</th>
                            <th>Category</th>
                            <th>Priority</th>
                            <th>Status</th>
                            <th>Date</th>
                            <th>Action</th>
                          </tr>
                        </thead>
                        <tbody>
                          {myTickets.map((tck) => (
                            <tr key={tck._id || tck.ticketNumber}>
                              <td>
                                <span className="ticket-number-tag">
                                  {tck.ticketNumber || tck._id}
                                </span>
                              </td>
                              <td style={{ fontWeight: 600 }}>{tck.subject}</td>
                              <td>{tck.category || "General"}</td>
                              <td>{getPriorityBadge(tck.priority)}</td>
                              <td>{getStatusBadge(tck.status)}</td>
                              <td>
                                {tck.createdAt
                                  ? new Date(tck.createdAt).toLocaleDateString()
                                  : "Recently"}
                              </td>
                              <td>
                                <button
                                  type="button"
                                  className="btn btn-sm btn-primary"
                                  onClick={() => handleOpenThread(tck)}
                                >
                                  View / Reply
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* TAB 3: TRACK PUBLIC TICKET */}
          {activeTab === "track" && (
            <div>
              <div className="section-header">
                <h2>Track Ticket Status</h2>
                <p>Lookup any guest or public ticket using your Ticket Number and email address.</p>
              </div>

              <form className="support-form mb-4" onSubmit={handleTrackSubmit}>
                <div className="row">
                  <div className="col-md-5 form-group">
                    <label>Ticket Number *</label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="e.g. TCK-20260814-7083"
                      value={trackForm.ticketNumber}
                      onChange={(e) =>
                        setTrackForm({ ...trackForm, ticketNumber: e.target.value })
                      }
                      required
                    />
                  </div>
                  <div className="col-md-5 form-group">
                    <label>Requester Email Address *</label>
                    <input
                      type="email"
                      className="form-control"
                      placeholder="Email used when creating ticket"
                      value={trackForm.email}
                      onChange={(e) =>
                        setTrackForm({ ...trackForm, email: e.target.value })
                      }
                      required
                    />
                  </div>
                  <div className="col-md-2 form-group d-flex align-items-end">
                    <button
                      type="submit"
                      className="btn-submit-ticket w-100 justify-content-center"
                      disabled={trackingLoading}
                    >
                      {trackingLoading ? (
                        <span className="spinner-border spinner-border-sm" />
                      ) : (
                        "Track"
                      )}
                    </button>
                  </div>
                </div>
              </form>

              {trackedTicket && (
                <div className="ticket-main-card border rounded-3 p-4 bg-light">
                  <div className="d-flex justify-content-between align-items-center flex-wrap gap-2 mb-3">
                    <h4 className="mb-0">
                      <span className="ticket-number-tag me-2">
                        {trackedTicket.ticketNumber || trackedTicket._id}
                      </span>
                      {trackedTicket.subject}
                    </h4>
                    <div className="d-flex gap-2">
                      {getPriorityBadge(trackedTicket.priority)}
                      {getStatusBadge(trackedTicket.status)}
                    </div>
                  </div>

                  <p className="text-muted">{trackedTicket.description}</p>

                  <hr />
                  <h5>Conversation History</h5>
                  {trackedTicket.replies && trackedTicket.replies.length > 0 ? (
                    <div className="thread-messages-list">
                      {trackedTicket.replies.map((rep, idx) => (
                        <div
                          key={idx}
                          className={`thread-bubble ${
                            rep.senderRole === "Admin" ? "bubble-admin" : "bubble-user"
                          }`}
                        >
                          <div className="bubble-meta">
                            <span className="bubble-author">
                              {rep.senderName || rep.senderRole || "Support Agent"}
                            </span>
                            <span>
                              {rep.createdAt
                                ? new Date(rep.createdAt).toLocaleString()
                                : ""}
                            </span>
                          </div>
                          <p className="bubble-text">{rep.message}</p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-muted small">No responses yet from support.</p>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>

      {/* Ticket Thread Detail & Reply Modal */}
      {activeThreadTicket && (
        <div className="ticket-thread-modal-overlay" onClick={() => setActiveThreadTicket(null)}>
          <div
            className="ticket-thread-modal"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="modal-header-custom">
              <div>
                <h5 className="mb-1">
                  <span className="ticket-number-tag me-2">
                    {activeThreadTicket.ticketNumber || activeThreadTicket._id}
                  </span>
                  {activeThreadTicket.subject}
                </h5>
                <div className="d-flex gap-2 align-items-center mt-1">
                  {getPriorityBadge(activeThreadTicket.priority)}
                  {getStatusBadge(activeThreadTicket.status)}
                  <span className="text-muted small ms-2">
                    Category: {activeThreadTicket.category || "General"}
                  </span>
                </div>
              </div>
              <button
                type="button"
                className="btn-close"
                onClick={() => setActiveThreadTicket(null)}
              />
            </div>

            <div className="modal-body-scrollable">
              {threadLoading ? (
                <div className="text-center py-4">
                  <div className="spinner-border text-primary" />
                </div>
              ) : (
                <>
                  <div className="bg-light p-3 rounded-3 mb-3">
                    <h6 className="fw-bold mb-1">Initial Issue Description:</h6>
                    <p className="mb-0 text-muted" style={{ whiteSpace: "pre-wrap" }}>
                      {activeThreadTicket.description}
                    </p>
                  </div>

                  <h6 className="fw-bold mt-4 mb-2">Replies & Updates</h6>
                  <div className="thread-messages-list">
                    {activeThreadTicket.replies && activeThreadTicket.replies.length > 0 ? (
                      activeThreadTicket.replies.map((rep, idx) => (
                        <div
                          key={idx}
                          className={`thread-bubble ${
                            rep.senderRole === "Admin" ? "bubble-admin" : "bubble-user"
                          }`}
                        >
                          <div className="bubble-meta">
                            <span className="bubble-author">
                              {rep.senderName || (rep.senderRole === "Admin" ? "Support Agent" : "You")}
                            </span>
                            <span>
                              {rep.createdAt ? new Date(rep.createdAt).toLocaleString() : ""}
                            </span>
                          </div>
                          <p className="bubble-text">{rep.message}</p>
                        </div>
                      ))
                    ) : (
                      <p className="text-muted small">No responses yet. We will notify you once a support agent responds.</p>
                    )}
                  </div>
                </>
              )}
            </div>

            {/* Reply Form Footer */}
            <div className="modal-footer-reply">
              {isTicketClosed(activeThreadTicket?.status) ? (
                <div className="alert alert-secondary d-flex align-items-center justify-content-between w-100 mb-0 py-2 px-3">
                  <span className="small text-muted">
                    <i className="fa-solid fa-lock me-2 text-danger" />
                    <strong>This ticket is Closed.</strong> Replies are disabled for closed tickets.
                  </span>
                  <button
                    type="button"
                    className="btn btn-sm btn-outline-primary ms-2"
                    onClick={() => {
                      setActiveThreadTicket(null);
                      setActiveTab("raise");
                    }}
                  >
                    Raise New Ticket
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSendReply}>
                  <div className="input-group">
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Type your reply message here..."
                      value={replyMessage}
                      onChange={(e) => setReplyMessage(e.target.value)}
                      disabled={replySubmitting}
                    />
                    <button
                      type="submit"
                      className="btn btn-primary"
                      disabled={replySubmitting || !replyMessage.trim()}
                    >
                      {replySubmitting ? "Sending..." : "Send Reply"}
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
