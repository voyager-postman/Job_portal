import { Link, useNavigate, useLocation } from "react-router-dom";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { API_BASE_URL } from "../Url/Url";
import { ToastContainer, toast } from "react-toastify";
import axios from "axios";

function OfferContact() {
  const { t } = useTranslation("global");
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
      toast.error(t("header.Please_fill_all_required_fields"));
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

      toast.success(t("wallet.requestSubmittedSuccess"));
      setTimeout(() => {
        navigate("/employer-dashboard");
      }, 2000);
    } catch (error) {
      toast.error(t("header.something_wrong"));
    }
  };

  return (
    <>
      <ToastContainer />
      <div className="main-dashboard-content d-flex flex-column">
        <div className="responsive-content">
          <div className="breadcrumb-area">
            <h1>{t("wallet.planPurchaseRequest")}</h1>
            <ol className="breadcrumb">
              <li className="item">
                <Link to="/">{t("header.home")}</Link>
              </li>
              <li className="item">
                <Link to="/employer-dashboard">
                  <i className="fa-solid fa-angle-right" /> {t("header.dashboard")}
                </Link>
              </li>
              <li className="item">
                <i className="fa-solid fa-angle-right" /> {t("wallet.requestPlan")}
              </li>
            </ol>
          </div>

          <div className="my-profile-area">
            <div className="profile-form-content">
              <h3>{t("wallet.planSummary")}</h3>

              <div className="alert alert-info">
                <h5>{plan?.packName}</h5>
                <p>
                  {t("wallet.jobCredits")}: {plan?.jobPostingCredits} <br />
                  {t("wallet.cvCredits")}: {plan?.profileViewingCredits} <br />
                  {t("wallet.validity")}: {plan?.validityValue} {plan?.validityUnit}{" "}
                  <br />
                  {t("wallet.price")}: {plan?.currency} {plan?.amount}
                </p>
              </div>

              <div className="profile-form">
                <form onSubmit={handleSubmit}>
                  <div className="row">
                    <div className="col-lg-6">
                      <div className="form-group">
                        <label>{t("wallet.contactPerson")}</label>
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
                        <label>{t("wallet.contactEmail")}</label>
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
                        <label>{t("wallet.contactPhone")}</label>
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
                        <label>{t("wallet.gstTaxNumber")}</label>
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
                        <label>{t("wallet.billingAddress")}</label>
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
                        <label>{t("wallet.specialNotes")}</label>
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
                    {t("wallet.submitRequest")}
                  </button>
                </form>
              </div>
            </div>
          </div>

          <div className="copy-right-area bg-f0f4fc">
            <div className="row">
              <div className="col-lg-6">
                <p>
                  © {t("header.Connect_Work")} {t("header.All_Rights_Reserved")}
                </p>
              </div>
              <div className="col-lg-6 text-end">
                <p>
                  {t("header.Designed_By")}{" "}
                  <a
                    href="https://hibootstrap.com/"
                    target="_blank"
                    rel="noreferrer"
                  >
                    {t("header.Webnmobapps_Solution_Pvt_Ltd")}
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
