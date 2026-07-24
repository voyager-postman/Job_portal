import React from "react";

import { Link } from "react-router-dom";

import PageSEO from "../components/PageSEO";

import { useTranslation } from "react-i18next";



function NotFound() {

  const { t } = useTranslation("global");



  return (

    <>

      <PageSEO

        title={t("notFound.seo_title")}

        description={t("notFound.seo_description")}

        canonical="/404"

        robots="noindex, nofollow"

      />

      <section className="text-center" style={{ padding: "100px" }}>

        <h1>{t("notFound.title")}</h1>

        <p>{t("notFound.message")}</p>

        <Link to="/" className="btn btn-primary mt-3">

          {t("notFound.go_home")}

        </Link>

      </section>

    </>

  );

}



export default NotFound;

