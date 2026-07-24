import { useTranslation } from "react-i18next";

const ResumeEditor = ({ data, setData }) => {
  const { t } = useTranslation("global");
  const update = (field, value) => {
    setData({ ...data, [field]: value });
  };

  return (
    <>
      <h3>{t("resume.edit_resume")}</h3>

      <label>{t("resume.summary")}</label>
      <textarea
        style={{ width: "100%", height: 100 }}
        value={data.summary}
        onChange={(e) => update("summary", e.target.value)}
      />
    </>
  );
};

export default ResumeEditor;
