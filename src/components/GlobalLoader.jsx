import { useTranslation } from "react-i18next";

export default function GlobalLoader({ message, overlay = true }) {
  const { t } = useTranslation("global");
  const displayMessage = message || t("header.Loading");

  const content = (
    <div className="loader-box">
      <div
        className="custom-spinner"
        role="status"
        aria-label={displayMessage}
      />
      <p className="brand-text">NADDI.MA</p>
    </div>
  );

  if (!overlay) {
    return (
      <div
        className="inline-loader d-flex flex-column justify-content-center align-items-center w-100 py-5"
        role="status"
        aria-live="polite"
        aria-busy="true"
      >
        <div
          className="custom-spinner mb-3"
          aria-label={displayMessage}
        />
        {message && <p className="text-muted mb-0">{displayMessage}</p>}
      </div>
    );
  }

  return (
    <div
      className="loader-overlay"
      role="status"
      aria-live="polite"
      aria-busy="true"
    >
      {content}
    </div>
  );
}
