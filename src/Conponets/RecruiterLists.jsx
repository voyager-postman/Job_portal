import { useEffect, useState } from "react";

import { Link } from "react-router-dom";

import { TableView } from "../Conponets/DataTable";

import { API_BASE_URL } from "../Url/Url";

import axios from "axios";

import { useNavigate } from "react-router-dom";

import Swal from "sweetalert2";

import { ToastContainer, toast } from "react-toastify";

import "react-toastify/dist/ReactToastify.css";

import { useTranslation } from "react-i18next";

import "./Recruiters.css";



function RecruiterLists() {

  const { t } = useTranslation("global");

  const navigate = useNavigate();

  const [limit, setLimit] = useState(10);

  const [globalFilter, setGlobalFilter] = useState("");

  const [data, setData] = useState([]);



  const getRecruiterList = () => {

    const token = localStorage.getItem("token");

    axios

      .get(`${API_BASE_URL}getRecruiterList`, {

        headers: {

          Authorization: `Bearer ${token}`,

        },

      })

      .then((response) => {

        const recruiters = response.data.recruiters || [];

        setData(recruiters);

      })

      .catch((error) => {

        console.log(error);

      });

  };



  useEffect(() => {

    getRecruiterList();

  }, []);



  const handleStatusToggle = async (recruiter) => {

    try {

      const token = localStorage.getItem("token");

      const newStatus = recruiter.status === "Active" ? "Inactive" : "Active";



      await axios.post(

        `${API_BASE_URL}updateRecruiterStatus/${recruiter._id}`,

        { status: newStatus },

        {

          headers: {

            Authorization: `Bearer ${token}`,

          },

        },

      );



      toast.success(

        t("recruiters.status_updated", {

          status:

            newStatus === "Active"

              ? t("recruiters.active")

              : t("recruiters.inactive"),

        }),

      );



      getRecruiterList();

    } catch (error) {

      toast.error(error.response?.data?.message || t("recruiters.failed_update_status"));

    }

  };



  const handleDelete = (recruiterId) => {

    Swal.fire({

      title: t("header.Are_you_sure"),

      text: t("recruiters.delete_confirm_text"),

      icon: t("header.warning"),

      showCancelButton: true,

      confirmButtonColor: "#d33",

      cancelButtonColor: "#3085d6",

      confirmButtonText: t("header.Yes_delete_it"),

    }).then(async (result) => {

      if (result.isConfirmed) {

        try {

          const token = localStorage.getItem("token");



          await axios.post(

            `${API_BASE_URL}deleteRecruiter/${recruiterId}`,

            {},

            {

              headers: {

                Authorization: `Bearer ${token}`,

              },

            },

          );



          Swal.fire(t("header.Deleted"), t("recruiters.deleted_success"), t("header.success"));



          getRecruiterList();

        } catch (error) {

          Swal.fire(

            t("header.Failed"),

            error.response?.data?.message || t("recruiters.failed_delete"),

            t("header.error"),

          );

        }

      }

    });

  };



  const columns = [

    {

      accessorKey: "id",

      header: t("header.S_No"),

      cell: ({ row }) => row.index + 1,

    },

    {

      accessorKey: "recruiter",

      header: t("recruiters.recruiter_col"),

      cell: ({ row }) => {

        const recruiter = row.original;

        const fullName = [recruiter.first_name, recruiter.last_name]

          .filter(Boolean)

          .join(" ");

        return (

          <div className="recruiter-name-cell">

            <span className="name">{fullName || "—"}</span>

            {recruiter.email && <span className="email">{recruiter.email}</span>}

          </div>

        );

      },

    },

    {

      accessorKey: "department",

      header: t("recruiters.department_col"),

      cell: ({ row }) => (

        <span className="recruiter-department-cell">

          {row.original.department || "—"}

        </span>

      ),

    },

    {

      accessorKey: "status",

      header: t("header.Status"),

      cell: ({ row }) => {

        const recruiter = row.original;

        return (

          <div className="recruiter-status-info">

            <div className="form-check form-switch">

              <input

                className="form-check-input"

                type="checkbox"

                role="switch"

                checked={recruiter.status === "Active"}

                onChange={() => handleStatusToggle(recruiter)}

              />

            </div>

          </div>

        );

      },

    },

    {

      accessorKey: "action",

      header: t("header.Action"),

      cell: ({ row }) => {

        const recruiter = row.original;

        return (

          <div className="action-icon-info">

            <i

              className="fa-solid fa-pencil"

              style={{ cursor: "pointer", marginRight: "10px" }}

              onClick={() =>

                navigate("/create-recruiters", {

                  state: { recruiterData: recruiter },

                })

              }

            />

            <i

              className="fa-solid fa-trash"

              style={{ cursor: "pointer" }}

              onClick={() => handleDelete(recruiter._id)}

            />

          </div>

        );

      },

    },

  ];



  return (

    <>

      <ToastContainer

        position="top-right"

        autoClose={3000}

        hideProgressBar={false}

        closeOnClick

        pauseOnHover

        draggable

        theme="light"

      />

      <div className="main-dashboard-content d-flex flex-column">

        <div className="responsive-content">

          <div className="breadcrumb-area">

            <h1>{t("sidebar.manage_recruiters")}</h1>

            <ol className="recruiters-breadcrumb">

              <li>

                <Link to="/">{t("header.home")}</Link>

                <span>&gt;</span>

              </li>

              <li>

                <Link to="/employer-dashboard">{t("header.dashboard")}</Link>

                <span>&gt;</span>

              </li>

              <li className="current">{t("sidebar.manage_recruiters")}</li>

            </ol>

          </div>



          <div className="my-profile-area">

            <div className="recruiters-page-card">

              <div className="recruiters-card-header">

                <div className="recruiters-card-header-text">

                  <h3>{t("recruiters.recruiters_list")}</h3>

                  <p>{t("recruiters.recruiters_list_subtitle")}</p>

                </div>

                <Link to="/create-recruiters" className="recruiters-add-btn">

                  <i className="fa-solid fa-plus" />

                  {t("recruiters.add_recruiters")}

                </Link>

              </div>



              <div className="profile-form recruiters-table-wrap">

                <div className="row">

                  <div className="col-lg-12 col-md-12">

                    <TableView

                      columns={columns}

                      data={data}

                      limit={limit}

                      setLimit={setLimit}

                      globalFilter={globalFilter}

                      setGlobalFilter={setGlobalFilter}

                    />

                  </div>

                </div>

              </div>

            </div>

          </div>



          <div className="copy-right-area bg-f0f4fc">

            <div className="row">

              <div className="col-lg-6 col-md-6">

                <div className="copyright-left-content">

                  <p>

                    <span className="copy">© </span>

                    <span id="year" />

                    <span className="template-name"> {t("header.Connect_Work")} </span>

                    {t("header.All_Rights_Reserved")}

                  </p>

                </div>

              </div>

              <div className="col-lg-6 col-md-6">

                <div className="copyright-right-content">

                  <p>

                    {t("header.Designed_By")}{" "}

                    <a href="https://hibootstrap.com/" target="_blank" rel="noreferrer">

                      {t("header.Webnmobapps_Solution_Pvt_Ltd")}

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



export default RecruiterLists;

