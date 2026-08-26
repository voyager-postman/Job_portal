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
import SafeHtml from "../components/SafeHtml";

const CHAT_SEARCH_DEBOUNCE_MS = 600;

function ChatMassageSystem() {
  const { t } = useTranslation("global");
  const navigate = useNavigate();
  const location = useLocation();
  console.log(location);
  const socketRef = useRef(null);
  const [date, setDate] = useState("");
  const bottomRef = useRef(null);
  const [showCompanyInfo, setShowCompanyInfo] = useState(true);
  const [showChatSearch, setShowChatSearch] = useState(false);
  const chatContainerRef = useRef(null);
  const [users, setUsers] = useState([]);
  const CURRENT_USER_ID = localStorage.getItem("user_id");
  console.log("Current Employer ID:-", CURRENT_USER_ID);
  const profileImage = localStorage.getItem("profileImage");
  const [activeUser, setActiveUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const [chatStore, setChatStore] = useState({});
  const [searchTerm, setSearchTerm] = useState("");
  const [activeFilter, setActiveFilter] = useState("all");
  const [chatSearchTerm, setChatSearchTerm] = useState("");
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState("");
  const fileInputRef = useRef(null);
  const emojiPickerRef = useRef(null);
  const emojiToggleRef = useRef(null);
  // ---------------- CONNECT SOCKET ----------------
  const [overview, setOverview] = useState({
    total: 0,
    notRead: 0,
    answerRate: 0,
  });
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
      console.log("Socket connected:", socket.id);
    });

    socket.on("connect_error", (err) => {
      console.log("Socket error:", err.message);
    });

    const handleNewMessage = (payload) => {
          console.log("📩 New message:", payload);

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

          setUsers((prevUsers) => {
            const updatedUsers = prevUsers.map((user) => {
              if (user.groupId === payload.groupId) {
                const isMine =
                  String(payload.message.sender) === String(CURRENT_USER_ID);

                return {
                  ...user,

                  lastMessage:
                    payload.message.message || t("messaging.attachment"),

                  lastMessageAt: payload.message.created_at || new Date(),

                  unreadCount: isMine
                    ? user.unreadCount || 0
                    : (user.unreadCount || 0) + 1,
                };
              }

              return user;
            });

            updatedUsers.sort(
              (a, b) =>
                new Date(b.lastMessageAt || 0) - new Date(a.lastMessageAt || 0),
            );

            const totalUnread = updatedUsers.reduce(
              (sum, u) => sum + (u.unreadCount || 0),
              0,
            );

            setOverview((prev) => ({
              ...prev,

              notRead: totalUnread,

              answerRate: calculateAnswerRate(prev.total, totalUnread),
            }));

            return [...updatedUsers];
          });
        };

    socket.on("message:new", handleNewMessage);

    socket.on("message:read", ({ groupId }) => {
          console.log("✔ Read:", groupId);

          setUsers((prevUsers) => {
            const updatedUsers = prevUsers.map((u) =>
              u.groupId === groupId
                ? {
                    ...u,
                    unreadCount: 0,
                  }
                : u,
            );

            const totalUnread = updatedUsers.reduce(
              (sum, u) => sum + (u.unreadCount || 0),
              0,
            );

            setOverview((prev) => ({
              ...prev,

              notRead: totalUnread,

              answerRate: calculateAnswerRate(prev.total, totalUnread),
            }));

            return updatedUsers;
          });
        });

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

          answerRate: calculateAnswerRate(prev.total, totalUnread),
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

    // Preview only
    if (file.type.startsWith("image/")) {
      setPreviewUrl(URL.createObjectURL(file));
    } else {
      setPreviewUrl("");
    }
  };
  const sendMessage = async () => {
    if (!activeUser) return;

    // prevent empty send
    if (!text.trim() && !selectedFile) return;

    let uploadedFile = null;

    // ================= UPLOAD FILE =================

    if (selectedFile) {
      uploadedFile = await uploadFile();
    }

    // ================= MESSAGE TYPE =================

    let messageType = "text";

    if (selectedFile) {
      if (selectedFile.type.startsWith("image")) {
        messageType = "image";
      } else if (selectedFile.type.startsWith("video")) {
        messageType = "video";
      } else {
        messageType = "file";
      }
    }

    // ================= PAYLOAD =================

    const payload = {
      receiverId: activeUser.id,
      groupId: activeUser.groupId,

      message: text.trim(),

      messageType,

      fileUrl: uploadedFile?.fileUrl || "",
      fileName: selectedFile?.name || "",
      fileMimeType: selectedFile?.type || "",
      fileSize: selectedFile?.size || "",

      clientMessageId: crypto.randomUUID(),
    };

    console.log("FINAL PAYLOAD:", payload);

    // ================= SOCKET SEND =================

    socketRef.current.emit("send_message", payload, (ack) => {
      console.log("SEND ACK:", ack);

      if (!ack?.success) {
        console.log("Message send failed");
      }
    });

    // ================= CLEAR =================

    setText("");
    setSelectedFile(null);
    setPreviewUrl("");
    setShowEmojiPicker(false);
  };

  const typingTimer = useRef(null);

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

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatStore, activeUser]);
  const fetchCandidates = async () => {
    const rateCheck = checkSearchRateLimit("chat-conversations");
    if (!rateCheck.allowed) {
      return;
    }

    try {
      let params = {
        search: debouncedSearch,
      };

      // ================= MAIN FILTER =================

      if (dateFilter === "all") {
        params.filter = "all";
      }

      if (dateFilter === "today") {
        params.filter = "today";
      }

      if (dateFilter === "custom" && startDate) {
        params.filter = "custom";
        params.date = startDate;
      }

      // ================= UNREAD FILTER =================

      if (filter === "unread") {
        params.filter = "unread";

        // custom + unread
        if (dateFilter === "custom" && startDate) {
          params.filter = "custom";
          params.date = startDate;
          params.unread = true;
        }
      }

      console.log("FINAL PARAMS:", params);

      const res = await axios.get(
        `${API_BASE_URL}chat/conversations`,
        getRequestConfig({ params }),
      );

      console.log("Conversation API:", res.data);

      setUsers(res.data?.chats || []);
      setOverview(res.data?.overview || {});
    } catch (error) {
      console.log("Conversation API Error", error);
    }
  };
  const [filter, setFilter] = useState(""); // unread filter only

  const [dateFilter, setDateFilter] = useState("all"); // date filter
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search, CHAT_SEARCH_DEBOUNCE_MS);

  useEffect(() => {
    fetchCandidates();
  }, [filter, dateFilter, debouncedSearch, startDate]);
  const filteredUsers = users.filter((u) =>
    (u?.otherUser?.brandName || "")
      .toLowerCase()
      .includes(search.toLowerCase()),
  );
  // useEffect(() => {
  //   if (!location.state?.groupId || users.length === 0) return;

  //   const selectedChat = users.find(
  //     (u) => u.groupId === location.state.groupId,
  //   );

  //   if (selectedChat) {
  //     loadChat(selectedChat);
  //   }
  // }, [location.state, users]);
  useEffect(() => {
    if (!location.state?.groupId || users.length === 0) return;

    const selectedChat = users.find(
      (u) => u.groupId === location.state.groupId,
    );

    if (selectedChat) {
      // ================= MOVE CHAT TO TOP =================
      setUsers((prevUsers) => {
        const filtered = prevUsers.filter(
          (u) => u.groupId !== selectedChat.groupId,
        );

        return [selectedChat, ...filtered];
      });

      // ================= LOAD ACTIVE CHAT =================
      loadChat(selectedChat);
    }
  }, [location.state, users]);
  const checkUnreadCount = async (groupId) => {
    try {
      const res = await axios.post(
        `${API_BASE_URL}chat/mark-read/${groupId}`,
        {},
        getRequestConfig(),
      );
      console.log(res.data);
      fetchCandidates();
    } catch (error) {
      console.error(error);
    }
  };

  const fetchHistory = async (groupId) => {
    try {
      const res = await axios.get(
        `${API_BASE_URL}chat/history/group/${groupId}`,
        getRequestConfig(),
      );

      console.log("CHAT HISTORY:", res.data);

      const history = res.data?.data || [];

      // store messages
      setChatStore((prev) => ({
        ...prev,
        [groupId]: history,
      }));

      setMessages(history);
    } catch (error) {
      console.log("Fetch History Error:", error);
    }
  };
  // ---------------- LOAD CHAT HISTORY ----------------
  const loadChat = (user) => {
    const groupId = user.groupId;

    setActiveUser({
      ...user,

      id:
        user?.otherUser?.companyId ||
        user?.otherUser?._id ||
        user?.otherUser?.userId,

      // COMMON
      type: user?.otherUser?.role,

      // NAME
      name:
        user?.otherUser?.brandName || user?.otherUser?.name || t("messaging.unknown_user"),

      // IMAGE
      image: user?.otherUser?.logo || user?.otherUser?.profileImage || "",

      // STATUS
      online: user?.otherUser?.isOnline ? t("messaging.online") : t("messaging.offline"),
      isOnline: user?.otherUser?.isOnline,

      // COMPANY ONLY
      industry: user?.otherUser?.industry?.name || "",
      aboutCompany: user?.otherUser?.aboutCompany || "",
      website: user?.otherUser?.links?.officialWebsite || "",

      // CANDIDATE ONLY
      professionParagraph: user?.otherUser?.professionParagraph || "",
      email: user?.otherUser?.email || "",
      phone:
        typeof user?.otherUser?.phone === "object"
          ? `+${user.otherUser.phone.countryCode} ${user.otherUser.phone.number}`
          : user?.otherUser?.phone || "",
      nationality: user?.otherUser?.country || "",
      gender: user?.otherUser?.gender || "",

      // COMMON LOCATION
      location: user?.otherUser?.location || user?.otherUser?.city || "N/A",

      slug: user?.otherUser?.slug || "",
    });

    // 🔥 join socket room
    socketRef.current?.emit("join_group", { groupId }, (res) => {
      console.log("Joined group:", res);
    });

    // mark read
    socketRef.current?.emit("mark_read", { groupId });

    // load history
    fetchHistory(groupId);
  };

  // ---------------- SEND MESSAGE ----------------

  const handleViewCompany = (company, from) => {
    console.log(company);

    navigate(`/${company.slug}`, {
      state: {
        companyId: company._id,
        from,
      },
    });
  };
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

  return (
    <>
      <div className="main-dashboard-content d-flex flex-column">
        <div className="responsive-content">
          <div className="breadcrumb-area">
            <h1>{t("messaging.title")}</h1>
            <ol className="breadcrumb">
              <li className="item">
                <Link to="/">{t("header.home")} </Link>
              </li>
              <li className="item">
                <Link to="/candidate-dashboard" style={{ marginLeft: 6 }}>
                  <i className="fa-solid fa-angle-right" /> {t("header.dashboard")}
                </Link>{" "}
              </li>
              <li className="item">
                <i className="fa-solid fa-angle-right" /> {t("messaging.title")}
              </li>
            </ol>
          </div>
          {/* End Breadcrumb Area */}
          {/* Chat Messaging System Section Start Area */}
          <div className="chat-modern-wrapper">
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
                    <span className="msg-stat-label-premium">{t("messaging.non_verbal")}</span>
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
                        {/* IMAGE */}
                        <div className="contact-avatar-container">
                          <img
                            alt="avatar"
                            className="contact-avatar"
                            crossOrigin="anonymous"
                            src={getImageUrl(
                              u?.otherUser?.logo || u?.otherUser?.profileImage,
                            )}
                            onError={handleImageError}
                            loading="lazy"
                            decoding="async"
                          />

                          <span
                            className={`online-dot ${isOnline ? "" : "offline"}`}
                          />
                        </div>

                        {/* INFO */}
                        <div className="contact-info">
                          {/* TOP */}
                          <div className="contact-name-row">
                            <span className="contact-name">
                              {u?.otherUser?.brandName || t("messaging.unknown_user")}
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

                          {/* LAST MESSAGE */}
                          <div className="contact-last-msg">
                            <span className="msg-text">
                              {u?.lastMessage?.length > 55
                                ? u.lastMessage.substring(0, 55) + "..."
                                : u?.lastMessage || t("messaging.no_messages")}
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
            <div className="chat-main-section">
              <div className="chat-global-filter-bar">
                <div className="empty-filters-group">
                  <div className="chat-filters">
                    <div
                      className={`filter-tab ${
                        activeFilter === "all" ? "active" : ""
                      }`}
                      onClick={() => {
                        setActiveFilter("all");
                        setFilter("");
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
                        setFilter("unread");
                      }}
                    >
                      {t("messaging.non_verbal")}
                    </div>
                  </div>

                  <div className="chat-date-filters">
                    {/* ALL */}
                    <span
                      className={`date-chip ${
                        dateFilter === "all" ? "active" : ""
                      }`}
                      onClick={() => {
                        setDateFilter("all");
                      }}
                    >
                      {t("messaging.all")}
                    </span>

                    {/* TODAY */}
                    <span
                      className={`date-chip ${
                        dateFilter === "today" ? "active" : ""
                      }`}
                      onClick={() => {
                        const today = new Date().toISOString().split("T")[0];

                        setDateFilter("today");

                        setStartDate(today);
                        setEndDate(today);
                      }}
                    >
                      {t("messaging.today")}
                    </span>

                    {/* CUSTOM */}
                    <div
                      className={`date-picker-wrapper ${
                        dateFilter === "custom" ? "active" : ""
                      }`}
                    >
                      <i className="fa-regular fa-calendar-days" />

                      <input
                        className="date-picker-input"
                        type="date"
                        value={startDate}
                        onChange={(e) => {
                          const selectedDate = e.target.value;

                          setDateFilter("custom");

                          setStartDate(selectedDate);
                        }}
                      />
                    </div>
                  </div>
                </div>

                <div className="chat-search-container">
                  <div className="chat-search-box">
                    <i className="fa-solid fa-magnifying-glass" />

                    <input
                      placeholder={t("messaging.search_company")}
                      type="text"
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                    />
                  </div>
                </div>
              </div>

              <div className="chat-header-modern">
                {activeUser && (
                  <>
                    <div className="chat-header-user-info">
                      <img
                        crossOrigin="anonymous"
                        alt="header-avatar"
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
                        title={t("messaging.search_conversation")}
                        onClick={() => setShowChatSearch((prev) => !prev)}
                      >
                        <i className="fa-solid fa-magnifying-glass" />
                      </button>

                      <button
                        className={`tool-btn ${
                          showCompanyInfo ? "active" : ""
                        }`}
                        title={t("messaging.company_information")}
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

                            const imageUrl = msg.fileUrl
                              ? getImageUrl(msg.fileUrl)
                              : "";

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
                                        <video controls>
                                          <source
                                            cr
                                            src={getImageUrl(msg.fileUrl)}
                                          />
                                        </video>
                                      )}
                                    {msg.fileUrl &&
                                      msg.messageType === "file" && (
                                        <a
                                          href={getImageUrl(msg.fileUrl)}
                                          target="_blank"
                                          rel="noreferrer"
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
              {activeUser && (
                <div className="chat-footer-modern">
                  <div className="chat-input-container-modern">
                    <>
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
                        accept="image/*,video/*,.pdf,.doc,.docx"
                        onChange={handleFileChange}
                      />
                    </>
                    {selectedFile && (
                      <div className="chat-file-preview">
                        <img
                          src={
                            previewUrl ||
                            "https://cdn-icons-png.flaticon.com/512/337/337946.png"
                          }
                          alt="file"
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
                          onClick={() => setSelectedFile(null)}
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
                      onChange={(e) => {
                        setText(e.target.value);
                        handleTyping();
                      }}
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
                            className="emoji-picker-wrapper emoji-pop-box "
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
                      alt="logo"
                      className="info-panel-logo"
                      src={getImageUrl(activeUser?.image)}
                      onError={handleImageError}
                      loading="lazy"
                      decoding="async"
                    />

                    <h4>{activeUser?.name}</h4>

                    <span className="industry-tag">{activeUser?.industry}</span>
                  </div>

                  <div className="info-section">
                    <div className="company-about">
                      <h5 className="section-title">{t("messaging.about_company")}</h5>

                      <SafeHtml
                        className="info-description"
                        html={activeUser?.aboutCompany}
                        decode
                        fallback={t("messaging.no_company_description")}
                      />
                    </div>

                    <div className="contact-section">
                      <h5 className="section-title">{t("messaging.contact_details")}</h5>

                      {activeUser?.website && (
                        <div className="info-item">
                          <i className="fa-solid fa-globe"></i>

                          <a
                            href={activeUser.website}
                            target="_blank"
                            rel="noreferrer"
                            className="info-link"
                          >
                            {activeUser.website}
                          </a>
                        </div>
                      )}

                      <div className="info-item">
                        <i className="fa-solid fa-envelope"></i>
                        <span>{activeUser?.email || t("messaging.na")}</span>
                      </div>

                      <div className="info-item">
                        <i className="fa-solid fa-phone"></i>
                        <span>
                          {activeUser?.phone
                            ? typeof activeUser.phone === "object"
                              ? `+${activeUser.phone.countryCode} ${activeUser.phone.number}`
                              : activeUser.phone
                            : t("messaging.na")}
                        </span>
                      </div>

                      <div className="info-item">
                        <i className="fa-solid fa-location-dot"></i>
                        <span>{activeUser?.location || "N/A"}</span>
                      </div>

                      <div className="info-item">
                        <i className="fa-solid fa-flag"></i>
                        <span>{activeUser?.nationality || "N/A"}</span>
                      </div>
                    </div>

                    <button
                      className="view-profile-btn"
                      onClick={() =>
                        handleViewCompany(
                          {
                            _id: activeUser?.id,
                            slug: activeUser?.slug,
                          },
                          "/chat-messaging-system",
                        )
                      }
                    >
                      {t("messaging.view_full_profile")}
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>

          <div className="copy-right-area bg-f0f4fc">
            <div className="row">
              <div className="col-lg-6 col-md-6">
                <div className="copyright-left-content">
                  <p>
                    {" "}
                    <span className="copy">© </span>
                    <span id="year" />
                    <span className="template-name"> {t("header.Connect_Work")} </span>{" "}
                    {t("header.All_Rights_Reserved")}
                  </p>
                </div>
              </div>
              <div className="col-lg-6 col-md-6">
                <div className="copyright-right-content">
                  <p>
                    {t("header.Designed_By")}{" "}
                    <a href="https://hibootstrap.com/" target="_blank">
                      {t("header.Webnmobapps_Solution_Pvt_Ltd")}
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
