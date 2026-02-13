import axios from "axios";
import React, { useEffect } from "react";
import { useState } from "react";
import { Link } from "react-router-dom";
import { API_BASE_URL, API_IMAGE_URL } from "../Url/Url";

function Blog() {
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

  return (
    <>
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
                  <div class="inner-page-banner-title">
                    <h2>Blog</h2>
                    <ul>
                      <li class="menu-divide-arrow">
                        <Link to="/">Home</Link>
                      </li>
                      <li>Blog List</li>
                    </ul>
                  </div>
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
                          src={`${API_IMAGE_URL}/${blog.bannerImage}`}
                          alt="Image"
                        />
                      </Link>
                    </div>
                    <div className="blog-content">
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
                          Read More
                        </Link>
                      </div>
                    </div>
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
