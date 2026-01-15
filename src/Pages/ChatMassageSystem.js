import axios from "../Services/axios";
import { API_BASE_URL, API_IMAGE_URL } from "../Url/Url";
import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import image1 from "../../src/images/whatImg.png";

function ChatMassageSystem() {
  const token = localStorage.getItem("token");
  const socketRef = useRef(null);
  const bottomRef = useRef(null);
  const [users, setUsers] = useState([]);
  const CURRENT_USER_ID = localStorage.getItem("user_id");
  console.log("Current Employer ID:-", CURRENT_USER_ID);
  const profileImage = localStorage.getItem("profileImage");
  const [activeUser, setActiveUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const [chatStore, setChatStore] = useState({});

  // ---------------- CONNECT SOCKET ----------------
  useEffect(() => {
    const ws = new WebSocket(
      "wss://thunderingslap.com/chatusingsocket/ws/chat/"
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

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const fetchCandidates = async () => {
    const res = await fetch(`${API_BASE_URL}getJobseekerChatList`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await res.json();
    const chats = data.chats || [];
    setUsers(chats);

    // // ✅ Auto-select first user
    // if (chats.length > 0) {
    //   loadChat(chats[0]);
    // }
  };
  useEffect(() => {
    fetchCandidates();
  }, []);

  const checkUnreadCount = async (groupId) => {
    try {
      const res = await axios.post(
        `${API_BASE_URL}chat/mark-read/${groupId}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      console.log(res.data);
      fetchCandidates();
    } catch (error) {
      console.error(error);
    }
  };

  // ---------------- LOAD CHAT HISTORY ----------------
  const loadChat = async (user) => {
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

    setActiveUser({
      id: userId,
      name: user?.otherUser?.brandName || "Null",
      image: user?.otherUser?.logo
        ? user.otherUser.logo.startsWith("http")
          ? user.otherUser.logo
          : `${API_IMAGE_URL}${user.otherUser.logo}`
        : "assets/images/freelancers/freelancers-img-1.jpg",
      jobId: user.jobId,
      online:
        user?.otherUser?.isOnline === "true"
          ? "Online"
          : getLastSeenText(user?.otherUser?.lastActiveAt),
      groupId: groupId,
      unreadCount: user.unreadCount,
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
        { headers: { Authorization: `Bearer ${token}` } }
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
  const sendMessage = () => {
    if (!text.trim() || !activeUser) return;

    if (!socketRef.current || socketRef.current.readyState !== WebSocket.OPEN) {
      console.log("Socket not connected");
      return;
    }
    const payload = {
      type: "chat",
      from: CURRENT_USER_ID,
      to: activeUser.id,
      message: text,
      jobId: activeUser.jobId,
      created_at: new Date().toISOString(),
    };
    socketRef.current.send(JSON.stringify(payload));

    // setChatStore((prev) => ({
    //   ...prev,
    //   [activeUser.id]: [...(prev[activeUser.id] || []), payload],
    // }));

    setMessages((prev) => [...prev, payload]); // instantly show in UI
    setText("");
  };

  return (
    <>
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
          <section className="chat-messaging-system-info">
            <div className="search-box-user-list-area">
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
              {/* ---------------- USER LIST ---------------- */}
              <div className="user-message-list">
                <ul className="nav nav-tabs" role="tablist">
                  {users.map((u) => (
                    <li
                      className="nav-item"
                      role="presentation"
                      key={u?.otherUser?.id}
                      onClick={() => {
                        loadChat(u);
                        fetchCandidates();
                        checkUnreadCount(u.groupId);
                        // update unread count
                        setUsers((prevUsers) =>
                          prevUsers.map((item) =>
                            item.groupId === u.groupId
                              ? { ...item, unreadCount: 0 }
                              : item
                          )
                        );
                      }}
                    >
                      <a className="nav-link" data-bs-toggle="tab">
                        <div className="user-img-name-chat-count-time-massage">
                          <div className="user-img-chat-count">
                            <img
                              crossOrigin="anonymous"
                              src={
                                u?.otherUser?.logo
                                  ? u.otherUser.logo.startsWith("http")
                                    ? u.otherUser.logo
                                    : `${API_IMAGE_URL}${u.otherUser.logo}`
                                  : "assets/images/freelancers/freelancers-img-1.jpg"
                              }
                              alt="image"
                            />
                            {u?.unreadCount > 0 && (
                              <>
                                <span className="chat-count">
                                  {u.unreadCount}
                                </span>
                              </>
                            )}
                          </div>
                          <div className="user-name-chat-time-massage">
                            <div className="user-name-time-info">
                              <h6>{u?.otherUser?.brandName}</h6>
                              {/* <p>Tap to chat</p> */}
                            </div>
                            <div className="user-short-massage">
                              <p>
                                {u?.lastMessage?.length > 40
                                  ? u.lastMessage.substring(0, 40) + "..."
                                  : u?.lastMessage}
                              </p>
                            </div>
                          </div>
                        </div>
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            <div className="user-header-user-chat-details">
              {!activeUser ? (
                <div
                  className="no-chat-selected"
                  style={{
                    height: "100%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexDirection: "column",
                    color: "#999",
                    background: "#a9a9a921",
                  }}
                >
                  {/* Optional Image */}
                  <img
                    src={image1}
                    alt="No chat selected"
                    style={{
                      width: "50%",
                      height: "100%",
                      margin: "20px 0px",
                      opacity: 0.7,
                    }}
                  />
                  {/* <h5>Select a user to start chatting</h5> */}
                </div>
              ) : (
                // ================= ACTIVE CHAT =================
                <>
                  {/* ---------- HEADER ---------- */}
                  <div className="user-name-message-dlt-info">
                    <div className="user-img-name-status-info">
                      <div className="user-message-img">
                        <img
                          crossOrigin="anonymous"
                          src={activeUser?.image}
                          alt={activeUser?.name}
                        />
                      </div>
                      <div className="user-name-status">
                        <h6>{activeUser ? activeUser.name : "Select User"}</h6>
                        <span>{activeUser?.online}</span>
                      </div>
                    </div>
                    <div className="user-message-dlt">
                      <span>
                        <i className="fa-solid fa-trash" />
                        Delete Conversation
                      </span>
                    </div>
                  </div>

                  {/* ---------- MESSAGES ---------- */}
                  <div className="user-message-list-massage-detail">
                    <div className="job-seeker-employer-message-detail">
                      {/* Tab Panes */}
                      <div className="tab-content">
                        <div className="tab-pane fade show active">
                          {(chatStore[activeUser?.id] || []).map((msg, index) =>
                            String(msg.sender) === String(CURRENT_USER_ID) ? (
                              // RIGHT SIDE (JOB SEEKER - YOU)
                              <div
                                key={index}
                                className="user-message-chat-details employer-info-main-area"
                              >
                                <div className="job-seeker-message-detail-text">
                                  <p>{msg.message}</p>
                                  <div className="job-seeker-message-time">
                                    <p>
                                      {new Date(
                                        msg.created_at
                                      ).toLocaleTimeString([], {
                                        hour: "2-digit",
                                        minute: "2-digit",
                                      })}
                                    </p>
                                  </div>
                                </div>
                                <div className="job-seeker-message-name-img-time">
                                  <div className="job-seeker-message-img">
                                    <img
                                      crossOrigin="anonymous"
                                      src={
                                        profileImage
                                          ? profileImage.startsWith("http")
                                            ? profileImage
                                            : `${API_IMAGE_URL}${profileImage}`
                                          : "assets/images/freelancers/freelancers-img-1.jpg"
                                      }
                                      alt="rectruiter"
                                    />
                                  </div>
                                </div>
                              </div>
                            ) : (
                              <div
                                key={index}
                                className="user-message-chat-details"
                              >
                                <div className="job-seeker-message-name-img-time">
                                  <div className="job-seeker-message-img">
                                    <img
                                      crossOrigin="anonymous"
                                      src={activeUser?.image}
                                      alt={activeUser?.name}
                                    />
                                  </div>
                                </div>

                                <div className="job-seeker-message-detail-text">
                                  <p>{msg.message}</p>
                                  <div className="job-seeker-message-time">
                                    <p>
                                      {new Date(
                                        msg.created_at
                                      ).toLocaleTimeString([], {
                                        hour: "2-digit",
                                        minute: "2-digit",
                                      })}
                                    </p>
                                  </div>
                                </div>
                              </div>
                            )
                          )}
                          <div ref={bottomRef}></div>
                        </div>
                      </div>
                    </div>
                    {/* ---------------- INPUT ---------------- */}
                    <div className="chat-messaging-typeing-function-btn">
                      <div className="chat-messaging-typeing-box">
                        <textarea
                          className="form-control"
                          placeholder="Type message..."
                          rows={1}
                          value={text}
                          onChange={(e) => setText(e.target.value)}
                          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                        />
                      </div>
                      <div
                        onClick={sendMessage}
                        className="chat-messaging-send-btn"
                      >
                        <i className="fa-solid fa-paper-plane" />
                        Send
                      </div>
                      <div className="chat-messaging-typeing-function"></div>
                    </div>
                  </div>
                </>
              )}
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
