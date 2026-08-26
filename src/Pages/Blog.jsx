import axios from "axios";
import React, { useEffect } from "react";
import { useState } from "react";
import { Link } from "react-router-dom";
import { API_BASE_URL, API_IMAGE_URL } from "../Url/Url";
import { useTranslation } from "react-i18next";
import { resolveMediaUrl } from "../utils/companyLogo";

function Blog() {
  const { t, i18n } = useTranslation("global");
  const [pageNumber, setPageNumber] = useState(1);
  const [pageSize, setPageSize] = useState(15);
  const [blogData, setBlogData] = useState([]);
  const [totalPages, setTotalPages] = useState(1);

  const getBlogList = async (page = 1, limit = pageSize) => {
    try {
      const params = {
        page,
        limit,
      };

      const res = await axios.get(`${API_BASE_URL}getActiveBlogs`, {
        params,
      });
      if (res.data.success) {
        setBlogData(res.data.data);
        setPageSize(res.data.limit);
        setPageNumber(res.data.page);
        setTotalPages(res.data.totalPages);
      }
    } catch (error) {
      console.error("Error Fetching Blog Data:-", error);
    }
  };

  useEffect(() => {
    getBlogList(pageNumber);
  }, [pageNumber]);

  const cleanImageUrl = (url) => resolveMediaUrl(url) || "";

  return (
    <>
      <section className="inner-banners-info-area">
        <div className="inner-banners-img-area">
          <img
            src="/jobPortal/assets/images/banner/inner-banner-img.jpg"
            alt={t("header.blog")}
            loading="lazy"
            decoding="async"
          />
        </div>
        <div className="inner-banners-title-info">
          <div className="container">
            <div className="row">
              <div className="col-lg-12 col-md-12 col-sm-12">
                <header className="inner-page-banner-title">
                  <h1>{t("header.blog")}</h1>
                  <ul>
                    <li className="menu-divide-arrow">
                      <Link to="/">{t("header.home")}</Link>
                    </li>
                    <li>{t("header.blog_list")}</li>
                  </ul>
                </header>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="blog-area ptb-100" aria-label={t("header.blog_list")}>
        <div className="container">
          <h2 className="visually-hidden">{t("header.blog_list")}</h2>
          <div className="row">
            {blogData?.map((blog) => (
              <div
                key={blog._id}
                className="col-lg-4 col-md-6 aos-init aos-animate"
                data-aos="fade-up"
                data-aos-duration={1200}
                data-aos-delay={200}
              >
                <article className="single-blog-card">
                  <div className="blog-img">
                    <Link to={`/blogDetails/${blog._id}`}>
                      <img
                        crossOrigin="anonymous"
                        src={cleanImageUrl(blog.bannerImage)}
                        alt={blog.title || t("header.blog")}
                        loading="lazy"
                        decoding="async"
                      />
                    </Link>
                  </div>
                  <div className="blog-content">
                    <div className="info-list">
                      <ul>
                        <li>
                          <i className="fa-solid fa-user" aria-hidden="true" />
                          <span>{blog.authorName}</span>
                        </li>
                        <li>
                          <i className="fa-solid fa-calendar-days" aria-hidden="true" />{" "}
                          {new Date(blog.publishDate).toLocaleDateString(
                            i18n.language?.startsWith("fr") ? "fr-FR" : "en-US",
                            {
                              year: "numeric",
                              month: "short",
                              day: "numeric",
                            },
                          )}
                        </li>
                      </ul>
                    </div>
                    <h2>
                      <Link to={`/blogDetails/${blog._id}`}>{blog.title}</Link>
                    </h2>
                    <p>{`${String(blog.content || "").substring(0, 150)}...`}</p>
                    <div className="blog-btn-info-area">
                      <Link
                        to={`/blogDetails/${blog._id}`}
                        className="read-more default-btn btn"
                      >
                        {t("header.read_more")}
                      </Link>
                    </div>
                  </div>
                </article>
              </div>
            ))}
          </div>
          <nav className="paginations" aria-label={t("header.blog")}>
            <ul>
              <li>
                <button
                  type="button"
                  className="pagination-btn"
                  disabled={pageNumber === 1}
                  onClick={() => setPageNumber(pageNumber - 1)}
                  aria-label="Previous page"
                >
                  <i className="fa-solid fa-angle-left" aria-hidden="true" />
                </button>
              </li>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <li key={page}>
                  <button
                    type="button"
                    className={`pagination-btn${page === pageNumber ? " active" : ""}`}
                    onClick={() => setPageNumber(page)}
                    aria-current={page === pageNumber ? "page" : undefined}
                  >
                    {page}
                  </button>
                </li>
              ))}
              <li>
                <button
                  type="button"
                  className="pagination-btn"
                  disabled={pageNumber === totalPages}
                  onClick={() => setPageNumber(pageNumber + 1)}
                  aria-label="Next page"
                >
                  <i className="fa-solid fa-angle-right" aria-hidden="true" />
                </button>
              </li>
            </ul>
          </nav>
        </div>
      </section>
    </>
  );
}

export default Blog;
