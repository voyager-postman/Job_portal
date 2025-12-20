const TemplateSelector = ({ setTemplate }) => {
  const templates = [
    {
      id: "t1",
      name: "Template1",
      img: "/JobPortal/assets/images/resume/Temp1.png",
    },
    {
      id: "t2",
      name: "Template2",
      img: "/JobPortal/assets/images/resume/Temp2.png",
    },
    {
      id: "t3",
      name: "Template3",
      img: "/JobPortal/assets/images/resume/Temp3.png",
    },
  ];

  return (
    <>
      <div className="manage-jobs-box p-2 align-items-center">
        <h5 className="mb-4">Select Resume Template</h5>
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
