// components/layout.jsx
import React from "react";
import Script from "next/script";
import { useState, useEffect } from "react";
import { isLoggedIn, logout, getToken } from "../utils/auth";
import { useRouter } from "next/router";


import "./../styles/vendor/css/pages/front-page.module.css";
import "./../styles/vendor/css/pages/front-page-landing.module.css";

//styles/vendor/css/pages/front-page.module.css

export default function Layout({ children }) {
  const [isClient, setIsClient] = useState(false);

  const [userLoggedIn, setUserLoggedIn] = useState(false);

  const router = useRouter();

  const handleLogout = async (event) => {
    event.preventDefault();
    const token = getToken();

    if (!token) {
      console.log("No active session or token expired");
      logout();
      setUserLoggedIn(false);
      router.push("/signin");
      return;
    }

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/logout/`,
      {
        method: "POST",
        headers: new Headers({
          Authorization: `Token ${token}`,
        }),
      }
    );

    if (response.ok) {
      logout();
      setUserLoggedIn(false);
      router.push("/signin"); // Redirect to the login page or home page
    } else {
      console.error("Logout failed");
    }
  };

  useEffect(() => {
    setUserLoggedIn(isLoggedIn());
  }, []);

  useEffect(() => {
    setIsClient(true);
  }, []);

  return (
    <>
      <Script src="/assets/vendor/js/helpers.js" strategy="beforeInteractive" />
      <Script src="/assets/js/front-config.js" strategy="beforeInteractive" />
      <Script
        src="/assets/vendor/js/dropdown-hover.js"
        strategy="beforeInteractive"
      />
      <Script
        src="/assets/vendor/js/mega-dropdown.js"
        strategy="beforeInteractive"
      />

      <nav className="layout-navbar shadow-none py-0">
        <div className="container">
          <div className="navbar navbar-expand-lg landing-navbar px-3 px-md-4 ">
            <div className="navbar-brand app-brand demo d-flex py-0 me-4">
              <button
                className="navbar-toggler border-0 px-0 me-2"
                type="button"
                data-bs-toggle="collapse"
                data-bs-target="#navbarSupportedContent"
                aria-controls="navbarSupportedContent"
                aria-expanded="false"
                aria-label="Toggle navigation"
              >
                <i className="tf-icons bx bx-menu bx-sm align-middle" />
              </button>

              <a href="" className="app-brand-link">
                <span className="app-brand-logo demo">
                  <svg
                    width={25}
                    viewBox="0 0 25 42"
                    version="1.1"
                    xmlns="http://www.w3.org/2000/svg"
                    xmlnsXlink="http://www.w3.org/1999/xlink"
                  >
                    <defs>
                      <path
                        d="M13.7918663,0.358365126 L3.39788168,7.44174259 C0.566865006,9.69408886 -0.379795268,12.4788597 0.557900856,15.7960551 C0.68998853,16.2305145 1.09562888,17.7872135 3.12357076,19.2293357 C3.8146334,19.7207684 5.32369333,20.3834223 7.65075054,21.2172976 L7.59773219,21.2525164 L2.63468769,24.5493413 C0.445452254,26.3002124 0.0884951797,28.5083815 1.56381646,31.1738486 C2.83770406,32.8170431 5.20850219,33.2640127 7.09180128,32.5391577 C8.347334,32.0559211 11.4559176,30.0011079 16.4175519,26.3747182 C18.0338572,24.4997857 18.6973423,22.4544883 18.4080071,20.2388261 C17.963753,17.5346866 16.1776345,15.5799961 13.0496516,14.3747546 L10.9194936,13.4715819 L18.6192054,7.984237 L13.7918663,0.358365126 Z"
                        id="path-1"
                      />
                      <path
                        d="M5.47320593,6.00457225 C4.05321814,8.216144 4.36334763,10.0722806 6.40359441,11.5729822 C8.61520715,12.571656 10.0999176,13.2171421 10.8577257,13.5094407 L15.5088241,14.433041 L18.6192054,7.984237 C15.5364148,3.11535317 13.9273018,0.573395879 13.7918663,0.358365126 C13.5790555,0.511491653 10.8061687,2.3935607 5.47320593,6.00457225 Z"
                        id="path-3"
                      />
                      <path
                        d="M7.50063644,21.2294429 L12.3234468,23.3159332 C14.1688022,24.7579751 14.397098,26.4880487 13.008334,28.506154 C11.6195701,30.5242593 10.3099883,31.790241 9.07958868,32.3040991 C5.78142938,33.4346997 4.13234973,34 4.13234973,34 C4.13234973,34 2.75489982,33.0538207 2.37032616e-14,31.1614621 C-0.55822714,27.8186216 -0.55822714,26.0572515 -4.05231404e-15,25.8773518 C0.83734071,25.6075023 2.77988457,22.8248993 3.3049379,22.52991 C3.65497346,22.3332504 5.05353963,21.8997614 7.50063644,21.2294429 Z"
                        id="path-4"
                      />
                      <path
                        d="M20.6,7.13333333 L25.6,13.8 C26.2627417,14.6836556 26.0836556,15.9372583 25.2,16.6 C24.8538077,16.8596443 24.4327404,17 24,17 L14,17 C12.8954305,17 12,16.1045695 12,15 C12,14.5672596 12.1403557,14.1461923 12.4,13.8 L17.4,7.13333333 C18.0627417,6.24967773 19.3163444,6.07059163 20.2,6.73333333 C20.3516113,6.84704183 20.4862915,6.981722 20.6,7.13333333 Z"
                        id="path-5"
                      />
                    </defs>
                    <g
                      id="g-app-brand"
                      stroke="none"
                      strokeWidth={1}
                      fill="none"
                      fillRule="evenodd"
                    >
                      <g
                        id="Brand-Logo"
                        transform="translate(-27.000000, -15.000000)"
                      >
                        <g
                          id="Icon"
                          transform="translate(27.000000, 15.000000)"
                        >
                          <g
                            id="Mask"
                            transform="translate(0.000000, 8.000000)"
                          >
                            <mask id="mask-2" fill="white">
                              <use xlinkHref="#path-1" />
                            </mask>
                            <use fill="#696cff" xlinkHref="#path-1" />
                            <g id="Path-3" mask="url(#mask-2)">
                              <use fill="#696cff" xlinkHref="#path-3" />
                              <use
                                fillOpacity="0.2"
                                fill="#FFFFFF"
                                xlinkHref="#path-3"
                              />
                            </g>
                            <g id="Path-4" mask="url(#mask-2)">
                              <use fill="#696cff" xlinkHref="#path-4" />
                              <use
                                fillOpacity="0.2"
                                fill="#FFFFFF"
                                xlinkHref="#path-4"
                              />
                            </g>
                          </g>
                          <g
                            id="Triangle"
                            transform="translate(19.000000, 11.000000) rotate(-300.000000) translate(-19.000000, -11.000000) "
                          >
                            <use fill="#696cff" xlinkHref="#path-5" />
                            <use
                              fillOpacity="0.2"
                              fill="#FFFFFF"
                              xlinkHref="#path-5"
                            />
                          </g>
                        </g>
                      </g>
                    </g>
                  </svg>
                </span>
                <span className="app-brand-text demo menu-text fw-bold ms-2 ps-1">
                  {process.env.NEXT_PUBLIC_DOMAIN_NAME}
                </span>
              </a>
            </div>

            <div
              className="collapse navbar-collapse landing-nav-menu"
              id="navbarSupportedContent"
            >
              <button
                className="navbar-toggler border-0 text-heading position-absolute end-0 top-0 scaleX-n1-rtl"
                type="button"
                data-bs-toggle="collapse"
                data-bs-target="#navbarSupportedContent"
                aria-controls="navbarSupportedContent"
                aria-expanded="false"
                aria-label="Toggle navigation"
              >
                <i className="tf-icons bx bx-x bx-sm" />
              </button>
              <ul className="navbar-nav me-auto">
                <li className="nav-item">
                  <a
                    className="nav-link fw-medium"
                    aria-current="page"
                    href="#landingHero"
                  >
                    Home
                  </a>
                </li>
                <li className="nav-item">
                  <a className="nav-link fw-medium" href="#landingFeatures">
                    Features
                  </a>
                </li>
                <li className="nav-item">
                  <a className="nav-link fw-medium" href="#landingTeam">
                    Team
                  </a>
                </li>
                <li className="nav-item">
                  <a className="nav-link fw-medium" href="l#landingFAQ">
                    FAQ
                  </a>
                </li>
                <li className="nav-item">
                  <a className="nav-link fw-medium" href="#landingContact">
                    Contact us
                  </a>
                </li>

                {userLoggedIn && (
                  <li className="nav-item">
                    <a className="nav-link fw-medium" href="/dashboard">
                      Dashboard
                    </a>
                  </li>
                )}
              </ul>
            </div>
            <div className="landing-menu-overlay d-lg-none" />

            <ul className="navbar-nav flex-row align-items-center ms-auto">
              <li className="nav-item dropdown-style-switcher dropdown me-2 me-xl-0">
                <a
                  className="nav-link dropdown-toggle hide-arrow"
                  href="#"
                  onClick={(e) => e.preventDefault()}
                  data-bs-toggle="dropdown"
                >
                  <i className="bx bx-sm" />
                </a>
                <ul className="dropdown-menu dropdown-menu-end dropdown-styles">
                  <li>
                    <a
                      className="dropdown-item"
                      href="#"
                      onClick={(e) => e.preventDefault()}
                      data-theme="light"
                    >
                      <span className="align-middle">
                        <i className="bx bx-sun me-2" />
                        Light
                      </span>
                    </a>
                  </li>
                  <li>
                    <a
                      className="dropdown-item"
                      href="#"
                      onClick={(e) => e.preventDefault()}
                      data-theme="dark"
                    >
                      <span className="align-middle">
                        <i className="bx bx-moon me-2" />
                        Dark
                      </span>
                    </a>
                  </li>
                  <li>
                    <a
                      className="dropdown-item"
                      href="#"
                      onClick={(e) => e.preventDefault()}
                      data-theme="system"
                    >
                      <span className="align-middle">
                        <i className="bx bx-desktop me-2" />
                        System
                      </span>
                    </a>
                  </li>
                </ul>
              </li>

              {!userLoggedIn ? (
                // Signin/Register button if not logged in
                <li>
                  <a href="/signin" className="btn btn-primary">
                    <span className="tf-icons bx bx-user me-md-1" />
                    <span className="d-none d-md-block">Signin/Register</span>
                  </a>
                </li>
              ) : (
                // Logout button if logged in
                <li>
                  <a
                    href="#"
                    onClick={handleLogout}
                    className="btn btn-primary"
                  >
                    <span className="tf-icons bx bx-log-out me-md-1" />
                    <span className="d-none d-md-block">Logout</span>
                  </a>
                </li>
              )}
            </ul>
          </div>
        </div>
      </nav>

      <div data-bs-spy="scroll" className="scrollspy-example">
        <section id="hero-animation">
          <div
            id="landingHero"
            className="section-py landing-hero position-relative"
          >
            <img
              src="../../assets/img/front-pages/backgrounds/hero-bg.png"
              alt="hero background"
              className="position-absolute top-0 start-50 translate-middle-x object-fit-contain w-100 h-100"
              data-speed={1}
            />
            <div className="container">
              <div className="hero-text-box text-center">
                <h1 className="text-primary hero-title display-4 fw-bold">
                  One dashboard to manage all your businesses
                </h1>
                <h2 className="hero-sub-title h6 mb-4 pb-1">
                  Production-ready &amp; easy to use Admin Template
                  <br className="d-none d-lg-block" />
                  for Reliability and Customizability.
                </h2>
              </div>
            </div>
          </div>
        </section>

        <section id="landingFeatures" className="section-py landing-features">
          <div className="container">
            <div className="text-center mb-3 pb-1">
              <span className="badge bg-label-primary">Useful Features</span>
            </div>
            <h3 className="text-center mb-1">
              Everything you need to start your next project
            </h3>
            <p className="text-center mb-3 mb-md-5 pb-3">
              Not just a set of tools, the package includes ready-to-deploy
              conceptual application.
            </p>
            <div className="features-icon-wrapper row gx-0 gy-4 g-sm-5">
              <div className="col-lg-4 col-sm-6 text-center features-icon-box">
                <div className="text-center mb-3">
                  <img
                    src="../../assets/img/front-pages/icons/laptop.png"
                    alt="laptop charging"
                  />
                </div>
                <h5 className="mb-3">Quality Code</h5>
                <p className="features-icon-description">
                  Code structure that all developers will easily understand and
                  fall in love with.
                </p>
              </div>
              <div className="col-lg-4 col-sm-6 text-center features-icon-box">
                <div className="text-center mb-3">
                  <img
                    src="../../assets/img/front-pages/icons/rocket.png"
                    alt="transition up"
                  />
                </div>
                <h5 className="mb-3">Continuous Updates</h5>
                <p className="features-icon-description">
                  Free updates for the next 12 months, including new demos and
                  features.
                </p>
              </div>
              <div className="col-lg-4 col-sm-6 text-center features-icon-box">
                <div className="text-center mb-3">
                  <img
                    src="../../assets/img/front-pages/icons/paper.png"
                    alt="edit"
                  />
                </div>
                <h5 className="mb-3">Stater-Kit</h5>
                <p className="features-icon-description">
                  Start your project quickly without having to remove
                  unnecessary features.
                </p>
              </div>
              <div className="col-lg-4 col-sm-6 text-center features-icon-box">
                <div className="text-center mb-3">
                  <img
                    src="../../assets/img/front-pages/icons/check.png"
                    alt="3d select solid"
                  />
                </div>
                <h5 className="mb-3">API Ready</h5>
                <p className="features-icon-description">
                  Just change the endpoint and see your own data loaded within
                  seconds.
                </p>
              </div>
              <div className="col-lg-4 col-sm-6 text-center features-icon-box">
                <div className="text-center mb-3">
                  <img
                    src="../../assets/img/front-pages/icons/user.png"
                    alt="lifebelt"
                  />
                </div>
                <h5 className="mb-3">Excellent Support</h5>
                <p className="features-icon-description">
                  An easy-to-follow doc with lots of references and code
                  examples.
                </p>
              </div>
              <div className="col-lg-4 col-sm-6 text-center features-icon-box">
                <div className="text-center mb-3">
                  <img
                    src="../../assets/img/front-pages/icons/keyboard.png"
                    alt="google docs"
                  />
                </div>
                <h5 className="mb-3">Well Documented</h5>
                <p className="features-icon-description">
                  An easy-to-follow doc with lots of references and code
                  examples.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section
          id="landingReviews"
          className="section-py bg-body landing-reviews pb-0"
        >
          {/* What people say slider: Start */}

          <div className="container">
            <div className="row align-items-center gx-0 gy-4 g-lg-5">
              <div className="col-md-6 col-lg-5 col-xl-3">
                <div className="mb-3 pb-1">
                  <span className="badge bg-label-primary">
                    Real Customers Reviews
                  </span>
                </div>
                <h3 className="mb-1">What people say</h3>
                <p className="mb-3 mb-md-5">
                  See what our customers have to
                  <br className="d-none d-xl-block" />
                  say about their experience.
                </p>
                <div className="landing-reviews-btns d-flex align-items-center gap-3">
                  <button
                    id="reviews-previous-btn"
                    className="btn btn-label-primary reviews-btn"
                    type="button"
                  >
                    <i className="bx bx-chevron-left bx-sm" />
                  </button>
                  <button
                    id="reviews-next-btn"
                    className="btn btn-label-primary reviews-btn"
                    type="button"
                  >
                    <i className="bx bx-chevron-right bx-sm" />
                  </button>
                </div>
              </div>
              <div className="col-md-6 col-lg-7 col-xl-9">
                <div className="swiper-reviews-carousel overflow-hidden mb-5 pb-md-2 pb-md-3">
                  <div className="swiper" id="swiper-reviews">
                    <div className="swiper-wrapper">
                      <div className="swiper-slide">
                        <div className="card h-100">
                          <div className="card-body text-body d-flex flex-column justify-content-between h-100">
                            <div className="mb-3">
                              <img
                                src="../../assets/img/front-pages/branding/logo-1.png"
                                alt="client logo"
                                className="client-logo img-fluid"
                              />
                            </div>
                            <p>
                              “Vuexy is hands down the most useful front end
                              Bootstrap theme I've ever used. I can't wait to
                              use it again for my next project.”
                            </p>
                            <div className="text-warning mb-3">
                              <i className="bx bxs-star bx-sm" />
                              <i className="bx bxs-star bx-sm" />
                              <i className="bx bxs-star bx-sm" />
                              <i className="bx bxs-star bx-sm" />
                              <i className="bx bxs-star bx-sm" />
                            </div>
                            <div className="d-flex align-items-center">
                              <div className="avatar me-2 avatar-sm">
                                <img
                                  src="../../assets/img/avatars/1.png"
                                  alt="Avatar"
                                  className="rounded-circle"
                                />
                              </div>
                              <div>
                                <h6 className="mb-0">Cecilia Payne</h6>
                                <p className="small text-muted mb-0">
                                  CEO of Airbnb
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="swiper-slide">
                        <div className="card h-100">
                          <div className="card-body text-body d-flex flex-column justify-content-between h-100">
                            <div className="mb-3">
                              <img
                                src="../../assets/img/front-pages/branding/logo-2.png"
                                alt="client logo"
                                className="client-logo img-fluid"
                              />
                            </div>
                            <p>
                              “I've never used a theme as versatile and flexible
                              as Vuexy. It's my go to for building dashboard
                              sites on almost any project.”
                            </p>
                            <div className="text-warning mb-3">
                              <i className="bx bxs-star bx-sm" />
                              <i className="bx bxs-star bx-sm" />
                              <i className="bx bxs-star bx-sm" />
                              <i className="bx bxs-star bx-sm" />
                              <i className="bx bxs-star bx-sm" />
                            </div>
                            <div className="d-flex align-items-center">
                              <div className="avatar me-2 avatar-sm">
                                <img
                                  src="../../assets/img/avatars/2.png"
                                  alt="Avatar"
                                  className="rounded-circle"
                                />
                              </div>
                              <div>
                                <h6 className="mb-0">Eugenia Moore</h6>
                                <p className="small text-muted mb-0">
                                  Founder of Hubspot
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="swiper-slide">
                        <div className="card h-100">
                          <div className="card-body text-body d-flex flex-column justify-content-between h-100">
                            <div className="mb-3">
                              <img
                                src="../../assets/img/front-pages/branding/logo-3.png"
                                alt="client logo"
                                className="client-logo img-fluid"
                              />
                            </div>
                            <p>
                              This template is really clean &amp; well
                              documented. The docs are really easy to understand
                              and it's always easy to find a screenshot from
                              their website.
                            </p>
                            <div className="text-warning mb-3">
                              <i className="bx bxs-star bx-sm" />
                              <i className="bx bxs-star bx-sm" />
                              <i className="bx bxs-star bx-sm" />
                              <i className="bx bxs-star bx-sm" />
                              <i className="bx bxs-star bx-sm" />
                            </div>
                            <div className="d-flex align-items-center">
                              <div className="avatar me-2 avatar-sm">
                                <img
                                  src="../../assets/img/avatars/3.png"
                                  alt="Avatar"
                                  className="rounded-circle"
                                />
                              </div>
                              <div>
                                <h6 className="mb-0">Curtis Fletcher</h6>
                                <p className="small text-muted mb-0">
                                  Design Lead at Dribbble
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="swiper-slide">
                        <div className="card h-100">
                          <div className="card-body text-body d-flex flex-column justify-content-between h-100">
                            <div className="mb-3">
                              <img
                                src="../../assets/img/front-pages/branding/logo-4.png"
                                alt="client logo"
                                className="client-logo img-fluid"
                              />
                            </div>
                            <p>
                              All the requirements for developers have been
                              taken into consideration, so I’m able to build any
                              interface I want.
                            </p>
                            <div className="text-warning mb-3">
                              <i className="bx bxs-star bx-sm" />
                              <i className="bx bxs-star bx-sm" />
                              <i className="bx bxs-star bx-sm" />
                              <i className="bx bxs-star bx-sm" />
                              <i className="bx bx-star bx-sm" />
                            </div>
                            <div className="d-flex align-items-center">
                              <div className="avatar me-2 avatar-sm">
                                <img
                                  src="../../assets/img/avatars/4.png"
                                  alt="Avatar"
                                  className="rounded-circle"
                                />
                              </div>
                              <div>
                                <h6 className="mb-0">Sara Smith</h6>
                                <p className="small text-muted mb-0">
                                  Founder of Continental
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="swiper-slide">
                        <div className="card h-100">
                          <div className="card-body text-body d-flex flex-column justify-content-between h-100">
                            <div className="mb-3">
                              <img
                                src="../../assets/img/front-pages/branding/logo-5.png"
                                alt="client logo"
                                className="client-logo img-fluid"
                              />
                            </div>
                            <p>
                              “I've never used a theme as versatile and flexible
                              as Vuexy. It's my go to for building dashboard
                              sites on almost any project.”
                            </p>
                            <div className="text-warning mb-3">
                              <i className="bx bxs-star bx-sm" />
                              <i className="bx bxs-star bx-sm" />
                              <i className="bx bxs-star bx-sm" />
                              <i className="bx bxs-star bx-sm" />
                              <i className="bx bxs-star bx-sm" />
                            </div>
                            <div className="d-flex align-items-center">
                              <div className="avatar me-2 avatar-sm">
                                <img
                                  src="../../assets/img/avatars/5.png"
                                  alt="Avatar"
                                  className="rounded-circle"
                                />
                              </div>
                              <div>
                                <h6 className="mb-0">Eugenia Moore</h6>
                                <p className="small text-muted mb-0">
                                  Founder of Hubspot
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="swiper-slide">
                        <div className="card h-100">
                          <div className="card-body text-body d-flex flex-column justify-content-between h-100">
                            <div className="mb-3">
                              <img
                                src="../../assets/img/front-pages/branding/logo-6.png"
                                alt="client logo"
                                className="client-logo img-fluid"
                              />
                            </div>
                            <p>
                              Lorem ipsum dolor sit amet consectetur adipisicing
                              elit. Veniam nemo mollitia, ad eum officia numquam
                              nostrum repellendus consequuntur!
                            </p>
                            <div className="text-warning mb-3">
                              <i className="bx bxs-star bx-sm" />
                              <i className="bx bxs-star bx-sm" />
                              <i className="bx bxs-star bx-sm" />
                              <i className="bx bxs-star bx-sm" />
                              <i className="bx bx-star bx-sm" />
                            </div>
                            <div className="d-flex align-items-center">
                              <div className="avatar me-2 avatar-sm">
                                <img
                                  src="../../assets/img/avatars/1.png"
                                  alt="Avatar"
                                  className="rounded-circle"
                                />
                              </div>
                              <div>
                                <h6 className="mb-0">Sara Smith</h6>
                                <p className="small text-muted mb-0">
                                  Founder of Continental
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="swiper-button-next" />
                    <div className="swiper-button-prev" />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <hr className="m-0" />

          <div className="container">
            <div className="swiper-logo-carousel py-4 my-lg-2">
              <div className="swiper" id="swiper-clients-logos">
                <div className="swiper-wrapper">
                  <div className="swiper-slide">
                    <img
                      src="../../assets/img/front-pages/branding/logo_1-light.png"
                      alt="client logo"
                      className="client-logo"
                      data-app-light-img="front-pages/branding/logo_1-light.png"
                      data-app-dark-img="front-pages/branding/logo_1-dark.png"
                    />
                  </div>
                  <div className="swiper-slide">
                    <img
                      src="../../assets/img/front-pages/branding/logo_2-light.png"
                      alt="client logo"
                      className="client-logo"
                      data-app-light-img="front-pages/branding/logo_2-light.png"
                      data-app-dark-img="front-pages/branding/logo_2-dark.png"
                    />
                  </div>
                  <div className="swiper-slide">
                    <img
                      src="../../assets/img/front-pages/branding/logo_3-light.png"
                      alt="client logo"
                      className="client-logo"
                      data-app-light-img="front-pages/branding/logo_3-light.png"
                      data-app-dark-img="front-pages/branding/logo_3-dark.png"
                    />
                  </div>
                  <div className="swiper-slide">
                    <img
                      src="../../assets/img/front-pages/branding/logo_4-light.png"
                      alt="client logo"
                      className="client-logo"
                      data-app-light-img="front-pages/branding/logo_4-light.png"
                      data-app-dark-img="front-pages/branding/logo_4-dark.png"
                    />
                  </div>
                  <div className="swiper-slide">
                    <img
                      src="../../assets/img/front-pages/branding/logo_5-light.png"
                      alt="client logo"
                      className="client-logo"
                      data-app-light-img="front-pages/branding/logo_5-light.png"
                      data-app-dark-img="front-pages/branding/logo_5-dark.png"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="landingTeam" className="section-py landing-team">
          <div className="container">
            <div className="text-center mb-3 pb-1">
              <span className="badge bg-label-primary">Our Great Team</span>
            </div>
            <h3 className="text-center mb-1">Supported by Real People</h3>
            <p className="text-center mb-md-5 pb-3">
              Who is behind these great-looking interfaces?
            </p>
            <div className="row gy-5 mt-2">
              <div className="col-lg-3 col-sm-6">
                <div className="card mt-3 mt-lg-0 shadow-none">
                  <div className="bg-label-primary position-relative team-image-box">
                    <img
                      src="../../assets/img/front-pages/landing-page/team-member-1.png"
                      className="position-absolute card-img-position bottom-0 start-50 scaleX-n1-rtl"
                      alt="human image"
                    />
                  </div>
                  <div className="card-body border border-top-0 border-label-primary text-center">
                    <h5 className="card-title mb-0">Sophie Gilbert</h5>
                    <p className="text-muted mb-0">Project Manager</p>
                  </div>
                </div>
              </div>
              <div className="col-lg-3 col-sm-6">
                <div className="card mt-3 mt-lg-0 shadow-none">
                  <div className="bg-label-info position-relative team-image-box">
                    <img
                      src="../../assets/img/front-pages/landing-page/team-member-2.png"
                      className="position-absolute card-img-position bottom-0 start-50 scaleX-n1-rtl"
                      alt="human image"
                    />
                  </div>
                  <div className="card-body border border-top-0 border-label-info text-center">
                    <h5 className="card-title mb-0">Paul Miles</h5>
                    <p className="text-muted mb-0">UI Designer</p>
                  </div>
                </div>
              </div>
              <div className="col-lg-3 col-sm-6">
                <div className="card mt-3 mt-lg-0 shadow-none">
                  <div className="bg-label-danger position-relative team-image-box">
                    <img
                      src="../../assets/img/front-pages/landing-page/team-member-3.png"
                      className="position-absolute card-img-position bottom-0 start-50 scaleX-n1-rtl"
                      alt="human image"
                    />
                  </div>
                  <div className="card-body border border-top-0 border-label-danger text-center">
                    <h5 className="card-title mb-0">Nannie Ford</h5>
                    <p className="text-muted mb-0">Development Lead</p>
                  </div>
                </div>
              </div>
              <div className="col-lg-3 col-sm-6">
                <div className="card mt-3 mt-lg-0 shadow-none">
                  <div className="bg-label-success position-relative team-image-box">
                    <img
                      src="../../assets/img/front-pages/landing-page/team-member-4.png"
                      className="position-absolute card-img-position bottom-0 start-50 scaleX-n1-rtl"
                      alt="human image"
                    />
                  </div>
                  <div className="card-body border border-top-0 border-label-success text-center">
                    <h5 className="card-title mb-0">Chris Watkins</h5>
                    <p className="text-muted mb-0">Marketing Manager</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section
          id="landingPricing"
          className="section-py bg-body landing-pricing"
        >
          <div className="container">
            <div className="text-center mb-3 pb-1">
              <span className="badge bg-label-primary">Pricing Plans</span>
            </div>
            <h3 className="text-center mb-1">
              Tailored pricing plans designed for you
            </h3>
            <p className="text-center mb-4 pb-3">
              All plans include 40+ advanced tools and features to boost your
              product.
              <br />
              Choose the best plan to fit your needs.
            </p>
            <div className="text-center mb-5">
              <div className="position-relative d-inline-block pt-3 pt-md-0">
                <label className="switch switch-primary me-0">
                  <span className="switch-label">Pay Monthly</span>
                  <input
                    type="checkbox"
                    className="switch-input price-duration-toggler"
                    defaultChecked=""
                  />
                  <span className="switch-toggle-slider">
                    <span className="switch-on" />
                    <span className="switch-off" />
                  </span>
                  <span className="switch-label">Pay Annual</span>
                </label>
                <div className="pricing-plans-item position-absolute d-flex">
                  <img
                    src="../../assets/img/front-pages/icons/pricing-plans-arrow.png"
                    alt="pricing plans arrow"
                    className="scaleX-n1-rtl"
                  />
                  <span className="fw-medium mt-2 ms-1"> Save 25%</span>
                </div>
              </div>
            </div>
            <div className="row gy-4 pt-lg-3">
              {/* Basic Plan: Start */}

              <div className="col-xl-4 col-lg-6">
                <div className="card">
                  <div className="card-header">
                    <div className="text-center">
                      <img
                        src="../../assets/img/front-pages/icons/paper-airplane.png"
                        alt="paper airplane icon"
                        className="mb-4 pb-2 scaleX-n1-rtl"
                      />
                      <h4 className="mb-1">Basic</h4>
                      <div className="d-flex align-items-center justify-content-center">
                        <span className="price-monthly h1 text-primary fw-bold mb-0">
                          $19
                        </span>
                        <span className="price-yearly h1 text-primary fw-bold mb-0 d-none">
                          $14
                        </span>
                        <sub className="h6 text-muted mb-0 ms-1">/mo</sub>
                      </div>
                      <div className="position-relative pt-2">
                        <div className="price-yearly text-muted price-yearly-toggle d-none">
                          $ 168 / year
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="card-body">
                    <ul className="list-unstyled">
                      <li>
                        <h5>
                          <span className="badge badge-center rounded-pill bg-label-primary p-0 me-2">
                            <i className="bx bx-check bx-xs" />
                          </span>
                          Timeline
                        </h5>
                      </li>
                      <li>
                        <h5>
                          <span className="badge badge-center rounded-pill bg-label-primary p-0 me-2">
                            <i className="bx bx-check bx-xs" />
                          </span>
                          Basic search
                        </h5>
                      </li>
                      <li>
                        <h5>
                          <span className="badge badge-center rounded-pill bg-label-primary p-0 me-2">
                            <i className="bx bx-check bx-xs" />
                          </span>
                          Live chat widget
                        </h5>
                      </li>
                      <li>
                        <h5>
                          <span className="badge badge-center rounded-pill bg-label-primary p-0 me-2">
                            <i className="bx bx-check bx-xs" />
                          </span>
                          Email marketing
                        </h5>
                      </li>
                      <li>
                        <h5>
                          <span className="badge badge-center rounded-pill bg-label-primary p-0 me-2">
                            <i className="bx bx-check bx-xs" />
                          </span>
                          Custom Forms
                        </h5>
                      </li>
                      <li>
                        <h5>
                          <span className="badge badge-center rounded-pill bg-label-primary p-0 me-2">
                            <i className="bx bx-check bx-xs" />
                          </span>
                          Traffic analytics
                        </h5>
                      </li>
                      <li>
                        <h5>
                          <span className="badge badge-center rounded-pill bg-label-primary p-0 me-2">
                            <i className="bx bx-check bx-xs" />
                          </span>
                          Basic Support
                        </h5>
                      </li>
                    </ul>
                    <div className="d-grid mt-4 pt-3">
                      <a
                        href="payment-page.html"
                        className="btn btn-label-primary"
                      >
                        Get Started
                      </a>
                    </div>
                  </div>
                </div>
              </div>

              <div className="col-xl-4 col-lg-6">
                <div className="card border border-primary shadow-lg">
                  <div className="card-header">
                    <div className="text-center">
                      <img
                        src="../../assets/img/front-pages/icons/plane.png"
                        alt="plane icon"
                        className="mb-4 pb-2 scaleX-n1-rtl"
                      />
                      <h4 className="mb-1">Team</h4>
                      <div className="d-flex align-items-center justify-content-center">
                        <span className="price-monthly h1 text-primary fw-bold mb-0">
                          $29
                        </span>
                        <span className="price-yearly h1 text-primary fw-bold mb-0 d-none">
                          $22
                        </span>
                        <sub className="h6 text-muted mb-0 ms-1">/mo</sub>
                      </div>
                      <div className="position-relative pt-2">
                        <div className="price-yearly text-muted price-yearly-toggle d-none">
                          $ 264 / year
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="card-body">
                    <ul className="list-unstyled">
                      <li>
                        <h5>
                          <span className="badge badge-center rounded-pill bg-primary p-0 me-2">
                            <i className="bx bx-check bx-xs" />
                          </span>
                          Everything in basic
                        </h5>
                      </li>
                      <li>
                        <h5>
                          <span className="badge badge-center rounded-pill bg-primary p-0 me-2">
                            <i className="bx bx-check bx-xs" />
                          </span>
                          Timeline with database
                        </h5>
                      </li>
                      <li>
                        <h5>
                          <span className="badge badge-center rounded-pill bg-primary p-0 me-2">
                            <i className="bx bx-check bx-xs" />
                          </span>
                          Advanced search
                        </h5>
                      </li>
                      <li>
                        <h5>
                          <span className="badge badge-center rounded-pill bg-primary p-0 me-2">
                            <i className="bx bx-check bx-xs" />
                          </span>
                          Marketing automation
                        </h5>
                      </li>
                      <li>
                        <h5>
                          <span className="badge badge-center rounded-pill bg-primary p-0 me-2">
                            <i className="bx bx-check bx-xs" />
                          </span>
                          Advanced chatbot
                        </h5>
                      </li>
                      <li>
                        <h5>
                          <span className="badge badge-center rounded-pill bg-primary p-0 me-2">
                            <i className="bx bx-check bx-xs" />
                          </span>
                          Campaign management
                        </h5>
                      </li>
                      <li>
                        <h5>
                          <span className="badge badge-center rounded-pill bg-primary p-0 me-2">
                            <i className="bx bx-check bx-xs" />
                          </span>
                          Collaboration tools
                        </h5>
                      </li>
                    </ul>
                    <div className="d-grid mt-4 pt-3">
                      <a href="payment-page.html" className="btn btn-primary">
                        Get Started
                      </a>
                    </div>
                  </div>
                </div>
              </div>

              <div className="col-xl-4 col-lg-6">
                <div className="card">
                  <div className="card-header">
                    <div className="text-center">
                      <img
                        src="../../assets/img/front-pages/icons/shuttle-rocket.png"
                        alt="shuttle rocket icon"
                        className="mb-4 pb-2 scaleX-n1-rtl"
                      />
                      <h4 className="mb-1">Enterprise</h4>
                      <div className="d-flex align-items-center justify-content-center">
                        <span className="price-monthly h1 text-primary fw-bold mb-0">
                          $49
                        </span>
                        <span className="price-yearly h1 text-primary fw-bold mb-0 d-none">
                          $37
                        </span>
                        <sub className="h6 text-muted mb-0 ms-1">/mo</sub>
                      </div>
                      <div className="position-relative pt-2">
                        <div className="price-yearly text-muted price-yearly-toggle d-none">
                          $ 444 / year
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="card-body">
                    <ul className="list-unstyled">
                      <li>
                        <h5>
                          <span className="badge badge-center rounded-pill bg-label-primary p-0 me-2">
                            <i className="bx bx-check bx-xs" />
                          </span>
                          Everything in premium
                        </h5>
                      </li>
                      <li>
                        <h5>
                          <span className="badge badge-center rounded-pill bg-label-primary p-0 me-2">
                            <i className="bx bx-check bx-xs" />
                          </span>
                          Timeline with database
                        </h5>
                      </li>
                      <li>
                        <h5>
                          <span className="badge badge-center rounded-pill bg-label-primary p-0 me-2">
                            <i className="bx bx-check bx-xs" />
                          </span>
                          Fuzzy search
                        </h5>
                      </li>
                      <li>
                        <h5>
                          <span className="badge badge-center rounded-pill bg-label-primary p-0 me-2">
                            <i className="bx bx-check bx-xs" />
                          </span>
                          A/B testing sanbox
                        </h5>
                      </li>
                      <li>
                        <h5>
                          <span className="badge badge-center rounded-pill bg-label-primary p-0 me-2">
                            <i className="bx bx-check bx-xs" />
                          </span>
                          Custom permissions
                        </h5>
                      </li>
                      <li>
                        <h5>
                          <span className="badge badge-center rounded-pill bg-label-primary p-0 me-2">
                            <i className="bx bx-check bx-xs" />
                          </span>
                          Social media automation
                        </h5>
                      </li>
                      <li>
                        <h5>
                          <span className="badge badge-center rounded-pill bg-label-primary p-0 me-2">
                            <i className="bx bx-check bx-xs" />
                          </span>
                          Sales automation tools
                        </h5>
                      </li>
                    </ul>
                    <div className="d-grid mt-4 pt-3">
                      <a
                        href="payment-page.html"
                        className="btn btn-label-primary"
                      >
                        Get Started
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="landingFunFacts" className="section-py landing-fun-facts">
          <div className="container">
            <div className="row gy-3">
              <div className="col-sm-6 col-lg-3">
                <div className="card border border-label-primary shadow-none">
                  <div className="card-body text-center">
                    <img
                      src="../../assets/img/front-pages/icons/laptop.png"
                      alt="laptop"
                      className="mb-2"
                    />
                    <h5 className="h2 mb-1">7.1k+</h5>
                    <p className="fw-medium mb-0">
                      Support Tickets
                      <br />
                      Resolved
                    </p>
                  </div>
                </div>
              </div>
              <div className="col-sm-6 col-lg-3">
                <div className="card border border-label-success shadow-none">
                  <div className="card-body text-center">
                    <img
                      src="../../assets/img/front-pages/icons/user-success.png"
                      alt="laptop"
                      className="mb-2"
                    />
                    <h5 className="h2 mb-1">50k+</h5>
                    <p className="fw-medium mb-0">
                      Join creatives
                      <br />
                      community
                    </p>
                  </div>
                </div>
              </div>
              <div className="col-sm-6 col-lg-3">
                <div className="card border border-label-info shadow-none">
                  <div className="card-body text-center">
                    <img
                      src="../../assets/img/front-pages/icons/diamond-info.png"
                      alt="laptop"
                      className="mb-2"
                    />
                    <h5 className="h2 mb-1">4.8/5</h5>
                    <p className="fw-medium mb-0">
                      Highly Rated
                      <br />
                      Products
                    </p>
                  </div>
                </div>
              </div>
              <div className="col-sm-6 col-lg-3">
                <div className="card border border-label-warning shadow-none">
                  <div className="card-body text-center">
                    <img
                      src="../../assets/img/front-pages/icons/check-warning.png"
                      alt="laptop"
                      className="mb-2"
                    />
                    <h5 className="h2 mb-1">100%</h5>
                    <p className="fw-medium mb-0">
                      Money Back
                      <br />
                      Guarantee
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="landingFAQ" className="section-py bg-body landing-faq">
          <div className="container">
            <div className="text-center mb-3 pb-1">
              <span className="badge bg-label-primary">FAQ</span>
            </div>
            <h3 className="text-center mb-1">Frequently asked questions</h3>
            <p className="text-center mb-5 pb-3">
              Browse through these FAQs to find answers to commonly asked
              questions.
            </p>
            <div className="row gy-5">
              <div className="col-lg-5">
                <div className="text-center">
                  <img
                    src="../../assets/img/front-pages/landing-page/faq-boy-with-logos.png"
                    alt="faq boy with logos"
                    className="faq-image"
                  />
                </div>
              </div>
              <div className="col-lg-7">
                <div className="accordion" id="accordionExample">
                  <div className="card accordion-item active">
                    <h2 className="accordion-header" id="headingOne">
                      <button
                        type="button"
                        className="accordion-button"
                        data-bs-toggle="collapse"
                        data-bs-target="#accordionOne"
                        aria-expanded="true"
                        aria-controls="accordionOne"
                      >
                        Do you charge for each upgrade?
                      </button>
                    </h2>
                    <div
                      id="accordionOne"
                      className="accordion-collapse collapse show"
                      data-bs-parent="#accordionExample"
                    >
                      <div className="accordion-body">
                        Lemon drops chocolate cake gummies carrot cake chupa
                        chups muffin topping. Sesame snaps icing marzipan gummi
                        bears macaroon dragée danish caramels powder. Bear claw
                        dragée pastry topping soufflé. Wafer gummi bears
                        marshmallow pastry pie.
                      </div>
                    </div>
                  </div>
                  <div className="card accordion-item">
                    <h2 className="accordion-header" id="headingTwo">
                      <button
                        type="button"
                        className="accordion-button collapsed"
                        data-bs-toggle="collapse"
                        data-bs-target="#accordionTwo"
                        aria-expanded="false"
                        aria-controls="accordionTwo"
                      >
                        Do I need to purchase a license for each website?
                      </button>
                    </h2>
                    <div
                      id="accordionTwo"
                      className="accordion-collapse collapse"
                      aria-labelledby="headingTwo"
                      data-bs-parent="#accordionExample"
                    >
                      <div className="accordion-body">
                        Dessert ice cream donut oat cake jelly-o pie sugar plum
                        cheesecake. Bear claw dragée oat cake dragée ice cream
                        halvah tootsie roll. Danish cake oat cake pie macaroon
                        tart donut gummies. Jelly beans candy canes carrot cake.
                        Fruitcake chocolate chupa chups.
                      </div>
                    </div>
                  </div>
                  <div className="card accordion-item">
                    <h2 className="accordion-header" id="headingThree">
                      <button
                        type="button"
                        className="accordion-button collapsed"
                        data-bs-toggle="collapse"
                        data-bs-target="#accordionThree"
                        aria-expanded="false"
                        aria-controls="accordionThree"
                      >
                        What is regular license?
                      </button>
                    </h2>
                    <div
                      id="accordionThree"
                      className="accordion-collapse collapse"
                      aria-labelledby="headingThree"
                      data-bs-parent="#accordionExample"
                    >
                      <div className="accordion-body">
                        Regular license can be used for end products that do not
                        charge users for access or service(access is free and
                        there will be no monthly subscription fee). Single
                        regular license can be used for single end product and
                        end product can be used by you or your client. If you
                        want to sell end product to multiple clients then you
                        will need to purchase separate license for each client.
                        The same rule applies if you want to use the same end
                        product on multiple domains(unique setup). For more info
                        on regular license you can check official description.
                      </div>
                    </div>
                  </div>
                  <div className="card accordion-item">
                    <h2 className="accordion-header" id="headingFour">
                      <button
                        type="button"
                        className="accordion-button collapsed"
                        data-bs-toggle="collapse"
                        data-bs-target="#accordionFour"
                        aria-expanded="false"
                        aria-controls="accordionFour"
                      >
                        What is extended license?
                      </button>
                    </h2>
                    <div
                      id="accordionFour"
                      className="accordion-collapse collapse"
                      aria-labelledby="headingFour"
                      data-bs-parent="#accordionExample"
                    >
                      <div className="accordion-body">
                        Lorem ipsum dolor sit amet consectetur adipisicing elit.
                        Nobis et aliquid quaerat possimus maxime! Mollitia
                        reprehenderit neque repellat delenibx delectus
                        architecto dolorum maxime, blanditiis earum ea, incidunt
                        quam possimus cumque.
                      </div>
                    </div>
                  </div>
                  <div className="card accordion-item">
                    <h2 className="accordion-header" id="headingFive">
                      <button
                        type="button"
                        className="accordion-button collapsed"
                        data-bs-toggle="collapse"
                        data-bs-target="#accordionFive"
                        aria-expanded="false"
                        aria-controls="accordionFive"
                      >
                        Which license is applicable for SASS application?
                      </button>
                    </h2>
                    <div
                      id="accordionFive"
                      className="accordion-collapse collapse"
                      aria-labelledby="headingFive"
                      data-bs-parent="#accordionExample"
                    >
                      <div className="accordion-body">
                        Lorem ipsum dolor sit amet consectetur, adipisicing
                        elit. Sequi molestias exercitationem ab cum nemo facere
                        voluptates veritatis quia, eveniet veniam at et
                        repudiandae mollitia ipsam quasi labore enim architecto
                        non!
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section
          id="landingCTA"
          className="section-py landing-cta position-relative p-lg-0 pb-0"
        >
          <img
            src="../../assets/img/front-pages/backgrounds/cta-bg-light.png"
            className="position-absolute bottom-0 end-0 scaleX-n1-rtl h-100 w-100 z-n1"
            alt="cta image"
            data-app-light-img="front-pages/backgrounds/cta-bg-light.png"
            data-app-dark-img="front-pages/backgrounds/cta-bg-dark.png"
          />
          <div className="container">
            <div className="row align-items-center gy-5 gy-lg-0">
              <div className="col-lg-6 text-center text-lg-start">
                <h6 className="h2 text-primary fw-bold mb-1">
                  Ready to Get Started?
                </h6>
                <p className="fw-medium mb-4">
                  Start your project with a 14-day free trial
                </p>
                <a href="payment-page.html" className="btn btn-primary">
                  Get Started
                </a>
              </div>
              <div className="col-lg-6 pt-lg-5 text-center text-lg-end">
                <img
                  src="../../assets/img/front-pages/landing-page/cta-dashboard.png"
                  alt="cta dashboard"
                  className="img-fluid"
                />
              </div>
            </div>
          </div>
        </section>

        <section
          id="landingContact"
          className="section-py bg-body landing-contact"
        >
          <div className="container">
            <div className="text-center mb-3 pb-1">
              <span className="badge bg-label-primary">Contact US</span>
            </div>
            <h3 className="text-center mb-1">Let's work together</h3>
            <p className="text-center mb-4 mb-lg-5 pb-md-3">
              Any question or remark? just write us a message
            </p>
            <div className="row gy-4">
              <div className="col-lg-5">
                <div className="contact-img-box position-relative border p-2 h-100">
                  <img
                    src="../../assets/img/front-pages/icons/contact-border.png"
                    alt="contact border"
                    className="contact-border-img position-absolute d-none d-md-block scaleX-n1-rtl"
                  />
                  <img
                    src="../../assets/img/front-pages/landing-page/contact-customer-service.png"
                    alt="contact customer service"
                    className="contact-img w-100 scaleX-n1-rtl"
                  />
                  <div className="pt-3 px-4 pb-1">
                    <div className="row gy-3 gx-md-4">
                      <div className="col-md-6 col-lg-12 col-xl-6">
                        <div className="d-flex align-items-center">
                          <div className="badge bg-label-primary rounded p-2 me-2">
                            <i className="bx bx-envelope bx-sm" />
                          </div>
                          <div>
                            <p className="mb-0">Email</p>
                            <h5 className="mb-0">
                              <a
                                href="mailto:example@gmail.com"
                                className="text-heading"
                              >
                                example@gmail.com
                              </a>
                            </h5>
                          </div>
                        </div>
                      </div>
                      <div className="col-md-6 col-lg-12 col-xl-6">
                        <div className="d-flex align-items-center">
                          <div className="badge bg-label-success rounded p-2 me-2">
                            <i className="bx bx-phone-call bx-sm" />
                          </div>
                          <div>
                            <p className="mb-0">Phone</p>
                            <h5 className="mb-0">
                              <a
                                href="tel:+1234-568-963"
                                className="text-heading"
                              >
                                +1234 568 963
                              </a>
                            </h5>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-lg-7">
                <div className="card">
                  <div className="card-body">
                    <h4 className="mb-1">Send a message</h4>
                    <p className="mb-4">
                      If you would like to discuss anything related to payment,
                      account, licensing,
                      <br className="d-none d-lg-block" />
                      partnerships, or have pre-sales questions, you’re at the
                      right place.
                    </p>
                    <form>
                      <div className="row g-4">
                        <div className="col-md-6">
                          <label
                            className="form-label"
                            htmlFor="contact-form-fullname"
                          >
                            Full Name
                          </label>
                          <input
                            type="text"
                            className="form-control"
                            id="contact-form-fullname"
                            placeholder="john"
                          />
                        </div>
                        <div className="col-md-6">
                          <label
                            className="form-label"
                            htmlFor="contact-form-email"
                          >
                            Email
                          </label>
                          <input
                            type="text"
                            id="contact-form-email"
                            className="form-control"
                            placeholder="johndoe@gmail.com"
                          />
                        </div>
                        <div className="col-12">
                          <label
                            className="form-label"
                            htmlFor="contact-form-message"
                          >
                            Message
                          </label>
                          <textarea
                            id="contact-form-message"
                            className="form-control"
                            rows={9}
                            placeholder="Write a message"
                            defaultValue={""}
                          />
                        </div>
                        <div className="col-12">
                          <button type="submit" className="btn btn-primary">
                            Send inquiry
                          </button>
                        </div>
                      </div>
                    </form>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>

      <footer className="landing-footer bg-body footer-text">
        <div className="footer-top position-relative overflow-hidden z-1">
          <img
            src="../../assets/img/front-pages/backgrounds/footer-bg-light.png"
            alt="footer bg"
            className="footer-bg banner-bg-img z-n1"
            data-app-light-img="front-pages/backgrounds/footer-bg-light.png"
            data-app-dark-img="front-pages/backgrounds/footer-bg-dark.png"
          />
          <div className="container">
            <div className="row gx-0 gy-4 g-md-5">
              <div className="col-lg-5">
                <a href="" className="app-brand-link mb-4">
                  <span className="app-brand-logo demo">
                    <svg
                      width={25}
                      viewBox="0 0 25 42"
                      version="1.1"
                      xmlns="http://www.w3.org/2000/svg"
                      xmlnsXlink="http://www.w3.org/1999/xlink"
                    >
                      <defs>
                        <path
                          d="M13.7918663,0.358365126 L3.39788168,7.44174259 C0.566865006,9.69408886 -0.379795268,12.4788597 0.557900856,15.7960551 C0.68998853,16.2305145 1.09562888,17.7872135 3.12357076,19.2293357 C3.8146334,19.7207684 5.32369333,20.3834223 7.65075054,21.2172976 L7.59773219,21.2525164 L2.63468769,24.5493413 C0.445452254,26.3002124 0.0884951797,28.5083815 1.56381646,31.1738486 C2.83770406,32.8170431 5.20850219,33.2640127 7.09180128,32.5391577 C8.347334,32.0559211 11.4559176,30.0011079 16.4175519,26.3747182 C18.0338572,24.4997857 18.6973423,22.4544883 18.4080071,20.2388261 C17.963753,17.5346866 16.1776345,15.5799961 13.0496516,14.3747546 L10.9194936,13.4715819 L18.6192054,7.984237 L13.7918663,0.358365126 Z"
                          id="path-1"
                        />
                        <path
                          d="M5.47320593,6.00457225 C4.05321814,8.216144 4.36334763,10.0722806 6.40359441,11.5729822 C8.61520715,12.571656 10.0999176,13.2171421 10.8577257,13.5094407 L15.5088241,14.433041 L18.6192054,7.984237 C15.5364148,3.11535317 13.9273018,0.573395879 13.7918663,0.358365126 C13.5790555,0.511491653 10.8061687,2.3935607 5.47320593,6.00457225 Z"
                          id="path-3"
                        />
                        <path
                          d="M7.50063644,21.2294429 L12.3234468,23.3159332 C14.1688022,24.7579751 14.397098,26.4880487 13.008334,28.506154 C11.6195701,30.5242593 10.3099883,31.790241 9.07958868,32.3040991 C5.78142938,33.4346997 4.13234973,34 4.13234973,34 C4.13234973,34 2.75489982,33.0538207 2.37032616e-14,31.1614621 C-0.55822714,27.8186216 -0.55822714,26.0572515 -4.05231404e-15,25.8773518 C0.83734071,25.6075023 2.77988457,22.8248993 3.3049379,22.52991 C3.65497346,22.3332504 5.05353963,21.8997614 7.50063644,21.2294429 Z"
                          id="path-4"
                        />
                        <path
                          d="M20.6,7.13333333 L25.6,13.8 C26.2627417,14.6836556 26.0836556,15.9372583 25.2,16.6 C24.8538077,16.8596443 24.4327404,17 24,17 L14,17 C12.8954305,17 12,16.1045695 12,15 C12,14.5672596 12.1403557,14.1461923 12.4,13.8 L17.4,7.13333333 C18.0627417,6.24967773 19.3163444,6.07059163 20.2,6.73333333 C20.3516113,6.84704183 20.4862915,6.981722 20.6,7.13333333 Z"
                          id="path-5"
                        />
                      </defs>
                      <g
                        id="g-app-brand"
                        stroke="none"
                        strokeWidth={1}
                        fill="none"
                        fillRule="evenodd"
                      >
                        <g
                          id="Brand-Logo"
                          transform="translate(-27.000000, -15.000000)"
                        >
                          <g
                            id="Icon"
                            transform="translate(27.000000, 15.000000)"
                          >
                            <g
                              id="Mask"
                              transform="translate(0.000000, 8.000000)"
                            >
                              <mask id="mask-2" fill="white">
                                <use xlinkHref="#path-1" />
                              </mask>
                              <use fill="#696cff" xlinkHref="#path-1" />
                              <g id="Path-3" mask="url(#mask-2)">
                                <use fill="#696cff" xlinkHref="#path-3" />
                                <use
                                  fillOpacity="0.2"
                                  fill="#FFFFFF"
                                  xlinkHref="#path-3"
                                />
                              </g>
                              <g id="Path-4" mask="url(#mask-2)">
                                <use fill="#696cff" xlinkHref="#path-4" />
                                <use
                                  fillOpacity="0.2"
                                  fill="#FFFFFF"
                                  xlinkHref="#path-4"
                                />
                              </g>
                            </g>
                            <g
                              id="Triangle"
                              transform="translate(19.000000, 11.000000) rotate(-300.000000) translate(-19.000000, -11.000000) "
                            >
                              <use fill="#696cff" xlinkHref="#path-5" />
                              <use
                                fillOpacity="0.2"
                                fill="#FFFFFF"
                                xlinkHref="#path-5"
                              />
                            </g>
                          </g>
                        </g>
                      </g>
                    </svg>
                  </span>
                  <span className="app-brand-text demo footer-link fw-bold ms-2 ps-1">
                    {process.env.NEXT_PUBLIC_DOMAIN_NAME}
                  </span>
                </a>
                <p className="footer-text footer-logo-description mb-4">
                  Most developer friendly &amp; highly customisable Admin
                  Dashboard Template.
                </p>
                <form className="footer-form">
                  <label htmlFor="footer-email" className="small">
                    Subscribe to newsletter
                  </label>
                  <div className="d-flex mt-1">
                    <input
                      type="email"
                      className="form-control rounded-0 rounded-start-bottom rounded-start-top"
                      id="footer-email"
                      placeholder="Your email"
                    />
                    <button
                      type="submit"
                      className="btn btn-primary shadow-none rounded-0 rounded-end-bottom rounded-end-top"
                    >
                      Subscribe
                    </button>
                  </div>
                </form>
              </div>
              <div className="col-lg-2 col-md-4 col-sm-6">
                <h6 className="footer-title mb-4">Demos</h6>
                <ul className="list-unstyled">
                  <li className="mb-3">
                    <a href="#" target="_blank" className="footer-link">
                      Vertical Layout
                    </a>
                  </li>
                  <li className="mb-3">
                    <a href="#" target="_blank" className="footer-link">
                      Horizontal Layout
                    </a>
                  </li>
                  <li className="mb-3">
                    <a href="#" target="_blank" className="footer-link">
                      Bordered Layout
                    </a>
                  </li>
                  <li className="mb-3">
                    <a href="#" target="_blank" className="footer-link">
                      Semi Dark Layout
                    </a>
                  </li>
                  <li className="mb-3">
                    <a href="#" target="_blank" className="footer-link">
                      Dark Layout
                    </a>
                  </li>
                </ul>
              </div>
              <div className="col-lg-2 col-md-4 col-sm-6">
                <h6 className="footer-title mb-4">Pages</h6>
                <ul className="list-unstyled">
                  <li className="mb-3">
                    <a href="#" className="footer-link">
                      Pricing
                    </a>
                  </li>
                  <li className="mb-3">
                    <a href="#" className="footer-link">
                      Payment
                      <span className="badge rounded bg-primary ms-2 px-2">
                        New
                      </span>
                    </a>
                  </li>
                  <li className="mb-3">
                    <a href="#" className="footer-link">
                      Checkout
                    </a>
                  </li>
                  <li className="mb-3">
                    <a href="#" className="footer-link">
                      Help Center
                    </a>
                  </li>
                  <li className="mb-3">
                    <a href="/signin" target="_blank" className="footer-link">
                      Signin/Register
                    </a>
                  </li>
                </ul>
              </div>
              <div className="col-lg-3 col-md-4">
                <h6 className="footer-title mb-4">Download our app</h6>
                <a
                  href="#"
                  onClick={(e) => e.preventDefault()}
                  className="d-block footer-link mb-3 pb-2"
                >
                  <img
                    src="../../assets/img/front-pages/landing-page/apple-icon.png"
                    alt="apple icon"
                  />
                </a>
                <a
                  href="#"
                  onClick={(e) => e.preventDefault()}
                  className="d-block footer-link"
                >
                  <img
                    src="../../assets/img/front-pages/landing-page/google-play-icon.png"
                    alt="google play icon"
                  />
                </a>
              </div>
            </div>
          </div>
        </div>
        <div className="footer-bottom py-3">
          <div className="container d-flex flex-wrap justify-content-between flex-md-row flex-column text-center text-md-start">
            <div className="mb-2 mb-md-0">
              <span className="footer-text">©</span>
              <a
                href="#"
                target="_blank"
                className="fw-medium text-white footer-link"
              >
                SmartTech LLC,
              </a>
              <span className="footer-text">
                {" "}
                Made with ❤️ for a better web.
              </span>
            </div>
            <div>
              <a href="#" className="footer-link me-3" target="_blank">
                <img
                  src="../../assets/img/front-pages/icons/github-light.png"
                  alt="github icon"
                  data-app-light-img="front-pages/icons/github-light.png"
                  data-app-dark-img="front-pages/icons/github-dark.png"
                />
              </a>
              <a href="#" className="footer-link me-3" target="_blank">
                <img
                  src="../../assets/img/front-pages/icons/facebook-light.png"
                  alt="facebook icon"
                  data-app-light-img="front-pages/icons/facebook-light.png"
                  data-app-dark-img="front-pages/icons/facebook-dark.png"
                />
              </a>
              <a href="#" className="footer-link me-3" target="_blank">
                <img
                  src="../../assets/img/front-pages/icons/twitter-light.png"
                  alt="twitter icon"
                  data-app-light-img="front-pages/icons/twitter-light.png"
                  data-app-dark-img="front-pages/icons/twitter-dark.png"
                />
              </a>
              <a href="#" className="footer-link" target="_blank">
                <img
                  src="../../assets/img/front-pages/icons/instagram-light.png"
                  alt="google icon"
                  data-app-light-img="front-pages/icons/instagram-light.png"
                  data-app-dark-img="front-pages/icons/instagram-dark.png"
                />
              </a>
            </div>
          </div>
        </div>
      </footer>

      <Script
        src="/assets/vendor/libs/popper/popper.js"
        strategy="beforeInteractive"
      />
      <Script
        src="/assets/vendor/js/bootstrap.js"
        strategy="beforeInteractive"
      />
      <Script
        src="/assets/vendor/libs/nouislider/nouislider.js"
        strategy="beforeInteractive"
      />
      <Script
        src="/assets/vendor/libs/swiper/swiper.js"
        strategy="beforeInteractive"
      />
      <Script src="/assets/js/front-main.js" />
      <Script src="/assets/js/front-page-landing.js" />
    </>
  );
}
