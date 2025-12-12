import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { TableView } from "../Conponets/DataTable";
import { API_BASE_URL } from "../Url/Url";
import axios from "axios";

function ActivityTimeline() {
  const [activity, setActivity] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [totalPages, setTotalPages] = useState(1);

  const fetchActivity = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const response = await axios.get(
        `${API_BASE_URL}jobseeker/activity?page=${page}&limit=${limit}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      console.log("Activity Timeline data:-", response.data.data);
      setActivity(response.data.data);
      setTotalPages(response.data.totalPages || 1);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchActivity();
  }, [page, limit]);

  const columns = [
    {
      accessorKey: "id",
      header: "S.No",
      cell: ({ row }) => (page - 1) * limit + row.index + 1,
    },
    {
      accessorKey: "activityType",
      header: "Activity Type",
      accessorFn: (row) => (row.activityType || "").toLowerCase(),
      cell: ({ row }) => row.original.activityType || "Not Provided",
    },
    {
      accessorKey: "message",
      header: "Message",
      accessorFn: (row) => (row.message || "").toLowerCase(),
      cell: ({ row }) => row.original.message || "Not Provided",
    },
    {
      accessorKey: "date",
      header: "Date",
      cell: ({ row }) => {
        const value = row.original.updatedAt;
        if (!value) return "Not Provided";

        const date = new Date(value);
        return date.toLocaleDateString("en-IN", {
          year: "numeric",
          month: "2-digit",
          day: "2-digit",
        });
      },
    },
    {
      accessorKey: "time",
      header: "Time",
      cell: ({ row }) => {
        const value = row.original.updatedAt;
        if (!value) return "Not Provided";

        const date = new Date(value);
        return date.toLocaleTimeString("en-IN", {
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
        });
      },
    },
  ];

  return (
    <>
      <div className="main-dashboard-content d-flex flex-column">
        <div className="responsive-content">
          {/* Breadcrumb Area */}
          <div className="breadcrumb-area">
            <h1>Activity timeline</h1>
            <ol className="breadcrumb">
              <li className="item">
                <a href="dashboard.html">Home </a>
              </li>
              <li className="item">
                <i className="fa-solid fa-angle-right" /> Dashboard
              </li>
              <li className="item">
                <i className="fa-solid fa-angle-right" /> Activity timeline
              </li>
            </ol>
          </div>
          {/* End Breadcrumb Area */}
          {/*Start My Profile Area*/}
          <div className="my-profile-area">
            <div className="profile-form-content add-recruiters-btn-postion">
              <h3>Andy Smith log view</h3>

              <div className="profile-form">
                <div className="row">
                  <div className="col-lg-12 col-md-12">
                    {loading ? (
                      <div className="d-flex justify-content-center py-5">
                        <div className="spinner-border text-primary"></div>
                      </div>
                    ) : (
                      <>
                        <TableView
                          columns={columns}
                          data={activity}
                          limit={limit}
                          setLimit={(value) => {
                            setLimit(value);
                            setPage(1);
                          }}
                        />
                        {/* PAGINATION BUTTONS */}
                        <div className="d-flex justify-content-center mt-3">
                          <button
                            className="btn btn-sm btn-primary mx-1"
                            disabled={page === 1}
                            onClick={() => setPage(page - 1)}
                          >
                            Prev
                          </button>

                          {[...Array(totalPages)].map((_, index) => (
                            <button
                              key={index}
                              className={`btn btn-sm mx-1 ${
                                page === index + 1
                                  ? "btn-primary"
                                  : "btn-outline-primary"
                              }`}
                              onClick={() => setPage(index + 1)}
                            >
                              {index + 1}
                            </button>
                          ))}

                          <button
                            className="btn btn-sm btn-primary mx-1"
                            disabled={page === totalPages}
                            onClick={() => setPage(page + 1)}
                          >
                            Next
                          </button>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
          {/*End My Profile Area*/}
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

export default ActivityTimeline;
