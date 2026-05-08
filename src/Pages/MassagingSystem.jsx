import { Link } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import axios from "axios";
import { useLocation } from "react-router-dom";
import { API_BASE_URL, API_IMAGE_URL } from "../Url/Url";
import image1 from "../../src/images/whatImg.png";

function MassagingSystem() {
  const location = useLocation();
  const token = localStorage.getItem("token");
  const socketRef = useRef(null);
  const bottomRef = useRef(null);
  const chatContainerRef = useRef(null);
  const [users, setUsers] = useState([]);
  const CURRENT_USER_ID = localStorage.getItem("companyId");
  console.log("Current Employer ID:-", CURRENT_USER_ID);
  const profileImage = localStorage.getItem("profileImage");
  const [activeUser, setActiveUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const [chatStore, setChatStore] = useState({});
  const stateHandledRef = useRef(false);

  // ---------------- CONNECT SOCKET ----------------

  useEffect(() => {
    const ws = new WebSocket(
      `wss://mobappssolutions.in/chatusingsocket/ws/chat/`,
    );
    socketRef.current = ws;
    ws.onopen = () => console.log("Websocket Connected");
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

      if (activeUser && otherUserId === activeUser.id) {
        setMessages((prev) => [...prev, normalized]);
      }
    };
    ws.onclose = () => console.log("Websocket Closed");
    return () => ws.close();
  }, []);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatStore, activeUser]);

  const fetchCandidates = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}getChatUserList`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      let chatUsers = res.data.data || [];

      // If we're coming from "Send Message" button, ensure that specific person is in the list
      if (location.state?.candidateId && location.state?.candidate) {
        const targetId = location.state.candidateId;
        const exists = chatUsers.find(
          (u) => String(u.user?._id) === String(targetId),
        );

        if (!exists) {
          const app = location.state.candidate;
          // Create a mock chat user object from the applicant data
          const newChatUser = {
            user: {
              _id: app.userId?._id,
              name: `${app.userId?.first_name} ${app.userId?.last_name}`,
              profileImage: app.userId?.profileImage,
            },
            lastMessage: "",
            unreadCount: 0,
            lastMessageAt: null,
            groupId: null,
          };
          chatUsers = [newChatUser, ...chatUsers];
        }
      }

      setUsers(chatUsers);
    } catch (error) {
      console.error("Error While fetching the candidate data", error);
    }
  };

  useEffect(() => {
    fetchCandidates();
  }, []);

  // Handle incoming candidate selection from state (e.g., from Manage Applicants page)
  useEffect(() => {
    if (
      !stateHandledRef.current &&
      location.state?.candidateId &&
      users.length > 0
    ) {
      const targetUser = users.find(
        (u) => String(u.user?._id) === String(location.state.candidateId),
      );
      if (targetUser) {
        loadChat(targetUser);
        stateHandledRef.current = true;
      }
    }
  }, [users, location.state]);

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
  const loadChat = async (chatItem) => {
    const userId = chatItem?.user?._id;
    const groupId = chatItem?.groupId;

    const getLastSeenText = (lastMessageAt) => {
      if (!lastMessageAt) return "";

      const lastActive = new Date(lastMessageAt);
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
      name: chatItem?.user?.name?.trim(),
      image: chatItem?.user?.profileImage,
      // jobId: chatItem?.jobId,
      online: getLastSeenText(chatItem?.lastMessageAt),
      groupId: groupId,
      unreadCount: chatItem?.unreadCount || 0,
    });

    // If already cached
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
    } catch (err) {
      console.log("History Load Failed", err);
    }
  };

  const sendMessage = () => {
    if (!text.trim() || !activeUser) return;

    const payload = {
      type: "chat",
      from: CURRENT_USER_ID,
      to: activeUser.id,
      message: text,
      created_at: new Date().toISOString(),
    };

    socketRef.current.send(JSON.stringify(payload));
    setMessages((prev) => [...prev, payload]);
    // setChatStore((prev) => ({
    //   ...prev,
    //   [activeUser.id]: [...(prev[activeUser.id] || []), payload],
    // }));

    setText("");
  };

  const getImageUrl = (url) => {
    if (!url) return "assets/images/userIcon.png";

    if (url.includes("http") && url.includes("uploads/http")) {
      return url.replace(`${API_IMAGE_URL}`, "");
    }

    return url.startsWith("http") ? url : `${API_IMAGE_URL}${url}`;
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
                <Link to="/employer-dashboard">
                  <i className="fa-solid fa-angle-right" /> Dashboard
                </Link>
              </li>
              <li className="item">
                <i className="fa-solid fa-angle-right" />
                Messages
              </li>
            </ol>
          </div>
          {/* End Breadcrumb Area */}

          {/*Start messaging system start here*/}
          <div className="my-profile-area">
            <div className="profile-form-content">
              <div className="profile-form">
                <div className="row">
                  <div className="messaging-system-info-area">
                    <div className="messaging-system-tab-area">
                      <div className="messaging-system-heading-info">
                        {/* <h5>Candidate massage</h5> */}
                        <div className="messaging-system-search-icon">
                          <div className="messaging-system-search">
                            <input
                              className="form-control"
                              type="text"
                              name="search"
                              placeholder="Search....."
                            />
                          </div>
                          <div className="messaging-system-icon">
                            <i className="fa-solid fa-magnifying-glass" />
                          </div>
                        </div>
                      </div>
                      {/* ---------------- USER LIST ---------------- */}
                      <div>
                        <ul className="nav nav-tabs" role="tablist">
                          {users.length === 0 ? (
                            <li className="nav-item w-100 text-center py-4">
                              <div className="no-users">
                                No Job Seeker available
                              </div>
                            </li>
                          ) : (
                            users.map((u) => (
                              <li
                                className="nav-item"
                                role="presentation"
                                style={{
                                  cursor: "pointer",
                                }}
                                key={u.user?._id}
                                onClick={() => {
                                  loadChat(u);
                                  fetchCandidates();
                                  checkUnreadCount(u.groupId || "");
                                }}
                              >
                                <a
                                  className={`nav-link ${
                                    String(activeUser?.id) ===
                                    String(u.user?._id)
                                      ? "active"
                                      : ""
                                  }`}
                                  data-bs-toggle="tab"
                                >
                                  <div className="messaging-system-img-user-info">
                                    <div className="messaging-system-user-img">
                                      <img
                                        crossOrigin="anonymous"
                                        src={getImageUrl(u?.user?.profileImage)}
                                      />

                                      {u?.unreadCount > 0 && (
                                        <>
                                          <span className="chat-count">
                                            {u?.unreadCount}
                                          </span>
                                        </>
                                      )}
                                    </div>
                                    <div className="messaging-system-user-info">
                                      <h5>
                                        {u.user?.name}{" "}
                                        {/* {u.applicant?.last_name} */}
                                      </h5>
                                      <p>
                                        {u?.lastMessage?.length > 30
                                          ? u.lastMessage.substring(0, 30) +
                                            "..."
                                          : u?.lastMessage}
                                      </p>
                                    </div>
                                  </div>
                                </a>
                              </li>
                            ))
                          )}
                        </ul>
                      </div>
                    </div>

                    <div className="messaging-system-chat-box">
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
                        </div>
                      ) : (
                        // ================= ACTIVE CHAT =================
                        <>
                          <div className="messaging-system-heading-info">
                            <div className="messaging-system-img-user-info">
                              <div className="messaging-system-user-img">
                                <img
                                  crossOrigin="anonymous"
                                  src={getImageUrl(activeUser?.image)}
                                  alt={activeUser?.name || "User"}
                                />
                              </div>
                              <div className="messaging-system-user-name">
                                <h5>
                                  {activeUser ? activeUser.name : "Select User"}
                                </h5>
                                <p
                                  style={{
                                    color: activeUser?.isOnline
                                      ? "green"
                                      : "#a2a6a2",
                                    fontWeight: 600,
                                  }}
                                >
                                  {activeUser?.online}
                                </p>
                              </div>
                            </div>
                            <div class="user-message-dlt">
                              <span>
                                <i class="fa-solid fa-trash"></i>Delete
                                Conversation
                              </span>
                            </div>
                          </div>
                          {/* ---------------- CHAT MESSAGES ---------------- */}
                          <div className="tab-content" ref={chatContainerRef}>
                            <div className="tab-pane fade show active">
                              {(chatStore[activeUser?.id] || []).map(
                                (msg, index) =>
                                  String(msg.sender) ===
                                  String(CURRENT_USER_ID) ? (
                                    // RIGHT SIDE (RECTRUITER - YOU)
                                    <>
                                      <div
                                        key={index}
                                        className="messaging-system-recruiter-messaging"
                                      >
                                        <div className="messaging-system-user-message bg-color">
                                          <p>{msg.message}</p>
                                          <div className="messaging-system-recruiter-message-time">
                                            <p>
                                              {new Date(
                                                msg.created_at,
                                              ).toLocaleTimeString([], {
                                                hour: "2-digit",
                                                minute: "2-digit",
                                              })}
                                            </p>
                                          </div>
                                        </div>
                                        <div className="messaging-system-userImg">
                                          <img
                                            crossOrigin="anonymous"
                                            src={getImageUrl(profileImage)}
                                            alt="rectruiter"
                                          />
                                        </div>
                                      </div>
                                    </>
                                  ) : (
                                    <>
                                      <div
                                        key={index}
                                        className="messaging-system-user-messaging"
                                      >
                                        <div className="messaging-system-userImg">
                                          <img
                                            crossOrigin="anonymous"
                                            src={getImageUrl(activeUser?.image)}
                                            alt={activeUser?.name || "User"}
                                          />
                                        </div>
                                        <div className="messaging-system-user-message">
                                          <p>{msg.message}</p>
                                          <div className="messaging-system-message-time">
                                            <p>
                                              {new Date(
                                                msg.created_at,
                                              ).toLocaleTimeString([], {
                                                hour: "2-digit",
                                                minute: "2-digit",
                                              })}
                                            </p>
                                          </div>
                                        </div>
                                      </div>
                                    </>
                                  ),
                              )}
                              <div ref={bottomRef}></div>
                            </div>
                          </div>
                          {/* ---------------- INPUT ---------------- */}
                          <div className="messaging-system-typeing-send-btn">
                            <>
                              <textarea
                                className="form-control"
                                placeholder="Write Brief Bio Or Introduction"
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
                            </>
                            <div
                              onClick={sendMessage}
                              className="send_chat cusror-pointer"
                              style={{
                                cursor: "pointer",
                              }}
                            >
                              <i className="fa-solid fa-paper-plane" />
                              Send
                            </div>
                            <div className="chat-messaging-typeing-function"></div>
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          {/*Start messaging system end here*/}
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

export default MassagingSystem;
