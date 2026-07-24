import React from "react";
import { useTranslation } from "react-i18next";

const CustomCreditModal = ({
  isOpen,
  onClose,
  creditType,
  onCreditTypeChange,
  jobCredits,
  onJobCreditsChange,
  cvCredits,
  onCvCreditsChange,
  onSubmit,
  loading = false,
}) => {
  const { t } = useTranslation("global");

  if (!isOpen) return null;

  return (
    <div className="custom-modal-overlay" onClick={onClose}>
      <div
        className="custom-modal-content topup-modal-content"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-header-premium">
          <h4 className="fw-bold mb-0">{t("wallet.requestCustomCredits")}</h4>
          <button type="button" className="btn-close-custom" onClick={onClose}>
            <i className="fa-solid fa-xmark" />
          </button>
        </div>
        <div className="modal-body-premium p-4">
          <div className="custom-request-form">
            <div className="mb-4">
              <label className="form-label-premium">{t("wallet.creditType")}</label>
              <select
                className="form-select-premium"
                value={creditType}
                onChange={(e) => onCreditTypeChange(e.target.value)}
              >
                <option value="CV">{t("wallet.cvCreditOnly")}</option>
                <option value="JOB">{t("wallet.jobPostingCreditOnly")}</option>
                <option value="BOTH">{t("wallet.bothCvJob")}</option>
              </select>
            </div>
            <div className="row g-3 mb-4">
              {(creditType === "JOB" || creditType === "BOTH") && (
                <div className="col-md-6">
                  <label className="form-label-premium">
                    {t("wallet.jobPostingCredits")}
                  </label>
                  <input
                    className="form-control-premium"
                    placeholder={t("wallet.enterAmount")}
                    type="number"
                    min="0"
                    value={jobCredits}
                    onChange={(e) => onJobCreditsChange(e.target.value)}
                  />
                </div>
              )}
              {(creditType === "CV" || creditType === "BOTH") && (
                <div className="col-md-6">
                  <label className="form-label-premium">
                    {t("wallet.cvViewingCredits")}
                  </label>
                  <input
                    className="form-control-premium"
                    placeholder={t("wallet.enterAmount")}
                    type="number"
                    min="0"
                    value={cvCredits}
                    onChange={(e) => onCvCreditsChange(e.target.value)}
                  />
                </div>
              )}
            </div>
            <div className="d-flex gap-3 mt-5">
              <button
                type="button"
                className="btn-cancel-custom w-100"
                onClick={onClose}
              >
                {t("header.Cancel")}
              </button>
              <button
                type="button"
                className="btn-submit-custom w-100"
                onClick={onSubmit}
                disabled={loading}
              >
                {loading ? t("wallet.submitting") : t("wallet.submitRequest")}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomCreditModal;
