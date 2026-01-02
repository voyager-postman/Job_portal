import axios from "axios";
import { API_BASE_URL } from "../Url/Url";
import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";

function ChatMassageSystem() {
  const socketRef = useRef(null);
  const bottomRef = useRef(null);

  // Job Seeker (YOU)
  const CURRENT_USER_ID = 2;

  // const RECEIVER_ID = 2; // selected chat user
  const [users, setUsers] = useState([
    { id: 1, name: "Recruiters One" },
    { id: 3, name: "Recruiters  Two" },
  ]);

  const [activeUser, setActiveUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const [chatStore, setChatStore] = useState({});

  // ---------------- CONNECT SOCKET ----------------
  useEffect(() => {
    const ws = new WebSocket("wss://66.116.198.68:8788/ws/chat/");
    socketRef.current = ws;
    ws.onopen = () => console.log("WebSocket Connected");
    ws.onmessage = (e) => {
      const data = JSON.parse(e.data);
      if (!data.message) return;

      const otherUser = data.from === CURRENT_USER_ID ? data.to : data.from;

      setChatStore((prev) => ({
        ...prev,
        [otherUser]: [...(prev[otherUser] || []), data],
      }));

      // If currently chatting with this user → update UI
      if (activeUser && otherUser === activeUser.id) {
        setMessages((prev) => [...prev, data]);
      }
    };

    ws.onclose = () => console.log("WebSocket Closed");
    return () => ws.close();
  }, []);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // ---------------- LOAD CHAT HISTORY ----------------
  const loadChat = async (user) => {
    setActiveUser(user);

    try {
      const res = await axios.get(
        `http://66.116.198.68:8788/chat/history/${CURRENT_USER_ID}/${user.id}/`
      );

      setChatStore((prev) => ({
        ...prev,
        [user.id]: res.data.messages,
      }));

      setMessages(res.data.messages);
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
            <div className="chat-messaging-system-heading">
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
              <div className="user-name-message-dlt-info">
                <div className="user-img-name-status-info">
                  <div className="user-message-img">
                    <img
                      src="assets/images/candidate-img/candidate2.jpg"
                      alt="image"
                    />
                  </div>
                  <div className="user-name-status">
                    <h6>{activeUser ? activeUser.name : "Select User"}</h6>
                    <span>Online</span>
                  </div>
                </div>
                <div className="user-message-dlt">
                  <span>
                    <i className="fa-solid fa-trash" />
                    Delete Conversation
                  </span>
                </div>
              </div>
            </div>
            <div className="user-message-list-massage-detail">
              {/* ---------------- USER LIST ---------------- */}
              <div className="user-message-list">
                <ul className="nav nav-tabs" role="tablist">
                  {users.map((u) => (
                    <li
                      className="nav-item"
                      role="presentation"
                      key={u.id}
                      onClick={(e) => loadChat(u)}
                    >
                      <a
                        className="nav-link"
                        data-bs-toggle="tab"
                        // href="#menu1"
                        // aria-selected="false"
                        // role="tab"
                      >
                        <div className="user-img-name-chat-count-time-massage">
                          <div className="user-img-chat-count">
                            <img
                              src="assets/images/candidate-img/candidate2.jpg"
                              alt="image"
                            />
                            <span className="chat-count">1</span>
                          </div>
                          <div className="user-name-chat-time-massage">
                            <div className="user-name-time-info">
                              <h6>{u.name}</h6>
                              <p>Tap to chat</p>
                            </div>
                            <div className="user-short-massage">
                              <p>Lorem Ipsum is not simply random</p>
                            </div>
                          </div>
                        </div>
                      </a>
                    </li>
                  ))}
                </ul>
              </div>

              {/* ---------------- CHAT MESSAGES ---------------- */}
              <div className="job-seeker-employer-message-detail">
                {/* Tab Panes */}
                <div className="tab-content">
                  <div className="tab-pane fade show active">
                    {(chatStore[activeUser?.id] || []).map((msg, index) =>
                      msg.from === CURRENT_USER_ID ? (
                        // RIGHT SIDE (JOB SEEKER - YOU)
                        <div
                          key={index}
                          className="user-message-chat-details employer-info-main-area"
                        >
                          <div className="job-seeker-message-detail-text">
                            <p>{msg.message}</p>
                            <div className="job-seeker-message-time">
                              <p>
                                {new Date(msg.created_at).toLocaleTimeString(
                                  [],
                                  {
                                    hour: "2-digit",
                                    minute: "2-digit",
                                  }
                                )}
                              </p>
                            </div>
                          </div>

                          <div className="job-seeker-message-name-img-time">
                            <div className="job-seeker-message-img">
                              <img
                                src="assets/images/candidate-img/candidate1.jpg"
                                alt="rectruiter"
                              />
                            </div>
                          </div>
                        </div>
                      ) : (
                        // LEFT SIDE (RECRUITER)
                        <div key={index} className="user-message-chat-details">
                          <div className="job-seeker-message-name-img-time">
                            <div className="job-seeker-message-img">
                              <img
                                src="assets/images/candidate-img/candidate2.jpg"
                                alt="image"
                              />
                            </div>
                          </div>

                          <div className="job-seeker-message-detail-text">
                            <p>{msg.message}</p>
                            <div className="job-seeker-message-time">
                              <p>
                                {new Date(msg.created_at).toLocaleTimeString(
                                  [],
                                  {
                                    hour: "2-digit",
                                    minute: "2-digit",
                                  }
                                )}
                              </p>
                            </div>
                          </div>
                        </div>
                      )
                    )}
                    <div ref={bottomRef}></div>
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
                    // className="chat-messaging-send-btn"
                    onClick={sendMessage}
                  >
                    <i className="fa-solid fa-paper-plane" />
                  </div>
                  <div className="chat-messaging-typeing-function">
                    {/* <div className="chat-messaging-emoji">
                      <i className="fa-solid fa-face-smile" />
                    </div>
                    <div className="chat-messaging-upload-img">
                      <i className="fa-solid fa-image" />
                    </div>
                    <div className="chat-messaging-upload-file">
                      <i className="fa-solid fa-paperclip" />
                    </div> */}
                  </div>
                </div>
              </div>
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
