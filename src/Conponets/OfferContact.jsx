import { Link, useNavigate, useLocation } from "react-router-dom";
import { useState } from "react";
import { API_BASE_URL } from "../Url/Url";
import { ToastContainer, toast } from "react-toastify";
import axios from "axios";

function OfferContact() {
  const navigate = useNavigate();
  const location = useLocation();
  const { plan } = location.state || {};

  const [formData, setFormData] = useState({
    contactPerson: "",
    contactEmail: "",
    contactPhone: "",
    billingAddress: "",
    gstNumber: "",
    notes: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !formData.contactPerson ||
      !formData.contactEmail ||
      !formData.contactPhone ||
      !formData.billingAddress
    ) {
      toast.error("Please fill all required fields");
      return;
    }

    try {
      const payload = {
        companyId: localStorage.getItem("companyId"),
        packId: plan?._id,
        packName: plan?.packName,
        amount: plan?.amount,
        currency: plan?.currency,
        paymentType: "MANUAL",
        ...formData,
        status: "PENDING",
      };

      await axios.post(`${API_BASE_URL}/request-pack`, payload, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      toast.success("Your request has been submitted successfully!");
      setTimeout(() => {
        navigate("/employer-dashboard");
      }, 2000);
    } catch (error) {
      toast.error("Something went wrong");
    }
  };

  return (
    <>
      <ToastContainer />
      <div className="main-dashboard-content d-flex flex-column">
        <div className="responsive-content">
          {/* Breadcrumb */}
          <div className="breadcrumb-area">
            <h1>Plan Purchase Request</h1>
            <ol className="breadcrumb">
              <li className="item">
                <Link to="/">Home</Link>
              </li>
              <li className="item">
                <Link to="/employer-dashboard">
                  <i className="fa-solid fa-angle-right" /> Dashboard
                </Link>
              </li>
              <li className="item">
                <i className="fa-solid fa-angle-right" /> Request Plan
              </li>
            </ol>
          </div>

          {/* Plan Summary */}
          <div className="my-profile-area">
            <div className="profile-form-content">
              <h3>Plan Summary</h3>

              <div className="alert alert-info">
                <h5>{plan?.packName}</h5>
                <p>
                  Job Credits: {plan?.jobPostingCredits} <br />
                  CV Credits: {plan?.profileViewingCredits} <br />
                  Validity: {plan?.validityValue} {plan?.validityUnit} <br />
                  Price: {plan?.currency} {plan?.amount}
                </p>
              </div>

              {/* Form */}
              <div className="profile-form">
                <form onSubmit={handleSubmit}>
                  <div className="row">
                    <div className="col-lg-6">
                      <div className="form-group">
                        <label>Contact Person *</label>
                        <input
                          type="text"
                          name="contactPerson"
                          className="form-control"
                          onChange={handleChange}
                        />
                      </div>
                    </div>

                    <div className="col-lg-6">
                      <div className="form-group">
                        <label>Contact Email *</label>
                        <input
                          type="email"
                          name="contactEmail"
                          className="form-control"
                          onChange={handleChange}
                        />
                      </div>
                    </div>

                    <div className="col-lg-6">
                      <div className="form-group">
                        <label>Contact Phone *</label>
                        <input
                          type="text"
                          name="contactPhone"
                          className="form-control"
                          onChange={handleChange}
                        />
                      </div>
                    </div>

                    <div className="col-lg-6">
                      <div className="form-group">
                        <label>GST / Tax Number</label>
                        <input
                          type="text"
                          name="gstNumber"
                          className="form-control"
                          onChange={handleChange}
                        />
                      </div>
                    </div>

                    <div className="col-lg-12">
                      <div className="form-group">
                        <label>Billing Address *</label>
                        <textarea
                          name="billingAddress"
                          className="form-control"
                          rows="3"
                          onChange={handleChange}
                        ></textarea>
                      </div>
                    </div>

                    <div className="col-lg-12">
                      <div className="form-group">
                        <label>Special Notes</label>
                        <textarea
                          name="notes"
                          className="form-control"
                          rows="3"
                          onChange={handleChange}
                        ></textarea>
                      </div>
                    </div>
                  </div>

                  <button type="submit" className="default-btn btn mt-3">
                    Submit Request
                  </button>
                </form>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="copy-right-area bg-f0f4fc">
            <div className="row">
              <div className="col-lg-6">
                <p>© Connect Work.ma All Rights Reserved</p>
              </div>
              <div className="col-lg-6 text-end">
                <p>
                  Designed By{" "}
                  <a
                    href="https://hibootstrap.com/"
                    target="_blank"
                    rel="noreferrer"
                  >
                    Webnmobapps Solution Pvt. Ltd
                  </a>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default OfferContact;
