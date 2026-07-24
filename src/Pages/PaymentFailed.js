import React from "react";

import { Link, useLocation, useNavigate } from "react-router-dom";

import { useTranslation } from "react-i18next";

import "./PaymentResult.css";



const PaymentFailed = () => {

  const { t } = useTranslation("global");

  const location = useLocation();

  const navigate = useNavigate();



  const error =

    location.state?.error || t("payment.default_error_message");



  const isCancelled = /cancel/i.test(error);



  return (

    <div className="payment-result-page payment-result-page--failed">

      <div className="payment-result-card">

        <div className="payment-result-icon-wrap">

          <div className="payment-result-icon payment-result-icon--failed">

            <i

              className={`fa-solid ${isCancelled ? "fa-ban" : "fa-xmark"}`}

            />

          </div>

        </div>



        <h1 className="payment-result-title">

          {isCancelled

            ? t("payment.payment_cancelled")

            : t("payment.payment_failed")}

        </h1>

        <p className="payment-result-subtitle">{error}</p>



        <div className="payment-result-details">

          <div className="payment-result-row">

            <span className="payment-result-label">{t("payment.status")}</span>

            <span className="payment-result-badge payment-result-badge--failed">

              {isCancelled ? t("payment.cancelled") : t("payment.failed")}

            </span>

          </div>

        </div>



        {!isCancelled && (

          <div className="payment-result-tips">

            <p className="payment-result-tips-title">

              <i className="fa-solid fa-lightbulb" />

              {t("payment.what_you_can_try")}

            </p>

            <ul className="payment-result-tips-list">

              <li>{t("payment.tip_verify_card")}</li>

              <li>{t("payment.tip_different_method")}</li>

              <li>{t("payment.tip_internet")}</li>

              <li>{t("payment.tip_contact_support")}</li>

            </ul>

          </div>

        )}



        <div className="payment-result-actions">

          <button

            type="button"

            className="payment-result-btn payment-result-btn--danger"

            onClick={() => navigate("/employer-wallet")}

          >

            <i className="fa-solid fa-rotate-right" />

            {t("payment.try_again")}

          </button>

          <Link

            to="/contact-us"

            className="payment-result-btn payment-result-btn--outline"

          >

            <i className="fa-solid fa-headset" />

            {t("payment.contact_support")}

          </Link>

        </div>



        <div className="payment-result-trust">

          <i className="fa-solid fa-lock" />

          {t("payment.no_charges")}

        </div>

      </div>

    </div>

  );

};



export default PaymentFailed;

