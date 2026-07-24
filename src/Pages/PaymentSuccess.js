import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import "./PaymentResult.css";

const WALLET_REFRESH_KEY = "employerWalletRefresh";

export const markEmployerWalletRefresh = (message) => {
  try {
    sessionStorage.setItem(
      WALLET_REFRESH_KEY,
      JSON.stringify({
        message: message || "",
        at: Date.now(),
      }),
    );
  } catch {
    // ignore storage errors
  }
};

const PaymentSuccess = () => {
  const { t } = useTranslation("global");
  const location = useLocation();
  const navigate = useNavigate();
  const payment = location.state?.payment;

  const successMessage =
    payment?.message || t("payment.default_success_message");

  const isPendingApproval =
    payment?.isPendingApproval ||
    payment?.status === "PENDING" ||
    /waiting for admin approval/i.test(successMessage);

  const formatAmount = () => {
    if (payment?.amount == null || payment?.amount === "") return null;
    const currency = payment.currency || "MAD";
    return `${payment.amount} ${currency}`;
  };

  const goToWallet = () => {
    markEmployerWalletRefresh(successMessage);
    navigate("/employer-wallet", {
      state: {
        walletRefresh: true,
        purchaseSuccessMessage: successMessage,
      },
    });
  };

  const detailRows = [
    { label: t("payment.plan"), value: payment?.planName },
    { label: t("payment.invoice"), value: payment?.invoiceNumber, mono: true },
    { label: t("payment.amount_paid"), value: formatAmount(), highlight: true },
    { label: t("payment.email"), value: payment?.payerEmail },
    {
      label: t("payment.status"),
      value: isPendingApproval
        ? t("payment.pending_approval")
        : payment?.status,
      badge: isPendingApproval ? "pending" : "success",
    },
  ].filter((row) => row.value);

  if (!payment) {
    return (
      <div className="payment-result-page payment-result-page--empty">
        <div className="payment-result-card">
          <div className="payment-result-icon-wrap">
            <div className="payment-result-icon payment-result-icon--neutral">
              <i className="fa-solid fa-receipt" />
            </div>
          </div>
          <h1 className="payment-result-title">
            {t("payment.no_payment_record")}
          </h1>
          <p className="payment-result-subtitle">
            {t("payment.no_payment_details")}
          </p>
          <div className="payment-result-actions">
            <button
              type="button"
              className="payment-result-btn payment-result-btn--primary"
              onClick={goToWallet}
            >
              <i className="fa-solid fa-wallet" />
              {t("payment.go_to_wallet")}
            </button>
            <Link
              to="/employer-dashboard"
              className="payment-result-btn payment-result-btn--outline"
            >
              {t("payment.back_to_dashboard")}
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`payment-result-page ${
        isPendingApproval
          ? "payment-result-page--pending"
          : "payment-result-page--success"
      }`}
    >
      <div className="payment-result-card">
        <div className="payment-result-icon-wrap">
          <div
            className={`payment-result-icon ${
              isPendingApproval
                ? "payment-result-icon--pending"
                : "payment-result-icon--success"
            }`}
          >
            <i
              className={`fa-solid ${
                isPendingApproval ? "fa-clock" : "fa-check"
              }`}
            />
          </div>
        </div>

        <h1 className="payment-result-title">
          {isPendingApproval
            ? t("payment.payment_received")
            : t("payment.payment_successful")}
        </h1>
        <p className="payment-result-subtitle">{successMessage}</p>

        {detailRows.length > 0 && (
          <div className="payment-result-details">
            {detailRows.map((row) => (
              <div className="payment-result-row" key={row.label}>
                <span className="payment-result-label">{row.label}</span>
                {row.badge ? (
                  <span
                    className={`payment-result-badge payment-result-badge--${row.badge}`}
                  >
                    {row.value}
                  </span>
                ) : (
                  <span
                    className={`payment-result-value${
                      row.mono ? " payment-result-value--mono" : ""
                    }${row.highlight ? " payment-result-value--highlight" : ""}`}
                  >
                    {row.value}
                  </span>
                )}
              </div>
            ))}
          </div>
        )}

        <div className="payment-result-actions">
          <button
            type="button"
            className="payment-result-btn payment-result-btn--success"
            onClick={() => navigate("/employer-dashboard")}
          >
            <i className="fa-solid fa-gauge-high" />
            {t("payment.go_to_dashboard")}
          </button>
          <button
            type="button"
            className="payment-result-btn payment-result-btn--outline"
            onClick={goToWallet}
          >
            <i className="fa-solid fa-wallet" />
            {t("payment.view_wallet")}
          </button>
        </div>

        <div className="payment-result-trust">
          <i className="fa-solid fa-shield-halved" />
          {t("payment.secured_payment")}
        </div>
      </div>
    </div>
  );
};

export default PaymentSuccess;
