import axios from "axios";
import { API_BASE_URL, API_IMAGE_URL } from "../Url/Url";
import { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import image1 from "../../src/images/whatImg.png";
import "./ChatMassageSystemModern.css";
import EmojiPicker from "emoji-picker-react";
function ChatMassageSystem() {
  const token = localStorage.getItem("token");
  const navigate = useNavigate();
  const socketRef = useRef(null);
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
  // ---------------- CONNECT SOCKET ----------------
  useEffect(() => {
    const ws = new WebSocket(
      "wss://mobappssolutions.in/chatusingsocket/ws/chat/",
    );
    socketRef.current = ws;
    ws.onopen = () => console.log("WebSocket Connected");
    ws.onmessage = (e) => {
      const data = JSON.parse(e.data);
      const normalized = {
        ...data,
        sender: data.from,
        receiver: data.to,
      };

      const otherUserId =
        String(normalized.sender) === String(CURRENT_USER_ID)
          ? normalized.receiver
          : normalized.sender;

      setChatStore((prev) => ({
        ...prev,
        [otherUserId]: [...(prev[otherUserId] || []), normalized],
      }));

      // If currently chatting with this user → update UI
      if (activeUser && otherUserId === activeUser.id) {
        setMessages((prev) => [...prev, normalized]);
      }
    };
    ws.onclose = () => console.log("WebSocket Closed");
    return () => ws.close();
  }, []);
  const handleEmojiClick = (emojiData) => {
    setText((prev) => prev + emojiData.emoji);
  };
  const handleFileChange = (e) => {
    const file = e.target.files[0];

    if (!file) return;

    setSelectedFile(file);

    // Preview only
    if (file.type.startsWith("image")) {
      setPreviewUrl(URL.createObjectURL(file));
    } else {
      setPreviewUrl("");
    }
  };
  const sendMessage = async () => {
    if ((!text.trim() && !selectedFile) || !activeUser) return;

    let uploadedFileUrl = "";
    let uploadedFileType = "";

    try {
      // FILE UPLOAD
      if (selectedFile) {
        const formData = new FormData();
        formData.append("file", selectedFile);

        const res = await axios.post(
          `${API_BASE_URL}upload-chat-file`,
          formData,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "multipart/form-data",
            },
          },
        );

        uploadedFileUrl = res.data.fileUrl;
        uploadedFileType = selectedFile.type;
      }

      const payload = {
        type: "chat",
        from: CURRENT_USER_ID,
        to: activeUser.id,
        message: text || "",
        file: uploadedFileUrl || "",
        fileType: uploadedFileType || "",
        fileName: selectedFile?.name || "",
        created_at: new Date().toISOString(),
      };
      if (socketRef.current?.readyState === WebSocket.OPEN) {
        socketRef.current.send(JSON.stringify(payload));
      } else {
        console.log("Socket not connected");
      }

      socketRef.current.send(JSON.stringify(payload));

      setMessages((prev) => [...prev, payload]);

      setText("");
      setSelectedFile(null);
      setPreviewUrl("");
      setShowEmojiPicker(false);
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatStore, activeUser]);

  const fetchCandidates = async () => {
    const res = await fetch(`${API_BASE_URL}getJobseekerChatList`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await res.json();
    const chats = data.chats || [];
    setUsers(chats);
  };

  useEffect(() => {
    fetchCandidates();
  }, []);
  const filteredUsers = users.filter((u) => {
    const brandName = u?.otherUser?.brandName?.toLowerCase().trim();

    const matchesSearch = brandName?.includes(searchTerm.toLowerCase().trim());

    // Non-verbal = unread messages
    const matchesFilter =
      activeFilter === "all"
        ? true
        : activeFilter === "non-verbal"
          ? u?.unreadCount > 0
          : true;

    return matchesSearch && matchesFilter;
  });
  const checkUnreadCount = async (groupId) => {
    try {
      const res = await axios.post(
        `${API_BASE_URL}chat/mark-read/${groupId}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } },
      );
      console.log(res.data);
      fetchCandidates();
    } catch (error) {
      console.error(error);
    }
  };

  // ---------------- LOAD CHAT HISTORY ----------------
  const loadChat = async (user) => {
    console.log(user, ">>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>");
    const userId = user.otherUser.companyId;
    const groupId = user.groupId;

    const getLastSeenText = (lastActiveAt) => {
      if (!lastActiveAt) return "";

      const lastActive = new Date(lastActiveAt);
      const now = new Date();

      const isToday =
        lastActive.getDate() === now.getDate() &&
        lastActive.getMonth() === now.getMonth() &&
        lastActive.getFullYear() === now.getFullYear();

      if (isToday) {
        const time = lastActive.toLocaleTimeString("en-US", {
          hour: "numeric",
          minute: "2-digit",
          hour12: true,
        });
        return `last seen today at ${time}`;
      }

      const date = lastActive.toLocaleDateString("en-US", {
        month: "short",
        day: "2-digit",
        year: "numeric",
      });
      return `last seen ${date}`;
    };
    const isOnline = user?.otherUser?.isOnline === "true";
    setActiveUser({
      id: userId,
      slug: user?.otherUser?.slug,

      name: user?.otherUser?.brandName || "Null",

      image: user?.otherUser?.logo
        ? user.otherUser.logo.startsWith("http")
          ? user.otherUser.logo
          : `${API_IMAGE_URL}${user.otherUser.logo}`
        : "assets/images/freelancers/freelancers-img-1.jpg",

      online: isOnline
        ? "Online"
        : getLastSeenText(user?.otherUser?.lastActiveAt),

      isOnline,

      groupId: groupId,

      unreadCount: user.unreadCount,

      aboutCompany: user?.otherUser?.aboutCompany,

      website: user?.otherUser?.links?.officialWebsite,

      location: user?.otherUser?.location || "Morocco",

      industry: user?.otherUser?.industry?.name || "Company",
    });

    // If already cached, reuse it
    if (chatStore[userId]) {
      setMessages(chatStore[userId]);
      return;
    }
    try {
      const res = await axios.post(
        `${API_BASE_URL}getChatHistory/${userId}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } },
      );
      setChatStore((prev) => ({
        ...prev,
        [userId]: res.data.data,
      }));
      setMessages(res.data.data);
      fetchCandidates();
    } catch (err) {
      console.log("History Load Failed", err);
    }
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
  const getImageUrl = (url) => {
    if (!url) return "";

    if (url.startsWith("http")) {
      return url;
    }

    return `${API_IMAGE_URL}${url}`;
  };

  return (
    <>
      <div className="main-dashboard-content d-flex flex-column">
        <div className="responsive-content">
          <div className="breadcrumb-area">
            <h1>Messages</h1>
            <ol className="breadcrumb">
              <li className="item">
                <Link to="/">Home </Link>
              </li>
              <li className="item">
                <Link to="/candidate-dashboard" style={{ marginLeft: 6 }}>
                  <i className="fa-solid fa-angle-right" /> Dashboard
                </Link>{" "}
              </li>
              <li className="item">
                <i className="fa-solid fa-angle-right" /> Messages
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
                  <span>
                    <font dir="auto" style={{ "vertical-align": "inherit" }}>
                      <font dir="auto" style={{ "vertical-align": "inherit" }}>
                        Overview
                      </font>
                    </font>
                  </span>
                </div>
                <div className="modern-msg-stats-integrated">
                  <div className="msg-stat-item-premium">
                    <span className="msg-stat-value-premium">7</span>
                    <span className="msg-stat-label-premium">Total</span>
                  </div>
                  <div className="msg-stat-item-premium unread">
                    <span className="msg-stat-value-premium">3</span>
                    <span className="msg-stat-label-premium">
                      <font dir="auto" style={{ "vertical-align": "inherit" }}>
                        <font
                          dir="auto"
                          style={{ "vertical-align": "inherit" }}
                        >
                          Non-verbal
                        </font>
                      </font>
                    </span>
                  </div>
                  <div className="msg-stat-item-premium rate">
                    <span className="msg-stat-value-premium">95%</span>
                    <span className="msg-stat-label-premium">
                      <font dir="auto" style={{ "vertical-align": "inherit" }}>
                        <font
                          dir="auto"
                          style={{ "vertical-align": "inherit" }}
                        >
                          Answer
                        </font>
                      </font>
                    </span>
                  </div>
                </div>
              </div>
              <div className="sidebar-divider-modern" />
              <div className="chat-sidebar-header-modern">
                <h2>
                  <font dir="auto" style={{ "vertical-align": "inherit" }}>
                    <font dir="auto" style={{ "vertical-align": "inherit" }}>
                      Conversations
                    </font>
                  </font>
                </h2>
              </div>
              <div className="chat-contact-list">
                {filteredUsers.length === 0 ? (
                  <div className="no-messages-found">
                    <i className="fa-solid fa-comment-slash"></i>
                    <p>No messages found</p>
                  </div>
                ) : (
                  filteredUsers.map((u) => {
                    const isActive = activeUser?.id === u?.otherUser?.companyId;

                    return (
                      <div
                        key={u.groupId}
                        className={`contact-card ${isActive ? "active" : ""}`}
                        onClick={() => {
                          loadChat(u);
                          fetchCandidates();
                          checkUnreadCount(u.groupId);

                          setUsers((prevUsers) =>
                            prevUsers.map((item) =>
                              item.groupId === u.groupId
                                ? {
                                    ...item,
                                    unreadCount: 0,
                                  }
                                : item,
                            ),
                          );
                        }}
                        style={{ cursor: "pointer" }}
                      >
                        <div className="contact-avatar-container">
                          <img
                            alt="avatar"
                            crossOrigin="anonymous"
                            className="contact-avatar"
                            src={getImageUrl(u?.otherUser?.logo)}
                          />

                          <span
                            className={`online-dot ${
                              u?.otherUser?.isOnline === "true" ? "" : "offline"
                            }`}
                          />
                        </div>

                        <div className="contact-info">
                          <div className="contact-name-row">
                            <span className="contact-name">
                              {u?.otherUser?.brandName}
                            </span>

                            <span className="contact-time">
                              {u?.updatedAt
                                ? new Date(u.updatedAt).toLocaleTimeString([], {
                                    hour: "2-digit",
                                    minute: "2-digit",
                                  })
                                : ""}
                            </span>
                          </div>

                          <div className="contact-last-msg">
                            <span className="msg-text">
                              {u?.lastMessage?.length > 55
                                ? u.lastMessage.substring(0, 55) + "..."
                                : u?.lastMessage}
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
                      className={`filter-tab ${activeFilter === "all" ? "active" : ""}`}
                      onClick={() => setActiveFilter("all")}
                    >
                      All
                    </div>

                    <div
                      className={`filter-tab ${
                        activeFilter === "non-verbal" ? "active" : ""
                      }`}
                      onClick={() => setActiveFilter("non-verbal")}
                    >
                      Non-verbal
                    </div>
                  </div>

                  <div className="chat-date-filters">
                    <span className="date-chip active">All</span>

                    <span className="date-chip">Today</span>

                    <div className="date-picker-wrapper">
                      <i className="fa-regular fa-calendar-days" />

                      <input className="date-picker-input" type="date" />
                    </div>
                  </div>
                </div>

                <div className="chat-search-container">
                  <div className="chat-search-box">
                    <i className="fa-solid fa-magnifying-glass" />

                    <input
                      placeholder="Search for a company..."
                      type="text"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
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
                        title="Search the conversation"
                        onClick={() => setShowChatSearch((prev) => !prev)}
                      >
                        <i className="fa-solid fa-magnifying-glass" />
                      </button>

                      <button
                        className={`tool-btn ${
                          showCompanyInfo ? "active" : ""
                        }`}
                        title="Company information"
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
                      placeholder="Rechercher un mot-clé dans ce chat..."
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
                    />

                    <h2>Ready to trade?</h2>
                  </div>
                ) : (
                  <>
                    <>
                      {(chatStore[activeUser?.id] || []).filter((msg) =>
                        msg?.message
                          ?.toLowerCase()
                          .includes(chatSearchTerm.toLowerCase()),
                      ).length === 0 ? (
                        <div className="no-messages-found">
                          <i className="fa-solid fa-comment-slash"></i>
                          <p>No messages found</p>
                        </div>
                      ) : (
                        (chatStore[activeUser?.id] || [])
                          .filter((msg) =>
                            msg?.message
                              ?.toLowerCase()
                              .includes(chatSearchTerm.toLowerCase()),
                          )
                          .map((msg, index) => {
                            const isMine =
                              String(msg.sender) === String(CURRENT_USER_ID);

                            return (
                              <div
                                key={index}
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
                                />

                                <div className="msg-content-wrapper">
                                  <div className="msg-bubble-modern">
                                    {msg.message && <p>{msg.message}</p>}

                                    {msg.file && (
                                      <>
                                        {msg.fileType?.startsWith("image") ? (
                                          <img
                                            src={getImageUrl(msg.file)}
                                            alt="chat-file"
                                            style={{
                                              maxWidth: "250px",
                                              borderRadius: "12px",
                                              marginTop: "8px",
                                            }}
                                          />
                                        ) : msg.fileType?.startsWith(
                                            "video",
                                          ) ? (
                                          <video
                                            controls
                                            style={{
                                              maxWidth: "250px",
                                              borderRadius: "12px",
                                              marginTop: "8px",
                                            }}
                                          >
                                            <source
                                              src={getImageUrl(msg.file)}
                                            />
                                          </video>
                                        ) : (
                                          <a
                                            href={getImageUrl(msg.file)}
                                            target="_blank"
                                            rel="noreferrer"
                                            className="chat-file-link"
                                          >
                                            📄 Download File
                                          </a>
                                        )}
                                      </>
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
                      placeholder="Write your message..."
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
                          type="button"
                          className="input-tool-btn"
                          onClick={() => setShowEmojiPicker((prev) => !prev)}
                        >
                          <i className="fa-regular fa-face-smile" />
                        </button>

                        {showEmojiPicker && (
                          <div className="emoji-picker-wrapper">
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
                    />

                    <h4>{activeUser?.name}</h4>

                    <span className="industry-tag">{activeUser?.industry}</span>
                  </div>

                  <div className="info-section">
                    <h5>About</h5>

                    <p
                      className="info-description"
                      dangerouslySetInnerHTML={{
                        __html:
                          activeUser?.aboutCompany ||
                          "No company description available.",
                      }}
                    />

                    <h5 style={{ marginTop: "24px" }}>Contact details</h5>

                    {activeUser?.website && (
                      <div className="info-item">
                        <i className="fa-solid fa-globe" />
                        {activeUser?.website}
                      </div>
                    )}

                    <div className="info-item">
                      <i className="fa-solid fa-location-dot" />
                      {activeUser?.location}
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
                      View full profile
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
