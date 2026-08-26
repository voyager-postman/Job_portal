// src/pages/MassagingSystem.jsx

import axios from "axios";
import { API_BASE_URL, API_IMAGE_URL } from "../Url/Url";
import { useState, useEffect, useRef } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import image1 from "../../src/images/whatImg.png";
import "./ChatMassageSystemModern.css";
import EmojiPicker from "emoji-picker-react";
import { connectSocket } from "../utils/socketAuth";
import { useDebounce } from "../hooks/useDebounce";
import { checkSearchRateLimit } from "../utils/searchRateLimit";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";
import { getRequestConfig } from "../utils/apiHeaders";
import { resolveMediaUrl } from "../utils/companyLogo";
import { validateChatAttachmentFile } from "../utils/fileUploadLimits";

const MESSAGING_SEARCH_DEBOUNCE_MS = 600;

function MassagingSystem() {
  const { t } = useTranslation("global");
  const navigate = useNavigate();
  const location = useLocation();
  const candidateId = location.state?.candidateId;
  const candidateData = location.state?.candidate;
  const candidateName = location.state?.candidateName;
  const candidateImage = location.state?.candidateImage;
  const profileFrom = location.state?.from || "";
  const navJobId = location.state?.jobId?._id || location.state?.jobId || null;
  const navApplicationId = location.state?.applicationId || null;
  console.log(candidateData);
  const resolveJobId = (data) => {
    const job = data?.jobId;
    return job?._id || job || navJobId || null;
  };

  const resolveApplicationId = (data) => {
    return data?._id || navApplicationId || null;
  };

  const getProfileContext = (userId, data = candidateData) => {
    if (!userId || !candidateId || String(userId) !== String(candidateId)) {
      return {};
    }

    const jobId = resolveJobId(data);
    const applicationId = resolveApplicationId(data);

    return {
      jobId,
      applicationId,
      fromPage: profileFrom,
      hasApplication: Boolean(jobId && applicationId),
    };
  };
  const chatContainerRef = useRef(null);
  const [chatSearchTerm, setChatSearchTerm] = useState("");
  const socketRef = useRef(null);
  const bottomRef = useRef(null);
  const fileInputRef = useRef(null);
  const emojiPickerRef = useRef(null);
  const emojiToggleRef = useRef(null);
  const CURRENT_USER_ID = localStorage.getItem("companyId")?.trim();
  const profileImage = localStorage.getItem("profileImage");
  const [users, setUsers] = useState([]);
  const [activeUser, setActiveUser] = useState(null);
  const [chatStore, setChatStore] = useState({});
  const [text, setText] = useState("");
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search, MESSAGING_SEARCH_DEBOUNCE_MS);
  const [showCompanyInfo, setShowCompanyInfo] = useState(true);
  const [showChatSearch, setShowChatSearch] = useState(false);
  const [activeFilter, setActiveFilter] = useState("all");
  const [filter, setFilter] = useState("all");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const typingTimer = useRef(null);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState("");
  const [dateFilter, setDateFilter] = useState("all");
  const [overview, setOverview] = useState({
    total: 0,
    notRead: 0,
    answerRate: 0,
  });
  const [conversationsLoaded, setConversationsLoaded] = useState(false);

  // ================= SOCKET =================
  const calculateAnswerRate = (total, unread) => {
    if (!total || total <= 0) return 0;

    const safeUnread = Math.min(unread, total);

    const rate = ((total - safeUnread) / total) * 100;

    return Math.max(0, Math.min(100, Math.round(rate)));
  };
  useEffect(() => {
    const socket = connectSocket();
    socketRef.current = socket;

    socket.on("connect", () => {
      console.log("Socket Connected:", socket.id);
    });

    socket.on("connect_error", (err) => {
      console.log("Socket Error:", err.message);
    });

    const handleNewMessage = (payload) => {
      console.log("📩 New message:", payload);

      // ================= CHAT STORE =================

      setChatStore((prev) => {
        const oldMessages = prev[payload.groupId] || [];

        const alreadyExists = oldMessages.some(
          (m) =>
            m._id === payload.message._id ||
            m.clientMessageId === payload.message.clientMessageId,
        );

        if (alreadyExists) return prev;

        return {
          ...prev,
          [payload.groupId]: [...oldMessages, payload.message],
        };
      });

      // ================= USERS =================

      setUsers((prevUsers) => {
        let chatFound = false;

        const updatedUsers = prevUsers.map((user) => {
          if (user.groupId === payload.groupId) {
            chatFound = true;

            const isMine =
              String(payload.message.sender) === String(CURRENT_USER_ID);

            return {
              ...user,

              lastMessage: payload.message.message || t("messaging.attachment"),

              lastMessageAt: payload.message.created_at || new Date(),

              unreadCount: isMine
                ? user.unreadCount || 0
                : (user.unreadCount || 0) + 1,
            };
          }

          return user;
        });

        // latest chat top
        updatedUsers.sort(
          (a, b) =>
            new Date(b.lastMessageAt || 0) - new Date(a.lastMessageAt || 0),
        );

        return [...updatedUsers];
      });

      // ================= OVERVIEW REALTIME =================

      setOverview((prev) => {
        const isMine =
          String(payload.message.sender) === String(CURRENT_USER_ID);

        const totalChats = prev.total || 0;

        const unread = isMine ? prev.notRead || 0 : (prev.notRead || 0) + 1;

        return {
          ...prev,

          total: totalChats,

          notRead: unread,

          answerRate: calculateAnswerRate(totalChats, unread),
        };
      });
    };

    socket.on("message:new", handleNewMessage);

    // ================= MESSAGE READ =================

    socket.on("message:read", ({ groupId, readerId }) => {
      console.log("✔ Message Read:", groupId);

      // reset unread for opened chat
      setUsers((prev) =>
        prev.map((u) =>
          u.groupId === groupId
            ? {
                ...u,
                unreadCount: 0,
              }
            : u,
        ),
      );

      // update overview
      setOverview((prev) => {
        const newUnread = Math.max((prev.notRead || 0) - 1, 0);

        return {
          ...prev,
          notRead: newUnread,
          answerRate: calculateAnswerRate(prev.total || 0, newUnread),
        };
      });
    });

    // ================= UNREAD UPDATE =================

    socket.on("unread:update", ({ groupId, unreadCount }) => {
      console.log("Unread Update:", groupId, unreadCount);

      setUsers((prevUsers) => {
        const updatedUsers = prevUsers.map((u) =>
          u.groupId === groupId
            ? {
                ...u,
                unreadCount,
              }
            : u,
        );

        const totalUnread = updatedUsers.reduce(
          (sum, item) => sum + (item.unreadCount || 0),
          0,
        );

        setOverview((prev) => ({
          ...prev,
          notRead: totalUnread,
          answerRate: calculateAnswerRate(prev.total || 0, totalUnread),
        }));

        return updatedUsers;
      });
    });

    return () => {
      socket.off("message:new", handleNewMessage);
      socket.off("message:read");
      socket.off("unread:update");
      socket.disconnect();
      socketRef.current = null;
    };
  }, []);
  // ================= GET IMAGE =================

  const isValidImageUrl = (url) => {
    if (url == null) return false;

    const trimmed = String(url).trim();

    if (!trimmed || trimmed === "null" || trimmed === "undefined") {
      return false;
    }

    return true;
  };

  const getImageUrl = (url) => {
    if (!isValidImageUrl(url)) return image1;
    return resolveMediaUrl(url) || image1;
  };

  const handleImageError = (e) => {
    e.target.onerror = null;
    e.target.src = image1;
  };

  // ================= FETCH CONVERSATIONS =================

  // ================= FETCH CONVERSATIONS =================
  const fetchConversations = async () => {
    const rateCheck = checkSearchRateLimit("messaging-conversations");
    if (!rateCheck.allowed) {
      return;
    }

    try {
      let params = {
        search: debouncedSearch,
      };

      // ================= FILTER =================

      // unread filter
      if (activeFilter === "non-verbal") {
        params.filter = "unread";
      }

      // date filters
      else if (filter === "today") {
        params.filter = "today";
      } else if (filter === "custom" && startDate) {
        params.filter = "custom";
        params.date = startDate;
      }

      // default
      else {
        params.filter = "all";
      }

      console.log("FINAL PARAMS:", params);

      const res = await axios.get(
        `${API_BASE_URL}chat/conversations`,
        getRequestConfig({ params }),
      );

      setUsers(res.data?.chats || []);
      setOverview(res.data?.overview || {});
    } catch (error) {
      console.log("Conversation Fetch Error:", error);
    } finally {
      setConversationsLoaded(true);
    }
  };
  useEffect(() => {
    fetchConversations();
  }, [filter, activeFilter, startDate, debouncedSearch]);
  // ================= AUTO OPEN CHAT =================

  // ================= FETCH CHAT =================

  // ================= AUTO OPEN CHAT =================
  const hasAutoOpened = useRef(false);

  useEffect(() => {
    hasAutoOpened.current = false;
  }, [candidateId]);

  const getNavCandidateProfile = () => {
    const user =
      candidateData?.userId || candidateData?.userInfo || candidateData;

    const fullName =
      `${user?.first_name || ""} ${user?.last_name || ""}`.trim() ||
      candidateData?.name ||
      candidateName ||
      t("messaging.candidate");

    return {
      fullName,
      profileImage:
        user?.profileImage || candidateData?.image || candidateImage,
      email: user?.email || candidateData?.email,
      phone: user?.phone || candidateData?.phone,
      city: user?.city || candidateData?.city,
      nationality: user?.Nationality,
      professionParagraph: candidateData.professionalSummary,
    };
  };

  useEffect(() => {
    if (!candidateId) return;
    if (hasAutoOpened.current) return;
    if (!conversationsLoaded) return;

    const existingChat = users.find(
      (u) =>
        String(u?.otherUser?._id) === String(candidateId) ||
        String(u?.otherUser?.userId) === String(candidateId),
    );

    // ================= EXISTING CHAT =================
    if (existingChat) {
      hasAutoOpened.current = true;

      setUsers((prevUsers) => {
        const updated = [...prevUsers];

        const index = updated.findIndex(
          (u) => u.groupId === existingChat.groupId,
        );

        if (index > -1) {
          const [selectedChat] = updated.splice(index, 1);
          updated.unshift(selectedChat);
        }

        return updated;
      });

      loadChat(existingChat);
      return;
    }

    // ================= NEW TEMP CHAT =================
    hasAutoOpened.current = true;

    const profile = getNavCandidateProfile();

    const tempChat = {
      groupId: `temp-${candidateId}`,
      otherUser: {
        _id: candidateId,
        fullName: profile.fullName,
        profileImage: profile.profileImage,
        email: profile.email,
        phone: profile.phone,
        city: profile.city,
        nationality: profile.nationality,
        professionParagraph: profile.professionParagraph,
        isOnline: false,
      },
      lastMessage: "",
      unreadCount: 0,
    };

    setUsers((prev) => {
      const alreadyAdded = prev.some(
        (u) => String(u?.otherUser?._id) === String(candidateId),
      );

      if (alreadyAdded) return prev;

      return [tempChat, ...prev];
    });

    setActiveUser({
      ...tempChat,
      id: candidateId,
      groupId: tempChat.groupId,
      name: profile.fullName,
      image: profile.profileImage,
      online: t("messaging.offline"),
      isOnline: false,
      email: profile.email,
      phone: profile.phone,
      city: profile.city,
      nationality: profile.nationality,
      professionParagraph: profile.professionParagraph,
      ...getProfileContext(candidateId),
    });

    setChatStore((prev) => ({
      ...prev,
      [tempChat.groupId]: [],
    }));
  }, [candidateId, users, conversationsLoaded]);
  const fetchHistory = async (groupId) => {
    try {
      const res = await axios.get(
        `${API_BASE_URL}chat/history/group/${groupId}`,
        getRequestConfig(),
      );

      const history = res.data?.data || [];

      setChatStore((prev) => ({
        ...prev,
        [groupId]: history,
      }));
    } catch (error) {
      console.log(error);
    }
  };

  // ================= LOAD CHAT =================

  const findApplicantByUserId = async (userId) => {
    try {
      const res = await axios.get(
        `${API_BASE_URL}getAllApplicantsPerCompany`,
        getRequestConfig({ params: { page: 1, limit: 200 } }),
      );

      const applicants = res.data?.applicants || [];
      return applicants.find(
        (item) => String(item?.userId?._id) === String(userId),
      );
    } catch (error) {
      console.log("Applicant lookup error:", error);
      return null;
    }
  };

  const resolveApplicationContext = async (userId, existing = {}) => {
    let jobId = existing?.jobId;
    let applicationId = existing?.applicationId;

    if (!jobId || !applicationId) {
      const fromNav = getProfileContext(userId);
      jobId = jobId || fromNav.jobId || resolveJobId(candidateData);
      applicationId =
        applicationId || fromNav.applicationId || resolveApplicationId(candidateData);
    }

    if (jobId && applicationId) {
      return { jobId, applicationId, hasApplication: true };
    }

    const match = await findApplicantByUserId(userId);
    if (match) {
      return {
        jobId: match?.jobId?._id || match?.jobId,
        applicationId: match._id,
        hasApplication: true,
      };
    }

    return { jobId: null, applicationId: null, hasApplication: false };
  };

  const handleViewFullProfile = async () => {
    const candidateUserId = activeUser?.id;
    if (!candidateUserId) return;

    const fromPage = activeUser?.fromPage || profileFrom;
    const { jobId, applicationId, hasApplication } =
      await resolveApplicationContext(candidateUserId, {
        jobId: activeUser?.jobId,
        applicationId: activeUser?.applicationId,
      });

    const goToApplicants = (resolvedApplicationId, resolvedJobId) => {
      const state = {
        applicationId: resolvedApplicationId,
        candidateId: candidateUserId,
        from: "/messaging-system",
      };

      if (resolvedJobId) {
        state.jobId = resolvedJobId;
        state.filterByJob = true;
      }

      navigate("/all-applicants-list", { state });
    };

    if (hasApplication) {
      goToApplicants(applicationId, jobId);
      return;
    }

    if (fromPage === "/candidates-search") {
      navigate("/candidates-search", {
        state: { userId: candidateUserId },
      });
      return;
    }

    if (fromPage === "/all-applicants-list") {
      navigate("/all-applicants-list", {
        state: { candidateId: candidateUserId, from: "/messaging-system" },
      });
      return;
    }

    navigate("/candidates-search", {
      state: { userId: candidateUserId },
    });
  };

  const loadChat = async (user) => {
    const groupId = user.groupId;
    const otherUserId =
      user?.otherUser?._id ||
      user?.otherUser?.userId ||
      user?.otherUser?.companyId;

    setActiveUser({
      ...user,

      id: otherUserId,

      name: user?.otherUser?.fullName || user?.otherUser?.name,

      image: user?.otherUser?.profileImage || user?.otherUser?.image,

      online: user?.otherUser?.isOnline ? t("messaging.online") : t("messaging.offline"),

      isOnline: user?.otherUser?.isOnline,

      email: user?.otherUser?.email,

      phone: user?.otherUser?.phone,

      city: user?.otherUser?.city,

      nationality: user?.otherUser?.Nationality,

      professionParagraph: user?.otherUser?.professionParagraph,

      gender: user?.otherUser?.gender,

      location: user?.otherUser?.location || user?.otherUser?.city,

      about:
        user?.otherUser?.professionParagraph ||
        user?.otherUser?.about ||
        user?.otherUser?.bio,

      slug: user?.otherUser?.slug,

      fromPage: profileFrom,
      ...getProfileContext(otherUserId),
    });

    socketRef.current?.emit("join_group", { groupId });

    socketRef.current?.emit("mark_read", { groupId });

    // only fetch real chat history
    if (!groupId?.startsWith("temp-") && !chatStore[groupId]) {
      fetchHistory(groupId);
    }
    try {
      if (!groupId?.startsWith("temp-")) {
        await axios.post(
          `${API_BASE_URL}chat/mark-read/${groupId}`,
          {},
          getRequestConfig(),
        );
      }
    } catch (error) {
      console.log(error);
    }
  };

  // ================= FILE CHANGE =================

  const handleFileChange = (e) => {
    const file = e.target.files[0];

    if (!file) return;

    const validation = validateChatAttachmentFile(file, t);
    if (!validation.ok) {
      toast.error(validation.message);
      e.target.value = "";
      return;
    }

    setSelectedFile(file);

    if (file.type.startsWith("image")) {
      setPreviewUrl(URL.createObjectURL(file));
    } else {
      setPreviewUrl("");
    }
  };

  // ================= UPLOAD FILE =================

  const uploadFile = async () => {
    if (!selectedFile) return null;

    const formData = new FormData();
    formData.append("file", selectedFile);

    try {
      const res = await axios.post(
        `${API_BASE_URL}chat/upload`,
        formData,
        getRequestConfig({
          headers: { "Content-Type": "multipart/form-data" },
        }),
      );

      console.log("UPLOAD RESPONSE:", res.data);

      return res.data?.data;
    } catch (error) {
      console.log("UPLOAD ERROR:", error);
      return null;
    }
  };
  // ================= SEND MESSAGE =================

  const sendMessage = async () => {
    if (!activeUser) return;

    if (!text.trim() && !selectedFile) return;

    let uploadedFile = null;

    // ================= FILE UPLOAD =================

    if (selectedFile) {
      uploadedFile = await uploadFile();
    }

    // ================= MESSAGE TYPE =================

    let messageType = "text";

    if (selectedFile) {
      if (selectedFile.type.startsWith("image/")) {
        messageType = "image";
      } else if (selectedFile.type.startsWith("video/")) {
        messageType = "video";
      } else {
        messageType = "file";
      }
    }

    // ================= PAYLOAD =================

    const payload = {
      receiverId: activeUser.id,
      groupId: activeUser.groupId?.startsWith("temp-")
        ? null
        : activeUser.groupId,

      message: text.trim(),

      messageType,

      fileUrl: uploadedFile?.fileUrl || "",
      fileName: selectedFile?.name || "",
      fileMimeType: selectedFile?.type || "",
      fileSize: selectedFile?.size || "",

      clientMessageId: crypto.randomUUID(),
    };

    // ================= SOCKET SEND =================

    socketRef.current.emit("send_message", payload, async (ack) => {
      console.log("SEND ACK:", ack);

      if (!ack?.success) {
        console.log("Message send failed");
        return;
      }

      // ================= NEW GROUP CREATED =================
      if (activeUser.groupId?.startsWith("temp-") && ack?.groupId) {
        const realGroupId = ack.groupId;

        // update active user
        setActiveUser((prev) => ({
          ...prev,
          groupId: realGroupId,
        }));

        // fetch latest conversations
        await fetchConversations();

        // fetch real history immediately
        fetchHistory(realGroupId);
      }
    });

    // ================= CLEAR =================

    setText("");
    setSelectedFile(null);
    setPreviewUrl("");
    setShowEmojiPicker(false);

    fetchConversations();
  };

  // ================= EMOJI =================

  const handleEmojiClick = (emojiData) => {
    setText((prev) => prev + emojiData.emoji);
  };

  useEffect(() => {
    if (!showEmojiPicker) return;

    const handleClickOutside = (e) => {
      if (
        emojiPickerRef.current?.contains(e.target) ||
        emojiToggleRef.current?.contains(e.target)
      ) {
        return;
      }
      setShowEmojiPicker(false);
    };

    const handleEscape = (e) => {
      if (e.key === "Escape") setShowEmojiPicker(false);
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [showEmojiPicker]);

  const handleTyping = () => {
    if (!activeUser) return;

    socketRef.current?.emit("typing:start", {
      groupId: activeUser.groupId,
    });

    clearTimeout(typingTimer.current);

    typingTimer.current = setTimeout(() => {
      socketRef.current?.emit("typing:stop", {
        groupId: activeUser.groupId,
      });
    }, 1500);
  };
  // ================= AUTO SCROLL =================

  useEffect(() => {
    bottomRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [chatStore, activeUser]);

  // ================= FILTER =================

  const filteredUsers = users.filter((u) =>
    (u?.otherUser?.fullName || u?.otherUser?.name || "")
      .toLowerCase()
      .includes(search.toLowerCase()),
  );

  return (
    <>
      <div className="main-dashboard-content d-flex flex-column">
        <div className="responsive-content">
          {/* ================= BREADCRUMB ================= */}

          <div className="breadcrumb-area">
            <h1>{t("messaging.title")}</h1>

            <ol className="breadcrumb">
              <li className="item">
                <Link to="/">{t("header.home")}</Link>
              </li>

              <li className="item">
                <i className="fa-solid fa-angle-right" />
                {t("messaging.title")}
              </li>
            </ol>
          </div>

          {/* ================= CHAT WRAPPER ================= */}

          <div className="chat-modern-wrapper">
            {/* ================= LEFT SIDEBAR ================= */}

            <div className="chat-sidebar-left">
              <div className="chat-sidebar-overview">
                <div className="overview-header-minimal">
                  <i className="fa-solid fa-chart-simple" />
                  <span>{t("messaging.overview")}</span>
                </div>

                <div className="modern-msg-stats-integrated">
                  <div className="msg-stat-item-premium">
                    <span className="msg-stat-value-premium">
                      {overview?.total || 0}
                    </span>
                    <span className="msg-stat-label-premium">{t("messaging.total")}</span>
                  </div>

                  <div className="msg-stat-item-premium unread">
                    <span className="msg-stat-value-premium">
                      {overview?.notRead || 0}
                    </span>

                    <span className="msg-stat-label-premium">{t("messaging.unread")}</span>
                  </div>

                  <div className="msg-stat-item-premium rate">
                    <span className="msg-stat-value-premium">
                      {overview?.answerRate || 0}%
                    </span>

                    <span className="msg-stat-label-premium">{t("messaging.answer")}</span>
                  </div>
                </div>
              </div>

              <div className="sidebar-divider-modern" />

              <div className="chat-sidebar-header-modern">
                <h2>{t("messaging.conversations")}</h2>
              </div>

              {/* ================= SEARCH ================= */}

              {/* ================= USER LIST ================= */}

              <div className="chat-contact-list">
                {filteredUsers.length === 0 ? (
                  <div className="no-messages-found">
                    <i className="fa-solid fa-comment-slash" />
                    <p>{t("messaging.no_messages_found")}</p>
                  </div>
                ) : (
                  filteredUsers.map((u) => {
                    const isOnline = u?.otherUser?.isOnline;

                    return (
                      <div
                        key={u.groupId}
                        className={`contact-card ${
                          activeUser?.groupId === u.groupId ? "active" : ""
                        }`}
                        onClick={() => loadChat(u)}
                      >
                        <div className="contact-avatar-container">
                          <img
                            alt=""
                            className="contact-avatar"
                            crossOrigin="anonymous"
                            src={getImageUrl(u?.otherUser?.profileImage)}
                            onError={handleImageError}
                            loading="lazy"
                            decoding="async"
                          />

                          <span
                            className={`online-dot ${isOnline ? "" : "offline"}`}
                          />
                        </div>

                        <div className="contact-info">
                          <div className="contact-name-row">
                            <span className="contact-name">
                              {u?.otherUser?.fullName || u?.otherUser?.name}
                            </span>

                            <span className="contact-time">
                              {u?.lastMessageAt
                                ? new Date(u.lastMessageAt).toLocaleTimeString(
                                    [],
                                    {
                                      hour: "2-digit",
                                      minute: "2-digit",
                                    },
                                  )
                                : ""}
                            </span>
                          </div>

                          <div className="contact-last-msg">
                            <span className="msg-text">
                              {u?.lastMessage || t("messaging.no_messages")}
                            </span>

                            {u?.unreadCount > 0 && (
                              <span className="unread-count-badge">
                                {u.unreadCount}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>

            {/* ================= CHAT AREA ================= */}

            <div className="chat-main-section">
              <div className="chat-global-filter-bar">
                <div className="empty-filters-group">
                  <div className="chat-filters">
                    <div
                      className={`filter-tab ${activeFilter === "all" ? "active" : ""}`}
                      onClick={() => {
                        setActiveFilter("all");
                      }}
                    >
                      {t("messaging.all")}
                    </div>

                    <div
                      className={`filter-tab ${
                        activeFilter === "non-verbal" ? "active" : ""
                      }`}
                      onClick={() => {
                        setActiveFilter("non-verbal");
                      }}
                    >
                      {t("messaging.unread")}
                    </div>
                  </div>

                  <div className="chat-date-filters">
                    {/* ALL */}
                    <span
                      className={`date-chip ${filter === "all" ? "active" : ""}`}
                      onClick={() => {
                        setFilter("all");
                        setStartDate("");
                        setEndDate("");
                      }}
                    >
                      {t("messaging.all")}
                    </span>

                    {/* TODAY */}
                    <span
                      className={`date-chip ${filter === "today" ? "active" : ""}`}
                      onClick={() => {
                        setFilter("today");
                        setStartDate("");
                        setEndDate("");
                      }}
                    >
                      {t("messaging.today")}
                    </span>

                    {/* CUSTOM DATE */}
                    <div
                      className={`date-picker-wrapper ${
                        filter === "custom" ? "active" : ""
                      }`}
                    >
                      <i className="fa-regular fa-calendar-days" />

                      <input
                        className="date-picker-input"
                        type="date"
                        value={startDate}
                        onChange={(e) => {
                          setFilter("custom");
                          setStartDate(e.target.value);
                        }}
                      />
                    </div>
                  </div>
                </div>

                <div className="chat-search-container">
                  <div className="chat-search-box">
                    <i className="fa-solid fa-magnifying-glass" />

                    <input
                      placeholder={t("messaging.search_user")}
                      type="text"
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                    />
                  </div>
                </div>
              </div>
              {/* ================= HEADER ================= */}

              <div className="chat-header-modern">
                {activeUser && (
                  <>
                    <div className="chat-header-user-info">
                      <img
                        crossOrigin="anonymous"
                        alt=""
                        className="header-avatar"
                        src={getImageUrl(activeUser?.image)}
                        onError={handleImageError}
                        loading="lazy"
                        decoding="async"
                      />

                      <div className="header-user-details">
                        <h3>{activeUser?.name}</h3>

                        <span
                          className="header-user-status"
                          style={{
                            color: activeUser?.isOnline ? "#16a34a" : "#8b8b8b",
                          }}
                        >
                          {activeUser?.online}
                        </span>
                      </div>
                    </div>

                    <div className="chat-header-tools">
                      <button
                        className={`tool-btn ${showChatSearch ? "active" : ""}`}
                        onClick={() => setShowChatSearch((prev) => !prev)}
                      >
                        <i className="fa-solid fa-magnifying-glass" />
                      </button>

                      <button
                        className={`tool-btn ${showCompanyInfo ? "active" : ""}`}
                        onClick={() => setShowCompanyInfo((prev) => !prev)}
                      >
                        <i className="fa-solid fa-circle-info" />
                      </button>
                    </div>
                  </>
                )}
              </div>
              {showChatSearch && (
                <div
                  className="chat-search-container"
                  style={{
                    padding: "10px 30px",
                    background: "var(--chat-bg-main)",
                  }}
                >
                  <div className="chat-search-box">
                    <i className="fa-solid fa-magnifying-glass" />
                    <input
                      placeholder={t("messaging.search_chat_keyword")}
                      type="text"
                      value={chatSearchTerm}
                      onChange={(e) => setChatSearchTerm(e.target.value)}
                    />
                  </div>
                </div>
              )}
              {/* ================= MESSAGES ================= */}

              <div className="messages-scroller" ref={chatContainerRef}>
                {!activeUser ? (
                  <div
                    className="no-chat-selected"
                    style={{
                      height: "100%",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flexDirection: "column",
                    }}
                  >
                    <img
                      crossOrigin="anonymous"
                      src={image1}
                      alt="No chat"
                      style={{
                        width: "40%",
                        opacity: 0.7,
                      }}
                      loading="lazy"
                      decoding="async"
                    />

                    <h2>{t("messaging.ready_to_trade")}</h2>
                  </div>
                ) : (
                  <>
                    <>
                      {(chatStore[activeUser?.groupId] || []).filter((msg) =>
                        (
                          (msg.message || "") +
                          (msg.fileName || "") +
                          (msg.messageType || "")
                        )
                          .toLowerCase()
                          .includes(chatSearchTerm.toLowerCase()),
                      ).length === 0 ? (
                        <div className="no-messages-found">
                          <i className="fa-solid fa-comment-slash"></i>
                          <p>{t("messaging.no_messages_found")}</p>
                        </div>
                      ) : (
                        (chatStore[activeUser?.groupId] || [])
                          .filter((msg) => {
                            const searchableText = (
                              (msg.message || "") +
                              (msg.fileName || "") +
                              (msg.messageType || "")
                            ).toLowerCase();

                            return searchableText.includes(
                              chatSearchTerm.toLowerCase(),
                            );
                          })
                          .map((msg, index) => {
                            const isMine =
                              String(msg.sender) === String(CURRENT_USER_ID);
                            console.log({
                              CURRENT_USER_ID,
                              isMine,
                            });

                            return (
                              <div
                                key={msg._id}
                                className={`message-group ${
                                  isMine ? "self" : "other"
                                }`}
                              >
                                <img
                                  crossOrigin="anonymous"
                                  className="msg-avatar"
                                  alt="avatar"
                                  src={
                                    isMine
                                      ? getImageUrl(profileImage)
                                      : getImageUrl(activeUser?.image)
                                  }
                                  onError={handleImageError}
                                  loading="lazy"
                                  decoding="async"
                                />

                                <div className="msg-content-wrapper">
                                  <div className="msg-bubble-modern">
                                    {(msg.messageType === "text" ||
                                      msg.messageType === "emoji") &&
                                      msg.message && (
                                        <p
                                          style={{
                                            color: isMine ? "#fff" : "",
                                          }}
                                        >
                                          {msg.message}
                                        </p>
                                      )}

                                    {msg.fileUrl &&
                                      msg.messageType === "image" && (
                                        <a
                                          href={getImageUrl(msg.fileUrl)}
                                          target="_blank"
                                          rel="noreferrer"
                                        >
                                          <img
                                            crossOrigin="anonymous"
                                            src={getImageUrl(msg.fileUrl)}
                                            style={{
                                              height: "200px",
                                              width: "200px",
                                              objectFit: "cover",
                                              cursor: "pointer",
                                              borderRadius: "10px",
                                            }}
                                            alt="chat-img"
                                            className="chat-image"
                                            onError={(e) => {
                                              console.log(
                                                "IMAGE LOAD ERROR:",
                                                e.target.src,
                                              );
                                            }}
                                            loading="lazy"
                                            decoding="async"
                                          />
                                        </a>
                                      )}
                                    {msg.fileUrl &&
                                      msg.messageType === "video" && (
                                        <video
                                          controls
                                          style={{
                                            width: "250px",
                                            borderRadius: "10px",
                                          }}
                                        >
                                          <source
                                            src={getImageUrl(msg.fileUrl)}
                                            type={
                                              msg.fileMimeType || "video/mp4"
                                            }
                                          />
                                        </video>
                                      )}

                                    {msg.fileUrl &&
                                      msg.messageType === "file" && (
                                        <a
                                          href={getImageUrl(msg.fileUrl)}
                                          target="_blank"
                                        >
                                          📄 {t("messaging.download_file")}
                                        </a>
                                      )}
                                  </div>

                                  <span className="msg-timestamp">
                                    {new Date(
                                      msg.created_at,
                                    ).toLocaleTimeString([], {
                                      hour: "2-digit",
                                      minute: "2-digit",
                                    })}
                                  </span>
                                </div>
                              </div>
                            );
                          })
                      )}

                      <div ref={bottomRef}></div>
                    </>
                  </>
                )}
              </div>
              {/* ================= FOOTER ================= */}

              {activeUser && (
                <div className="chat-footer-modern">
                  <div className="chat-input-container-modern">
                    <button
                      className="input-tool-btn"
                      onClick={() => fileInputRef.current.click()}
                    >
                      <i className="fa-solid fa-paperclip" />
                    </button>

                    <input
                      type="file"
                      ref={fileInputRef}
                      style={{ display: "none" }}
                      accept="image/*,video/mp4,video/webm,video/ogg,.pdf,.doc,.docx"
                      onChange={handleFileChange}
                    />

                    {selectedFile && (
                      <div className="chat-file-preview">
                        <img
                          src={
                            previewUrl ||
                            "https://cdn-icons-png.flaticon.com/512/337/337946.png"
                          }
                          alt=""
                          loading="lazy"
                          decoding="async"
                        />

                        <div className="file-preview-info">
                          <div className="file-preview-name">
                            {selectedFile.name}
                          </div>

                          <div className="file-preview-size">
                            {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                          </div>
                        </div>

                        <button
                          className="remove-file-btn"
                          onClick={() => {
                            setSelectedFile(null);
                            setPreviewUrl("");
                          }}
                        >
                          <i className="fa-solid fa-xmark"></i>
                        </button>
                      </div>
                    )}

                    <textarea
                      className="chat-input-textarea"
                      placeholder={t("messaging.write_message")}
                      rows={1}
                      value={text}
                      onChange={(e) => setText(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" && !e.shiftKey) {
                          e.preventDefault();
                          sendMessage();
                        }
                      }}
                    />

                    <div className="chat-input-tools">
                      <div style={{ position: "relative" }}>
                        <button
                          ref={emojiToggleRef}
                          type="button"
                          className={`input-tool-btn ${showEmojiPicker ? "active" : ""}`}
                          aria-expanded={showEmojiPicker}
                          aria-label={t("messaging.toggle_emoji_picker")}
                          onClick={(e) => {
                            e.stopPropagation();
                            setShowEmojiPicker((prev) => !prev);
                          }}
                        >
                          <i className="fa-regular fa-face-smile" />
                        </button>

                        {showEmojiPicker && (
                          <div
                            ref={emojiPickerRef}
                            className="emoji-picker-wrapper emoji-pop-box"
                          >
                            <button
                              type="button"
                              className="emoji-picker-close"
                              aria-label={t("messaging.close_emoji_picker")}
                              onClick={() => setShowEmojiPicker(false)}
                            >
                              <i className="fa-solid fa-xmark" />
                            </button>
                            <EmojiPicker onEmojiClick={handleEmojiClick} />
                          </div>
                        )}
                      </div>

                      <button className="send-btn-modern" onClick={sendMessage}>
                        <i className="fa-solid fa-paper-plane" />
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* ================= RIGHT SIDEBAR ================= */}

            <div
              className={`chat-sidebar-right ${
                showCompanyInfo && activeUser ? "show-sidebar" : "hide-sidebar"
              }`}
            >
              {activeUser && (
                <>
                  <div className="info-panel-header">
                    <img
                      crossOrigin="anonymous"
                      alt=""
                      className="info-panel-logo"
                      src={getImageUrl(activeUser?.image)}
                      onError={handleImageError}
                      loading="lazy"
                      decoding="async"
                    />

                    <h4>{activeUser?.name}</h4>

                    <span className="industry-tag">{t("messaging.candidate")}</span>
                  </div>

                  <div className="info-section">
                    <h5>{t("header.Professional_Summary")}</h5>

                    <p
                      className="info-description"
                      style={{
                        whiteSpace: "pre-line",
                      }}
                    >
                      {activeUser?.professionParagraph ||
                        t("messaging.no_professional_summary")}
                    </p>

                    <h5 style={{ marginTop: "20px" }}>{t("messaging.contact_details")}</h5>

                    <div className="info-item">
                      <i className="fa-solid fa-envelope" />
                      {activeUser?.email || t("messaging.na")}
                    </div>

                    <div className="info-item">
                      <i className="fa-solid fa-phone" />
                      {activeUser?.phone || t("messaging.na")}
                    </div>

                    <div className="info-item">
                      <i className="fa-solid fa-location-dot" />
                      {activeUser?.city || t("messaging.na")}
                    </div>

                    <div className="info-item">
                      <i className="fa-solid fa-flag" />
                      {activeUser?.nationality || t("messaging.na")}
                    </div>

                    <button
                      className="view-profile-btn"
                      onClick={handleViewFullProfile}
                    >
                      {t("messaging.view_full_profile")}
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default MassagingSystem;
