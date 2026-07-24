import React, { useCallback, useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import axios from "axios";
import { API_BASE_URL, API_IMAGE_URL } from "../Url/Url";
import { useTranslation } from "react-i18next";
import PageSEO from "../components/PageSEO";
import {
  absoluteUrl,
  buildBlogPostingSchema,
  buildBreadcrumbSchema,
  stripHtml,
  SITE,
} from "../utils/seo";

const POPULAR_POSTS_LIMIT = 5;

function BlogDetails() {
  const { t, i18n } = useTranslation("global");
  const { id } = useParams();
  const [blog, setBlog] = useState(null);
  const [popularPosts, setPopularPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const cleanImageUrl = useCallback((url) => {
    if (!url) return "";

    if (url === "/jobPortal/assets/images/dashboard/images1.png") {
      return url;
    }

    if (url.includes("uploads/https")) {
      return url.substring(url.indexOf("https"));
    }

    if (url.startsWith("http://") || url.startsWith("https://")) {
      return url;
    }

    return `${API_IMAGE_URL}${url}`;
  }, []);

  const formatPublishDate = (date) => {
    if (!date) return "";
    return new Date(date).toLocaleDateString(
      i18n.language?.startsWith("fr") ? "fr-FR" : "en-US",
      {
        year: "numeric",
        month: "short",
        day: "numeric",
      },
    );
  };

  const getBlogDetails = useCallback(async () => {
    if (!id) return;

    try {
      setLoading(true);
      const res = await axios.get(`${API_BASE_URL}getBlog/${id}`, {
        params: { popularLimit: POPULAR_POSTS_LIMIT },
      });

      if (res.data?.success && res.data?.data) {
        setBlog(res.data.data);
        setPopularPosts(
          (res.data.popularPosts || []).filter((post) => post._id !== id),
        );
        setError(null);
      } else {
        setBlog(null);
        setPopularPosts([]);
        setError("Blog not found");
      }
    } catch (fetchError) {
      console.error("Error Fetching Blog Details:-", fetchError);
      setBlog(null);
      setPopularPosts([]);
      setError("Failed to load blog details");
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    getBlogDetails();
  }, [getBlogDetails]);

  if (loading) {
    return (
      <>
        <PageSEO
          title={t("header.blog")}
          description={SITE.defaultDescription}
          canonical={`/blogDetails/${id}`}
          robots="index, follow"
        />
        <div className="blog-area pt-100 pb-70">
          <div className="container">
            <div className="text-center">
              <div className="spinner-border" role="status">
                <span className="visually-hidden">{t("header.Loading")}</span>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }

  if (error) {
    return (
      <>
        <PageSEO
          title={t("header.blog")}
          description={SITE.defaultDescription}
          canonical={`/blogDetails/${id}`}
          robots="noindex, follow"
        />
        <div className="blog-area pt-100 pb-70">
          <div className="container">
            <div className="alert alert-danger" role="alert">
              {error}
            </div>
            <Link to="/blog" className="default-btn btn">
              {t("header.Back_to_Blog_List")}
            </Link>
          </div>
        </div>
      </>
    );
  }

  if (!blog) {
    return null;
  }

  return (
    <>
      <PageSEO
        title={blog.title}
        description={stripHtml(blog.content)}
        canonical={`/blogDetails/${id}`}
        image={cleanImageUrl(blog.bannerImage)}
        ogType="article"
        articlePublishedTime={blog.publishDate || blog.createdAt}
        articleAuthor={blog.authorName}
        jsonLd={[
          buildBlogPostingSchema(
            blog,
            absoluteUrl(`/blogDetails/${id}`),
          ),
          buildBreadcrumbSchema([
            { name: t("header.home"), path: "/" },
            { name: t("header.blog"), path: "/blog" },
            { name: blog.title, path: `/blogDetails/${id}` },
          ]),
        ]}
      />
      <article>
        <div className="page-banner-area bg-f0f4fc">
          <div className="container">
            <div className="page-banner-content">
              <h1>{blog.title}</h1>
              <ul>
                <li>
                  <Link to="/">{t("header.home")}</Link>
                </li>
                <li>
                  <Link to="/blog">{t("header.blog")}</Link>
                </li>
                <li>{blog.title}</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="blog-area pt-100 pb-70">
          <div className="container">
            <div className="row">
              <div className="col-lg-8">
                <div className="blog-details">
                  <div className="blog-details-top-content">
                    <div className="top-image">
                      <img
                        crossOrigin="anonymous"
                        src={cleanImageUrl(blog.bannerImage)}
                        alt={blog?.title}
                      />
                    </div>
                    <div className="info">
                      <ul>
                        <li>
                          <i className="fa-solid fa-user" />
                          <Link to="#">{blog.authorName}</Link>
                        </li>
                        <li>
                          <i className="fa-solid fa-calendar-days" />{" "}
                          {formatPublishDate(blog.publishDate)}
                        </li>
                      </ul>
                    </div>
                    <div
                      className="blog-article-body"
                      dangerouslySetInnerHTML={{ __html: blog.content }}
                    />
                  </div>
                  {blog.additionalContent && (
                    <div className="blog-deails-content">
                      <div
                        dangerouslySetInnerHTML={{
                          __html: blog.additionalContent,
                        }}
                      />
                    </div>
                  )}
                </div>
              </div>

              <div className="col-lg-4">
                <div className="sidebar">
                  {popularPosts.length > 0 && (
                    <div className="single-sidebar-widget widget-peru-posts-thumb">
                      <h3>{t("header.blog_list")}</h3>
                      <div className="post-wrap">
                        {popularPosts.map((post, index) => (
                          <article className="item" key={post._id}>
                            <Link
                              to={`/blogDetails/${post._id}`}
                              className="thumb"
                            >
                              {post.bannerImage ? (
                                <img
                                  crossOrigin="anonymous"
                                  src={cleanImageUrl(post.bannerImage)}
                                  alt={post.title}
                                  className="fullimage cover"
                                />
                              ) : (
                                <span
                                  className={`fullimage cover bg${
                                    (index % 3) + 1
                                  }`}
                                  role="img"
                                  aria-label={post.title}
                                />
                              )}
                            </Link>
                            <div className="info">
                              <time dateTime={post.publishDate || ""}>
                                {formatPublishDate(post.publishDate)}
                              </time>
                              <h4 className="title usmall">
                                <Link to={`/blogDetails/${post._id}`}>
                                  {post.title}
                                </Link>
                              </h4>
                              {post.authorName && (
                                <p className="mb-0 small text-muted">
                                  {post.authorName}
                                </p>
                              )}
                            </div>
                            <div className="clear" />
                          </article>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </article>
    </>
  );
}

export default BlogDetails;
