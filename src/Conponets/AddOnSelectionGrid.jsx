import React from "react";
import { useTranslation } from "react-i18next";

const getAddonIcon = (plan) => {
  const hasJob = (plan?.jobPostingCredits || 0) > 0;
  const hasCv = (plan?.profileViewingCredits || 0) > 0;
  if (hasJob && hasCv) return "fa-solid fa-layer-group";
  if (hasCv) return "fa-solid fa-user-tie";
  return "fa-solid fa-briefcase";
};

const isManualAddon = (plan) =>
  plan?.paymentMode === "Manual" ||
  plan?.canPurchaseOnline === false ||
  plan?.showButton === "Contact Us" ||
  plan?.showButton === "Manual Request" ||
  plan?.showButton === "Manuel Request";

const isAddonNotAvailable = (plan) => plan?.showButton === "Not Available";

const AddOnSelectionGrid = ({
  plans = [],
  loading = false,
  hasActiveGateway = false,
  onBuy,
  onManualRequest,
  onRequestCustomCredit,
  showCustomCreditButton = true,
}) => {
  const { t } = useTranslation("global");

  const getAddonButtonLabel = (plan) => {
    if (isAddonNotAvailable(plan)) return t("addons.notAvailable");
    if (isManualAddon(plan)) return t("addons.manualRequest");
    return t("addons.buy");
  };

  const isAddonButtonDisabled = (plan) => {
    if (isAddonNotAvailable(plan)) return true;
    if (isManualAddon(plan)) return false;
    return plan?.canPurchase === false;
  };

  if (loading) {
    return (
      <div className="text-center py-5">
        <div className="spinner-border text-primary mb-3" role="status" />
        <p className="text-muted mb-0">{t("addons.loadingAddonPacks")}</p>
      </div>
    );
  }

  if (!loading && plans.length === 0) {
    return (
      <div className="text-center py-5 text-muted">
        {t("addons.noActiveAddonPacks")}
      </div>
    );
  }

  return (
    <>
      <div className="row g-3 justify-content-center">
        {plans.map((plan) => {
          const manual = isManualAddon(plan);
          const icon = getAddonIcon(plan);

          return (
            <div className="col-lg-4 col-md-6 d-flex" key={plan._id}>
              <div className="addon-selection-card w-100 d-flex flex-column">
                <div className="d-flex justify-content-between align-items-start mb-3">
                  <div className="addon-icon">
                    <i className={icon} />
                  </div>
                  <div className="addon-price">
                    {plan.price}{" "}
                    <span className="small">{plan.currency || "MAD"}</span>
                  </div>
                </div>
                <h6 className="fw-bold text-dark mb-2">{plan.name}</h6>
                <div className="addon-details mb-4 flex-grow-1">
                  {(plan?.jobPostingCredits || 0) > 0 && (
                    <div className="d-flex justify-content-between small mb-1">
                      <span className="text-muted">{t("addons.jobCreditsLabel")}</span>
                      <span className="fw-bold">+{plan.jobPostingCredits}</span>
                    </div>
                  )}
                  {(plan?.profileViewingCredits || 0) > 0 && (
                    <div className="d-flex justify-content-between small mb-1">
                      <span className="text-muted">{t("addons.cvCreditsLabel")}</span>
                      <span className="fw-bold">
                        +{plan.profileViewingCredits}
                      </span>
                    </div>
                  )}
                  <div className="d-flex justify-content-between small">
                    <span className="text-muted">{t("addons.mode")}</span>
                    <span className="fw-bold text-dark">
                      {plan.paymentMode ||
                        (manual ? t("addons.manual") : t("addons.online"))}
                    </span>
                  </div>
                </div>
                <button
                  type="button"
                  className="btn-select-addon w-100 d-flex align-items-center justify-content-center"
                  disabled={isAddonButtonDisabled(plan)}
                  title={
                    isManualAddon(plan) ? "" : plan?.purchaseBlockedReason || ""
                  }
                  onClick={() => {
                    if (isAddonNotAvailable(plan)) return;
                    if (isManualAddon(plan) || !hasActiveGateway) {
                      onManualRequest?.(plan);
                      return;
                    }
                    if (plan?.canPurchase === false) return;
                    onBuy?.(plan);
                  }}
                >
                  {getAddonButtonLabel(plan)}
                </button>
              </div>
            </div>
          );
        })}
      </div>
      {showCustomCreditButton && (
        <div className="mt-4 pt-4 border-top text-center">
          <p className="text-muted small mb-3">
            {t("addons.needSpecificCredits")}
          </p>
          <button
            type="button"
            className="btn-custom-trigger"
            onClick={onRequestCustomCredit}
          >
            <i className="fa-solid fa-percent me-2" />{" "}
            {t("addons.requestCustomCredit")}
          </button>
        </div>
      )}
    </>
  );
};

export default AddOnSelectionGrid;
