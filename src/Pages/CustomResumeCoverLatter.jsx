import React from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

const CustomResumeCoverLatter = () => {
  const { t } = useTranslation("global");

  return (
    <>
      <div className="page-banner-area bg-f0f4fc">
        <div className="container">
          <div className="page-banner-content">
            <h1>{t("resume.custom_cover_title")}</h1>
            <ul>
              <li>
                <a href="index-2.html">{t("header.home")}</a>
              </li>
              <li>{t("resume.custom_cover_title")}</li>
            </ul>
          </div>
        </div>
      </div>
      <section className="custom-resume-cover-letter-job-seeker-info">
        <div className="container">
          <div className="row">
            <div className="custom-resume-cover-letter-heading">
              <h4>{t("resume.edit_profile_details")}</h4>
            </div>
          </div>
          <div className="row">
            <div className="custom-resume-cover-letter-candidate-detail">
              <div className="custom-resume-cover-letter-candidates-img-detail-info">
                <div className="custom-resume-cover-letter-candidates-img-info">
                  <img
                    src="assets/images/dashboard/dashboard-img-5.jpg"
                    alt="Image"
                  />
                  <div className="custom-resume-cover-letter-img-edit-icon">
                    <i className="fas fa-pencil-alt" />
                  </div>
                </div>
                <div className="custom-resume-cover-letter-candidates-details-info">
                  <h3>
                    <strong>{t("header.name")}:</strong> Andy Smith
                  </h3>
                  <h3>
                    <strong>{t("resume.position")}:</strong> Website Desginer
                  </h3>
                  <h3>
                    <strong>{t("header.email")}:</strong> andysmith@gmail.com
                  </h3>
                  <h3>
                    <strong>{t("resume.contact")}:</strong> +567 908 234 875
                  </h3>
                  <h3>
                    <strong>{t("resume.address")}:</strong> New York, USA
                  </h3>
                </div>
              </div>
              <div className="custom-resume-cover-letter-website-promotion">
                <ul>
                  <li>
                    <i className="fa-regular fa-clock" />
                    {t("resume.get_hired_faster")}
                  </li>
                  <li>
                    <i className="fa-solid fa-signal" />
                    {t("resume.attract_more_offers")}
                  </li>
                  <li>
                    <i className="fa-regular fa-star" />
                    {t("resume.top_employers_offers")}
                  </li>
                </ul>
              </div>
            </div>
          </div>
          <div className="custom-resume-cover-letter-detail-info">
            <div className="row">
              <div className="custom-resume-cover-letter-heading">
                <h4>{t("resume.personal_details")}</h4>
              </div>
              <div className="resume-cover-letter-divder-line-info" />
              <div className="custom-resume-cover-user-detail-info">
                <div className="custom-resume-cover-job-seeker-info">
                  <div className="custom-resume-cover-job-seeker">
                    <h4>{t("resume.first_name")}</h4>
                    <p>Jhama</p>
                  </div>
                  <div className="custom-resume-cover-job-seeker">
                    <h4>{t("resume.last_name")}</h4>
                    <p>Kumari</p>
                  </div>
                  <div className="custom-resume-cover-user-edit">
                    <i className="fas fa-pencil-alt" />
                  </div>
                </div>
                <div className="resume-cover-letter-divder-line-info" />
                <div className="custom-resume-cover-job-seeker-info">
                  <div className="custom-resume-cover-job-seeker">
                    <h4>{t("header.email")}</h4>
                    <p>mobappssolutions142@gmail.com</p>
                  </div>
                  <div className="custom-resume-cover-job-seeker">
                    <h4>{t("resume.phone_number")}</h4>
                    <p>9874563214</p>
                  </div>
                </div>
                <div className="resume-cover-letter-divder-line-info" />
                <div className="custom-resume-cover-job-seeker-info">
                  <div className="custom-resume-cover-job-seeker">
                    <h4>{t("resume.year_of_birth")}</h4>
                    <p>2025</p>
                  </div>
                  <div className="custom-resume-cover-job-seeker">
                    <h4>{t("resume.gender_identity")}</h4>
                    <p>Male</p>
                  </div>
                </div>
                <div className="resume-cover-letter-divder-line-info" />
                <div className="custom-resume-cover-job-seeker-info">
                  <div className="custom-resume-cover-job-seeker">
                    <h4>{t("header.City")}</h4>
                    <p>Noida</p>
                  </div>
                  <div className="custom-resume-cover-job-seeker">
                    <h4>{t("resume.nationality")}</h4>
                    <p>India</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="custom-resume-cover-letter-input-field-info-area">
              <div className="row">
                <div className="col-lg-6 col-md-6">
                  <div className="form-group">
                    <label>{t("resume.first_name")}</label>
                    <input className="form-control" type="text" placeholder="Jhama" />
                  </div>
                </div>
                <div className="col-lg-6 col-md-6">
                  <div className="form-group">
                    <label>{t("resume.last_name")}</label>
                    <input className="form-control" type="text" placeholder="Kumari" />
                  </div>
                </div>
                <div className="col-lg-6 col-md-6">
                  <div className="form-group">
                    <label>{t("header.email")}</label>
                    <input className="form-control" type="text" placeholder="hello@gmail.com" />
                  </div>
                </div>
                <div className="col-lg-6 col-md-6">
                  <div className="form-group">
                    <label>{t("resume.phone_number")}</label>
                    <input className="form-control" type="text" placeholder="9874563214" />
                  </div>
                </div>
                <div className="col-lg-6 col-md-6">
                  <div className="form-group">
                    <label>{t("resume.year_of_birth")}</label>
                    <input className="form-control" type="text" placeholder="1-8-2025" />
                  </div>
                </div>
                <div className="col-lg-6 col-md-6">
                  <div className="form-group">
                    <label>{t("resume.gender_identity")}</label>
                    <input className="form-control" type="text" placeholder="Male" />
                  </div>
                </div>
                <div className="col-lg-6 col-md-6">
                  <div className="form-group">
                    <label>{t("header.City")}</label>
                    <select className="form-select form-control" aria-label="City">
                      <option selected>Noida</option>
                      <option value={1}>Mau</option>
                      <option value={2}>Kanpur</option>
                      <option value={3}>Muradabad</option>
                    </select>
                  </div>
                </div>
                <div className="col-lg-6 col-md-6">
                  <div className="form-group">
                    <label>{t("resume.nationality")}</label>
                    <select className="form-select form-control" aria-label="Nationality">
                      <option selected>India</option>
                      <option value={1}>USA</option>
                      <option value={2}>UK</option>
                      <option value={3}>Paris</option>
                    </select>
                  </div>
                </div>
                <div className="custom-resume-cover-letter-save-cancel-btn">
                  <span className="default-btn btn">{t("resume.save")}</span>
                  <span className="default-btn btn">{t("header.Cancel")}</span>
                </div>
              </div>
            </div>
          </div>
          <div className="custom-resume-cover-letter-detail-info">
            <div className="row">
              <div className="custom-resume-cover-letter-heading">
                <h4>{t("resume.my_cvs")}</h4>
              </div>
              <div className="resume-cover-letter-divder-line-info" />
              <div className="custom-resume-cover-letter-upload-cv">
                <form>
                  <div className="row">
                    <div className="col-lg-12 col-md-12">
                      <div className="upload-download-dlt-cv">
                        <div className="upload-cv-info-area">
                          <p>
                            <i className="fas fa-file-alt" /> Workscope For Job Portal Platform like docx
                          </p>
                        </div>
                        <div className="download-dlt-cv">
                          <i className="fas fa-ellipsis-v" />
                          <div className="download-edit-info">
                            <ul>
                              <li>
                                <i className="fa-solid fa-arrow-down" /> {t("resume.download")}
                              </li>
                              <li>
                                <i className="fa-solid fa-trash" /> {t("header.Delete")}
                              </li>
                            </ul>
                          </div>
                        </div>
                      </div>
                      <div className="upload-cv-area">
                        <input type="file" name="avatar" accept=".pdf, .doc, .docx" />
                      </div>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </div>
          <div className="custom-resume-cover-letter-detail-info">
            <div className="row">
              <div className="custom-resume-cover-letter-heading">
                <h4>{t("resume.career_goals")}</h4>
              </div>
              <div className="resume-cover-letter-divder-line-info" />
              <div className="custom-resume-cover-user-detail-info">
                <div className="custom-resume-cover-job-seeker-info">
                  <div className="custom-resume-cover-job-seeker">
                    <h4>{t("resume.desired_job_title")}</h4>
                    <p>Website designer</p>
                  </div>
                  <div className="custom-resume-cover-job-seeker">
                    <h4>{t("resume.desired_employment_type")}</h4>
                    <p>Permanent contract</p>
                  </div>
                  <div className="custom-resume-cover-job-seeker">
                    <h4>{t("resume.desired_occupation_type")}</h4>
                    <p>{t("resume.full_time")}</p>
                  </div>
                  <div className="custom-resume-cover-user-edit">
                    <i className="fas fa-pencil-alt" />
                  </div>
                </div>
                <div className="resume-cover-letter-divder-line-info" />
                <div className="custom-resume-cover-job-seeker-info">
                  <div className="custom-resume-cover-job-seeker">
                    <h4>{t("resume.min_desired_salary")}</h4>
                    <p>€25 / Hourly</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="resume-cover-letter-divder-line-info" />
            <div className="custom-resume-cover-letter-input-field-info-area">
              <div className="row">
                <div className="col-lg-6 col-md-6">
                  <div className="form-group">
                    <label>{t("resume.desired_job_title")}</label>
                    <input className="form-control" type="text" placeholder={t("resume.desired_job_title")} />
                  </div>
                </div>
                <div className="col-lg-6 col-md-6">
                  <div className="form-group">
                    <label>{t("resume.desired_employment_type")}</label>
                    <select className="form-select form-control">
                      <option selected>{t("resume.select_employment_type")}</option>
                      <option value={1}>{t("resume.full_time")}</option>
                      <option value={2}>{t("resume.part_time")}</option>
                      <option value={3}>{t("resume.contract")}</option>
                      <option value={4}>{t("resume.temporary")}</option>
                      <option value={5}>{t("resume.apprenticeship")}</option>
                    </select>
                  </div>
                </div>
                <div className="col-lg-6 col-md-6">
                  <div className="form-group">
                    <label>{t("resume.desired_occupation_type")}</label>
                    <select className="form-select form-control">
                      <option value={3}>{t("resume.select_occupation_type")}</option>
                      <option selected>Skills and Interests</option>
                      <option value={1}>Industry</option>
                      <option value={2}>Healthcare</option>
                      <option value={3}>Technology</option>
                    </select>
                  </div>
                </div>
                <div className="col-lg-6 col-md-6">
                  <div className="form-group">
                    <label>{t("resume.min_desired_salary")}</label>
                    <input className="form-control" type="text" placeholder={t("resume.min_desired_salary")} />
                  </div>
                </div>
                <div className="custom-resume-cover-letter-save-cancel-btn">
                  <span className="default-btn btn">{t("resume.save")}</span>
                  <span className="default-btn btn">{t("header.Cancel")}</span>
                </div>
              </div>
            </div>
          </div>
          <div className="custom-resume-cover-letter-detail-info">
            <div className="row">
              <div className="custom-resume-cover-letter-heading">
                <h4>{t("resume.about_your_role")}</h4>
              </div>
              <div className="resume-cover-letter-divder-line-info" />
              <div className="custom-resume-cover-user-detail-info">
                <div className="custom-resume-cover-job-seeker-info">
                  <div className="custom-resume-cover-job-seeker">
                    <h4>{t("resume.job_title")}</h4>
                    <p>Website designer</p>
                  </div>
                  <div className="custom-resume-cover-job-seeker">
                    <h4>{t("resume.years_of_experience")}</h4>
                    <p>8</p>
                  </div>
                  <div className="custom-resume-cover-job-seeker">
                    <h4>{t("resume.job_category")}</h4>
                    <p>Web Development</p>
                  </div>
                  <div className="custom-resume-cover-user-edit">
                    <i className="fas fa-pencil-alt" />
                  </div>
                </div>
              </div>
            </div>
            <div className="resume-cover-letter-divder-line-info" />
            <div className="custom-resume-cover-letter-input-field-info-area">
              <div className="row">
                <div className="col-lg-6 col-md-6">
                  <div className="form-group">
                    <label>{t("resume.job_title")}</label>
                    <input className="form-control" type="text" placeholder={t("resume.job_title")} />
                  </div>
                </div>
                <div className="col-lg-6 col-md-6">
                  <div className="form-group">
                    <label>{t("resume.years_of_experience")}</label>
                    <input className="form-control" type="text" placeholder={t("resume.years_of_experience")} />
                  </div>
                </div>
                <div className="col-lg-6 col-md-6">
                  <div className="form-group">
                    <label>{t("resume.job_category")}</label>
                    <select className="form-select form-control">
                      <option selected>Digital</option>
                      <option value={1}>Website Desgin</option>
                      <option value={2}>Php</option>
                      <option value={3}>Testing</option>
                      <option value={4}>Team Leader</option>
                    </select>
                  </div>
                </div>
                <div className="custom-resume-cover-letter-save-cancel-btn">
                  <span className="default-btn btn">{t("resume.save")}</span>
                  <span className="default-btn btn">{t("header.Cancel")}</span>
                </div>
              </div>
            </div>
          </div>
          <div className="custom-resume-cover-letter-detail-info">
            <div className="row">
              <div className="custom-resume-cover-letter-heading">
                <h4>{t("header.Work_Experience")}</h4>
              </div>
              <div className="resume-cover-letter-divder-line-info" />
              <div className="custom-resume-cover-user-detail-info">
                <div className="custom-resume-cover-job-seeker-info">
                  <div className="custom-resume-cover-job-seeker">
                    <h4>Website designer</h4>
                    <p>Jun 2017 - Dec 2020</p>
                    <p>Marvel Studios</p>
                    <p>New York, NY</p>
                    <p>{t("resume.full_time")}</p>
                  </div>
                  <div className="custom-resume-cover-user-edit">
                    <i className="fas fa-pencil-alt" />
                  </div>
                </div>
                <div className="resume-cover-letter-divder-line-info" />
                <div className="custom-resume-cover-job-seeker-info">
                  <div className="custom-resume-cover-job-seeker">
                    <h4>{t("resume.description")}</h4>
                    <p>Led digital campaigns that increased client engagement by 35% year-over-year</p>
                  </div>
                </div>
                <div className="resume-cover-letter-divder-line-info" />
                <div className="custom-resume-cover-job-seeker-info">
                  <div className="custom-resume-cover-job-seeker">
                    <h4>{t("resume.salary")}</h4>
                    <p>2000</p>
                  </div>
                </div>
                <div className="resume-cover-letter-divder-line-info" />
                <div className="custom-resume-cover-job-seeker-info">
                  <div className="custom-resume-cover-job-seeker">
                    <h4>{t("resume.payroll_frequency")}</h4>
                    <p>{t("resume.monthly")}</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="resume-cover-letter-divder-line-info" />
            <div className="custom-resume-cover-letter-input-field-info-area">
              <div className="row">
                <div className="col-lg-6 col-md-6">
                  <div className="form-group">
                    <label>{t("resume.job_title")}</label>
                    <input className="form-control" type="text" placeholder={t("resume.job_title")} />
                  </div>
                </div>
                <div className="col-lg-6 col-md-6">
                  <div className="form-group">
                    <label>{t("resume.company_name")}</label>
                    <input className="form-control" type="text" placeholder={t("resume.company_name")} />
                  </div>
                </div>
                <div className="col-lg-6 col-md-6">
                  <div className="form-group">
                    <label>{t("resume.start_date")}</label>
                    <input className="form-control" type="date" />
                  </div>
                </div>
                <div className="col-lg-6 col-md-6">
                  <div className="form-group">
                    <label>{t("resume.end_date")}</label>
                    <input className="form-control" type="date" />
                  </div>
                </div>
                <div className="col-lg-12 col-md-12">
                  <div className="form-group">
                    <div className="currently-working-here">
                      <input type="checkbox" id="CurrentlyWorking" name="CurrentlyWorking" />
                      <label htmlFor="vehicle1"> {t("resume.currently_working_here")}</label>
                    </div>
                  </div>
                </div>
                <div className="col-lg-12 col-md-12">
                  <div className="form-group">
                    <label>{t("resume.description")}</label>
                    <textarea className="form-control" placeholder={t("resume.description_placeholder")} rows={3} defaultValue="" />
                  </div>
                </div>
                <div className="col-lg-6 col-md-6">
                  <div className="form-group">
                    <label>{t("resume.employment_type")}</label>
                    <select className="form-select form-control">
                      <option selected>{t("resume.choose")}</option>
                      <option value={1}>{t("resume.part_time")}</option>
                      <option value={2}>{t("resume.full_time")}</option>
                    </select>
                  </div>
                </div>
                <div className="col-lg-6 col-md-6">
                  <div className="form-group">
                    <label>{t("resume.work_location")}</label>
                    <select className="form-select form-control">
                      <option selected>{t("resume.choose")}</option>
                      <option value={1}>Development</option>
                      <option value={2}>Information IT</option>
                      <option value={3}>Corporate Job</option>
                    </select>
                  </div>
                </div>
                <div className="col-lg-3 col-md-3">
                  <div className="form-group">
                    <label>{t("resume.position_salary")}</label>
                    <select className="form-select form-control">
                      <option selected>EUR</option>
                      <option value={1}>USD</option>
                    </select>
                  </div>
                </div>
                <div className="col-lg-9 col-md-9">
                  <div className="form-group">
                    <label>{t("resume.enter_salary")}</label>
                    <input className="form-control" type="text" placeholder={t("resume.enter_salary")} />
                  </div>
                </div>
                <div className="col-lg-12 col-md-12">
                  <div className="form-group">
                    <select className="form-select form-control">
                      <option selected>{t("resume.select_payroll_frequency")}</option>
                      <option value={1}>{t("resume.weekly")}</option>
                      <option value={2}>{t("resume.monthly")}</option>
                    </select>
                  </div>
                </div>
                <div className="custom-resume-cover-letter-save-cancel-btn">
                  <span className="default-btn btn">{t("resume.save")}</span>
                  <span className="default-btn btn">{t("header.Cancel")}</span>
                </div>
              </div>
            </div>
          </div>
          <div className="custom-resume-cover-letter-detail-info">
            <div className="row">
              <div className="custom-resume-cover-letter-heading">
                <h4>{t("header.Education")}</h4>
              </div>
              <div className="resume-cover-letter-divder-line-info" />
              <div className="custom-resume-cover-user-detail-info">
                <div className="custom-resume-cover-job-seeker-info">
                  <div className="custom-resume-cover-job-seeker">
                    <h4>{t("resume.schools")}</h4>
                    <p>12<sup>th</sup></p>
                  </div>
                  <div className="custom-resume-cover-job-seeker">
                    <h4>{t("resume.school_name")}</h4>
                    <p>University of Oxford</p>
                  </div>
                  <div className="custom-resume-cover-user-edit">
                    <i className="fas fa-pencil-alt" />
                  </div>
                </div>
                <div className="resume-cover-letter-divder-line-info" />
                <div className="custom-resume-cover-job-seeker-info">
                  <div className="custom-resume-cover-job-seeker">
                    <h4>{t("resume.start_date")}</h4>
                    <p>02 / 2025</p>
                  </div>
                  <div className="custom-resume-cover-job-seeker">
                    <h4>{t("resume.end_date")}</h4>
                    <p>02 / 2045</p>
                  </div>
                </div>
                <div className="resume-cover-letter-divder-line-info" />
                <div className="custom-resume-cover-job-seeker-info">
                  <div className="custom-resume-cover-job-seeker">
                    <h4>{t("resume.degree")}</h4>
                    <p>2025</p>
                  </div>
                  <div className="custom-resume-cover-job-seeker">
                    <h4>{t("resume.end_date")}</h4>
                    <p>02 / 2045</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="custom-resume-cover-letter-input-field-info-area">
              <div className="row">
                <div className="col-lg-6 col-md-6">
                  <div className="form-group">
                    <label>{t("resume.school")}</label>
                    <input className="form-control" type="text" placeholder={t("resume.school")} />
                  </div>
                </div>
                <div className="col-lg-6 col-md-6">
                  <div className="form-group">
                    <label>{t("resume.school_name")}</label>
                    <input className="form-control" type="text" placeholder="Kumari" />
                  </div>
                </div>
                <div className="col-lg-6 col-md-6">
                  <div className="form-group">
                    <label>{t("resume.start_date")}</label>
                    <input className="form-control" type="date" />
                  </div>
                </div>
                <div className="col-lg-6 col-md-6">
                  <div className="form-group">
                    <label>{t("resume.end_date")}</label>
                    <input className="form-control" type="date" />
                  </div>
                </div>
                <div className="col-lg-6 col-md-6">
                  <div className="form-group">
                    <label>{t("resume.degree")}</label>
                    <input className="form-control" type="text" placeholder={t("resume.degree")} />
                  </div>
                </div>
                <div className="col-lg-6 col-md-6">
                  <div className="form-group">
                    <label>{t("resume.university")}</label>
                    <input className="form-control" type="text" placeholder={t("resume.university_name")} />
                  </div>
                </div>
                <div className="col-lg-12 col-md-12">
                  <div className="form-group">
                    <input type="checkbox" id="studying" name="CurrentlyWorking" />
                    <label htmlFor="vehicle1"> {t("resume.currently_studying")}</label>
                  </div>
                </div>
                <div className="custom-resume-cover-letter-save-cancel-btn">
                  <span className="default-btn btn">{t("resume.save")}</span>
                  <span className="default-btn btn">{t("header.Cancel")}</span>
                </div>
              </div>
            </div>
          </div>
          <div className="custom-resume-cover-letter-detail-info">
            <div className="row">
              <div className="custom-resume-cover-letter-heading">
                <h4>{t("resume.skills_technologies")}</h4>
              </div>
              <div className="resume-cover-letter-divder-line-info" />
              <div className="custom-resume-cover-letter-add-skill">
                <form>
                  <div className="row">
                    <div className="col-lg-12 col-md-12">
                      <div className="enter-skill-info">
                        <div className="form-group">
                          <input className="form-control" type="url" placeholder={t("resume.enter_skills")} />
                        </div>
                        <div className="skill-btn-info">
                          <a href="#" className="default-btn btn">{t("resume.add_skills")}</a>
                        </div>
                      </div>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </div>
          <div className="custom-resume-cover-letter-detail-info">
            <div className="row">
              <div className="custom-resume-cover-letter-heading">
                <h4>{t("header.Languages")}</h4>
              </div>
              <div className="resume-cover-letter-divder-line-info" />
              <div className="custom-resume-cover-letter-input-field-info-area">
                <div className="row">
                  <div className="col-lg-6 col-md-6">
                    <div className="form-group">
                      <label>{t("resume.language")}</label>
                      <select className="form-select form-control">
                        <option selected>Brazil</option>
                        <option value={1}>USA</option>
                      </select>
                    </div>
                  </div>
                  <div className="col-lg-6 col-md-6">
                    <div className="form-group">
                      <label>{t("resume.language_skills")}</label>
                      <select className="form-select form-control">
                        <option selected>Basic (A1/A2)</option>
                        <option value={3}>Native / Bilingual (C2)</option>
                      </select>
                    </div>
                  </div>
                  <div className="custom-resume-cover-letter-save-cancel-btn">
                    <span className="default-btn btn">{t("resume.save")}</span>
                    <span className="default-btn btn">{t("header.Cancel")}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="custom-resume-cover-letter-detail-info">
            <div className="row">
              <div className="custom-resume-cover-letter-heading">
                <h4>{t("header.Certifications")}</h4>
              </div>
              <div className="resume-cover-letter-divder-line-info" />
              <div className="custom-resume-cover-letter-input-field-info-area">
                <div className="row">
                  <div className="col-lg-6 col-md-6">
                    <div className="form-group">
                      <label>{t("resume.certificate_title")}</label>
                      <input className="form-control" type="text" placeholder={t("resume.certificate_title")} />
                    </div>
                  </div>
                  <div className="col-lg-6 col-md-6">
                    <div className="form-group">
                      <label>{t("resume.issue_date")}</label>
                      <input className="form-control" type="url" placeholder="YYYY" />
                    </div>
                  </div>
                  <div className="custom-resume-cover-letter-save-cancel-btn">
                    <span className="default-btn btn">{t("resume.save")}</span>
                    <span className="default-btn btn">{t("header.Cancel")}</span>
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

export default CustomResumeCoverLatter;
