import React, { useRef } from "react";

import { useTranslation } from "react-i18next";

import { CardElement, useStripe, useElements } from "@stripe/react-stripe-js";

import { toast } from "react-toastify";



const CheckoutForm = ({

  selectedPlan,

  purchasePack,

  paymentMethodName = "Stripe",

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



      const { error, paymentMethod: stripePaymentMethod } =

        await stripe.createPaymentMethod({

          type: "card",

          card: cardElement,

        });



      if (error) {

        toast.error(error.message);

        return;

      }



      await purchasePack({

        paymentMethod: paymentMethodName,

        paymentMethodId: stripePaymentMethod.id,

      });

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



export default CheckoutForm;


