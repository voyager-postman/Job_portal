import React, { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";
import Switch from "@mui/material/Switch";
import {
  EMPTY_JOBS_LISTING_SEO,
  fetchJobsListingSeoConfig,
  normalizeJobsListingSeoConfig,
  updateJobsListingSeoConfig,
} from "../../utils/jobsListingSeoApi";
import { validateImageFile } from "../../utils/fileUploadLimits";

function AdminJobsListingSeoSettings() {
  const { t } = useTranslation("global");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState(EMPTY_JOBS_LISTING_SEO);
  const [ogImageFile, setOgImageFile] = useState(null);

  const loadConfig = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetchJobsListingSeoConfig();
      setForm(normalizeJobsListingSeoConfig(res.data));
      setOgImageFile(null);
    } catch (error) {
      console.error(error);
      toast.error(t("jobsListingSeo.load_error"));
    } finally {
      setLoading(false);
    }
  }, [t]);

  useEffect(() => {
    loadConfig();
  }, [loadConfig]);

  const handleImageSelect = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const validation = validateImageFile(file, t);
    if (!validation.ok) {
      toast.error(validation.message);
      event.target.value = "";
      return;
    }

    setOgImageFile(file);
  };

  const handleSave = async (event) => {
    event.preventDefault();
    setSaving(true);
    try {
      await updateJobsListingSeoConfig(form, { ogImage: ogImageFile });
      toast.success(t("jobsListingSeo.saved"));
      await loadConfig();
    } catch (error) {
      console.error(error);
      toast.error(t("jobsListingSeo.save_error"));
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
            <h1>{t("jobsListingSeo.title")}</h1>
            <ol className="breadcrumb">
              <li className="item">
                <Link to="/">{t("header.home")}</Link>
              </li>
              <li className="item">
                <i className="fa-solid fa-angle-right" />{" "}
                {t("jobsListingSeo.title")}
              </li>
            </ol>
          </div>
        </div>

        <form onSubmit={handleSave}>
          <div className="profile-form-content p-4 border rounded bg-white mb-4">
            <div className="d-flex justify-content-between align-items-center">
              <div>
                <h4 className="mb-1">{t("jobsListingSeo.status_title")}</h4>
                <p className="text-muted small mb-0">
                  {t("jobsListingSeo.status_description")}
                </p>
              </div>
              <div className="d-flex align-items-center gap-2">
                <span className="small text-muted">
                  {form.isActive
                    ? t("jobsListingSeo.active")
                    : t("jobsListingSeo.inactive")}
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
            <h4 className="mb-3">{t("jobsListingSeo.meta_title")}</h4>
            <div className="row">
              <div className="col-md-6">
                <div className="form-group mb-3">
                  <label>{t("jobsListingSeo.page_title")}</label>
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
                  <label>{t("jobsListingSeo.robots")}</label>
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
                  <label>{t("jobsListingSeo.description")}</label>
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
                  <label>{t("jobsListingSeo.keywords")}</label>
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
                  <label>{t("jobsListingSeo.canonical_url")}</label>
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
              {form.defaultJobsListUrl ? (
                <div className="col-md-6">
                  <div className="form-group mb-3">
                    <label>{t("jobsListingSeo.default_jobs_url")}</label>
                    <input
                      className="form-control"
                      type="url"
                      value={form.defaultJobsListUrl}
                      readOnly
                    />
                  </div>
                </div>
              ) : null}
            </div>
          </div>

          <div className="profile-form-content p-4 border rounded bg-white mb-4">
            <h4 className="mb-3">{t("jobsListingSeo.og_title_section")}</h4>
            <div className="row">
              <div className="col-md-6">
                <div className="form-group mb-3">
                  <label>{t("jobsListingSeo.og_title")}</label>
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
                  <label>{t("jobsListingSeo.og_image")}</label>
                  <input
                    className="form-control"
                    type="file"
                    accept="image/*"
                    onChange={handleImageSelect}
                  />
                  {form.ogImage ? (
                    <img
                      src={form.ogImage}
                      alt="OG preview"
                      className="mt-2"
                      style={{ maxHeight: 80 }}
                    />
                  ) : null}
                </div>
              </div>
              <div className="col-12">
                <div className="form-group mb-3">
                  <label>{t("jobsListingSeo.og_description")}</label>
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
            <h4 className="mb-3">{t("jobsListingSeo.jsonld_title")}</h4>
            <div className="row">
              <div className="col-md-6">
                <div className="d-flex justify-content-between align-items-center border rounded p-3 mb-3">
                  <span>{t("jobsListingSeo.item_list_schema")}</span>
                  <Switch
                    checked={Boolean(form.enableItemListSchema)}
                    onChange={(e) =>
                      setForm((prev) => ({
                        ...prev,
                        enableItemListSchema: e.target.checked,
                      }))
                    }
                  />
                </div>
              </div>
              <div className="col-md-6">
                <div className="form-group mb-3">
                  <label>{t("jobsListingSeo.max_jobs_in_schema")}</label>
                  <input
                    className="form-control"
                    type="number"
                    min={1}
                    max={100}
                    value={form.maxJobsInSchema}
                    onChange={(e) =>
                      setForm((prev) => ({
                        ...prev,
                        maxJobsInSchema: e.target.value,
                      }))
                    }
                  />
                </div>
              </div>
            </div>
          </div>

          <button type="submit" className="default-btn btn" disabled={saving}>
            {saving ? t("jobsListingSeo.saving") : t("jobsListingSeo.save")}
          </button>
        </form>
      </div>
    </section>
  );
}

export default AdminJobsListingSeoSettings;
