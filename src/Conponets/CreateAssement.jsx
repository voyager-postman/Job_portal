import { Link, useNavigate, useLocation } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
// import axios from "axios";
import { API_BASE_URL } from "../Url/Url";
import { ToastContainer, toast } from "react-toastify";
import axios from "axios";
import { getAdminAuthHeaders } from "../utils/apiHeaders";
import { useTranslation } from "react-i18next";

function CreateAssement() {
  const { t } = useTranslation("global");
  const categoryRef = useRef(null);
  const answerDropdownRef = useRef(null);
  const navigate = useNavigate();
  const { state } = useLocation();
  const assessmentId = state?.assessmentId || null;

  const isEditMode = Boolean(assessmentId);

  const [showAnswerDropdown, setShowAnswerDropdown] = useState(false);
  const [manualQuestions, setManualQuestions] = useState([]); // saved questions
  const [currentQuestion, setCurrentQuestion] = useState(null); // active form
  const [showManualQuestions, setShowManualQuestions] = useState(false);
  const [categories, setCategories] = useState([]);
  const [questionLevel, setQuestionLevel] = useState("");
  const [bankQuestions, setBankQuestions] = useState([]);
  const [assessmentName, setAssessmentName] = useState("");
  const [questionSource, setQuestionSource] = useState("");
  const [loadingQuestions, setLoadingQuestions] = useState(false);
  const [formData, setFormData] = useState({
    totalDuration: "",
    totalQuestions: "",
    passingPercentage: "",
  });
  const handleAddManualQuestion = () => {
    setShowManualQuestions((prev) => {
      // CLOSE
      if (prev) {
        setCurrentQuestion(null);
        return false;
      }

      // OPEN
      setQuestionSource("MANUAL");
      setCurrentQuestion({
        id: Date.now(),
        skillCategory: "",
        questionType: "",
        question: "",
        options: { A: "", B: "", C: "", D: "" },
        correctAnswer: [],
      });
      return true;
    });
  };

  const fetchCategories = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/skill-categories`);
      if (res.data?.success) {
        setCategories(res.data.data);
      }
    } catch {
      toast.error(t("assessment.failed_load_categories"));
    }
  };
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        answerDropdownRef.current &&
        !answerDropdownRef.current.contains(e.target)
      ) {
        setShowAnswerDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  /* ================= EDIT MODE PREFILL ================= */
  useEffect(() => {
    fetchCategories();
  }, []);
  const fetchAssessmentById = async (id) => {
    try {
      const res = await axios.get(
        `${API_BASE_URL}/getSkillAssessmentById/${id}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        },
      );

      const assessment = res.data?.data;
      if (!assessment) return;

      // ✅ BASIC INFO
      setAssessmentName(assessment.assessmentName);

      setFormData({
        totalDuration: assessment.totalDuration,
        totalQuestions: assessment.totalQuestions,
        passingPercentage: assessment.passingPercentage,
      });

      // ✅ PREFILL BANK QUESTIONS
      setSelectedBankQuestions(assessment.questions || []);

      // ✅ PREFILL QUESTION LEVEL (from first question)
      if (assessment.questions?.length) {
        setQuestionLevel(assessment.questions[0].level);
      }

      // ✅ PREFILL CATEGORIES (unique)
      const uniqueCategoryIds = [
        ...new Set(assessment.questions.map((q) => q.skillCategory)),
      ];

      const selectedCats = categories.filter((cat) =>
        uniqueCategoryIds.includes(cat._id),
      );

      setSelectedCategories(selectedCats);
    } catch (err) {
      toast.error(t("assessment.failed_load_assessment"));
    }
  };

  useEffect(() => {
    if (isEditMode && categories.length) {
      fetchAssessmentById(assessmentId);
    }
  }, [assessmentId, categories]);

  const [selectedBankQuestions, setSelectedBankQuestions] = useState([]);
  const [showQuestionOptions, setShowQuestionOptions] = useState(false);
  const [questionSearchTerm, setQuestionSearchTerm] = useState("");

  const questionRef = useRef(null);
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (questionRef.current && !questionRef.current.contains(e.target)) {
        setShowQuestionOptions(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [categorySearchTerm, setCategorySearchTerm] = useState("");
  const [showCategoryOptions, setShowCategoryOptions] = useState(false);
  const [questions, setQuestions] = useState([]);

  // Add / remove question
  const toggleBankQuestion = (question) => {
    setSelectedBankQuestions((prev) =>
      prev.some((q) => q._id === question._id)
        ? prev.filter((q) => q._id !== question._id)
        : [...prev, question],
    );
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (categoryRef.current && !categoryRef.current.contains(event.target)) {
        setShowCategoryOptions(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Add new question

  const toggleCategory = (category) => {
    setSelectedCategories((prev) => {
      const exists = prev.some((c) => c._id === category._id);

      return exists
        ? prev.filter((c) => c._id !== category._id)
        : [...prev, category];
    });
  };

  // Remove by cross icon
  const handleRemoveCategory = (categoryId) => {
    // 1️⃣ Remove category
    setSelectedCategories((prev) => prev.filter((c) => c._id !== categoryId));

    // 2️⃣ Remove related questions
    setSelectedBankQuestions((prev) =>
      prev.filter((q) => q.skillCategory !== categoryId),
    );
  };

  // Filter categories
  const filteredCategories = categories.filter((cat) =>
    cat.name.toLowerCase().includes(categorySearchTerm.toLowerCase()),
  );

  // Update option text

  console.log("MCQ DATA 👉", questions);
  const fetchQuestionsFromBank = async () => {
    if (!selectedCategories.length || !questionLevel) {
      setBankQuestions([]);
      return;
    }

    try {
      setLoadingQuestions(true);

      const categoryIds = selectedCategories.map((c) => c._id).join(",");

      const res = await axios.get(`${API_BASE_URL}/getQuestionsByCategories`, {
        params: {
          categoryIds,
          level: questionLevel,
        },
      });

      if (res.data?.success && res.data.data?.length > 0) {
        setBankQuestions(res.data.data);
      } else {
        setBankQuestions([]);
        toast.info(t("assessment.no_questions_found"));
      }
    } catch (err) {
      toast.error(t("assessment.failed_load_questions"));
      setBankQuestions([]);
    } finally {
      setLoadingQuestions(false);
    }
  };

  //   if (!selectedCategories.length || !questionLevel) {
  //     setBankQuestions([]);
  //     return;
  //   }

  //   try {
  //     setLoadingQuestions(true);

  //     const categoryIds = selectedCategories.map((c) => c._id).join(",");

  //     const res = await axios.get(`${API_BASE_URL}/getQuestionsByCategories`, {
  //       params: {
  //         categoryIds,
  //         level: questionLevel,
  //       },
  //     });

  //     if (res.data?.success) {
  //       setBankQuestions(res.data.data || []);
  //     } else {
  //       setBankQuestions([]);

  //     }
  //   } catch (err) {
  //     toast.error("Failed to load questions");
  //     setBankQuestions([]);
  //   } finally {
  //     setLoadingQuestions(false);
  //   }
  // };
  useEffect(() => {
    const total = selectedBankQuestions.length + manualQuestions.length;

    setFormData((prev) => ({
      ...prev,
      totalQuestions: total,
    }));
  }, [selectedBankQuestions, manualQuestions]);

  useEffect(() => {
    fetchQuestionsFromBank();
  }, [selectedCategories, questionLevel]);

  const buildPayload = () => {
    const bankQuestionIds = selectedBankQuestions.map((q) => q._id);

    return {
      assessmentName,
      bankQuestionIds,
      totalQuestions: Number(formData.totalQuestions),
      totalDuration: Number(formData.totalDuration),
      passingPercentage: Number(formData.passingPercentage),
    };
  };

  const validateForm = () => {
    if (!assessmentName.trim()) {
      toast.error(t("assessment.name_required"));
      return false;
    }

    if (!formData.totalDuration || Number(formData.totalDuration) <= 0) {
      toast.error(t("assessment.duration_required"));
      return false;
    }

    if (
      !formData.passingPercentage ||
      Number(formData.passingPercentage) <= 0 ||
      Number(formData.passingPercentage) > 100
    ) {
      toast.error(t("assessment.passing_range"));
      return false;
    }

    const totalSelected = selectedBankQuestions.length + manualQuestions.length;

    if (!totalSelected) {
      toast.error(t("assessment.add_one_question"));
      return false;
    }

    if (!totalSelected) {
      toast.error(t("assessment.add_one_question"));
      return false;
    }

    return true;
  };

  const handleSubmitAssessment = async () => {
    if (!validateForm()) return;

    try {
      const payload = buildPayload();

      const url = isEditMode
        ? `${API_BASE_URL}/updateSkillAssessment/${assessmentId}`
        : `${API_BASE_URL}/createSkillAssessment`;

      await axios.post(url, payload, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      toast.success(
        isEditMode ? t("assessment.updated_success") : t("assessment.created_success"),
      );

      setTimeout(() => {
        navigate("/manage-assessment");
      }, 1200);
    } catch (err) {
      toast.error(err.response?.data?.message || t("assessment.failed_save"));
    }
  };
  return (
    <>
      <ToastContainer />
      <div className="main-dashboard-content d-flex flex-column">
        <div className="responsive-content">
          {/* Breadcrumb Area */}
          <div className="breadcrumb-area">
            <h1>{t("assessment.create_assessment")}</h1>
            <ol className="breadcrumb">
              <li className="item">
                <Link to="/">{t("header.home")} </Link>
              </li>
              <li className="item">
                <Link to="/employer-dashboard">
                  {" "}
                  <i className="fa-solid fa-angle-right" />
                  {t("header.dashboard")}{" "}
                </Link>
              </li>
              <li className="item">
                <Link to="/manage-assessment">
                  <i className="fa-solid fa-angle-right" />
                  {t("assessment.manage_assessment")}
                </Link>
              </li>
              <li className="item">
                <i className="fa-solid fa-angle-right" /> {t("assessment.create")}
              </li>
            </ol>
          </div>
          {/* End Breadcrumb Area */}
          {/*Start My Profile Area*/}
          <div className="my-profile-area">
            <div className="profile-form-content">
              <h3>{t("assessment.create_assessment")}</h3>
              <div className="my-profile-area">
                <div className="profile-form-content">
                  <div className="profile-form">
                    <form className="skill-assessments-from-main-area">
                      <div className="row">
                        <div className="col-lg-12 col-md-12">
                          <div className="form-group">
                            <label>{t("assessment.assessment_name")}</label>
                            <input
                              className="form-control"
                              type="text"
                              placeholder={t("assessment.assessment_name_placeholder")}
                              value={assessmentName}
                              onChange={(e) =>
                                setAssessmentName(e.target.value)
                              }
                            />
                          </div>
                        </div>
                        <div className="col-lg-12 col-md-12">
                          <div className="form-group">
                            <label>{t("assessment.question_level_label")}</label>
                            <select
                              className="form-select form-control"
                              value={questionLevel}
                              onChange={(e) => {
                                const level = e.target.value;

                                setQuestionLevel(level);

                                if (!isEditMode) {
                                  setSelectedCategories([]);
                                  setSelectedBankQuestions([]);
                                  setManualQuestions([]);
                                  setCurrentQuestion(null);
                                }
                              }}
                              disabled={isEditMode}
                            >
                              <option value="">{t("assessment.select_level")}</option>
                              <option value="Easy">{t("assessment.easy")}</option>
                              <option value="Medium">{t("assessment.medium")}</option>
                              <option value="Hard">{t("assessment.hard")}</option>
                            </select>
                          </div>
                        </div>

                        <div className="col-lg-12 col-md-12">
                          <div className="form-group questions-category-main">
                            <label>{t("assessment.select_category")}</label>

                            <div
                              className="multi-select-container"
                              ref={categoryRef}
                              style={{ position: "relative" }}
                            >
                              {/* Selected chips */}
                              <div
                                className="selected-items"
                                onClick={() => setShowCategoryOptions(true)}
                                style={{
                                  display: "flex",
                                  flexWrap: "wrap",
                                  border: "1px solid #ccc",
                                  borderRadius: "6px",
                                  padding: "6px",
                                  cursor: "text",
                                }}
                              >
                                {selectedCategories.map((cat) => (
                                  <span
                                    key={cat._id}
                                    style={{
                                      background: "#007bff",
                                      color: "white",
                                      borderRadius: "4px",
                                      padding: "3px 6px",
                                      margin: "2px",
                                      display: "flex",
                                      alignItems: "center",
                                    }}
                                  >
                                    {cat.name}
                                    <i
                                      className="fa-solid fa-xmark"
                                      style={{
                                        cursor: "pointer",
                                        marginLeft: "6px",
                                      }}
                                      onClick={() =>
                                        handleRemoveCategory(cat._id)
                                      }
                                    />
                                  </span>
                                ))}

                                <input
                                  type="text"
                                  placeholder={t("assessment.search_category")}
                                  value={categorySearchTerm}
                                  onChange={(e) =>
                                    setCategorySearchTerm(e.target.value)
                                  }
                                  onFocus={() => setShowCategoryOptions(true)}
                                  style={{
                                    flex: 1,
                                    border: "none",
                                    outline: "none",
                                    minWidth: "120px",
                                  }}
                                />
                              </div>

                              {/* Dropdown */}
                              {showCategoryOptions && (
                                <ul
                                  style={{
                                    border: "1px solid #ccc",
                                    borderRadius: "6px",
                                    maxHeight: "200px",
                                    overflowY: "auto",
                                    background: "#fff",
                                    position: "absolute",
                                    width: "100%",
                                    zIndex: 1000,
                                    marginTop: "4px",
                                    padding: "6px",
                                    listStyle: "none",
                                  }}
                                >
                                  {filteredCategories.map((cat) => {
                                    const isSelected = selectedCategories.some(
                                      (c) => c._id === cat._id,
                                    );

                                    return (
                                      <li
                                        key={cat._id}
                                        style={{
                                          display: "flex",
                                          alignItems: "center",
                                          padding: "6px 10px",
                                          cursor: "pointer",
                                        }}
                                        onClick={() => toggleCategory(cat)}
                                      >
                                        <input
                                          type="checkbox"
                                          checked={isSelected}
                                          readOnly
                                          style={{ marginRight: "8px" }}
                                        />
                                        <span>{cat.name}</span>
                                      </li>
                                    );
                                  })}
                                </ul>
                              )}
                            </div>
                          </div>
                        </div>

                        <div className="question-bank-question-area ">
                          <div className="d-flex justify-content-between align-items-center mb-3">
                            <h5 className="mb-0">{t("assessment.questions")}</h5>
                            <button
                              type="button"
                              className="add-question-button"
                              onClick={handleAddManualQuestion}
                            >
                              {showManualQuestions ? "−" : "+"}
                            </button>
                          </div>
                          {showManualQuestions && currentQuestion && (
                            <div className="manual-question-form ">
                              {/* Skill Category */}
                              <div className="form-group">
                                <label>{t("assessment.skill_category")}</label>
                                <select
                                  className="form-control"
                                  value={currentQuestion.skillCategory}
                                  onChange={(e) => {
                                    const selectedCatId = e.target.value;

                                    // Update the current question's category
                                    setCurrentQuestion((prev) => ({
                                      ...prev,
                                      skillCategory: selectedCatId,
                                    }));

                                    // Add the category to selectedCategories if not already there
                                    setSelectedCategories((prev) => {
                                      if (
                                        !prev.some(
                                          (c) => c._id === selectedCatId,
                                        )
                                      ) {
                                        const catObj = categories.find(
                                          (c) => c._id === selectedCatId,
                                        );
                                        return catObj
                                          ? [...prev, catObj]
                                          : prev;
                                      }
                                      return prev;
                                    });
                                  }}
                                >
                                  <option value="">
                                    {t("assessment.select_skill_category")}
                                  </option>
                                  {categories.map((cat) => (
                                    <option key={cat._id} value={cat._id}>
                                      {cat.name}
                                    </option>
                                  ))}
                                </select>
                              </div>

                              {/* Question Type */}
                              <div className="form-group">
                                <label>{t("assessment.question_type")}</label>
                                <select
                                  className="form-control"
                                  value={currentQuestion.questionType}
                                  onChange={(e) => {
                                    const value = e.target.value;
                                    setCurrentQuestion({
                                      ...currentQuestion,
                                      questionType: value,
                                      options:
                                        value === "boolean"
                                          ? {
                                              A: "True",
                                              B: "False",
                                              C: "",
                                              D: "",
                                            }
                                          : { A: "", B: "", C: "", D: "" },
                                      correctAnswer: [],
                                    });
                                  }}
                                >
                                  <option value="">
                                    {t("assessment.select_question_type")}
                                  </option>
                                  <option value="single">{t("assessment.single_choice")}</option>
                                  <option value="multiple">
                                    {t("assessment.multiple_choice")}
                                  </option>
                                  <option value="boolean">{t("assessment.true_false")}</option>
                                </select>
                              </div>

                              {/* Question */}
                              <div className="form-group">
                                <label>{t("assessment.question")}</label>
                                <textarea
                                  className="custom-question-area"
                                  rows={2}
                                  placeholder={t("assessment.enter_question")}
                                  value={currentQuestion.question}
                                  onChange={(e) =>
                                    setCurrentQuestion({
                                      ...currentQuestion,
                                      question: e.target.value,
                                    })
                                  }
                                />
                              </div>

                              {/* Options */}
                              {["A", "B"].map((opt) => (
                                <div className="form-group" key={opt}>
                                  <label>
                                    {t("assessment.option", { key: opt })}
                                    {currentQuestion.questionType ===
                                      "boolean" &&
                                      ` (${opt === "A" ? t("assessment.true") : t("assessment.false")})`}
                                  </label>
                                  <input
                                    className="form-control"
                                    placeholder={`Option (${opt})`}
                                    value={currentQuestion.options[opt]}
                                    disabled={
                                      currentQuestion.questionType === "boolean"
                                    }
                                    onChange={(e) =>
                                      setCurrentQuestion({
                                        ...currentQuestion,
                                        options: {
                                          ...currentQuestion.options,
                                          [opt]: e.target.value,
                                        },
                                      })
                                    }
                                  />
                                </div>
                              ))}

                              {currentQuestion.questionType !== "boolean" &&
                                ["C", "D"].map((opt) => (
                                  <div className="form-group" key={opt}>
                                    <label>{t("assessment.option", { key: opt })}</label>
                                    <input
                                      className="form-control"
                                      placeholder={`Option (${opt})`}
                                      value={currentQuestion.options[opt]}
                                      onChange={(e) =>
                                        setCurrentQuestion({
                                          ...currentQuestion,
                                          options: {
                                            ...currentQuestion.options,
                                            [opt]: e.target.value,
                                          },
                                        })
                                      }
                                    />
                                  </div>
                                ))}

                              {/* Correct Answer */}
                              <div
                                ref={answerDropdownRef}
                                className="form-group position-relative"
                              >
                                <label>{t("assessment.correct_answer_label")}</label>

                                <div
                                  className="form-control d-flex justify-content-between align-items-center"
                                  style={{ cursor: "pointer" }}
                                  onClick={() =>
                                    setShowAnswerDropdown((prev) => !prev)
                                  }
                                >
                                  <span>
                                    {currentQuestion.correctAnswer.length > 0
                                      ? t("assessment.selected_answers", {
                                          answers: currentQuestion.correctAnswer.join(", "),
                                        })
                                      : t("assessment.select_correct_answer")}
                                  </span>
                                  <i className="fa fa-caret-down" />
                                </div>

                                {showAnswerDropdown && (
                                  <div
                                    className="border mt-1 p-2 bg-white position-absolute w-100"
                                    style={{ zIndex: 1000 }}
                                  >
                                    {(currentQuestion.questionType === "boolean"
                                      ? ["A", "B"]
                                      : ["A", "B", "C", "D"]
                                    ).map((opt) => (
                                      // <div className="form-check" key={opt}>
                                      //   <input
                                      //     type={
                                      //       currentQuestion.questionType ===
                                      //       "multiple"
                                      //         ? "checkbox"
                                      //         : "radio"
                                      //     }
                                      //     className="form-check-input"
                                      //     checked={currentQuestion.correctAnswer.includes(
                                      //       opt,
                                      //     )}
                                      //     onChange={() => {
                                      //       setCurrentQuestion((prev) => {
                                      //         if (
                                      //           prev.questionType ===
                                      //             "single" ||
                                      //           prev.questionType === "boolean"
                                      //         ) {
                                      //           return {
                                      //             ...prev,
                                      //             correctAnswer: [opt],
                                      //           };
                                      //         }

                                      //         const exists =
                                      //           prev.correctAnswer.includes(
                                      //             opt,
                                      //           );
                                      //         return {
                                      //           ...prev,
                                      //           correctAnswer: exists
                                      //             ? prev.correctAnswer.filter(
                                      //                 (a) => a !== opt,
                                      //               )
                                      //             : [
                                      //                 ...prev.correctAnswer,
                                      //                 opt,
                                      //               ],
                                      //         };
                                      //       });
                                      //     }}
                                      //   />
                                      //   <label className="form-check-label">
                                      //     {currentQuestion.questionType ===
                                      //     "boolean"
                                      //       ? opt === "A"
                                      //         ? "True"
                                      //         : "False"
                                      //       : `Option ${opt}`}
                                      //   </label>
                                      // </div>
                                      <div className="form-check" key={opt}>
                                        <input
                                          id={`correct-${opt}`}
                                          type={
                                            currentQuestion.questionType ===
                                            "multiple"
                                              ? "checkbox"
                                              : "radio"
                                          }
                                          className="form-check-input"
                                          checked={currentQuestion.correctAnswer.includes(
                                            opt,
                                          )}
                                          onChange={() => {
                                            setCurrentQuestion((prev) => {
                                              if (
                                                prev.questionType ===
                                                  "single" ||
                                                prev.questionType === "boolean"
                                              ) {
                                                return {
                                                  ...prev,
                                                  correctAnswer: [opt],
                                                };
                                              }

                                              const exists =
                                                prev.correctAnswer.includes(
                                                  opt,
                                                );
                                              return {
                                                ...prev,
                                                correctAnswer: exists
                                                  ? prev.correctAnswer.filter(
                                                      (a) => a !== opt,
                                                    )
                                                  : [
                                                      ...prev.correctAnswer,
                                                      opt,
                                                    ],
                                              };
                                            });
                                          }}
                                        />

                                        <label
                                          htmlFor={`correct-${opt}`}
                                          className="form-check-label"
                                          style={{ cursor: "pointer" }}
                                        >
                                          {currentQuestion.questionType ===
                                          "boolean"
                                            ? opt === "A"
                                              ? t("assessment.true")
                                              : t("assessment.false")
                                            : t("assessment.option", { key: opt })}
                                        </label>
                                      </div>
                                    ))}
                                  </div>
                                )}
                              </div>

                              {/* Save / Close */}
                              <div className="mt-3 d-flex justify-content-center gap-2">
                                <button
                                  type="button"
                                  className="default-btn btn"
                                  onClick={async () => {
                                    const q = currentQuestion;

                                    // ✅ validations
                                    if (!q.skillCategory) {
                                      toast.error(t("assessment.skill_category_required"));
                                      return;
                                    }
                                    if (!q.questionType) {
                                      toast.error(t("assessment.question_type_required"));
                                      return;
                                    }
                                    if (!q.question.trim()) {
                                      toast.error(t("assessment.question_required"));
                                      return;
                                    }
                                    if (!q.correctAnswer.length) {
                                      toast.error(t("assessment.select_correct_answer_error"));
                                      return;
                                    }

                                    try {
                                      const formattedOptions = Object.entries(
                                        q.options,
                                      )
                                        .filter(
                                          ([_, text]) => text && text.trim(),
                                        )
                                        .map(([key, text]) => ({ key, text }));

                                      const payload = {
                                        skillCategory: q.skillCategory,
                                        level: questionLevel,
                                        questionType: q.questionType,
                                        question: q.question,
                                        options: formattedOptions,
                                        correctAnswers: q.correctAnswer,
                                      };

                                      // 🔥 CREATE QUESTION
                                      const res = await axios.post(
                                        `${API_BASE_URL}/add-question`,
                                        payload,
                                        { headers: getAdminAuthHeaders() },
                                      );

                                      const newQuestion = res.data?.data;

                                      toast.success(
                                        t("assessment.question_added_bank"),
                                      );

                                      // 🔄 REFRESH BANK QUESTIONS
                                      await fetchQuestionsFromBank();

                                      // ✅ AUTO-CHECK NEW QUESTION
                                      if (newQuestion?._id) {
                                        setSelectedBankQuestions((prev) => [
                                          ...prev,
                                          newQuestion,
                                        ]);
                                      }

                                      setCurrentQuestion(null);
                                      setShowManualQuestions(false);
                                    } catch (err) {
                                      toast.error(
                                        err.response?.data?.message ||
                                          t("assessment.failed_save_question"),
                                      );
                                    }
                                  }}
                                >
                                  {t("assessment.save_question")}
                                </button>

                                <button
                                  type="button"
                                  className="btn btn-secondary"
                                  onClick={() => {
                                    setCurrentQuestion(null);
                                    setShowManualQuestions(false);
                                  }}
                                >
                                  {t("header.Close")}
                                </button>
                              </div>
                            </div>
                          )}
                          <div className="question-bank-question-area mt-3">
                            {bankQuestions.map((group) => (
                              <div key={group.categoryId} className="mb-4">
                                {/* CATEGORY + LEVEL */}
                                <h6 className="mb-2">
                                  {group.categoryName} ({questionLevel})
                                </h6>

                                {group.questions.map((q, index) => {
                                  const isChecked = selectedBankQuestions.some(
                                    (sq) => sq._id === q._id,
                                  );

                                  return (
                                    <div
                                      className="question-bank-question-list"
                                      key={q._id}
                                    >
                                      {/* LEFT SIDE */}
                                      <div className="question-bank-question d-flex align-items-center gap-2">
                                        {/* CHECKBOX */}
                                        <input
                                          type="checkbox"
                                          checked={isChecked}
                                          onChange={() => toggleBankQuestion(q)}
                                        />

                                        <h5 className="mb-0">
                                          <span>Q{index + 1}.</span>{" "}
                                          {q.question}
                                        </h5>
                                      </div>
                                    </div>
                                  );
                                })}
                              </div>
                            ))}
                          </div>
                        </div>

                        <div className="col-lg-4 col-md-12">
                          <div className="form-group">
                            <label>{t("assessment.total_duration_minutes")}</label>
                            <input
                              className="form-control"
                              type="text"
                              name="totalDuration"
                              placeholder={t("assessment.total_duration_placeholder")}
                              value={formData.totalDuration}
                              onChange={handleChange}
                            />
                          </div>
                        </div>
                        <div className="col-lg-4 col-md-12">
                          <div className="form-group">
                            <label>{t("assessment.total_questions_col")}</label>
                            <input
                              className="form-control"
                              type="text"
                              name="totalQuestions"
                              value={formData.totalQuestions}
                              readOnly
                            />
                          </div>
                        </div>
                        <div className="col-lg-4 col-md-12">
                          <div className="form-group">
                            <label>{t("assessment.passing_percentage_label")}</label>
                            <input
                              className="form-control"
                              type="text"
                              name="passingPercentage"
                              placeholder={t("assessment.passing_percentage_placeholder")}
                              value={formData.passingPercentage}
                              onChange={handleChange}
                            />
                          </div>
                        </div>
                        <div className="skill-assessment-btn-area">
                          <button
                            type="button"
                            className="default-btn btn"
                            onClick={handleSubmitAssessment}
                          >
                            {isEditMode ? t("assessment.update_assessment") : t("assessment.submit")}
                          </button>
                        </div>
                      </div>
                    </form>
                  </div>
                </div>
              </div>
            </div>
          </div>
          {/*End My Profile Area*/}
          <div className="copy-right-area bg-f0f4fc">
            <div className="row">
              <div className="col-lg-6 col-md-6">
                <div className="copyright-left-content">
                  <p>
                    {" "}
                    <span className="copy">© </span>
                    <span id="year" />
                    <span className="template-name"> Connect Work.ma </span> All
                    Rights Reserved
                  </p>
                </div>
              </div>
              <div className="col-lg-6 col-md-6">
                <div className="copyright-right-content">
                  <p>
                    Designed By{" "}
                    <a href="https://hibootstrap.com/" target="_blank">
                      Webnmobapps Solution Pvt. Ltd
                    </a>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default CreateAssement;
