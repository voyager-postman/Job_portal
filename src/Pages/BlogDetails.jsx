import React from "react";
import { Link } from "react-router-dom";
function BlogDetails() {
  return (
    <>
      <div>
        {/*Start Page Banner Area*/}
        <div className="page-banner-area bg-f0f4fc">
          <div className="container">
            <div className="page-banner-content">
              <h1>Blog Details</h1>
              <ul>
                <li>
                  <a href="index-2.html">Home</a>
                </li>
                <li>Blog Details</li>
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
                        src="assets/images/blog/blog-img-15.jpg"
                        alt="Image"
                      />
                    </div>
                    <div className="info">
                      <ul>
                        <li>
                          <i className="fa-solid fa-user" />
                          <a href="#">Andrew Lawson</a>
                        </li>
                        <li>
                          <i className="fa-solid fa-calendar-days" /> Feb 12,
                          2024
                        </li>
                      </ul>
                    </div>
                    <h2>The Internet Is A Job Seeker Most Crucial Success</h2>
                    <p>
                      Lorem ipsum dolor sit amet, consectetur adipiscing elit,
                      sed do eiusmod tempor incididunt labore et dolore magna
                      aliqua Ut enim ad minim veniam, quis nostrud exercitation
                      ullamc laboris nisi ut aliquip commodo consequat. Duis
                      aute irure dolor in reprehenderit in voluptate velit esse
                      cillum dolore eu fugiat nulla pariatur commodo. Lorem
                      ipsum dolor sit amet consectetur adipisicing elit.
                      Voluptatem necessitatibus dolor placeat fuga deleniti
                      doloremque? Ratione officia quia aliquam possimus.
                    </p>
                    <p>
                      Excepteur sint occaecat cupidatat non proident, sunt in
                      culpa qui officia deserunt mollit anim id est laborum. Sed
                      ut perspiciatis unde omnis iste natus error sit voluptatem
                      accusantium sed doloremque laudantium, totam rem aperiam,
                      eaque ipsa quae ab illo inventore veritatis et quasi
                      architecto beatae vitae dicta sunt explicabo.
                    </p>
                  </div>
                  <div className="blog-deails-content">
                    <p>
                      Lorem ipsum dolor sit amet, consectetur adipiscing elit,
                      sed do eiusmod tempor incididunt labore et dolore magna
                      aliqua Ut enim ad minim veniam, quis nostrud exercitation
                      ullamc laboris nisi ut aliquip commodo consequat. Duis
                      aute irure dolor in reprehenderit in voluptate velit esse
                      cillum dolore eu fugiat nulla pariatur commodo.
                    </p>
                    <p>
                      Excepteur sint occaecat cupidatat non proident, sunt in
                      culpa qui officia deserunt mollit anim id est laborum. Sed
                      ut perspici unde omnis iste natus error sit voluptatem
                      accusantium sed doloremque laudantium.
                    </p>
                  </div>
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
