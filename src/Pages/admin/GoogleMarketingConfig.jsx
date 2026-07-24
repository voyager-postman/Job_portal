import React, { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";
import Switch from "@mui/material/Switch";
import {
  fetchGoogleMarketingConfig,
  saveGoogleAnalyticsConfig,
  saveGoogleSearchConsoleConfig,
  saveGoogleTagManagerConfig,
  toggleGoogleAnalyticsStatus,
  toggleGoogleSearchConsoleStatus,
  toggleGoogleTagManagerStatus,
} from "../../utils/googleMarketingApi";

const EMPTY_GTM = { containerId: "", isActive: false, environment: "live" };
const EMPTY_GA = { measurementId: "", isActive: false, environment: "live" };
const EMPTY_GSC = { verificationCode: "", siteUrl: "", isActive: false };

const normalizeConfig = (value, fallback) => ({
  ...fallback,
  ...(value || {}),
});

function GoogleMarketingConfig() {
  const { t } = useTranslation("global");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState({
    gtm: false,
    ga: false,
    gsc: false,
  });
  const [gtm, setGtm] = useState(EMPTY_GTM);
  const [ga, setGa] = useState(EMPTY_GA);
  const [gsc, setGsc] = useState(EMPTY_GSC);

  const loadConfig = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetchGoogleMarketingConfig();
      const data = res.data?.data || res.data || {};

      setGtm(
        normalizeConfig(data.googleTagManager || data.gtm, EMPTY_GTM),
      );
      setGa(normalizeConfig(data.googleAnalytics || data.ga, EMPTY_GA));
      setGsc(
        normalizeConfig(data.googleSearchConsole || data.searchConsole, EMPTY_GSC),
      );
    } catch (error) {
      console.error(error);
      toast.error(t("googleMarketing.load_error"));
    } finally {
      setLoading(false);
    }
  }, [t]);

  useEffect(() => {
    loadConfig();
  }, [loadConfig]);

  const handleGtmToggle = async (event) => {
    const isActive = event.target.checked;
    setGtm((prev) => ({ ...prev, isActive }));
    try {
      await toggleGoogleTagManagerStatus(isActive);
      toast.success(t("googleMarketing.status_updated"));
    } catch (error) {
      setGtm((prev) => ({ ...prev, isActive: !isActive }));
      toast.error(t("googleMarketing.status_error"));
    }
  };

  const handleGaToggle = async (event) => {
    const isActive = event.target.checked;
    setGa((prev) => ({ ...prev, isActive }));
    try {
      await toggleGoogleAnalyticsStatus(isActive);
      toast.success(t("googleMarketing.status_updated"));
    } catch (error) {
      setGa((prev) => ({ ...prev, isActive: !isActive }));
      toast.error(t("googleMarketing.status_error"));
    }
  };

  const handleGscToggle = async (event) => {
    const isActive = event.target.checked;
    setGsc((prev) => ({ ...prev, isActive }));
    try {
      await toggleGoogleSearchConsoleStatus(isActive);
      toast.success(t("googleMarketing.status_updated"));
    } catch (error) {
      setGsc((prev) => ({ ...prev, isActive: !isActive }));
      toast.error(t("googleMarketing.status_error"));
    }
  };

  const saveGtm = async (event) => {
    event.preventDefault();
    if (!gtm.containerId?.trim()) {
      toast.error(t("googleMarketing.gtm_id_required"));
      return;
    }

    setSaving((prev) => ({ ...prev, gtm: true }));
    try {
      await saveGoogleTagManagerConfig({
        containerId: gtm.containerId.trim(),
        isActive: Boolean(gtm.isActive),
        environment: gtm.environment || "live",
      });
      toast.success(t("googleMarketing.gtm_saved"));
      await loadConfig();
    } catch (error) {
      toast.error(t("googleMarketing.save_error"));
    } finally {
      setSaving((prev) => ({ ...prev, gtm: false }));
    }
  };

  const saveGa = async (event) => {
    event.preventDefault();
    if (!ga.measurementId?.trim()) {
      toast.error(t("googleMarketing.ga_id_required"));
      return;
    }

    setSaving((prev) => ({ ...prev, ga: true }));
    try {
      await saveGoogleAnalyticsConfig({
        measurementId: ga.measurementId.trim(),
        isActive: Boolean(ga.isActive),
        environment: ga.environment || "live",
      });
      toast.success(t("googleMarketing.ga_saved"));
      await loadConfig();
    } catch (error) {
      toast.error(t("googleMarketing.save_error"));
    } finally {
      setSaving((prev) => ({ ...prev, ga: false }));
    }
  };

  const saveGsc = async (event) => {
    event.preventDefault();
    if (!gsc.verificationCode?.trim()) {
      toast.error(t("googleMarketing.gsc_code_required"));
      return;
    }

    setSaving((prev) => ({ ...prev, gsc: true }));
    try {
      await saveGoogleSearchConsoleConfig({
        verificationCode: gsc.verificationCode.trim(),
        siteUrl: gsc.siteUrl?.trim() || "",
        isActive: Boolean(gsc.isActive),
      });
      toast.success(t("googleMarketing.gsc_saved"));
      await loadConfig();
    } catch (error) {
      toast.error(t("googleMarketing.save_error"));
    } finally {
      setSaving((prev) => ({ ...prev, gsc: false }));
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
            <h1>{t("googleMarketing.title")}</h1>
            <ol className="breadcrumb">
              <li className="item">
                <Link to="/">{t("header.home")}</Link>
              </li>
              <li className="item">
                <i className="fa-solid fa-angle-right" />{" "}
                {t("googleMarketing.title")}
              </li>
            </ol>
          </div>
        </div>

        <div className="row g-4">
          <div className="col-lg-12">
            <div className="profile-form-content p-4 border rounded bg-white">
              <div className="d-flex justify-content-between align-items-center mb-3">
                <div>
                  <h4 className="mb-1">{t("googleMarketing.gtm_title")}</h4>
                  <p className="text-muted small mb-0">
                    {t("googleMarketing.gtm_description")}
                  </p>
                </div>
                <div className="d-flex align-items-center gap-2">
                  <span className="small text-muted">
                    {gtm.isActive
                      ? t("googleMarketing.active")
                      : t("googleMarketing.inactive")}
                  </span>
                  <Switch checked={Boolean(gtm.isActive)} onChange={handleGtmToggle} />
                </div>
              </div>
              <form onSubmit={saveGtm}>
                <div className="row">
                  <div className="col-md-6">
                    <div className="form-group mb-3">
                      <label>{t("googleMarketing.container_id")}</label>
                      <input
                        className="form-control"
                        type="text"
                        placeholder="GTM-XXXXXXX"
                        value={gtm.containerId || ""}
                        onChange={(e) =>
                          setGtm((prev) => ({
                            ...prev,
                            containerId: e.target.value,
                          }))
                        }
                      />
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="form-group mb-3">
                      <label>{t("googleMarketing.environment")}</label>
                      <select
                        className="form-control"
                        value={gtm.environment || "live"}
                        onChange={(e) =>
                          setGtm((prev) => ({
                            ...prev,
                            environment: e.target.value,
                          }))
                        }
                      >
                        <option value="live">{t("googleMarketing.live")}</option>
                        <option value="test">{t("googleMarketing.test")}</option>
                      </select>
                    </div>
                  </div>
                </div>
                <p className="text-muted small">
                  {t("googleMarketing.gtm_env_hint")}
                </p>
                <button
                  type="submit"
                  className="default-btn btn"
                  disabled={saving.gtm}
                >
                  {saving.gtm
                    ? t("googleMarketing.saving")
                    : t("googleMarketing.save_gtm")}
                </button>
              </form>
            </div>
          </div>

          <div className="col-lg-12">
            <div className="profile-form-content p-4 border rounded bg-white">
              <div className="d-flex justify-content-between align-items-center mb-3">
                <div>
                  <h4 className="mb-1">{t("googleMarketing.ga_title")}</h4>
                  <p className="text-muted small mb-0">
                    {t("googleMarketing.ga_description")}
                  </p>
                </div>
                <div className="d-flex align-items-center gap-2">
                  <span className="small text-muted">
                    {ga.isActive
                      ? t("googleMarketing.active")
                      : t("googleMarketing.inactive")}
                  </span>
                  <Switch checked={Boolean(ga.isActive)} onChange={handleGaToggle} />
                </div>
              </div>
              <form onSubmit={saveGa}>
                <div className="row">
                  <div className="col-md-6">
                    <div className="form-group mb-3">
                      <label>{t("googleMarketing.measurement_id")}</label>
                      <input
                        className="form-control"
                        type="text"
                        placeholder="G-XXXXXXXXXX"
                        value={ga.measurementId || ""}
                        onChange={(e) =>
                          setGa((prev) => ({
                            ...prev,
                            measurementId: e.target.value,
                          }))
                        }
                      />
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="form-group mb-3">
                      <label>{t("googleMarketing.environment")}</label>
                      <select
                        className="form-control"
                        value={ga.environment || "live"}
                        onChange={(e) =>
                          setGa((prev) => ({
                            ...prev,
                            environment: e.target.value,
                          }))
                        }
                      >
                        <option value="live">{t("googleMarketing.live")}</option>
                        <option value="test">{t("googleMarketing.test")}</option>
                      </select>
                    </div>
                  </div>
                </div>
                <p className="text-muted small">
                  {t("googleMarketing.ga_env_hint")}
                </p>
                <button
                  type="submit"
                  className="default-btn btn"
                  disabled={saving.ga}
                >
                  {saving.ga
                    ? t("googleMarketing.saving")
                    : t("googleMarketing.save_ga")}
                </button>
              </form>
            </div>
          </div>

          <div className="col-lg-12">
            <div className="profile-form-content p-4 border rounded bg-white">
              <div className="d-flex justify-content-between align-items-center mb-3">
                <div>
                  <h4 className="mb-1">{t("googleMarketing.gsc_title")}</h4>
                  <p className="text-muted small mb-0">
                    {t("googleMarketing.gsc_description")}
                  </p>
                </div>
                <div className="d-flex align-items-center gap-2">
                  <span className="small text-muted">
                    {gsc.isActive
                      ? t("googleMarketing.active")
                      : t("googleMarketing.inactive")}
                  </span>
                  <Switch checked={Boolean(gsc.isActive)} onChange={handleGscToggle} />
                </div>
              </div>
              <form onSubmit={saveGsc}>
                <div className="row">
                  <div className="col-md-6">
                    <div className="form-group mb-3">
                      <label>{t("googleMarketing.verification_code")}</label>
                      <input
                        className="form-control"
                        type="text"
                        placeholder={t("googleMarketing.verification_placeholder")}
                        value={gsc.verificationCode || ""}
                        onChange={(e) =>
                          setGsc((prev) => ({
                            ...prev,
                            verificationCode: e.target.value,
                          }))
                        }
                      />
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="form-group mb-3">
                      <label>{t("googleMarketing.site_url")}</label>
                      <input
                        className="form-control"
                        type="url"
                        placeholder="https://example.com"
                        value={gsc.siteUrl || ""}
                        onChange={(e) =>
                          setGsc((prev) => ({
                            ...prev,
                            siteUrl: e.target.value,
                          }))
                        }
                      />
                    </div>
                  </div>
                </div>
                <p className="text-muted small">
                  {t("googleMarketing.gsc_hint")}
                </p>
                <button
                  type="submit"
                  className="default-btn btn"
                  disabled={saving.gsc}
                >
                  {saving.gsc
                    ? t("googleMarketing.saving")
                    : t("googleMarketing.save_gsc")}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default GoogleMarketingConfig;
