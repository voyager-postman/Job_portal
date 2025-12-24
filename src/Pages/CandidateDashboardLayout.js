import React from "react";
import { Outlet } from "react-router-dom";

const CandidateDashboardLayout = () => {
  return (
    <div className="main-dashboard-content d-flex flex-column">
      <div className="responsive-content">
        <Outlet />
      </div>
    </div>
  );
};

export default CandidateDashboardLayout;
