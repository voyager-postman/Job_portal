import { Link } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import axios from "axios";
import { useLocation } from "react-router-dom";
import { API_BASE_URL, API_IMAGE_URL } from "../Url/Url";

function MassagingSystem() {
  const location = useLocation();
  const token = localStorage.getItem("token");
  const profileImage = localStorage.getItem("profileImage");
  const jobId = location.state?.jobId;
  const socketRef = useRef(null);
  const bottomRef = useRef(null);
  const [users, setUsers] = useState([]);
  const [activeUser, setActiveUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const [chatStore, setChatStore] = useState({});
  const CURRENT_USER_ID = localStorage.getItem("companyId");
  console.log("Current Employer ID:-", CURRENT_USER_ID);
  // const companyId = localStorage.getItem("companyId");

  // ---------------- CONNECT SOCKET ----------------
  useEffect(() => {
    const ws = new WebSocket("ws://66.116.198.68:8788/ws/chat/");
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
    const res = await fetch(`${API_BASE_URL}getApplicantsListByJob/${jobId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    const data = await res.json();
    const applicants = data.applicants || [];
    setUsers(applicants);

    // ✅ Auto-select first user
    if (applicants.length > 0) {
      loadChat(applicants[0]);
    }
  };

  useEffect(() => {
    fetchCandidates();
  }, []);

  const loadChat = async (user) => {
    const userId = user.applicant.userId;

    setActiveUser({
      id: userId,
      name: `${user.applicant.first_name} ${user.applicant.last_name}`,
      image: user.applicant.profileImage,
      jobId: user.jobId,
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
    } catch (err) {
      console.log("History Load Failed", err);
    }
  };

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
      jobId: jobId,
      created_at: new Date().toISOString(),
    };
    console.log(payload);
    socketRef.current.send(JSON.stringify(payload));

    // setChatStore((prev) => ({
    //   ...prev,
    //   [activeUser.id]: [...(prev[activeUser.id] || []), payload],
    // }));

    setMessages((prev) => [...prev, payload]);
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
                      <ul className="nav nav-tabs" role="tablist">
                        {users.map((u) => (
                          <li
                            className="nav-item"
                            role="presentation"
                            key={u.applicant.userId}
                            onClick={(e) => loadChat(u)}
                          >
                            <a className="nav-link" data-bs-toggle="tab">
                              <div className="messaging-system-img-user-info">
                                <div className="messaging-system-user-img">
                                  <img
                                    crossOrigin="anonymous"
                                    src={
                                      u?.applicant?.profileImage
                                        ? u.applicant.profileImage.startsWith(
                                            "http"
                                          )
                                          ? u.applicant.profileImage
                                          : `${API_IMAGE_URL}${u.userId.profileImage}`
                                        : "assets/images/freelancers/freelancers-img-1.jpg"
                                    }
                                    alt="image"
                                  />
                                </div>
                                <div className="messaging-system-user-info">
                                  <h5>
                                    {u.applicant?.first_name}{" "}
                                    {u.applicant?.last_name}
                                  </h5>
                                  <p>Tap to chat</p>
                                </div>
                              </div>
                            </a>
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div className="messaging-system-chat-box">
                      {/* Tab Panes */}
                      <div className="messaging-system-heading-info">
                        <div className="messaging-system-img-user-info">
                          <div className="messaging-system-user-img">
                            <img
                              crossOrigin="anonymous"
                              src={activeUser?.image}
                              alt={activeUser?.name}
                            />
                          </div>
                          <div className="messaging-system-user-name">
                            <h5>
                              {activeUser ? activeUser.name : "Select User"}
                            </h5>
                            <p>Online</p>
                          </div>
                        </div>
                      </div>
                      {/* ---------------- CHAT MESSAGES ---------------- */}
                      <div className="tab-content">
                        <div
                          className="tab-pane fade show active"
                          // id="menu1"
                          // role="tabpanel"
                        >
                          {(chatStore[activeUser?.id] || []).map((msg, index) =>
                            String(msg.sender) === String(CURRENT_USER_ID) ? (
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
                                          msg.created_at
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
                                <div ref={bottomRef}></div>
                              </>
                            ) : (
                              <>
                                <div className="messaging-system-user-messaging">
                                  <div className="messaging-system-userImg">
                                    <img
                                      crossOrigin="anonymous"
                                      src={activeUser?.image}
                                      alt={activeUser?.name}
                                    />
                                  </div>
                                  <div className="messaging-system-user-message">
                                    <p>{msg.message}</p>
                                    <div className="messaging-system-message-time">
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
                                <div ref={bottomRef}></div>
                              </>
                            )
                          )}
                        </div>
                      </div>
                      {/* ---------------- INPUT ---------------- */}
                      <div className="messaging-system-typeing-send-btn">
                        <textarea
                          className="form-control"
                          placeholder="Write Brief Bio Or Introduction"
                          rows={1}
                          value={text}
                          onChange={(e) => setText(e.target.value)}
                          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                        />
                        <div onClick={sendMessage} className="send_chat">
                          <i className="fa-solid fa-paper-plane" />
                          Send
                        </div>
                      </div>
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
