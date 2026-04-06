import React from "react";
import { CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import { toast } from "react-toastify";

const CheckoutForm1 = ({ selectedPlan, purchasePack, resetPaymentState }) => {
  const stripe = useStripe();
  const elements = useElements();

  // const handleSubmit = async (e) => {
  //   e.preventDefault();

  //   if (!stripe || !elements) return;

  //   const cardElement = elements.getElement(CardElement);

  //   const { error, paymentMethod } = await stripe.createPaymentMethod({
  //     type: "card",
  //     card: cardElement,
  //   });

  //   if (error) {
  //     toast.error(error.message);
  //   } else {
  //     await purchasePack({
  //       paymentMethod: "Stripe",
  //       paymentMethodId: paymentMethod.id,
  //     });
  //   }
  // };
  //   const handleSubmit = async (e) => {
  //     e.preventDefault();

  //     if (!stripe || !elements) return;

  //     const cardElement = elements.getElement(CardElement);

  //     const { error, paymentMethod } = await stripe.createPaymentMethod({
  //       type: "card",
  //       card: cardElement,
  //     });

  //     if (error) {
  //       toast.error(error.message);
  //     } else {
  //       const result = await purchasePack({
  //         paymentMode: "Stripe", // ✅ REQUIRED
  //         paymentMethodId: paymentMethod.id, // ✅ REQUIRED
  //       });

  //       if (result?.success) {
  //         toast.success("Payment Successful");
  //         // window.location.href = "/jobPortal/payment-success";
  //       } else {
  //         toast.error("Payment failed");
  //         // window.location.href = "/jobPortal/payment-failed";
  //       }
  //     }
  //   };
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!stripe || !elements) return;

    const cardElement = elements.getElement(CardElement);

    const { error, paymentMethod } = await stripe.createPaymentMethod({
      type: "card",
      card: cardElement,
    });

    if (error) {
      toast.error(error.message);
    } else {
      const result = await purchasePack({
        paymentMode: "Stripe",
        paymentMethodId: paymentMethod.id,
      });

      if (result?.success) {
        toast.success("Payment Successful");

        resetPaymentState(); // ✅ NOW THIS WORKS
      } else {
        toast.error("Payment failed");
      }
    }
  };
  return (
    <form onSubmit={handleSubmit}>
      <div className="mb-3 p-2 border rounded">
        <CardElement />
      </div>

      <button className="btn btn-primary w-100">
        Pay {selectedPlan.amount}
      </button>
    </form>
  );
};

export default CheckoutForm1;
