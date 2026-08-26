import React from "react";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";
import { validateImageFile } from "../utils/fileUploadLimits";

const Setting = () => {
  const { t } = useTranslation("global");
  const [activeTab, setActiveTab] = useState("menu1");
  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const validation = validateImageFile(file, t);
    if (!validation.ok) {
      toast.error(validation.message);
      e.target.value = "";
    }
  };

  return (
    <>
      <section className="job-card-list-info-area">
        <div className="container">
          <div className="my-profile-area">
            <div className="profile-form-content">
              <h3>{t("settings.title")}</h3>
              <div className="company-profile-management-info">
                <div className="company-profile-management-tab">
                  <ul className="nav nav-tabs" role="tablist">
                    <li className="nav-item" role="presentation">
                      <a
                        className={`nav-link ${
                          activeTab === "menu1" ? "active" : ""
                        }`}
                        onClick={() => setActiveTab("menu1")}
                        data-bs-toggle="tab"
                      >
                        {t("settings.employer_profile_tab")}
                      </a>
                    </li>
                    <li className="nav-item" role="presentation">
                      <a
                        className={`nav-link ${
                          activeTab === "menu2" ? "active" : ""
                        }`}
                        onClick={() => setActiveTab("menu2")}
                      >
                        {t("settings.change_password_tab")}
                      </a>
                    </li>
                  </ul>
                </div>
                <div className="company-profile-management-input-form">
                  <div className="tab-content">
                    <div
                      className={`tab-pane fade ${
                        activeTab === "menu1" ? "show active" : ""
                      }`}
                      id="menu1"
                      role="tabpanel"
                    >
                      <div className="profile-form">
                        <form>
                          <div className="row">
                            <div className="col-lg-12 col-md-12">
                              <div className="form-group">
                                <label>{t("header.name")}</label>
                                <input
                                  className="form-control"
                                  type="text"
                                  placeholder={t("settings.enter_name")}
                                  name="name"
                                />
                              </div>
                            </div>
                            <div className="col-lg-12 col-md-12">
                              <div className="form-group">
                                <label>{t("header.email")}</label>
                                <input
                                  className="form-control"
                                  type="email"
                                  placeholder={t("settings.enter_email")}
                                  name="email"
                                />
                              </div>
                            </div>
                            <div className="col-lg-12 col-md-12">
                              <div className="form-group">
                                <label>{t("profile.phone_number")}</label>
                                <input
                                  className="form-control"
                                  type="number"
                                  placeholder={t("settings.enter_phone_number")}
                                  name="phone"
                                />
                              </div>
                            </div>
                            <div className="col-lg-12 col-md-12">
                              <div className="form-group">
                                <label>{t("settings.profile_photo")}</label>
                                <div className="upload-company-info-area">
                                  <div className="upload-company-img-preview">
                                    <img
                                      crossorigin="anonymous"
                                      src="/jobPortal/assets/images/logo.png"
                                      className="main-logo"
                                      alt={t("profile.image_preview")}
                                      loading="lazy"
                                      decoding="async"
                                    />
                                  </div>
                                  <div className="upload-company-input">
                                    <input
                                      type="file"
                                      id="imageInput"
                                      accept="image/*"
                                      placeholder={t("settings.profile_photo")}
                                    />
                                  </div>
                                  <div className="upload-company-file-name">
                                    <span className="file-name">
                                      {t("settings.no_selected_photo")}
                                    </span>
                                  </div>
                                  <div className="upload-company-file-btn">
                                    <label
                                      htmlFor="imageInput"
                                      className="custom-upload default-btn btn"
                                    >
                                      {t("settings.choose_img")}
                                    </label>
                                  </div>
                                </div>
                              </div>
                              <div className="employer-personal-info-btn">
                                <button className="default-btn btn">
                                  {t("settings.submit")}
                                </button>
                              </div>
                            </div>
                          </div>
                        </form>
                      </div>
                    </div>
                    <div
                      className={`tab-pane fade ${
                        activeTab === "menu2" ? "show active" : ""
                      }`}
                      id="menu2"
                      role="tabpanel"
                    >
                      <div className="profile-form">
                        <form>
                          <div className="row">
                            <div className="col-lg-12 col-md-12">
                              <div className="form-group">
                                <label>{t("settings.enter_new_password")}</label>
                                <input
                                  className="form-control"
                                  type="text"
                                  placeholder={t("settings.enter_new_password")}
                                  name="new_password"
                                />
                              </div>
                            </div>
                            <div className="col-lg-12 col-md-12">
                              <div className="form-group">
                                <label>{t("settings.enter_confirm_password")}</label>
                                <input
                                  className="form-control"
                                  type="text"
                                  placeholder={t("settings.enter_confirm_password")}
                                  name="confirm_password"
                                />
                              </div>
                            </div>
                            <div className="employer-personal-info-btn">
                              <button className="default-btn btn">
                                {t("settings.submit")}
                              </button>
                            </div>
                          </div>
                        </form>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Setting;
