import Temp1 from "../../src/images/resume/Temp1.png";
import Temp2 from "../../src/images/resume/Temp2.png";
import Temp3 from "../../src/images/resume/Temp3.png";
const TemplateSelector = ({ setTemplate }) => {
  const templates = [
    { id: "t1", name: "Template1", img: Temp1 },
    { id: "t2", name: "Template2", img: Temp2 },
    { id: "t3", name: "Template3", img: Temp3 },
  ];
  return (
    <>
      <div className="manage-jobs-box p-2 align-items-center">
        <h5 className="my-2">Select a Resume Template</h5>
      </div>

      <div style={{ display: "flex", gap: 20 }}>
        {templates.map((t) => (
          <div
            key={t.id}
            style={{
              width: "50%",
              height: 350,
              // border: "2px solid #ccc",
              padding: 10,
              cursor: "pointer",
              background: "#fff",
            }}
            onClick={() => setTemplate(t.id)}
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
                src={t.img}
                alt={t.name}
                style={{ width: "100%", height: "100%", objectFit: "contain" }}
              />
            </div>
            <button style={{ textAlign: "center" }} className="default-btn btn">
              {t.name}
            </button>
          </div>
        ))}
      </div>
    </>
  );
};

export default TemplateSelector;
