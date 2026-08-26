import { useEffect, useRef, useState, Suspense } from "react";
import { BrowserRouter, Routes, Route, useLocation, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import Swal from "sweetalert2";
import { useTranslation } from "react-i18next";
import { useAuth } from "./context/AuthContext";
import { consumeSocialOAuthCallback, enrichSocialLoginProfile } from "./utils/socialOAuthCallback";
import Header from "./Conponets/Header";
import Footer from "./Conponets/Footer";
import Home from "./Conponets/Home";
import "./App.css";
import "react-toastify/dist/ReactToastify.css";

import Sidebar from "./Conponets/Sidebar";
import ScrollToTop from "./ScrollToTop";
import NotFound from "./Pages/NotFound";
import PrivateRoute from "./Routes/PrivateRoute";
import RouteSEO from "./components/RouteSEO";
import GoogleMarketingScripts from "./components/GoogleMarketingScripts";
import HomePageSEO from "./components/HomePageSEO";
import VisitorTracker from "./components/VisitorTracker";
import GlobalSeoScripts from "./components/GlobalSeoScripts";
import LegacyJobRedirect from "./Pages/LegacyJobRedirect";
import RouteFallback from "./components/RouteFallback";
import * as Lazy from "./Routes/lazyPages";
import {
  loadDashboardStyles,
  loadExtraUiStyles,
} from "./utils/loadStylesheet";
// "build 04-09-2025"
console.log("Date:20-02-2026,time:-18:05");
function LayoutWrapper() {
  const location = useLocation();
  const navigate = useNavigate();
  const { login: authLogin, updateProfileImage, updateName } = useAuth();
  const { t } = useTranslation("global");
  const oauthResultRef = useRef(null);
  const oauthHandledRef = useRef(false);

  if (oauthResultRef.current === null) {
    oauthResultRef.current = consumeSocialOAuthCallback(location.search);
  }

  useEffect(() => {
    if (oauthHandledRef.current) {
      return;
    }

    const result = oauthResultRef.current;
    if (!result) {
      return;
    }

    oauthHandledRef.current = true;

    const finishSocialLogin = async () => {
      if (result.error) {
        toast.error(result.error);
        oauthResultRef.current = null;
        return;
      }

      if (!result.persisted) {
        oauthResultRef.current = null;
        return;
      }

      const profileData = await enrichSocialLoginProfile(result.role);
      authLogin();

      if (profileData) {
        const profileImg = localStorage.getItem("profileImage");
        if (profileImg && typeof updateProfileImage === "function") {
          updateProfileImage(profileImg);
        }

        const firstName =
          profileData.first_name || localStorage.getItem("first_name") || "";
        const lastName =
          profileData.last_name || localStorage.getItem("last_name") || "";
        if (typeof updateName === "function") {
          updateName(firstName, lastName);
        }
      }

      if (result.blockedUnverified) {
        await Swal.fire({
          title: t("header.Account_Not_Verified"),
          text: t("header.Your_account_is_not_verified_by_the_admin"),
          icon: "error",
          confirmButtonText: t("header.ok"),
        });
        navigate("/", { replace: true });
        oauthResultRef.current = null;
        return;
      }

      if (result.redirectPath && location.pathname !== result.redirectPath) {
        navigate(result.redirectPath, { replace: true });
      }

      oauthResultRef.current = null;
    };

    finishSocialLogin();
    // Run once for the OAuth callback only; do not re-run on route changes.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!location.state?.loginSuccess) {
      return;
    }

    toast.success(t("header.login_success"), { toastId: "login-success" });

    const nextState = { ...location.state };
    delete nextState.loginSuccess;

    navigate(
      { pathname: location.pathname, search: location.search },
      {
        replace: true,
        state: Object.keys(nextState).length ? nextState : null,
      },
    );
  }, [location, navigate, t]);

  const noLayoutRoutes = [
    "/start-test",
    "/apply-test",
    "/test-result",
    "/checkout",
    "/payment-success",
    "/payment-failed",
  ];
  const hideLayout = noLayoutRoutes.some((route) =>
    location.pathname.startsWith(route),
  );
  const sidebarRoutes = [
    "/candidate-profile",
    "/certificates-scores",
    "/skill-assessments-tests",
    "/job-search",
    "/companies-list",
    "/companies-list",
    "/your-job-posts",
    "/employer-wallet",
    "/employer-dashboard",
    "/manage-applicants",
    "/bookmark-candidate",
    "/candidates-search",
    "/all-applicants-list",
    "/create-recruiters",
    "/create-assessment",
    "/request-plan",
    "/manage-recruiter",
    "/manage-assessment",
    "/messaging-system",
    "/change-password",
    "/notifications",
    "/company-profile",
    "/assessment-details",
    "/job-details-form",
    "/job-details-list",
    "/resume-builder",
    // "/job-details",
    "/candidate-dashboard",
    "/view-invoice",
    "/chat-messaging-system",
    "/applied-jobs-list",
    "/activity-timeline",
    // "/candidates-details",
    "/manage-job-application",
    "/application-management",
    "/job-alert",
  ];

  const showSidebar = sidebarRoutes.some((route) =>
    location.pathname.startsWith(route),
  );

  useEffect(() => {
    if (showSidebar) {
      loadDashboardStyles();
    }
  }, [showSidebar]);

  // Extra UI CSS (meanmenu/aos) can reshape layout â€” only after real interaction,
  // never on a timer (late CSS was a major CLS source on Home).
  useEffect(() => {
    const warmExtraCss = () => loadExtraUiStyles();
    const onInteract = () => {
      warmExtraCss();
      window.removeEventListener("scroll", onInteract);
      window.removeEventListener("click", onInteract);
      window.removeEventListener("touchstart", onInteract);
    };
    window.addEventListener("scroll", onInteract, { once: true, passive: true });
    window.addEventListener("click", onInteract, { once: true, passive: true });
    window.addEventListener("touchstart", onInteract, { once: true, passive: true });
    return () => {
      window.removeEventListener("scroll", onInteract);
      window.removeEventListener("click", onInteract);
      window.removeEventListener("touchstart", onInteract);
    };
  }, []);

  const bgColor = showSidebar ? "#fff" : "#f0f5f7";
  const showFooter = !hideLayout && !showSidebar;

  // Mount Footer after Home sections have mostly settled so growing main
  // does not shove Footer (largest CLS contributor on this page).
  const [footerReady, setFooterReady] = useState(false);
  useEffect(() => {
    if (!showFooter) {
      setFooterReady(false);
      return undefined;
    }
    let cancelled = false;
    const reveal = () => {
      if (cancelled) return;
      window.setTimeout(() => {
        if (!cancelled) setFooterReady(true);
      }, 1200);
    };
    if (document.readyState === "complete") reveal();
    else window.addEventListener("load", reveal, { once: true });
    const fallback = window.setTimeout(reveal, 3500);
    return () => {
      cancelled = true;
      window.clearTimeout(fallback);
      window.removeEventListener("load", reveal);
    };
  }, [showFooter, location.pathname]);

  return (
    <>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        pauseOnHover
        draggable
        limit={3}
        style={{ zIndex: 99999 }}
      />
      <RouteSEO />
      <HomePageSEO />
      <GoogleMarketingScripts />
      <GlobalSeoScripts />
      <VisitorTracker />
      {!hideLayout && <Header bgColor={bgColor} />}
      {showSidebar && <Sidebar />}

      <main id="main-content" role="main">
      <Suspense fallback={<RouteFallback />}>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Lazy.Login />} />
        <Route path="/verification" element={<Lazy.Varification />} />
        <Route path="/account-verified" element={<Lazy.AccountVerified />} />
        <Route path="/verified-cancel" element={<Lazy.VerifiedCancel />} />
        <Route path="/register" element={<Lazy.Register />} />
        <Route path="/recovery-password" element={<Lazy.RecoveryPassword />} />
        <Route path="/forgot-password" element={<Lazy.RecoveryPassword />} />
        <Route path="/verify-otp" element={<Lazy.SendOtp />} />
        <Route path="/employer-register" element={<Lazy.EmployerRegister />} />
        <Route path="/employer-login" element={<Lazy.EmployerLogin />} />
        <Route path="/email-verification" element={<Lazy.EmailOTPVerification />} />
        <Route path="/contact-us" element={<Lazy.ContactUs />} />
        <Route path="/support-tickets" element={<Lazy.SupportTickets />} />
        <Route path="/tickets" element={<Lazy.SupportTickets />} />
        <Route path="/privacy-policy" element={<Lazy.PrivecyPolicy />} />
        <Route path="/terms-condition" element={<Lazy.TearmCondition />} />
        <Route path="/companies" element={<Lazy.Employers />} />
        <Route path="/faq/:type" element={<Lazy.Faq />} />{" "}
        <Route
          path="/applied-candidate-list"
          element={<Lazy.EmployerCandinateList />}
        />
        <Route path="/applicants-details" element={<Lazy.ApplicantsDetails />} />
        <Route path="/about-us" element={<Lazy.AboutUs />} />
        <Route path="/blog" element={<Lazy.Blog />} />
        <Route path="/payment-success" element={<Lazy.PaymentSuccess />} />
        <Route path="/payment-failed" element={<Lazy.PaymentFailed />} />
        <Route path="/blogDetails/:id" element={<Lazy.BlogDetails />} />
        <Route path="/employer-home" element={<Lazy.EmployerHomePage />} />
        <Route
          path="/employer-basic-info"
          element={<Lazy.EmployerBasicInformation />}
        />
        <Route path="/jobs" element={<Lazy.JobList />} />
        <Route path="/job-details/:id" element={<LegacyJobRedirect />} />
        <Route
          path="/custom-resume-cover-letter"
          element={<Lazy.CustomResumeCoverLatter />}
        />
        <Route path="/company-details" element={<Lazy.CompanyDetailsInfo />} />
        <Route path="/add-plan" element={<Lazy.AddPlan />} />
        <Route path="/add-on-pack" element={<Lazy.AddOnPack />} />
        {/* Protected Routes */}
        <Route
          path="/job-details-form/:id"
          element={
            <PrivateRoute allowedRoles={["Recruiter", "Company"]}>
              <Lazy.JobDetailsForm />
            </PrivateRoute>
          }
        />
        <Route
          path="/job-details-form"
          element={
            <PrivateRoute allowedRoles={["Recruiter", "Company"]}>
              <Lazy.JobDetailsForm />
            </PrivateRoute>
          }
        />
        <Route
          path="/profile-basic-info"
          element={
            <PrivateRoute allowedRoles={["JobSeeker"]}>
              <Lazy.MyProfile />
            </PrivateRoute>
          }
        />
        <Route
          path="/candidate-profile"
          element={
            <PrivateRoute allowedRoles={["JobSeeker"]}>
              <Lazy.CandidateProfile />
            </PrivateRoute>
          }
        />
        <Route
          path="/resume-builder"
          element={
            <PrivateRoute allowedRoles={["JobSeeker"]}>
              <Lazy.ResumeBuilder />
            </PrivateRoute>
          }
        />
        <Route
          path="/employer-dashboard"
          element={
            <PrivateRoute allowedRoles={["Recruiter", "Company"]}>
              <Lazy.EmployerDashboard />
            </PrivateRoute>
          }
        />
        <Route
          path="/skill-assessments-tests"
          element={
            <PrivateRoute>
              <Lazy.SkillAssementTestPage />
            </PrivateRoute>
          }
        />
        <Route
          path="/certificates-scores"
          element={
            <PrivateRoute>
              <Lazy.CertificateScorePage />
            </PrivateRoute>
          }
        />
        <Route
          path="/job-alert"
          element={
            <PrivateRoute>
              <Lazy.JobAlert />
            </PrivateRoute>
          }
        />
        <Route
          path="/activity-timeline"
          element={
            <PrivateRoute  allowedRoles={["JobSeeker"]}>
              <Lazy.ActivityTimeline />
            </PrivateRoute>
          }
        />
        <Route
          path="/notifications"
          element={
            <PrivateRoute>
              <Lazy.Notifications />
            </PrivateRoute>
          }
        />
        <Route
          path="/application-management"
          element={
            <PrivateRoute>
              <Lazy.ApplicationManagement />
            </PrivateRoute>
          }
        />
        <Route
          path="/applied-jobs-list"
          element={
            <PrivateRoute allowedRoles={["Recruiter", "Company"]}>
              <Lazy.AppliedJobList />
            </PrivateRoute>
          }
        />
        <Route
          path="/chat-messaging-system"
          element={
            <PrivateRoute allowedRoles={["JobSeeker"]}>
              <Lazy.ChatMassageSystem />
            </PrivateRoute>
          }
        />
        <Route path="/:companySlug" element={<Lazy.CompanyDetailsPage />} />
       <Route path="/job/:jobSlug" element={<Lazy.JobDetails />} />
        <Route
          path="/job-details-list"
          element={
            <PrivateRoute>
              <Lazy.JobDetailsList />
            </PrivateRoute>
          }
        />
        <Route
          path="/candidate-dashboard"
          element={
            <PrivateRoute allowedRoles={["JobSeeker"]}>
              <Lazy.CandidateDashboard />
            </PrivateRoute>
          }
        />
        <Route
          path="/manage-job-application"
          element={
            <PrivateRoute allowedRoles={["JobSeeker"]}>
              <Lazy.ManagesJobApplication />
            </PrivateRoute>
          }
        />
        <Route
          path="/your-job-posts"
          element={
            <PrivateRoute allowedRoles={["Recruiter", "Company"]}>
              <Lazy.YourJobPosts />
            </PrivateRoute>
          }
        />
        <Route
          path="/employer-wallet"
          element={
            <PrivateRoute allowedRoles={["Recruiter", "Company"]}>
              <Lazy.EmployerWallet />
            </PrivateRoute>
          }
        />
        <Route
          path="/checkout"
          element={
            <PrivateRoute allowedRoles={["Recruiter", "Company"]}>
              <Lazy.Checkout />
            </PrivateRoute>
          }
        />
        {/* <Route
          path="/employer-wallet"
          element={
            <PrivateRoute>
              <Lazy.EmployerWallet />
            </PrivateRoute>
          }
        /> */}
        <Route
          path="/view-invoice/:id"
          element={
            <PrivateRoute>
              <Lazy.InvoiceView />
            </PrivateRoute>
          }
        />
        <Route
          path="/setting"
          element={
            <PrivateRoute>
              <Lazy.Setting />
            </PrivateRoute>
          }
        />
        <Route
          path="/admin/google-marketing"
          element={
            <PrivateRoute allowedRoles={["Admin"]}>
              <Lazy.GoogleMarketingConfig />
            </PrivateRoute>
          }
        />
        <Route
          path="/admin/home-page-seo"
          element={
            <PrivateRoute allowedRoles={["Admin"]}>
              <Lazy.HomePageSeoConfig />
            </PrivateRoute>
          }
        />
        <Route
          path="/admin/jobs-listing-seo-settings"
          element={
            <PrivateRoute allowedRoles={["Admin"]}>
              <Lazy.AdminJobsListingSeoSettings />
            </PrivateRoute>
          }
        />
        <Route
          path="/manage-applicants"
          element={
            <PrivateRoute>
              <Lazy.EmployerFilterCandinateList />
            </PrivateRoute>
          }
        />
        <Route
          path="/bookmark-candidate"
          element={
            <PrivateRoute allowedRoles={["Recruiter", "Company"]}>
              <Lazy.EmployerShortListCandinate />
            </PrivateRoute>
          }
        />
        <Route
          path="/candidates-search"
          element={
            <PrivateRoute allowedRoles={["Recruiter", "Company"]}>
              <Lazy.CandinatesList />
            </PrivateRoute>
          }
        />
        <Route
          path="/all-applicants-list"
          element={
            <PrivateRoute allowedRoles={["Recruiter", "Company"]}>
              <Lazy.ManagesApplicants />
            </PrivateRoute>
          }
        />
        <Route
          path="/create-recruiters"
          element={
            <PrivateRoute>
              <Lazy.CreateRecruiters />
            </PrivateRoute>
          }
        />
        <Route
          path="/create-assessment"
          element={
            <PrivateRoute>
              <Lazy.CreateAssement />
            </PrivateRoute>
          }
        />
        <Route
          path="/request-plan"
          element={
            <PrivateRoute>
              <Lazy.OfferContact />
            </PrivateRoute>
          }
        />
        <Route
          path="/manage-recruiter"
          element={
            <PrivateRoute allowedRoles={["Recruiter", "Company"]}>
              <Lazy.RecruiterLists />
            </PrivateRoute>
          }
        />
        <Route
          path="/manage-assessment"
          element={
            <PrivateRoute allowedRoles={["Recruiter", "Company"]}>
              <Lazy.ManagesAssement />
            </PrivateRoute>
          }
        />
        <Route
          path="/messaging-system"
          element={
            <PrivateRoute allowedRoles={["Recruiter", "Company"]}>
              <Lazy.MassagingSystem />
            </PrivateRoute>
          }
        />
        <Route
          path="/company-profile"
          element={
            <PrivateRoute allowedRoles={["Recruiter", "Company"]}>
              <Lazy.EmployerProfile />
            </PrivateRoute>
          }
        />
        <Route
          path="/assessment-details"
          element={
            <PrivateRoute>
              <Lazy.AssessmentDetails />
            </PrivateRoute>
          }
        />
        <Route
          path="/change-password"
          element={
            <PrivateRoute>
              <Lazy.ChangePassword />
            </PrivateRoute>
          }
        />
        <Route
          path="/candidates-details"
          element={
            <PrivateRoute>
              <Lazy.CandinateProfileDetails />
            </PrivateRoute>
          }
        />
        <Route
          path="/job-search"
          element={
            <PrivateRoute allowedRoles={["JobSeeker"]}>
              <Lazy.JobSearch />
            </PrivateRoute>
          }
        ></Route>
        <Route
          path="/apply-test"
          element={
            <PrivateRoute>
              <Lazy.ApplyTest />
            </PrivateRoute>
          }
        ></Route>
        <Route
          path="/start-test"
          element={
            <PrivateRoute>
              <Lazy.StartTest />
            </PrivateRoute>
          }
        ></Route>
        <Route
          path="/test-result"
          element={
            <PrivateRoute>
              <Lazy.TestResult />
            </PrivateRoute>
          }
        ></Route>
        <Route path="/companies-list" element={<Lazy.Companies />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
      </Suspense>
      </main>
      {showFooter && footerReady && <Footer />}
    </>
  );
}

function App() {
  return (
    <>
      <BrowserRouter basename="/jobPortal">
        <ScrollToTop />
        <LayoutWrapper />
      </BrowserRouter>
    </>
  );
}

export default App;
