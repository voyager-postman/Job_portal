import React, { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { Link, useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { API_BASE_URL } from "../Url/Url";
import CheckoutForm from "./CheckoutForm";
import { buildPaymentSuccessState } from "../utils/paymentSuccessState";
import { getPaymentRequestConfig, getRequestConfig } from "../utils/apiHeaders";

const GATEWAY_CONFIG = {
  paypal: {
    icon: "fa-brands fa-paypal",
    iconClass: "text-primary",
  },
  cmi: {
    icon: "fa-solid fa-credit-card",
    iconClass: "text-success",
  },
  stripe: {
    icon: "fa-brands fa-stripe",
    iconClass: "text-primary",
  },
};

const formatPaymentMethod = (method = "") => {
  const normalized = String(method || "").trim().toLowerCase();
  if (normalized === "stripe") return "Stripe";
  if (normalized === "paypal") return "PayPal";
  if (normalized === "cmi") return "CMI";
  if (!method) return "Stripe";
  return (
    String(method).charAt(0).toUpperCase() + String(method).slice(1).toLowerCase()
  );
};

const buildPackPaymentPayload = (paymentData = {}, selectedGateway = "") => {
  const { paymentMethod, paymentMode, ...rest } = paymentData;

  return {
    paymentMethod: formatPaymentMethod(
      paymentMethod ?? paymentMode ?? selectedGateway,
    ),
    ...rest,
  };
};

const buildAddOnPaymentPayload = (paymentData = {}, selectedGateway = "") => {
  const { paymentMethod, paymentMode, ...rest } = paymentData;

  return {
    paymentMode: formatPaymentMethod(
      paymentMode ?? paymentMethod ?? selectedGateway,
    ),
    ...rest,
  };
};

const Checkout = () => {
  const { t } = useTranslation("global");
  const navigate = useNavigate();
  const location = useLocation();
  const checkoutState = location.state || {};
  const {
    paymentMethod = "stripe",
    pack,
    purchaseType = "pack",
    packId,
    returnTo = "/employer-wallet",
  } = checkoutState;

  const [paymentLoading, setPaymentLoading] = useState(false);
  const [paymentGateways, setPaymentGateways] = useState([]);
  const [stripePromise, setStripePromise] = useState(null);
  const paymentSubmittingRef = useRef(false);

  useEffect(() => {
    if (!pack) {
      navigate(returnTo, { replace: true });
    }
  }, [pack, navigate, returnTo]);

  useEffect(() => {
    const fetchGateways = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get(`${API_BASE_URL}getActivePaymentGateways`, getRequestConfig());

        if (res.data.success) {
          const active = (res.data.data || []).filter((g) => g.isActive);
          setPaymentGateways(active);

          const stripeGateway = active.find(
            (g) => g.gatewayName.toLowerCase() === "stripe",
          );
          if (stripeGateway?.publishableKey) {
            setStripePromise(loadStripe(stripeGateway.publishableKey));
          }
        }
      } catch (error) {
        console.error("Gateway fetch error:", error);
      }
    };

    fetchGateways();
  }, []);

  if (!pack) return null;

  const gateway = GATEWAY_CONFIG[paymentMethod] || GATEWAY_CONFIG.stripe;
  const formattedTotal = `${pack.price} ${pack.currency}`;
  const paypalGateway = paymentGateways.find(
    (g) => g.gatewayName.toLowerCase() === "paypal",
  );

  const selectedPlanForCheckout = {
    _id: pack.id,
    packName: pack.name,
    name: pack.name,
    amount: pack.price,
    price: pack.price,
    currency: pack.currency || "MAD",
  };

  const completePurchase = async (paymentData = {}) => {
    if (paymentSubmittingRef.current) {
      return { success: false, message: t("checkout.processing") };
    }

    paymentSubmittingRef.current = true;

    try {
      setPaymentLoading(true);

      if (purchaseType === "pack" && pack.id) {
        const res = await axios.post(
          `${API_BASE_URL}company/purchase-pack`,
          {
            packId: pack.id,
            ...buildPackPaymentPayload(paymentData, paymentMethod),
          },
          getPaymentRequestConfig(),
        );

        if (res.data.success) {
          try {
            sessionStorage.setItem(
              "employerWalletRefresh",
              JSON.stringify({
                message: res.data.message || t("checkout.purchaseCompleted"),
                at: Date.now(),
              }),
            );
          } catch {
            // ignore
          }
          toast.success(res.data.message || t("checkout.purchaseCompleted"));
          return {
            success: true,
            message: res.data.message,
            data: res.data.data,
          };
        }

        const packMessage = res.data.message || t("checkout.purchaseFailed");
        if (/active pack|cannot purchase another/i.test(packMessage)) {
          navigate(returnTo, { replace: true, state: { packError: packMessage } });
          return { success: false, message: packMessage };
        }

        toast.error(packMessage);
        return { success: false, message: packMessage };
      }

      if (purchaseType === "addon" && pack.id) {
        const res = await axios.post(
          `${API_BASE_URL}purchase-CompanyAddOn`,
          {
            addOnId: pack.id,
            companyPackId: packId,
            ...buildAddOnPaymentPayload(paymentData, paymentMethod),
          },
          getPaymentRequestConfig(),
        );

        if (res.data.success) {
          try {
            sessionStorage.setItem(
              "employerWalletRefresh",
              JSON.stringify({
                message: res.data.message || t("checkout.purchaseCompleted"),
                at: Date.now(),
              }),
            );
          } catch {
            // ignore
          }
          toast.success(res.data.message || t("checkout.purchaseCompleted"));
          return {
            success: true,
            message: res.data.message,
            data: res.data.data,
          };
        }

        toast.error(res.data.message || t("checkout.purchaseFailed"));
        return {
          success: false,
          message: res.data.message || t("checkout.purchaseFailed"),
        };
      }

      const invalidItemMessage = t("checkout.invalidPurchaseItem");
      toast.error(invalidItemMessage);
      return { success: false, message: invalidItemMessage };
    } catch (error) {
      const packMessage = error.response?.data?.message || t("checkout.purchaseFailed");
      if (
        purchaseType === "pack" &&
        /active pack|cannot purchase another/i.test(packMessage)
      ) {
        navigate(returnTo, { replace: true, state: { packError: packMessage } });
        return { success: false, message: packMessage };
      }

      toast.error(packMessage);
      return { success: false, message: packMessage };
    } finally {
      paymentSubmittingRef.current = false;
      setPaymentLoading(false);
    }
  };

  const redirectOnSuccess = (result) => {
    if (result?.success) {
      navigate("/payment-success", {
        state: {
          payment: buildPaymentSuccessState(result.message, result.data, {
            amount: pack.price,
            currency: pack.currency,
            planName: pack.name,
          }),
        },
      });
    }
    return result;
  };

  const purchasePackWithRedirect = async (paymentData = {}) => {
    const result = await completePurchase(paymentData);
    return redirectOnSuccess(result);
  };

  const handleDemoPayment = async () => {
    if (paymentSubmittingRef.current || paymentLoading) return;
    await purchasePackWithRedirect({ paymentMethod: "CMI" });
  };

  const handleChangeMethod = () => {
    navigate(returnTo, {
      state: {
        reopenCheckoutPayment: {
          pack,
          purchaseType,
        },
      },
    });
  };

  const method = paymentMethod.toLowerCase();

  return (
    <div className="checkout-page-wrapper">
      <ToastContainer position="top-right" autoClose={4000} />
      {paymentLoading && (
        <div className="loader-overlay" role="status" aria-live="polite" aria-busy="true">
          <div className="loader-box">
            <div className="custom-spinner" />
            <p className="brand-text">NADDI.MA</p>
          </div>
        </div>
      )}
      <div className="container py-5">
        <div className="row g-5">
          <div className="col-lg-8">
            <div className="checkout-main-card">
              <div className="checkout-header mb-5">
                <h2 className="fw-800 text-dark mb-2">{t("checkout.finalizePurchase")}</h2>
                <p className="text-muted">
                  {t("checkout.finalizeSubtitle")}
                </p>
              </div>

              <div className="payment-method-review mb-5">
                <h5 className="section-title mb-4">{t("checkout.paymentMethod")}</h5>
                <div className="selected-gateway-display">
                  <div className="gateway-icon-large">
                    <i className={`${gateway.icon} ${gateway.iconClass}`} />
                  </div>
                  <div className="gateway-info">
                    <span className="gateway-name text-uppercase">
                      {paymentMethod}
                    </span>
                    <span className="gateway-status">
                      <i className="fa-solid fa-shield-halved me-1" />{" "}
                      {t("checkout.secureConnection")}
                    </span>
                  </div>
                  <button
                    type="button"
                    className="btn-change-method ms-auto"
                    onClick={handleChangeMethod}
                  >
                    {t("checkout.change")}
                  </button>
                </div>
              </div>

              <div className="order-items-review mb-5">
                <h5 className="section-title mb-4">{t("checkout.itemsInOrder")}</h5>
                <div className="review-item-card">
                  <div className="item-icon">
                    <i className="fa-solid fa-gem" />
                  </div>
                  <div className="item-details">
                    <h6 className="fw-bold mb-1">{pack.name}</h6>
                    <div className="d-flex gap-3 small text-muted">
                      {pack.jobCredits != null && (
                        <span>
                          <i className="fa-solid fa-briefcase me-1" />{" "}
                          {t("checkout.jobsCount", { count: pack.jobCredits })}
                        </span>
                      )}
                      {pack.cvCredits != null && (
                        <span>
                          <i className="fa-solid fa-user-tie me-1" />{" "}
                          {t("checkout.cvsCount", { count: pack.cvCredits })}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="item-price ms-auto">{formattedTotal}</div>
                </div>
              </div>

              <div className="checkout-payment-widget mb-4">
                {method === "stripe" && stripePromise && (
                  <Elements stripe={stripePromise}>
                    <CheckoutForm
                      selectedPlan={selectedPlanForCheckout}
                      purchasePack={purchasePackWithRedirect}
                      paymentMethodName={formatPaymentMethod(paymentMethod)}
                      submitting={paymentLoading}
                    />
                  </Elements>
                )}

                {method === "paypal" && paypalGateway?.clientId && (
                  <PayPalScriptProvider
                    options={{
                      "client-id": paypalGateway.clientId,
                      currency: pack.currency || "MAD",
                      intent: "capture",
                      disableFunding: ["card"],
                    }}
                  >
                    <PayPalButtons
                      style={{ layout: "vertical" }}
                      disabled={paymentLoading}
                      createOrder={(data, actions) => {
                        return actions.order.create({
                          intent: "CAPTURE",
                          purchase_units: [
                            {
                              amount: {
                                currency_code: pack.currency || "MAD",
                                value: Number(pack.price).toFixed(2),
                              },
                            },
                          ],
                        });
                      }}
                      onApprove={async (data, actions) => {
                        if (paymentSubmittingRef.current) return;

                        try {
                          const details = await actions.order.capture();
                          const capture =
                            details?.purchase_units?.[0]?.payments
                              ?.captures?.[0];

                          if (!capture || capture.status !== "COMPLETED") {
                            navigate("/payment-failed", {
                              state: { error: t("checkout.paymentNotCompleted") },
                            });
                            return;
                          }

                          const result = await completePurchase({
                            paymentMethod: "PayPal",
                            orderID: details.id,
                            captureId: capture.id,
                            amount: capture.amount?.value,
                            currency: capture.amount?.currency_code,
                            payerEmail: details.payer?.email_address,
                            status: capture.status,
                          });

                          if (result?.success) {
                            navigate("/payment-success", {
                              state: {
                                payment: buildPaymentSuccessState(
                                  result.message,
                                  result.data,
                                  {
                                    amount: capture.amount?.value,
                                    currency: capture.amount?.currency_code,
                                    planName: pack.name,
                                  },
                                ),
                              },
                            });
                          } else {
                            navigate("/payment-failed", {
                              state: { error: t("checkout.planActivationFailed") },
                            });
                          }
                        } catch {
                          navigate("/payment-failed", {
                            state: {
                              error: t("checkout.paymentFailedCapture"),
                            },
                          });
                        }
                      }}
                      onCancel={() => {
                        navigate("/payment-failed", {
                          state: { error: t("checkout.paymentCancelledByUser") },
                        });
                      }}
                      onError={() => {
                        navigate("/payment-failed", {
                          state: {
                            error: t("checkout.paymentErrorTryAgain"),
                          },
                        });
                      }}
                    />
                  </PayPalScriptProvider>
                )}

                {method === "cmi" && (
                  <button
                    type="button"
                    className="btn-checkout-finalize w-100"
                    onClick={handleDemoPayment}
                    disabled={paymentLoading}
                  >
                    {paymentLoading ? t("checkout.processing") : t("checkout.confirmPayNow")}
                  </button>
                )}
              </div>

              <div className="trust-badges row g-3 mt-4">
                <div className="col-md-4">
                  <div className="trust-card">
                    <i className="fa-solid fa-lock" />
                    <span>{t("checkout.sslEncrypted")}</span>
                  </div>
                </div>
                <div className="col-md-4">
                  <div className="trust-card">
                    <i className="fa-solid fa-shield-check" />
                    <span>{t("checkout.safePayment")}</span>
                  </div>
                </div>
                <div className="col-md-4">
                  <div className="trust-card">
                    <i className="fa-solid fa-bolt" />
                    <span>{t("checkout.instantCredits")}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="col-lg-4">
            <div className="order-summary-sticky">
              <div className="summary-card">
                <h5 className="fw-bold mb-4">{t("checkout.orderSummary")}</h5>
                <div className="summary-row">
                  <span>{t("checkout.subtotal")}</span>
                  <span>{formattedTotal}</span>
                </div>
                <div className="summary-row">
                  <span>{t("checkout.taxesVat")}</span>
                  <span>0.00 {pack.currency}</span>
                </div>
                <div className="summary-divider my-4" />
                <div className="summary-total mb-4">
                  <div className="d-flex justify-content-between align-items-center">
                    <span className="total-label">{t("checkout.totalAmount")}</span>
                    <span className="total-val">{formattedTotal}</span>
                  </div>
                </div>
                {method !== "cmi" && method !== "paypal" && method !== "stripe" && (
                  <button
                    type="button"
                    className="btn-checkout-finalize w-100 mb-3"
                    disabled={paymentLoading}
                  >
                    {t("checkout.confirmPayNow")}
                  </button>
                )}
                <p className="text-center xsmall text-muted mb-0">
                  {t("checkout.termsAgreement")}{" "}
                  <Link to="/terms-condition">{t("checkout.termsOfService")}</Link>.
                </p>
              </div>
              <div className="back-link-wrap mt-4 text-center">
                <Link
                  to={returnTo}
                  className="text-decoration-none text-muted small"
                >
                  <i className="fa-solid fa-arrow-left me-2" /> {t("checkout.backToWallet")}
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style
        dangerouslySetInnerHTML={{
          __html: `
        @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;600;800&display=swap');

        .checkout-page-wrapper {
          font-family: 'Outfit', sans-serif;
          background-color: #f8fafc;
          min-height: 100vh;
          padding: 40px 0;
          color: #1e293b;
        }

        .checkout-main-card {
          background: white;
          border-radius: 32px;
          padding: 45px;
          box-shadow: 0 10px 40px rgba(0,0,0,0.03);
          border: 1px solid #f1f5f9;
        }

        .section-title {
          font-size: 14px;
          font-weight: 800;
          color: #1967d2;
          text-transform: uppercase;
          letter-spacing: 1.5px;
        }

        .selected-gateway-display {
          display: flex;
          align-items: center;
          background: #f8fafc;
          border: 1px solid #e2e8f0;
          padding: 24px;
          border-radius: 20px;
          gap: 20px;
        }

        .gateway-icon-large {
          width: 64px;
          height: 64px;
          background: white;
          border-radius: 16px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 32px;
          box-shadow: 0 4px 10px rgba(0,0,0,0.05);
        }

        .gateway-name { font-weight: 800; font-size: 18px; display: block; color: #0f172a; }
        .gateway-status { font-size: 12px; color: #10b981; font-weight: 600; display: flex; align-items: center; }

        .btn-change-method {
          background: white;
          border: 1px solid #e2e8f0;
          padding: 8px 16px;
          border-radius: 10px;
          font-size: 13px;
          font-weight: 700;
          color: #64748b;
          transition: all 0.2s;
        }
        .btn-change-method:hover { background: #f1f5f9; color: #1e293b; }

        .review-item-card {
          display: flex;
          align-items: center;
          padding: 20px;
          border: 1.5px solid #f1f5f9;
          border-radius: 20px;
          gap: 15px;
        }

        .item-icon {
          width: 48px;
          height: 48px;
          background: #eef2ff;
          color: #4f46e5;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 20px;
        }

        .item-price { font-weight: 800; font-size: 18px; color: #1e293b; }

        .trust-card {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 12px;
          background: #f8fafc;
          border-radius: 12px;
          font-size: 12px;
          font-weight: 700;
          color: #64748b;
        }
        .trust-card i { color: #10b981; font-size: 14px; }

        .summary-card {
          background: white;
          border-radius: 32px;
          padding: 35px;
          box-shadow: 0 20px 50px rgba(0,0,0,0.05);
          border: 1px solid #f1f5f9;
          position: sticky;
          top: 40px;
        }

        .summary-row {
          display: flex;
          justify-content: space-between;
          margin-bottom: 15px;
          font-weight: 600;
          color: #64748b;
        }

        .summary-divider { border-top: 1px dashed #e2e8f0; }

        .total-label { font-size: 14px; font-weight: 700; color: #0f172a; text-transform: uppercase; }
        .total-val { font-size: 28px; font-weight: 900; color: #1967d2; letter-spacing: -1px; }

        .btn-checkout-finalize {
          background: #1e293b;
          color: white;
          border: none;
          padding: 18px;
          border-radius: 18px;
          font-weight: 800;
          font-size: 16px;
          transition: all 0.3s;
          box-shadow: 0 10px 25px rgba(30, 41, 59, 0.2);
        }
        .btn-checkout-finalize:hover {
          background: #0f172a;
          transform: translateY(-2px);
          box-shadow: 0 15px 30px rgba(30, 41, 59, 0.3);
          color: white;
        }
        .btn-checkout-finalize:disabled {
          opacity: 0.7;
          transform: none;
        }

        .fw-800 { font-weight: 800; }
        .xsmall { font-size: 11px; }

        @media (max-width: 991px) {
          .checkout-main-card { padding: 30px; }
          .order-summary-sticky { margin-top: 30px; }
        }
      `,
        }}
      />
    </div>
  );
};

export default Checkout;
