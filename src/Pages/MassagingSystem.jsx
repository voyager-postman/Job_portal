import { Link } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import axios from "axios";

function MassagingSystem() {
  const socketRef = useRef(null);
  const bottomRef = useRef(null);
  const CURRENT_USER_ID = 1;
  const [users, setUsers] = useState([
    { id: 2, name: "User One" },
    { id: 3, name: "User Two" },
  ]);

  const [activeUser, setActiveUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const [chatStore, setChatStore] = useState({});

  useEffect(() => {
    const ws = new WebSocket("ws://66.116.198.68:8788/ws/chat/");
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
              <h3>Message</h3>
              <div className="profile-form">
                <div className="row">
                  <div className="messaging-system-info-area">
                    <div className="messaging-system-tab-area">
                      <div className="messaging-system-heading-info">
                        <h5>Candidate massage</h5>
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
                            key={u.id}
                            onClick={(e) => loadChat(u)}
                          >
                            <a
                              className="nav-link"
                              data-bs-toggle="tab"
                              // href="#menu1"
                              // aria-selected="true"
                              // role="tab"
                            >
                              <div className="messaging-system-img-user-info">
                                <div className="messaging-system-user-img">
                                  <img
                                    src="assets/images/candidate-img/candidate1.jpg"
                                    alt="image"
                                  />
                                </div>
                                <div className="messaging-system-user-info">
                                  <h5>{u.name}</h5>
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
                              src="assets/images/candidate-img/candidate1.jpg"
                              alt="image"
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
                            msg.from === CURRENT_USER_ID ? (
                              // RIGHT SIDE (RECTRUITER - YOU)
                              <>
                                <div className="messaging-system-recruiter-messaging">
                                  <div className="messaging-system-user-message bg-color">
                                    <p>{msg.message}</p>
                                    <div className="messaging-system-recruiter-message-time">
                                      {/* <h6>Sophia Smith</h6> */}
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
                                      src="assets/images/candidate-img/candidate2.jpg"
                                      alt="image"
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
                                      src="assets/images/candidate-img/candidate1.jpg"
                                      alt="user"
                                    />
                                  </div>
                                  <div className="messaging-system-user-message">
                                    <p>{msg.message}</p>
                                    <div className="messaging-system-message-time">
                                      {/* <h6>Sophia Smith</h6> */}
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
                        <div onClick={sendMessage}>
                          <i className="fa-solid fa-paper-plane" />
                        </div>
                      </div>
                    </div>
                    <div className="messaging-system-interview-scheduling">
                      <div className="messaging-system-heading-info">
                        <h5>Interview Scheduling</h5>
                        <div className="messaging-system-select">
                          <select
                            className="form-select form-control"
                            aria-label="Default2 select example"
                          >
                            <option selected>Select Interview</option>
                            <option value={1}>Development</option>
                            <option value={2}>Information IT</option>
                            <option value={3}>Corporate Job</option>
                          </select>
                        </div>
                      </div>
                      <div className="interview-scheduling-info">
                        <span>
                          <input
                            type="radio"
                            id="html"
                            name="fav_language"
                            defaultValue="HTML"
                          />
                          <label htmlFor="html">Tuesday, 10:00 AM</label>
                        </span>
                        <span>
                          <input
                            type="radio"
                            id="css"
                            name="fav_language"
                            defaultValue="CSS"
                          />
                          <label htmlFor="css">Tuesday, 1:00 PM</label>
                        </span>
                        <span>
                          <input
                            type="radio"
                            id="javascript"
                            name="fav_language"
                            defaultValue="JavaScript"
                          />
                          <label htmlFor="javascript">Wednesday, 2:00 PM</label>
                        </span>
                        <span>
                          <input
                            type="radio"
                            id="javascript"
                            name="fav_language"
                            defaultValue="JavaScript"
                          />
                          <label htmlFor="javascript">Thursday, 4:00 PM</label>
                        </span>
                      </div>
                      <div className="send-invitation-btn">
                        <a href="#" className="default-btn btn">
                          Send Invitation
                        </a>
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
