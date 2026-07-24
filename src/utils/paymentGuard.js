import { useCallback, useRef } from "react";

export const runWithPaymentGuard = async (guardRef, task) => {
  if (guardRef?.current) {
    return { success: false, duplicate: true };
  }

  guardRef.current = true;

  try {
    return await task();
  } finally {
    guardRef.current = false;
  }
};

export const usePaymentGuard = () => {
  const paymentGuardRef = useRef(false);

  const runGuardedPayment = useCallback(
    (task) => runWithPaymentGuard(paymentGuardRef, task),
    [],
  );

  const isPaymentSubmitting = useCallback(
    () => paymentGuardRef.current,
    [],
  );

  return { paymentGuardRef, runGuardedPayment, isPaymentSubmitting };
};
