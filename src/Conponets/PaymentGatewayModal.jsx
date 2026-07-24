import React from "react";
import { useTranslation } from "react-i18next";

const GATEWAY_ICONS = {
  paypal: { icon: "fa-brands fa-paypal", iconClass: "text-primary" },
  cmi: { icon: "fa-solid fa-credit-card", iconClass: "text-success" },
  stripe: { icon: "fa-brands fa-stripe", iconClass: "text-primary" },
};

const getGatewayIcon = (gatewayName) => {
  const key = (gatewayName || "").toLowerCase();
  return GATEWAY_ICONS[key] || GATEWAY_ICONS.stripe;
};

const PaymentGatewayModal = ({
  isOpen,
  onClose,
  itemName,
  itemPrice,
  itemCurrency = "MAD",
  paymentGateways = [],
  startPayment = false,
  onGatewaySelect,
  onBack,
  backLabel,
  paymentStepBackLabel,
  children,
}) => {
  const { t } = useTranslation("global");

  if (!isOpen) return null;

  const handleBack = onBack || onClose;
  const resolvedBackLabel = backLabel ?? t("checkout.backToPacks");
  const resolvedPaymentStepBackLabel =
    paymentStepBackLabel ?? t("checkout.back");

  return (
    <div className="custom-modal-overlay" onClick={onClose}>
      <div
        className="custom-modal-content topup-modal-content"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-header-premium">
          <h4 className="fw-bold mb-0">{t("checkout.selectPaymentMethod")}</h4>
          <button type="button" className="btn-close-custom" onClick={onClose}>
            <i className="fa-solid fa-xmark" />
          </button>
        </div>
        <div className="modal-body-premium p-4">
          {!startPayment ? (
            <div className="payment-gateway-selection">
              <div className="selected-plan-summary mb-4">
                <span className="small text-muted d-block">
                  {t("checkout.purchasing")}
                </span>
                <span className="fw-bold text-dark fs-5">{itemName}</span>
                {(itemPrice != null || itemCurrency) && (
                  <span className="badge bg-primary-subtle text-primary ms-2">
                    {itemPrice} {itemCurrency}
                  </span>
                )}
              </div>
              {paymentGateways.length === 0 ? (
                <p className="text-danger mb-0">
                  {t("checkout.noPaymentGateways")}
                </p>
              ) : (
                <div className="row g-3">
                  {paymentGateways.map((gateway) => {
                    const key = gateway.gatewayName.toLowerCase();
                    const { icon, iconClass } = getGatewayIcon(key);

                    return (
                      <div className="col-md-6" key={gateway._id || key}>
                        <div
                          className="gateway-card"
                          role="button"
                          tabIndex={0}
                          onClick={() => onGatewaySelect?.(key)}
                          onKeyDown={(e) => {
                            if (e.key === "Enter" || e.key === " ") {
                              e.preventDefault();
                              onGatewaySelect?.(key);
                            }
                          }}
                        >
                          <div className="gateway-logo">
                            <i className={`${icon} fs-2 ${iconClass}`} />
                          </div>
                          <span className="fw-bold text-dark text-uppercase">
                            {key}
                          </span>
                          <i className="fa-solid fa-chevron-right ms-auto text-muted small" />
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
              <div className="mt-5">
                <button
                  type="button"
                  className="btn-cancel-custom w-100"
                  onClick={handleBack}
                >
                  {resolvedBackLabel}
                </button>
              </div>
            </div>
          ) : (
            <>
              <div className="selected-plan-summary mb-4">
                <span className="small text-muted d-block">
                  {t("checkout.purchasing")}
                </span>
                <span className="fw-bold text-dark fs-5">{itemName}</span>
                {(itemPrice != null || itemCurrency) && (
                  <span className="badge bg-primary-subtle text-primary ms-2">
                    {itemPrice} {itemCurrency}
                  </span>
                )}
              </div>
              {children}
              <div className="mt-4">
                <button
                  type="button"
                  className="btn-cancel-custom w-100"
                  onClick={handleBack}
                >
                  {resolvedPaymentStepBackLabel}
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default PaymentGatewayModal;
