import React from "react";
import { CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import { toast } from "react-toastify";

const CheckoutForm = ({ selectedPlan, purchasePack }) => {
  const stripe = useStripe();
  const elements = useElements();

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
      await purchasePack({
        paymentMethod: "Stripe",
        paymentMethodId: paymentMethod.id,
      });
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

export default CheckoutForm;
