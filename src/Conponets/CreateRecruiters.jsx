import { Link, useNavigate, useLocation } from "react-router-dom";

import { useState, useEffect } from "react";

import { API_BASE_URL } from "../Url/Url";

import { ToastContainer, toast } from "react-toastify";

import axios from "axios";

import { useTranslation } from "react-i18next";

import "./Recruiters.css";



function CreateRecruiters() {

  const { t } = useTranslation("global");

  const location = useLocation();

  const editData = location.state?.recruiterData;

  const isEditMode = Boolean(editData);



  const navigate = useNavigate();

  const [formData, setFormData] = useState({

    first_name: "",

    last_name: "",

    email: "",

    department: "",

    password: "",

  });

  const [loading, setLoading] = useState(false);



  useEffect(() => {

    if (isEditMode) {

      setFormData({

        first_name: editData.first_name || "",

        last_name: editData.last_name || "",

        email: editData.email || "",

        department: editData.department || "",

        password: "",

      });

    }

  }, [isEditMode, editData]);



  const handleChange = (e) => {

    const { name, value } = e.target;

    setFormData({ ...formData, [name]: value });

  };



  const handleSubmit = async (e) => {

    e.preventDefault();



    if (

      !formData.first_name ||

      !formData.last_name ||

      !formData.email ||

      !formData.department

    ) {

      toast.error(t("recruiters.all_fields_required"));

      return;

    }



    if (!isEditMode && !formData.password) {

      toast.error(t("recruiters.password_required"));

      return;

    }



    setLoading(true);



    try {

      const token = localStorage.getItem("token");



      const url = isEditMode

        ? `${API_BASE_URL}updateRecruiter/${editData._id}`

        : `${API_BASE_URL}addRecruiter`;



      const payload = isEditMode

        ? {

            first_name: formData.first_name,

            last_name: formData.last_name,

            email: formData.email,

            department: formData.department,

          }

        : formData;



      await axios.post(url, payload, {

        headers: {

          Authorization: `Bearer ${token}`,

          "Content-Type": "application/json",

        },

      });



      toast.success(

        isEditMode ? t("recruiters.updated_success") : t("recruiters.added_success"),

      );



      navigate("/manage-recruiter");

    } catch (error) {

      toast.error(error.response?.data?.message || t("header.something_wrong"));

    } finally {

      setLoading(false);

    }

  };



  const pageTitle = isEditMode

    ? t("recruiters.update_recruiter")

    : t("recruiters.add_new_recruiter");



  return (

    <>

      <ToastContainer />

      <div className="main-dashboard-content d-flex flex-column">

        <div className="responsive-content">

          <div className="breadcrumb-area">

            <h1>{pageTitle}</h1>

            <ol className="recruiters-breadcrumb">

              <li>

                <Link to="/">{t("header.home")}</Link>

                <span>&gt;</span>

              </li>

              <li>

                <Link to="/employer-dashboard">{t("header.dashboard")}</Link>

                <span>&gt;</span>

              </li>

              <li>

                <Link to="/manage-recruiter">{t("sidebar.manage_recruiters")}</Link>

                <span>&gt;</span>

              </li>

              <li className="current">

                {isEditMode ? t("recruiters.edit") : t("recruiters.create")}

              </li>

            </ol>

          </div>



          <div className="my-profile-area">

            <div className="recruiters-page-card">

              <h4 className="recruiters-form-section-title">

                {t("recruiters.recruiter_information")}

              </h4>

              <p className="recruiters-form-section-subtitle">

                {t("recruiters.recruiter_form_subtitle")}

              </p>



              <div className="profile-form">

                <form onSubmit={handleSubmit}>

                  <div className="row">

                    <div className="col-lg-6 col-md-6">

                      <div className="form-group">

                        <label>{t("recruiters.first_name")}</label>

                        <input

                          className="form-control"

                          type="text"

                          name="first_name"

                          placeholder={t("recruiters.first_name_placeholder")}

                          value={formData.first_name}

                          onChange={handleChange}

                        />

                      </div>

                    </div>

                    <div className="col-lg-6 col-md-6">

                      <div className="form-group">

                        <label>{t("recruiters.last_name")}</label>

                        <input

                          className="form-control"

                          type="text"

                          name="last_name"

                          placeholder={t("recruiters.last_name_placeholder")}

                          value={formData.last_name}

                          onChange={handleChange}

                        />

                      </div>

                    </div>

                    <div className="col-lg-6 col-md-6">

                      <div className="form-group">

                        <label>{t("recruiters.email_address")}</label>

                        <input

                          className="form-control"

                          type="email"

                          name="email"

                          placeholder={t("recruiters.email_placeholder")}

                          value={formData.email}

                          onChange={handleChange}

                        />

                      </div>

                    </div>

                    <div className="col-lg-6 col-md-6">

                      <div className="form-group">

                        <label>{t("recruiters.department")}</label>

                        <input

                          className="form-control"

                          type="text"

                          name="department"

                          placeholder={t("recruiters.department_placeholder")}

                          value={formData.department}

                          onChange={handleChange}

                        />

                      </div>

                    </div>

                    {!isEditMode && (

                      <div className="col-lg-6 col-md-6">

                        <div className="form-group">

                          <label>{t("recruiters.temporary_password")}</label>

                          <input

                            className="form-control"

                            type="password"

                            name="password"

                            placeholder={t("recruiters.temporary_password")}

                            value={formData.password}

                            onChange={handleChange}

                          />

                        </div>

                      </div>

                    )}

                  </div>



                  <div className="recruiters-form-actions">

                    <button type="submit" className="default-btn btn" disabled={loading}>

                      <i className="fa-solid fa-plus" />

                      {loading

                        ? t("recruiters.submitting")

                        : isEditMode

                          ? t("recruiters.update_recruiter")

                          : t("recruiters.create_recruiter")}

                    </button>

                    <Link to="/manage-recruiter" className="recruiters-cancel-link">

                      {t("recruiters.cancel")}

                    </Link>

                  </div>

                </form>

              </div>

            </div>

          </div>



          <div className="copy-right-area bg-f0f4fc">

            <div className="row">

              <div className="col-lg-6 col-md-6">

                <div className="copyright-left-content">

                  <p>

                    <span className="copy">© </span>

                    <span id="year" />

                    <span className="template-name"> {t("header.Connect_Work")} </span>

                    {t("header.All_Rights_Reserved")}

                  </p>

                </div>

              </div>

              <div className="col-lg-6 col-md-6">

                <div className="copyright-right-content">

                  <p>

                    {t("header.Designed_By")}{" "}

                    <a href="https://hibootstrap.com/" target="_blank" rel="noreferrer">

                      {t("header.Webnmobapps_Solution_Pvt_Ltd")}

                    </a>

                  </p>

                </div>

              </div>

            </div>

          </div>

        </div>

      </div>

    </>

  );

}



export default CreateRecruiters;

