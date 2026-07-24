import React from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

const CategoryManagement = () => {
  const { t } = useTranslation("global");
  return (
    <>
      <div className="main-dashboard-content d-flex flex-column">
        <div className="responsive-content">
          <div className="breadcrumb-area">
            <h1>{t("assessment.manage_assesment_title")}</h1>
            <ol className="breadcrumb">
              <li className="item">
                <Link to="/">{t("header.home")} </Link>
              </li>
              <li className="item">
                <Link to="/employer-dashboard">
                  <i className="fa-solid fa-angle-right" /> {t("header.dashboard")}
                </Link>
              </li>
              <li className="item">
                <i className="fa-solid fa-angle-right" />
                {t("assessment.manage_assesment_title")}
              </li>
            </ol>
          </div>
        </div>
      </div>
    </>
  );
};

export default CategoryManagement;
