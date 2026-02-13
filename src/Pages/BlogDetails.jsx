import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import axios from "axios";
import { API_BASE_URL, API_IMAGE_URL } from "../Url/Url";

function BlogDetails() {
  const { id } = useParams();
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const getBlogDetails = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${API_BASE_URL}getActiveBlogs`);

      if (res.data.success) {
        const selectedBlog = res.data.data.find(
          (item) => item._id === id || item.slug === id,
        );

        if (selectedBlog) {
          setBlog(selectedBlog);
          setError(null);
        } else {
          setError("Blog not found");
        }
      } else {
        setError("Blog not found");
      }
    } catch (error) {
      console.error("Error Fetching Blog Details:-", error);
      setError("Failed to load blog details");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
      getBlogDetails();
    }
  }, [id]);

  if (loading) {
    return (
      <div className="blog-area pt-100 pb-70">
        <div className="container">
          <div className="text-center">
            <div className="spinner-border" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="blog-area pt-100 pb-70">
        <div className="container">
          <div className="alert alert-danger" role="alert">
            {error}
          </div>
          <Link to="/blog" className="default-btn btn">
            Back to Blog List
          </Link>
        </div>
      </div>
    );
  }

  if (!blog) {
    return null;
  }

  return (
    <>
      <div>
        {/*Start Page Banner Area*/}
        <div className="page-banner-area bg-f0f4fc">
          <div className="container">
            <div className="page-banner-content">
              <h1>{blog.title}</h1>
              <ul>
                <li>
                  <Link to="/">Home</Link>
                </li>
                <li>{blog.title}</li>
              </ul>
            </div>
          </div>
        </div>
        {/*End Page Banner Area*/}
        {/*Start Blog Area*/}
        <div className="blog-area pt-100 pb-70">
          <div className="container">
            <div className="row">
              <div className="col-lg-8">
                <div className="blog-details">
                  <div className="blog-details-top-content">
                    <div className="top-image">
                      <img
                        src={
                          blog?.bannerImage
                            ? `${API_IMAGE_URL}/${blog.bannerImage}`
                            : "/images/placeholder.jpg"
                        }
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
                    <h2>{blog.title}</h2>
                    <div dangerouslySetInnerHTML={{ __html: blog.content }} />
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
                  {/* <div class="tag-and-share">
                          <div class="row align-items-center">
                              <div class="col-lg-6 col-md-7">
                                  <div class="tags">
                                      <ul>
                                          <li><i class="fa-solid fa-tag"></i></li>
                                          <li><a href="#">SEO</a></li>
                                          <li><a href="#">Business</a></li>
                                          <li><a href="#">Internet</a></li>
                                          <li><a href="#">Property</a></li>
                                      </ul>
                                  </div>
                              </div>
                              <div class="col-lg-6 col-md-5">
                                  <div class="share">
                                      <ul>
                                          <li>Share:</li>
                                          <li>
                                              <a href="https://www.facebook.com/" target="_blank"><i class="fa-brands fa-facebook-f"></i></a>
                                          </li>
                                          <li>
                                              <a href="https://www.twitter.com/" target="_blank"><i class="fa-brands fa-twitter"></i></a>
                                          </li>
                                          <li>
                                              <a href="https://instagram.com/?lang=en" target="_blank"><i class="fa-brands fa-instagram"></i></a>
                                          </li>
                                      </ul>
                                  </div>
                              </div>
                          </div>
                      </div> */}
                  {/* <div class="reply-content">
                          <h3>Leave A Reply</h3>
                          <p>Your email address will not be published. Required fields are marked</p>
                          <form>
                              <div class="row">
                                  <div class="col-lg-6 col-md-6">
                                      <div class="form-group">
                                          <input class="form-control" type="text" placeholder="Name">
                                      </div>
                                  </div>
                                  <div class="col-lg-6 col-md-6">
                                      <div class="form-group">
                                          <input class="form-control" type="email" placeholder="Email">
                                      </div>
                                  </div>
                                  <div class="col-lg-12">
                                      <div class="form-group">
                                          <textarea class="form-control" placeholder="Comment" rows="5"></textarea>
                                      </div>
                                  </div>
                              </div>
                          </form>
                      </div> */}
                </div>
              </div>
              <div className="col-lg-4">
                <div className="sidebar">
                  <div className="single-sidebar-widget search-bar">
                    <div className="form-group">
                      <input
                        className="form-control"
                        type="text"
                        placeholder="Search..."
                      />
                      <button type="submit" className="default-btn btn">
                        <i className="flaticon-search" />
                      </button>
                    </div>
                  </div>
                  {/* <div class="single-sidebar-widget categories">
                          <h3>Categories</h3>
                          <ul>
                              <li><a href="blog-grid.html">Design</a></li>
                              <li><a href="blog-grid.html">Lifestyle</a></li>
                              <li><a href="blog-grid.html">Camping</a></li>
                              <li><a href="blog-grid.html">Job</a></li>
                              <li><a href="blog-grid.html">Device</a></li>
                              <li><a href="blog-grid.html">Internet</a></li>
                          </ul>
                      </div> */}
                  <div className="single-sidebar-widget widget-peru-posts-thumb">
                    <h3>Popular Post</h3>
                    <div className="post-wrap">
                      <article className="item">
                        <a href="blog-details.html" className="thumb">
                          <span className="fullimage cover bg1" role="img" />
                        </a>
                        <div className="info">
                          <time dateTime="2024-06-30">July 30, 2024</time>
                          <h4 className="title usmall">
                            <a href="blog-details.html">
                              We’ve Weeded Through Hundreds Of Job Hunting
                            </a>
                          </h4>
                        </div>
                        <div className="clear" />
                      </article>
                      <article className="item">
                        <a href="blog-details.html" className="thumb">
                          <span className="fullimage cover bg2" role="img" />
                        </a>
                        <div className="info">
                          <time dateTime="2024-06-30">July 30, 2024</time>
                          <h4 className="title usmall">
                            <a href="blog-details.html">
                              Today From Connecting With Potential Employers
                            </a>
                          </h4>
                        </div>
                        <div className="clear" />
                      </article>
                      <article className="item">
                        <a href="blog-details.html" className="thumb">
                          <span className="fullimage cover bg3" role="img" />
                        </a>
                        <div className="info">
                          <time dateTime="2024-06-30">July 30, 2024</time>
                          <h4 className="title usmall">
                            <a href="blog-details.html">
                              We Do Friendly Behave With Our All Employee
                            </a>
                          </h4>
                        </div>
                        <div className="clear" />
                      </article>
                    </div>
                  </div>
                  {/* <div class="single-sidebar-widget tags">
                          <h3>Tags</h3>
                          <a href="blog-grid.html">Business</a>
                          <a href="blog-grid.html">Internet</a>
                          <a href="blog-grid.html">IT & Support</a>
                          <a href="blog-grid.html">SASS</a>
                          <a href="blog-grid.html">Tips</a>
                          <a href="blog-grid.html">Device</a>
                      </div> */}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default BlogDetails;
