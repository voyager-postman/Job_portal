import { useState, useRef, useCallback } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { API_BASE_URL } from "../Url/Url";
import { canApplySelection } from "../utils/jobApplyHelpers";
import { getAuthHeaders, isAuthReady } from "../utils/apiHeaders";
import {
  MAX_APPLY_FILE_SIZE,
  fetchCandidateApplyDocuments,
  uploadCvToProfile,
  uploadCoverLetterToProfile,
  appendApplyDocumentsToFormData,
} from "../utils/jobApplyUpload";

export function useJobApply({ t, onApplySuccess, modalId = "exampleModal" }) {
  const [resumeList, setResumeList] = useState([]);
  const [coverLetterList, setCoverLetterList] = useState([]);
  const [selectedResumeUrl, setSelectedResumeUrl] = useState(null);
  const [selectedCoverLetterUrl, setSelectedCoverLetterUrl] = useState(null);
  const [selectedCustomFile, setSelectedCustomFile] = useState(null);
  const [isApplying, setIsApplying] = useState(false);
  const [jobId, setJobId] = useState(null);
  const [isUploadingCv, setIsUploadingCv] = useState(false);
  const [isUploadingCover, setIsUploadingCover] = useState(false);

  const fileInputRef = useRef(null);
  const cvUploadInputRef = useRef(null);
  const coverUploadInputRef = useRef(null);

  const loadDocuments = useCallback(async () => {
    const role = localStorage.getItem("user_role");
    if (!isAuthReady() || role !== "JobSeeker") {
      setResumeList([]);
      setCoverLetterList([]);
      return;
    }

    const docs = await fetchCandidateApplyDocuments();
    setResumeList(docs.resumeList);
    setCoverLetterList(docs.coverLetterList);
  }, []);

  const setApplyJobId = useCallback(
    async (id) => {
      setJobId(id);
      await loadDocuments();
    },
    [loadDocuments],
  );

  const resetApplyModal = useCallback(() => {
    setSelectedResumeUrl(null);
    setSelectedCoverLetterUrl(null);
    setSelectedCustomFile(null);
    setIsApplying(false);
    if (fileInputRef.current) fileInputRef.current.value = "";
    if (cvUploadInputRef.current) cvUploadInputRef.current.value = "";
    if (coverUploadInputRef.current) coverUploadInputRef.current.value = "";
  }, []);

  const clearCustomFile = useCallback(() => {
    setSelectedCustomFile(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  }, []);

  const handleSelect = useCallback(
    (type, id = null) => {
      if (type === "resume") {
        setSelectedResumeUrl(id);
        clearCustomFile();
      } else if (type === "cover") {
        setSelectedCoverLetterUrl(id);
        clearCustomFile();
      }
    },
    [clearCustomFile],
  );

  const handleFileUpload = useCallback((e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > MAX_APPLY_FILE_SIZE) {
      toast.error(t("header.file_too_large"), { autoClose: 2000, theme: "colored" });
      e.target.value = "";
      return;
    }

    setSelectedCustomFile(file);
    setSelectedResumeUrl(null);
    setSelectedCoverLetterUrl(null);
  }, [t]);

  const handleCvUpload = useCallback(
    async (e) => {
      const file = e.target.files?.[0];
      if (!file) return;
      e.target.value = "";

      if (!isAuthReady()) {
        toast.error(t("header.Please_login_first") || "Please login first.");
        return;
      }

      if (resumeList.length >= 3) {
        toast.error(t("header.max_cv_uploads") || "You can upload up to 3 CVs.");
        return;
      }

      if (file.size > MAX_APPLY_FILE_SIZE) {
        toast.error(t("header.file_too_large"), { autoClose: 2000, theme: "colored" });
        return;
      }

      setIsUploadingCv(true);
      try {
        const entry = await uploadCvToProfile(file, t);
        setResumeList((prev) => [...prev, entry]);
        setSelectedResumeUrl(entry.url);
        clearCustomFile();
        toast.success(t("header.cv_uploaded") || "CV uploaded successfully!", {
          autoClose: 2000,
          theme: "colored",
        });
      } catch (error) {
        console.error("CV upload error:", error);
        if (error?.code === "FILE_TOO_LARGE" || error?.response?.status === 413) {
          toast.error(t("header.file_too_large"), { autoClose: 2000, theme: "colored" });
        } else {
          toast.error(t("header.cv_upload_failed") || "Failed to upload CV.", {
            autoClose: 2000,
            theme: "colored",
          });
        }
      } finally {
        setIsUploadingCv(false);
      }
    },
    [t, resumeList.length, clearCustomFile],
  );

  const handleCoverUpload = useCallback(
    async (e) => {
      const file = e.target.files?.[0];
      if (!file) return;
      e.target.value = "";

      if (!isAuthReady()) {
        toast.error(t("header.Please_login_first") || "Please login first.");
        return;
      }

      if (coverLetterList.length >= 3) {
        toast.error(
          t("header.max_cover_uploads") ||
            "You can upload up to 3 cover letters.",
        );
        return;
      }

      if (file.size > MAX_APPLY_FILE_SIZE) {
        toast.error(t("header.file_too_large"), { autoClose: 2000, theme: "colored" });
        return;
      }

      setIsUploadingCover(true);
      try {
        const entry = await uploadCoverLetterToProfile(file, t);
        setCoverLetterList((prev) => [...prev, entry]);
        setSelectedCoverLetterUrl(entry.url);
        clearCustomFile();
        toast.success(
          t("header.cover_letter_uploaded") || "Cover letter uploaded successfully!",
          { autoClose: 2000, theme: "colored" },
        );
      } catch (error) {
        console.error("Cover letter upload error:", error);
        if (error?.code === "FILE_TOO_LARGE" || error?.response?.status === 413) {
          toast.error(t("header.file_too_large"), { autoClose: 2000, theme: "colored" });
        } else {
          toast.error(
            t("header.cover_upload_failed") || "Failed to upload cover letter.",
            { autoClose: 2000, theme: "colored" },
          );
        }
      } finally {
        setIsUploadingCover(false);
      }
    },
    [t, coverLetterList.length, clearCustomFile],
  );

  const isSelectionMade = useCallback(
    () =>
      canApplySelection({
        selectedCustomFile,
        selectedResumeUrl,
        selectedCoverLetterUrl,
      }),
    [selectedCustomFile, selectedResumeUrl, selectedCoverLetterUrl],
  );

  const hideApplyModal = useCallback(() => {
    const modal = document.getElementById(modalId);
    if (modal) {
      const bootstrapModal = window.bootstrap?.Modal?.getInstance(modal);
      bootstrapModal?.hide();
    }
  }, [modalId]);

  const handleApplyJob = useCallback(async () => {
    if (!jobId) {
      console.error("jobId is missing");
      return;
    }

    if (!isSelectionMade()) {
      toast.error(t("header.Please_select_resume_file"), {
        autoClose: 2000,
        theme: "colored",
      });
      return;
    }

    if (selectedCustomFile && selectedCustomFile.size > MAX_APPLY_FILE_SIZE) {
      toast.error(t("header.file_too_large"), {
        autoClose: 2000,
        theme: "colored",
      });
      return;
    }

    setIsApplying(true);
    const formData = new FormData();
    appendApplyDocumentsToFormData(formData, {
      selectedResumeUrl,
      selectedCoverLetterUrl,
      selectedCustomFile,
    });
    formData.append("jobId", jobId);

    try {
      const res = await axios.post(`${API_BASE_URL}applyJob`, formData, {
        withCredentials: true,
        headers: getAuthHeaders(),
      });
      toast.success(res.data.message || "Applied successfully!");
      resetApplyModal();
      hideApplyModal();
      if (typeof onApplySuccess === "function") {
        await onApplySuccess();
      }
    } catch (error) {
      console.error("Apply job error:", error);
      if (error?.response?.data?.message) {
        toast.error(error.response.data.message, {
          autoClose: 2000,
          theme: "colored",
        });
      } else if (
        error?.response?.status === 413 ||
        error?.message?.includes("413")
      ) {
        toast.error(t("header.file_too_large"), {
          autoClose: 2000,
          theme: "colored",
        });
      } else {
        toast.error(t("header.something_wrong"));
      }
    } finally {
      setIsApplying(false);
    }
  }, [
    jobId,
    isSelectionMade,
    selectedResumeUrl,
    selectedCoverLetterUrl,
    selectedCustomFile,
    t,
    resetApplyModal,
    hideApplyModal,
    onApplySuccess,
  ]);

  return {
    resumeList,
    coverLetterList,
    selectedResumeUrl,
    selectedCoverLetterUrl,
    selectedCustomFile,
    isApplying,
    isUploadingCv,
    isUploadingCover,
    jobId,
    setJobId: setApplyJobId,
    fileInputRef,
    cvUploadInputRef,
    coverUploadInputRef,
    handleSelect,
    handleFileUpload,
    handleCvUpload,
    handleCoverUpload,
    handleApplyJob,
    resetApplyModal,
    clearCustomFile,
    isSelectionMade,
    loadDocuments,
  };
}
