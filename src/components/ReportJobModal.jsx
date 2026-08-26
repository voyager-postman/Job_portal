import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";
import { reportJobPosting } from "../Services/recruiterJobService";

const REPORT_REASONS = [
  { value: "Scam / Fraud", labelKey: "jobs.report_reason_scam", defaultLabel: "Scam / Fraud" },
  { value: "Inappropriate content", labelKey: "jobs.report_reason_inappropriate", defaultLabel: "Inappropriate content" },
  { value: "Fake company", labelKey: "jobs.report_reason_fake_company", defaultLabel: "Fake company" },
  { value: "Discriminatory", labelKey: "jobs.report_reason_discriminatory", defaultLabel: "Discriminatory" },
  { value: "Misleading salary", labelKey: "jobs.report_reason_misleading_salary", defaultLabel: "Misleading salary" },
  { value: "Expired job", labelKey: "jobs.report_reason_expired", defaultLabel: "Expired job" },
  { value: "Other", labelKey: "jobs.report_reason_other", defaultLabel: "Other" },
];

function ReportJobModal({
  modalId = "reportJobModal",
  jobId,
  jobTitle = "",
  companyName = "",
  onClose,
}) {
  const { t } = useTranslation("global");
  const [reason, setReason] = useState(REPORT_REASONS[0].value);
  const [details, setDetails] = useState("");
  const [email, setEmail] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const storedEmail = localStorage.getItem("user_email") || "";
    setEmail(storedEmail);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!jobId) {
      toast.error(t("jobs.job_not_found", "Job not found"));
      return;
    }

    if (!reason) {
      toast.error(t("jobs.select_report_reason", "Please select a reason for reporting"));
      return;
    }

    try {
      setSubmitting(true);
      const res = await reportJobPosting(jobId, {
        reason,
        details: details.trim(),
        email: email.trim(),
      });

      toast.success(
        res?.message ||
          t(
            "jobs.report_submitted",
            "Report submitted successfully. Our team will review this listing."
          )
      );

      // Reset form
      setReason(REPORT_REASONS[0].value);
      setDetails("");

      // Hide bootstrap modal
      const modalEl = document.getElementById(modalId);
      if (modalEl && window.bootstrap?.Modal) {
        const modalInstance = window.bootstrap.Modal.getInstance(modalEl);
        if (modalInstance) {
          modalInstance.hide();
        }
      }

      if (onClose) {
        onClose();
      }
    } catch (error) {
      console.error("Report Job error:", error);
      const errorMsg =
        error.response?.data?.message ||
        t("header.something_wrong", "Failed to submit report. Please try again.");
      toast.error(errorMsg);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div
      className="modal fade"
      id={modalId}
      tabIndex={-1}
      aria-labelledby={`${modalId}Label`}
      aria-hidden="true"
    >
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content" style={{ borderRadius: "16px", overflow: "hidden" }}>
          <div
            className="modal-header"
            style={{
              backgroundColor: "#fff5f5",
              borderBottom: "1px solid #fee2e2",
              padding: "16px 24px",
            }}
          >
            <div className="d-flex align-items-center gap-2">
              <div
                style={{
                  width: "36px",
                  height: "36px",
                  borderRadius: "50%",
                  backgroundColor: "#fee2e2",
                  color: "#dc2626",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <i className="fa-solid fa-flag fs-6" />
              </div>
              <div>
                <h5 className="modal-title mb-0" id={`${modalId}Label`} style={{ fontWeight: 700, color: "#1f2937" }}>
                  {t("jobs.report_job_title", "Report this Job")}
                </h5>
                {jobTitle && (
                  <p className="text-muted small mb-0" style={{ fontSize: "12px" }}>
                    {jobTitle} {companyName ? `• ${companyName}` : ""}
                  </p>
                )}
              </div>
            </div>
            <button
              type="button"
              className="btn-close"
              data-bs-dismiss="modal"
              aria-label="Close"
              onClick={onClose}
            />
          </div>

          <form onSubmit={handleSubmit}>
            <div className="modal-body" style={{ padding: "20px 24px" }}>
              <p className="text-muted small mb-3">
                {t(
                  "jobs.report_description",
                  "Help us keep our community safe. If you believe this job post violates our guidelines, is fraudulent, or contains incorrect info, please report it."
                )}
              </p>

              {/* Reason Selector */}
              <div className="mb-3">
                <label className="form-label fw-bold" style={{ fontSize: "13px" }}>
                  {t("jobs.report_reason", "Reason for reporting")} <span className="text-danger">*</span>
                </label>
                <select
                  className="form-select form-control"
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  required
                  style={{ borderRadius: "8px", height: "44px", fontSize: "14px" }}
                >
                  {REPORT_REASONS.map((r) => (
                    <option key={r.value} value={r.value}>
                      {t(r.labelKey, r.defaultLabel)}
                    </option>
                  ))}
                </select>
              </div>

              {/* Details Textarea */}
              <div className="mb-3">
                <label className="form-label fw-bold" style={{ fontSize: "13px" }}>
                  {t("jobs.report_details", "Details / Explanation")}
                </label>
                <textarea
                  className="form-control"
                  rows={4}
                  placeholder={t(
                    "jobs.report_details_placeholder",
                    "Provide any extra context, evidence, or information..."
                  )}
                  value={details}
                  onChange={(e) => setDetails(e.target.value)}
                  style={{ borderRadius: "8px", fontSize: "14px" }}
                />
              </div>

              {/* Email (Optional for guests, pre-filled for logged-in) */}
              <div className="mb-2">
                <label className="form-label fw-bold" style={{ fontSize: "13px" }}>
                  {t("jobs.report_email", "Your Email (optional)")}
                </label>
                <input
                  type="email"
                  className="form-control"
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  style={{ borderRadius: "8px", height: "42px", fontSize: "14px" }}
                />
                <small className="text-muted" style={{ fontSize: "11px" }}>
                  {t("jobs.report_email_hint", "We may contact you if we need additional details.")}
                </small>
              </div>
            </div>

            <div
              className="modal-footer"
              style={{
                backgroundColor: "#f9fafb",
                borderTop: "1px solid #f3f4f6",
                padding: "14px 24px",
              }}
            >
              <button
                type="button"
                className="btn btn-light"
                data-bs-dismiss="modal"
                onClick={onClose}
                disabled={submitting}
                style={{ borderRadius: "8px", fontWeight: 600 }}
              >
                {t("header.cancel", "Cancel")}
              </button>
              <button
                type="submit"
                className="btn btn-danger"
                disabled={submitting}
                style={{
                  borderRadius: "8px",
                  fontWeight: 600,
                  backgroundColor: "#dc2626",
                  borderColor: "#dc2626",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "6px",
                }}
              >
                {submitting ? (
                  <>
                    <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true" />
                    {t("header.submitting", "Submitting...")}
                  </>
                ) : (
                  <>
                    <i className="fa-solid fa-paper-plane" />
                    {t("jobs.submit_report", "Submit Report")}
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default ReportJobModal;
