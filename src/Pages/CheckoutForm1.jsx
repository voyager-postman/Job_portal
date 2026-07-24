import React, { useRef } from "react";

import { CardElement, useStripe, useElements } from "@stripe/react-stripe-js";

import { toast } from "react-toastify";

import { useTranslation } from "react-i18next";



const CheckoutForm1 = ({

  selectedPlan,

  purchasePack,

  resetPaymentState,

  submitting = false,

}) => {

  const { t } = useTranslation("global");

  const stripe = useStripe();

  const elements = useElements();

  const submittingRef = useRef(false);



  const handleSubmit = async (e) => {

    e.preventDefault();



    if (!stripe || !elements || submitting || submittingRef.current) return;



    submittingRef.current = true;



    try {

      const cardElement = elements.getElement(CardElement);



      const { error, paymentMethod } = await stripe.createPaymentMethod({

        type: "card",

        card: cardElement,

      });



      if (error) {

        toast.error(error.message);

        return;

      }



      const result = await purchasePack({

        paymentMode: "Stripe",

        paymentMethodId: paymentMethod.id,

      });



      if (result?.success) {

        toast.success(t("payment.payment_successful"));

        resetPaymentState();

      } else if (!result?.duplicate) {

        toast.error(t("payment.payment_failed"));

      }

    } finally {

      submittingRef.current = false;

    }

  };



  return (

    <form onSubmit={handleSubmit}>

      <div className="mb-3 p-2 border rounded">

        <CardElement />

      </div>



      <button

        type="submit"

        className="btn btn-primary w-100"

        disabled={!stripe || submitting}

      >

        {submitting

          ? t("checkout.processing")

          : t("checkout.payAmount", { amount: selectedPlan.amount })}

      </button>

    </form>

  );

};



export default CheckoutForm1;


