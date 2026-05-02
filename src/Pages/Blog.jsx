import axios from "axios";
import React, { useEffect } from "react";
import { useState } from "react";
import { Link } from "react-router-dom";
import { API_BASE_URL, API_IMAGE_URL } from "../Url/Url";
import { useTranslation } from "react-i18next";
import { Helmet } from "react-helmet-async";
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

  const cleanImageUrl = (url) => {
    if (!url) return "";

    // ✅ Default local dashboard image
    if (url === "/jobPortal/assets/images/dashboard/images1.png") {
      return url;
    }

    // ✅ Fix wrong stored URL like "/uploads/https://..."
    if (url.includes("uploads/https")) {
      return url.substring(url.indexOf("https"));
    }

    // ✅ External image (Google, GitHub, etc.)
    if (url.startsWith("http://") || url.startsWith("https://")) {
      return url;
    }

    // ✅ Local uploaded image
    return `${API_IMAGE_URL}${url}`;
  };

  return (
    <>
      <Helmet>
        <title>Blog | Job Portal</title>
        <meta
          name="description"
          content="Read latest job tips, career advice and hiring insights."
        />

        <link rel="canonical" href={window.location.href} />

        {/* Open Graph */}
        <meta property="og:title" content="Blog | Job Portal" />
        <meta
          property="og:description"
          content="Read latest job tips, career advice and hiring insights."
        />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={window.location.href} />
        <meta
          property="og:image"
          content="/jobPortal/assets/images/banner/inner-banner-img.jpg"
        />

        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Blog | Job Portal" />
        <meta
          name="twitter:description"
          content="Read latest job tips and career insights."
        />

        {/* JSON-LD for Blog List */}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Blog",
            name: "Job Portal Blog",
            url: window.location.href,
            description: "Latest job tips and hiring insights",
          })}
        </script>
      </Helmet>
      <div>
        {/*Start Page Banner Area*/}
        <section class="inner-banners-info-area">
          <div class="inner-banners-img-area">
            <img
              src="/jobPortal/assets/images/banner/inner-banner-img.jpg"
              alt="breadcrumb Img"
            />
          </div>
          <div class="inner-banners-title-info">
            <div class="container">
              <div class="row">
                <div class="col-lg-12 col-md-12 col-sm-12">
                  <header class="inner-page-banner-title">
                    <h2>{t("header.blog")}</h2>
                    <ul>
                      <li class="menu-divide-arrow">
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
        {/*End Page Banner Area*/}
        {/*Start Blog Area*/}
        <div className="blog-area ptb-100">
          <div className="container">
            <div className="row">
              {blogData?.map((blog) => (
                <div
                  key={blog._id}
                  className="col-lg-4 col-md-6 aos-init aos-animate"
                  data-aos="fade-up"
                  data-aos-duration={1200}
                  data-aos-delay={200}
                >
                  <div className="single-blog-card">
                    <div className="blog-img">
                      <Link to={`/blogDetails/${blog._id}`}>
                        <img
                          crossorigin="anonymous"
                          src={cleanImageUrl(blog.bannerImage)}
                          alt="Image"
                        />
                      </Link>
                    </div>
                    <article className="blog-content">
                      <div className="info-list">
                        <ul>
                          <li>
                            <i className="fa-solid fa-user" />
                            <Link to="#">{blog.authorName}</Link>
                          </li>
                          <li>
                            <i className="fa-solid fa-calendar-days" />{" "}
                            {new Date(blog.publishDate).toLocaleDateString(
                              "en-US",
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
                        <Link to={`/blogDetails/${blog._id}`}>
                          {blog.title}
                        </Link>
                      </h2>
                      <p>{blog.content.substring(0, 150) + "..."}</p>
                      <div className="blog-btn-info-area">
                        <Link
                          to={`/blogDetails/${blog._id}`}
                          className="read-more default-btn btn"
                        >
                          {t("header.read_more")}
                        </Link>
                      </div>
                    </article>
                  </div>
                </div>
              ))}
            </div>
            <div className="paginations">
              <ul>
                <li>
                  <Link
                    to="#"
                    onClick={(e) => {
                      e.preventDefault();
                      if (pageNumber > 1) setPageNumber(pageNumber - 1);
                    }}
                    style={{
                      pointerEvents: pageNumber === 1 ? "none" : "auto",
                      opacity: pageNumber === 1 ? 0.5 : 1,
                    }}
                  >
                    <i className="fa-solid fa-angle-left" />
                  </Link>
                </li>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                  (page) => (
                    <li key={page}>
                      <Link
                        to="#"
                        className={page === pageNumber ? "active" : ""}
                        onClick={(e) => {
                          e.preventDefault();
                          setPageNumber(page);
                        }}
                      >
                        {page}
                      </Link>
                    </li>
                  ),
                )}
                <li>
                  <Link
                    to="#"
                    onClick={(e) => {
                      e.preventDefault();
                      if (pageNumber < totalPages)
                        setPageNumber(pageNumber + 1);
                    }}
                    style={{
                      pointerEvents:
                        pageNumber === totalPages ? "none" : "auto",
                      opacity: pageNumber === totalPages ? 0.5 : 1,
                    }}
                  >
                    <i className="fa-solid fa-angle-right" />
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Blog;
