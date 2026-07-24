export const buildPaymentSuccessState = (
  apiMessage,
  apiData = {},
  fallback = {},
) => {
  const paymentTransaction = apiData.paymentTransaction || {};
  const companyPack = apiData.companyPack || {};
  const invoice = apiData.invoice;

  const isPendingApproval =
    companyPack.activationStatus === "Pending" ||
    /waiting for admin approval/i.test(apiMessage || "");

  return {
    message:
      apiMessage ||
      (isPendingApproval
        ? "Payment successful. Waiting for admin approval."
        : "Pack activated successfully"),
    amount: paymentTransaction.amount ?? fallback.amount,
    currency: paymentTransaction.currency ?? fallback.currency,
    status: isPendingApproval
      ? "PENDING"
      : paymentTransaction.status || "COMPLETED",
    planName: paymentTransaction.planName ?? fallback.planName,
    orderID: paymentTransaction._id,
    captureId: paymentTransaction._id,
    invoiceNumber: invoice?.invoiceNumber,
    payerEmail: paymentTransaction.stripe?.billingEmail,
    isPendingApproval,
  };
};
