import { useTranslation } from "react-i18next";
import Temp1 from "../../src/images/resume/Temp1.png";
import Temp2 from "../../src/images/resume/Temp2.png";
import Temp3 from "../../src/images/resume/Temp3.png";

const TemplateSelector = ({ setTemplate }) => {
  const { t } = useTranslation("global");
  const templates = [
    { id: "t1", name: t("resume.template1"), img: Temp1 },
    { id: "t2", name: t("resume.template2"), img: Temp2 },
    { id: "t3", name: t("resume.template3"), img: Temp3 },
  ];
  return (
    <>
      <div className="manage-jobs-box p-2 align-items-center">
        <h5 className="my-2">{t("resume.select_template")}</h5>
      </div>

      <div style={{ display: "flex", gap: 20 }}>
        {templates.map((tpl) => (
          <div
            key={tpl.id}
            style={{
              width: "50%",
              height: 350,
              padding: 10,
              cursor: "pointer",
              background: "#fff",
            }}
            onClick={() => setTemplate(tpl.id)}
          >
            <div
              style={{
                height: "90%",
                background: "#fff",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                overflow: "hidden",
              }}
            >
              <img
                crossorigin="anonymous"
                src={tpl.img}
                alt={tpl.name}
                style={{ width: "100%", height: "100%", objectFit: "contain" }}
              />
            </div>
            <button style={{ textAlign: "center" }} className="default-btn btn">
              {tpl.name}
            </button>
          </div>
        ))}
      </div>
    </>
  );
};

export default TemplateSelector;
