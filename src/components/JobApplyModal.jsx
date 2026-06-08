import React from "react";
import { useTranslation } from "react-i18next";
import {
  getDisplayFileName,
  getFileIconClass,
  getFileName,
  isGeneratedFileName,
} from "../utils/jobApplyHelpers";
import "./JobApplyModal.css";

function JobApplyModal({
  modalId = "exampleModal",
  resumeList = [],
  coverLetterList = [],
  selectedResumeUrl,
  selectedCoverLetterUrl,
  selectedCustomFile,
  isApplying,
  fileInputRef,
  cvUploadInputRef,
  coverUploadInputRef,
  onSelect,
  onFileUpload,
  onUploadCv,
  onUploadCover,
  isUploadingCv = false,
  isUploadingCover = false,
  onApply,
  onClose,
  onClearCustom,
  isSelectionMade,
}) {
  const { t } = useTranslation("global");

  return (
    <div
      className="modal fade job-apply-modal"
      id={modalId}
      tabIndex={-1}
      aria-labelledby={`${modalId}Label`}
      aria-hidden="true"
    >
      <div className="modal-dialog apply-modal-dialog">
        <div className="modal-content">
          <div className="modal-header">
            <h1 className="modal-title" id={`${modalId}Label`}>
              {t("header.apply_now")}
            </h1>
            <button
              type="button"
              className="btn-close"
              data-bs-dismiss="modal"
              aria-label="Close"
              onClick={onClose}
            />
          </div>
          <div className="modal-body apply-modal-body">
            <p className="apply-modal-hint">
              <i className="fa-solid fa-circle-info me-2" />
              {t("header.apply_cv_cover_hint")}
            </p>
            <div className="job-apply-defult-resume-custom-resume apply-modal-redesign">
              <div
                className={
                  "apply-doc-section" +
                  (selectedResumeUrl && !selectedCustomFile ? " is-complete" : "")
                }
              >
                <div className="apply-doc-section-header">
                  <span className="apply-doc-section-icon">
                    <i className="fa-solid fa-file-lines" />
                  </span>
                  <div className="apply-doc-section-title-wrap">
                    <div className="apply-doc-section-title-row">
                      <h6>{t("header.select_cv")}</h6>
                      <span className="apply-doc-required-badge">
                        {t("header.required_field")}
                      </span>
                    </div>
                  </div>
                  {selectedResumeUrl && (
                    <i className="fa-solid fa-circle-check apply-doc-check" />
                  )}
                </div>
                <div className="apply-doc-section-body">
                  <div className="apply-doc-file-list">
                    {Array.isArray(resumeList) && resumeList.length > 0 ? (
                      resumeList.map((resume, index) => {
                        const fileName = getDisplayFileName(
                          resume,
                          index,
                          "resume",
                        );
                        const rawName = getFileName(resume);
                        return (
                          <div
                            key={resume._id}
                            className={
                              "apply-doc-item" +
                              (selectedResumeUrl === resume.url ? " active" : "")
                            }
                            onClick={() => {
                              onClearCustom?.();
                              onSelect("resume", resume.url);
                            }}
                          >
                            <div className="apply-doc-item-left">
                              <i
                                className={
                                  getFileIconClass(fileName) + " file-icon"
                                }
                              />
                              <span>
                                <span className="apply-doc-item-name">
                                  {fileName}
                                </span>
                                {isGeneratedFileName(rawName) && (
                                  <small className="apply-doc-item-sub">
                                    {rawName}
                                  </small>
                                )}
                              </span>
                            </div>
                            {selectedResumeUrl === resume.url && (
                              <i className="fa-solid fa-circle-check apply-doc-check" />
                            )}
                          </div>
                        );
                      })
                    ) : (
                      <p className="apply-doc-empty">
                        {t("header.no_cv_in_profile")}
                      </p>
                    )}
                  </div>
                  <div className="apply-doc-upload-row">
                    <input
                      ref={cvUploadInputRef}
                      type="file"
                      accept=".pdf,.doc,.docx"
                      onChange={onUploadCv}
                      style={{ display: "none" }}
                    />
                    <button
                      type="button"
                      className="default-btn btn apply-doc-upload-btn"
                      disabled={isUploadingCv}
                      onClick={(e) => {
                        e.preventDefault();
                        onClearCustom?.();
                        cvUploadInputRef?.current?.click();
                      }}
                    >
                      {isUploadingCv ? (
                        <>
                          <span
                            className="spinner-border spinner-border-sm me-2"
                            role="status"
                            aria-hidden="true"
                          />
                          {t("header.uploading")}
                        </>
                      ) : (
                        <>
                          <i className="fa-solid fa-cloud-arrow-up me-2" />
                          {t("header.upload_cv")}
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>

              <div
                className={
                  "apply-doc-section" +
                  (selectedCoverLetterUrl && !selectedCustomFile
                    ? " is-complete"
                    : "")
                }
              >
                <div className="apply-doc-section-header">
                  <span className="apply-doc-section-icon">
                    <i className="fa-solid fa-envelope-open-text" />
                  </span>
                  <div className="apply-doc-section-title-wrap">
                    <div className="apply-doc-section-title-row">
                      <h6>{t("header.select_cover_letter")}</h6>
                      <span className="apply-doc-optional-badge">
                        {t("header.cover_letter_optional")}
                      </span>
                    </div>
                  </div>
                  {selectedCoverLetterUrl && (
                    <i className="fa-solid fa-circle-check apply-doc-check" />
                  )}
                </div>
                <div className="apply-doc-section-body">
                  <div className="apply-doc-file-list">
                    {Array.isArray(coverLetterList) &&
                      coverLetterList.length > 0 ? (
                      coverLetterList.map((cover, index) => {
                        const fileName = getDisplayFileName(
                          cover,
                          index,
                          "cover",
                        );
                        const rawName = getFileName(cover);
                        return (
                          <div
                            key={cover._id}
                            className={
                              "apply-doc-item" +
                              (selectedCoverLetterUrl === cover.url
                                ? " active"
                                : "")
                            }
                            onClick={() => {
                              onClearCustom?.();
                              onSelect("cover", cover.url);
                            }}
                          >
                            <div className="apply-doc-item-left">
                              <i
                                className={
                                  getFileIconClass(fileName) + " file-icon"
                                }
                              />
                              <span>
                                <span className="apply-doc-item-name">
                                  {fileName}
                                </span>
                                {isGeneratedFileName(rawName) && (
                                  <small className="apply-doc-item-sub">
                                    {rawName}
                                  </small>
                                )}
                              </span>
                            </div>
                            {selectedCoverLetterUrl === cover.url && (
                              <i className="fa-solid fa-circle-check apply-doc-check" />
                            )}
                          </div>
                        );
                      })
                    ) : (
                      <p className="apply-doc-empty">
                        {t("header.no_cover_letter_in_profile")}
                      </p>
                    )}
                  </div>
                  <div className="apply-doc-upload-row">
                    <input
                      ref={coverUploadInputRef}
                      type="file"
                      accept=".pdf,.doc,.docx"
                      onChange={onUploadCover}
                      style={{ display: "none" }}
                    />
                    <button
                      type="button"
                      className="default-btn btn apply-doc-upload-btn"
                      disabled={isUploadingCover}
                      onClick={(e) => {
                        e.preventDefault();
                        onClearCustom?.();
                        coverUploadInputRef?.current?.click();
                      }}
                    >
                      {isUploadingCover ? (
                        <>
                          <span
                            className="spinner-border spinner-border-sm me-2"
                            role="status"
                            aria-hidden="true"
                          />
                          {t("header.uploading")}
                        </>
                      ) : (
                        <>
                          <i className="fa-solid fa-cloud-arrow-up me-2" />
                          {t("header.upload_cover_letter")}
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>

              <div className="apply-doc-or-divider apply-doc-or-optional">
                <span>{t("header.optional_alternative")}</span>
              </div>

              <div
                className={
                  "apply-doc-section apply-doc-custom apply-doc-optional" +
                  (selectedCustomFile ? " is-complete" : "")
                }
              >
                <div className="apply-doc-section-header">
                  <span className="apply-doc-section-icon">
                    <i className="fa-solid fa-file-circle-plus" />
                  </span>
                  <div className="apply-doc-section-title-wrap">
                    <div className="apply-doc-section-title-row">
                      <h6>{t("header.Custom_resume_with_cover_letter")}</h6>
                      <span className="apply-doc-optional-badge">
                        {t("header.optional_field")}
                      </span>
                    </div>
                    <small>{t("header.custom_cv_cover_hint")}</small>
                  </div>
                  {selectedCustomFile && (
                    <i className="fa-solid fa-circle-check apply-doc-check" />
                  )}
                </div>
                <div className="apply-doc-section-body">
                  {selectedCustomFile && (
                    <div className="apply-doc-item active">
                      <div className="apply-doc-item-left">
                        <i
                          className={
                            getFileIconClass(selectedCustomFile.name) +
                            " file-icon"
                          }
                        />
                        <span className="apply-doc-item-name">
                          {selectedCustomFile.name}
                        </span>
                      </div>
                      <i className="fa-solid fa-circle-check apply-doc-check" />
                    </div>
                  )}
                  <div className="apply-doc-upload-row apply-doc-custom-upload">
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept=".pdf,.doc,.docx"
                      onChange={onFileUpload}
                      style={{ display: "none" }}
                    />
                    <button
                      type="button"
                      className="default-btn btn apply-doc-upload-btn apply-doc-upload-btn-primary"
                      onClick={(e) => {
                        e.preventDefault();
                        fileInputRef?.current?.click();
                      }}
                    >
                      <i className="fa-solid fa-cloud-arrow-up me-2" />
                      {selectedCustomFile
                        ? t("header.change_file")
                        : t("header.upload_custom_file")}
                    </button>
                    {selectedCustomFile && (
                      <button
                        type="button"
                        className="btn btn-link apply-doc-switch-separate"
                        onClick={(e) => {
                          e.preventDefault();
                          onClearCustom?.();
                        }}
                      >
                        {t("header.use_separate_documents")}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
            <div className="apply-modal-footer">
              <button
                type="button"
                className="default-btn btn apply-modal-submit-btn"
                onClick={onApply}
                disabled={isApplying || !isSelectionMade}
              >
                {isApplying ? (
                  <>
                    <span
                      className="spinner-border spinner-border-sm me-2"
                      role="status"
                      aria-hidden="true"
                    />
                    {t("header.applying")}
                  </>
                ) : (
                  t("header.apply_now")
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default JobApplyModal;
