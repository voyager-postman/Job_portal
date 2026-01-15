import React, { useEffect, useMemo, useState } from "react";
import { TableView } from "../Conponets/DataTable";
import { API_BASE_URL } from "../Url/Url";
import axios from "../utils/axiosInstance"


function ActivityTimeline() {
  const [globalFilter, setGlobalFilter] = useState("");

  const [activity, setActivity] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [totalPages, setTotalPages] = useState(1);

  // ✅ API CALL
  const fetchActivity = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");

      const res = await axios.get(`${API_BASE_URL}jobseeker/activity`, {
        params: { page, limit }, // ✅ correct way
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setActivity(res.data.data || []);
      setTotalPages(res.data.totalPages || 1);
    } catch (err) {
      console.error("Activity fetch error", err);
    } finally {
      setLoading(false);
    }
  };

  // 🔥 Re-fetch when page OR limit changes
  useEffect(() => {
    fetchActivity();
  }, [page, limit]);

  // 🔹 Columns
  const columns = [
    {
      header: "S.No",
      cell: ({ row }) => (page - 1) * limit + row.index + 1,
    },
    {
      accessorKey: "activityType",
      header: "Activity Type",
    },
    {
      accessorKey: "message",
      header: "Message",
    },
    {
      header: "Date",
      cell: ({ row }) =>
        new Date(row.original.createdAt).toLocaleDateString("en-IN"),
    },
    {
      header: "Time",
      cell: ({ row }) =>
        new Date(row.original.createdAt).toLocaleTimeString("en-IN"),
    },
  ];

  return (
    <div className="main-dashboard-content d-flex flex-column">
      <div className="responsive-content">
        <div className="breadcrumb-area">
          <h1>Activity Timeline</h1>
        </div>

        <div className="my-profile-area">
          <div className="profile-form-content">
            {loading ? (
              <div className="d-flex justify-content-center py-5">
                <div className="spinner-border text-primary" />
              </div>
            ) : (
              <>
                {/* TABLE */}
                <TableView
                  columns={columns}
                  data={activity}
                  limit={limit}
                  setLimit={(val) => {
                    setLimit(val);
                    setPage(1); // 🔥 reset page
                  }}
                  globalFilter={globalFilter}
                  setGlobalFilter={setGlobalFilter}
                />

                {/* ✅ PAGINATION */}
                <div className="d-flex justify-content-center mt-3">
                  <button
                    className="btn btn-sm btn-primary mx-1"
                    disabled={page === 1}
                    onClick={() => setPage((p) => p - 1)}
                  >
                    Prev
                  </button>

                  <span className="mx-2">
                    Page {page} of {totalPages}
                  </span>

                  <button
                    className="btn btn-sm btn-primary mx-1"
                    disabled={page === totalPages}
                    onClick={() => setPage((p) => p + 1)}
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
  );
}

export default ActivityTimeline;
