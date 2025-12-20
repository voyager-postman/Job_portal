const ResumeEditor = ({ data, setData }) => {
  const update = (field, value) => {
    setData({ ...data, [field]: value });
  };

  return (
    <>
      <h3>Edit Resume</h3>

      <label>Summary</label>
      <textarea
        style={{ width: "100%", height: 100 }}
        value={data.summary}
        onChange={(e) => update("summary", e.target.value)}
      />
    </>
  );
};

export default ResumeEditor;
