export const getNotificationMeta = (note) => {
  const label = `${note?.type || ""} ${note?.title || ""}`.toLowerCase();

  if (
    label.includes("credit") ||
    label.includes("low_balance") ||
    label.includes("zero_credit")
  ) {
    return {
      icon: "fa-solid fa-coins",
      color: "#2563eb",
      bg: "#dbeafe",
    };
  }

  if (label.includes("pack") || label.includes("approved")) {
    return {
      icon: "fa-solid fa-box-open",
      color: "#059669",
      bg: "#dcfce7",
    };
  }

  if (
    label.includes("limit") ||
    label.includes("daily") ||
    label.includes("weekly") ||
    label.includes("monthly")
  ) {
    return {
      icon: "fa-solid fa-chart-line",
      color: "#ea580c",
      bg: "#ffedd5",
    };
  }

  if (label.includes("job")) {
    return {
      icon: "fa-solid fa-briefcase",
      color: "#7c3aed",
      bg: "#ede9fe",
    };
  }

  if (label.includes("application") || label.includes("interview")) {
    return {
      icon: "fa-solid fa-file-lines",
      color: "#0891b2",
      bg: "#cffafe",
    };
  }

  return {
    icon: "fa-solid fa-bell",
    color: "#64748b",
    bg: "#f1f5f9",
  };
};

export const formatNotificationTime = (date, language = "en") => {
  if (!date) return "";
  const locale = language.startsWith("fr") ? "fr-FR" : "en-US";
  const diffMs = Date.now() - new Date(date).getTime();
  const minutes = Math.floor(diffMs / 60000);
  const rtf = new Intl.RelativeTimeFormat(locale, { numeric: "auto" });

  if (minutes < 1) return rtf.format(0, "minute");
  if (minutes < 60) return rtf.format(-minutes, "minute");
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return rtf.format(-hours, "hour");
  const days = Math.floor(hours / 24);
  if (days < 7) return rtf.format(-days, "day");
  return new Date(date).toLocaleDateString(locale, {
    month: "short",
    day: "numeric",
  });
};

export const getNotificationRoute = (note, userRole) => {
  const walletTypes = [
    "pack",
    "pack_warning",
    "pack_expired",
    "welcome_pack_warning",
    "Welcome_Pack_Expired",
    "credits",
    "low_balance",
    "zero_credit",
    "LOW_JOB_CREDIT",
    "monthly_limit",
    "weekly_limit",
    "daily_limit",
  ];

  if (walletTypes.includes(note?.type)) {
    return "/employer-wallet";
  }

  if (note?.type === "job_alert") {
    return "/job-search";
  }

  if (note?.type === "application-status") {
    return "/manage-job-application";
  }

  const label = `${note?.type || ""} ${note?.title || ""} ${note?.message || ""}`.toLowerCase();

  if (userRole === "JobSeeker") {
    if (
      label.includes("interview") ||
      label.includes("preselect") ||
      label.includes("application") ||
      label.includes("contacted") ||
      label.includes("shortlist")
    ) {
      return "/manage-job-application";
    }
    return "/manage-job-application";
  }

  return "/employer-dashboard";
};
