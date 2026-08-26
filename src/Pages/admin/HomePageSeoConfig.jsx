import React, { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";
import Switch from "@mui/material/Switch";
import {
  EMPTY_HOME_PAGE_SEO,
  fetchHomePageSeoConfig,
  normalizeHomePageSeoConfig,
  updateHomePageSeoConfig,
} from "../../utils/homePageSeoApi";
import { validateImageFile } from "../../utils/fileUploadLimits";

const updateNested = (setForm, path, value) => {
  setForm((prev) => {
    const next = { ...prev };
    const keys = path.split(".");
    let cursor = next;
    for (let i = 0; i < keys.length - 1; i += 1) {
      cursor[keys[i]] = { ...cursor[keys[i]] };
      cursor = cursor[keys[i]];
    }
    cursor[keys[keys.length - 1]] = value;
    return next;
  });
};

function HomePageSeoConfig() {
  const { t } = useTranslation("global");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState(EMPTY_HOME_PAGE_SEO);
  const [ogImageFile, setOgImageFile] = useState(null);
  const [organizationLogoFile, setOrganizationLogoFile] = useState(null);

  const loadConfig = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetchHomePageSeoConfig();
      setForm(normalizeHomePageSeoConfig(res.data));
      setOgImageFile(null);
      setOrganizationLogoFile(null);
    } catch (error) {
      console.error(error);
      toast.error(t("homePageSeo.load_error"));
    } finally {
      setLoading(false);
    }
  }, [t]);

  useEffect(() => {
    loadConfig();
  }, [loadConfig]);

  const handleImageSelect = (event, type) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const validation = validateImageFile(file, t);
    if (!validation.ok) {
      toast.error(validation.message);
      event.target.value = "";
      return;
    }

    if (type === "ogImage") setOgImageFile(file);
    if (type === "organizationLogo") setOrganizationLogoFile(file);
  };

  const handleSave = async (event) => {
    event.preventDefault();
    setSaving(true);
    try {
      await updateHomePageSeoConfig(form, {
        ogImage: ogImageFile,
        organizationLogo: organizationLogoFile,
      });
      toast.success(t("homePageSeo.saved"));
      await loadConfig();
    } catch (error) {
      console.error(error);
      toast.error(t("homePageSeo.save_error"));
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <section className="job-card-list-info-area">
        <div className="container py-5 text-center">
          <div className="spinner-border text-primary" role="status" />
        </div>
      </section>
    );
  }

  return (
    <section className="job-card-list-info-area">
      <div className="container">
        <div className="main-dashboard-content d-flex flex-column mb-4">
          <div className="breadcrumb-area">
            <h1>{t("homePageSeo.title")}</h1>
            <ol className="breadcrumb">
              <li className="item">
                <Link to="/">{t("header.home")}</Link>
              </li>
              <li className="item">
                <i className="fa-solid fa-angle-right" /> {t("homePageSeo.title")}
              </li>
            </ol>
          </div>
        </div>

        <form onSubmit={handleSave}>
          <div className="profile-form-content p-4 border rounded bg-white mb-4">
            <div className="d-flex justify-content-between align-items-center">
              <div>
                <h4 className="mb-1">{t("homePageSeo.status_title")}</h4>
                <p className="text-muted small mb-0">
                  {t("homePageSeo.status_description")}
                </p>
              </div>
              <div className="d-flex align-items-center gap-2">
                <span className="small text-muted">
                  {form.isActive
                    ? t("homePageSeo.active")
                    : t("homePageSeo.inactive")}
                </span>
                <Switch
                  checked={Boolean(form.isActive)}
                  onChange={(e) =>
                    setForm((prev) => ({ ...prev, isActive: e.target.checked }))
                  }
                />
              </div>
            </div>
          </div>

          <div className="profile-form-content p-4 border rounded bg-white mb-4">
            <h4 className="mb-3">{t("homePageSeo.meta_title")}</h4>
            <div className="row">
              <div className="col-md-6">
                <div className="form-group mb-3">
                  <label>{t("homePageSeo.page_title")}</label>
                  <input
                    className="form-control"
                    value={form.title}
                    onChange={(e) =>
                      setForm((prev) => ({ ...prev, title: e.target.value }))
                    }
                  />
                </div>
              </div>
              <div className="col-md-6">
                <div className="form-group mb-3">
                  <label>{t("homePageSeo.robots")}</label>
                  <input
                    className="form-control"
                    value={form.robots}
                    onChange={(e) =>
                      setForm((prev) => ({ ...prev, robots: e.target.value }))
                    }
                  />
                </div>
              </div>
              <div className="col-12">
                <div className="form-group mb-3">
                  <label>{t("homePageSeo.description")}</label>
                  <textarea
                    className="form-control"
                    rows={3}
                    value={form.description}
                    onChange={(e) =>
                      setForm((prev) => ({
                        ...prev,
                        description: e.target.value,
                      }))
                    }
                  />
                </div>
              </div>
              <div className="col-12">
                <div className="form-group mb-3">
                  <label>{t("homePageSeo.keywords")}</label>
                  <input
                    className="form-control"
                    placeholder="jobs, careers, morocco, freelance"
                    value={form.keywords}
                    onChange={(e) =>
                      setForm((prev) => ({
                        ...prev,
                        keywords: e.target.value,
                      }))
                    }
                  />
                </div>
              </div>
              <div className="col-md-6">
                <div className="form-group mb-3">
                  <label>{t("homePageSeo.canonical_url")}</label>
                  <input
                    className="form-control"
                    type="url"
                    value={form.canonicalUrl}
                    onChange={(e) =>
                      setForm((prev) => ({
                        ...prev,
                        canonicalUrl: e.target.value,
                      }))
                    }
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="profile-form-content p-4 border rounded bg-white mb-4">
            <h4 className="mb-3">{t("homePageSeo.og_title_section")}</h4>
            <div className="row">
              <div className="col-md-6">
                <div className="form-group mb-3">
                  <label>{t("homePageSeo.og_title")}</label>
                  <input
                    className="form-control"
                    value={form.ogTitle}
                    onChange={(e) =>
                      setForm((prev) => ({ ...prev, ogTitle: e.target.value }))
                    }
                  />
                </div>
              </div>
              <div className="col-md-6">
                <div className="form-group mb-3">
                  <label>{t("homePageSeo.og_image")}</label>
                  <input
                    className="form-control"
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleImageSelect(e, "ogImage")}
                  />
                  {form.ogImage ? (
                    <img
                      src={form.ogImage}
                      alt="OG preview"
                      className="mt-2"
                      style={{ maxHeight: 80 }}
                      loading="lazy"
                      decoding="async"
                    />
                  ) : null}
                </div>
              </div>
              <div className="col-12">
                <div className="form-group mb-3">
                  <label>{t("homePageSeo.og_description")}</label>
                  <textarea
                    className="form-control"
                    rows={2}
                    value={form.ogDescription}
                    onChange={(e) =>
                      setForm((prev) => ({
                        ...prev,
                        ogDescription: e.target.value,
                      }))
                    }
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="profile-form-content p-4 border rounded bg-white mb-4">
            <h4 className="mb-3">{t("homePageSeo.jsonld_title")}</h4>
            <div className="row mb-3">
              {[
                ["enableWebsiteSchema", t("homePageSeo.website_schema")],
                ["enableOrganizationSchema", t("homePageSeo.organization_schema")],
                ["enableJobPostingSchema", t("homePageSeo.job_posting_schema")],
              ].map(([key, label]) => (
                <div className="col-md-4" key={key}>
                  <div className="d-flex justify-content-between align-items-center border rounded p-3">
                    <span>{label}</span>
                    <Switch
                      checked={Boolean(form[key])}
                      onChange={(e) =>
                        setForm((prev) => ({ ...prev, [key]: e.target.checked }))
                      }
                    />
                  </div>
                </div>
              ))}
            </div>

            <h5 className="mb-3">{t("homePageSeo.website_section")}</h5>
            <div className="row">
              {[
                ["name", t("homePageSeo.website_name")],
                ["url", t("homePageSeo.website_url")],
                ["searchUrl", t("homePageSeo.search_url")],
              ].map(([key, label]) => (
                <div className="col-md-4" key={key}>
                  <div className="form-group mb-3">
                    <label>{label}</label>
                    <input
                      className="form-control"
                      value={form.website[key] || ""}
                      onChange={(e) =>
                        updateNested(setForm, `website.${key}`, e.target.value)
                      }
                    />
                  </div>
                </div>
              ))}
              <div className="col-12">
                <div className="form-group mb-3">
                  <label>{t("homePageSeo.website_description")}</label>
                  <textarea
                    className="form-control"
                    rows={2}
                    value={form.website.description || ""}
                    onChange={(e) =>
                      updateNested(
                        setForm,
                        "website.description",
                        e.target.value,
                      )
                    }
                  />
                </div>
              </div>
            </div>

            <h5 className="mb-3 mt-2">{t("homePageSeo.organization_section")}</h5>
            <div className="row">
              {[
                ["name", t("homePageSeo.org_name")],
                ["url", t("homePageSeo.org_url")],
                ["email", t("homePageSeo.org_email")],
                ["phone", t("homePageSeo.org_phone")],
              ].map(([key, label]) => (
                <div className="col-md-6" key={key}>
                  <div className="form-group mb-3">
                    <label>{label}</label>
                    <input
                      className="form-control"
                      value={form.organization[key] || ""}
                      onChange={(e) =>
                        updateNested(
                          setForm,
                          `organization.${key}`,
                          e.target.value,
                        )
                      }
                    />
                  </div>
                </div>
              ))}
              <div className="col-md-6">
                <div className="form-group mb-3">
                  <label>{t("homePageSeo.org_logo")}</label>
                  <input
                    className="form-control"
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleImageSelect(e, "organizationLogo")}
                  />
                  {form.organization.logo ? (
                    <img
                      src={form.organization.logo}
                      alt="Organization logo"
                      className="mt-2"
                      style={{ maxHeight: 80 }}
                      loading="lazy"
                      decoding="async"
                    />
                  ) : null}
                </div>
              </div>
              <div className="col-12">
                <div className="form-group mb-3">
                  <label>{t("homePageSeo.org_description")}</label>
                  <textarea
                    className="form-control"
                    rows={2}
                    value={form.organization.description || ""}
                    onChange={(e) =>
                      updateNested(
                        setForm,
                        "organization.description",
                        e.target.value,
                      )
                    }
                  />
                </div>
              </div>
              <div className="col-12">
                <div className="form-group mb-3">
                  <label>{t("homePageSeo.same_as")}</label>
                  <input
                    className="form-control"
                    placeholder="https://facebook.com/..., https://linkedin.com/..."
                    value={form.organization.sameAs || ""}
                    onChange={(e) =>
                      updateNested(
                        setForm,
                        "organization.sameAs",
                        e.target.value,
                      )
                    }
                  />
                </div>
              </div>
              {[
                ["streetAddress", t("homePageSeo.street")],
                ["addressLocality", t("homePageSeo.city")],
                ["addressRegion", t("homePageSeo.region")],
                ["postalCode", t("homePageSeo.postal_code")],
                ["addressCountry", t("homePageSeo.country")],
              ].map(([key, label]) => (
                <div className="col-md-4" key={key}>
                  <div className="form-group mb-3">
                    <label>{label}</label>
                    <input
                      className="form-control"
                      value={form.organization.address?.[key] || ""}
                      onChange={(e) =>
                        updateNested(
                          setForm,
                          `organization.address.${key}`,
                          e.target.value,
                        )
                      }
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <button type="submit" className="default-btn btn" disabled={saving}>
            {saving ? t("homePageSeo.saving") : t("homePageSeo.save")}
          </button>
        </form>
      </div>
    </section>
  );
}

export default HomePageSeoConfig;
