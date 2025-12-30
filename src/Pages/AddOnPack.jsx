import { Link } from "react-router-dom";
import React, { useEffect, useState } from "react";
import { API_BASE_URL } from "../Url/Url";
import { ToastContainer, toast } from "react-toastify";
import axios from "axios";
// Load Stripe.js

// Initialize Stripe with your publishable key
const AddOnPack = () => {
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchActivePacks = async () => {
      try {
        const token = localStorage.getItem("token");

        const res = await axios.get(
          `${API_BASE_URL}get/ActiveAddOns
`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (res.data.success) {
          setPlans(res.data.data || []);
        }
      } catch (error) {
        console.error("Failed to fetch plans", error);
      } finally {
        setLoading(false);
      }
    };

    fetchActivePacks();
  }, []);
  // const handleBuyNow = async (planId) => {
  //   try {
  //     const token = localStorage.getItem("token");

  //     const res = await axios.post(
  //       `${API_BASE_URL}company/purchase-pack`,
  //       { packId: planId },
  //       {
  //         headers: {
  //           Authorization: `Bearer ${token}`,
  //         },
  //       }
  //     );

  //     console.log("Purchase successful:", res.data);
  //     toast.success(`Plan purchased successfully: ${res.data.packName}`, {
  //       autoClose: 5000,
  //       theme: "colored",
  //     });
  //   } catch (error) {
  //     console.error("Purchase failed:", error.response || error);

  //     toast.error(
  //       `Purchase failed: ${error.response?.data?.message || error.message}`
  //     );
  //   }
  // };
  return (
    <>
      <ToastContainer />
      <section className="inner-banners-info-area">
        <div className="inner-banners-img-area">
          <img
            src="/jobPortal/assets/images/banner/inner-banner-img.jpg"
            alt="breadcrumb Img"
          />
        </div>
        <div className="inner-banners-title-info">
          <div className="container">
            <div className="row">
              <div className="col-lg-12 col-md-12 col-sm-12">
                <div className="inner-page-banner-title">
                  <h2>Add On Plan</h2>
                  <ul>
                    <li className="menu-divide-arrow">
                      <Link to="/">Home</Link>
                    </li>
                    <li>Add On Plan</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      <section className="plan-price-info-area">
        <div className="container">
          <div className="row">
            <div className="col-lg-12">
              <div className="section-title">
                <h2>Transparent Pricing Plan For You</h2>
                <p>Select the best plan that fits your needs</p>
              </div>
            </div>

            {/* Loading */}
            {loading && (
              <div className="col-12 text-center">
                <p>Loading plans...</p>
              </div>
            )}

            {/* No Plans */}
            {!loading && plans.length === 0 && (
              <div className="col-12 text-center">
                <p>No active Add On Plan available</p>
              </div>
            )}

            {/* Plans */}
            {plans.map((plan, index) => (
              <div className="col-lg-4 col-md-4" key={plan._id}>
                <div className="plan-price-box-info-area">
                  <div
                    className={`plan-price-heaing-info ${
                      index === 1
                        ? "card-header-orange"
                        : index === 2
                        ? "card-header-green"
                        : ""
                    }`}
                  >
                    <h4>{plan.packName}</h4>
                    <h5>
                      {plan.currency} {plan.amount}
                    </h5>
                  </div>

                  <div className="plan-price-detail-info">
                    <ul>
                      <li>Job Post Credit: {plan.jobPostingCredits} Credits</li>
                      <li>
                        Daily Job Posting Limit: {plan.dailyJobPostingLimit}
                      </li>
                      <li>
                        CV Viewing Credit: {plan.profileViewingCredits} Credits
                      </li>
                      <li>
                        Daily Profile Viewing Limit:{" "}
                        {plan.dailyProfileViewingLimit}
                      </li>
                      <li>
                        Valid for {plan.validityValue} {plan.validityUnit}
                      </li>
                    </ul>
                  </div>

                  <div className="plan-price-btn-info">
                    <button
                      className="plan-price-btn default-btn btn"
                      // onClick={() => handleBuyNow(plan._id)}
                    >
                      Buy Now
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
};

export default AddOnPack;
