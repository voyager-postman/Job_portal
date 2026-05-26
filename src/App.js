import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import Header from "./Conponets/Header";
import Footer from "./Conponets/Footer";
import Home from "./Conponets/Home";
import Register from "./Pages/Register";
import Login from "./Pages/Login";
import RecoveryPassword from "./Pages/RecoveryPassword";
import MyProfile from "./Pages/MyProfile";
import "./App.css";

import ContactUs from "./Pages/ContactUs";
import AboutUs from "./Pages/AboutUs";
import Sidebar from "./Conponets/Sidebar";
import CandidateProfile from "./Pages/CandidateProfile";
import ScrollToTop from "./ScrollToTop";
import NotFound from "./Pages/NotFound";
import JobSearch from "./Pages/JobSearch";
import Companies from "./Pages/Companies";
import EmployerRegister from "./Pages/EmployerRegister";
import EmployerLogin from "./Pages/EmployerLogin";
import PrivateRoute from "./Routes/PrivateRoute";
import EmployerHomePage from "./Pages/EmployerHomePage";
import EmployerBasicInformation from "./Pages/EmployerBasicInformation";
import CompanyDetailsPage from "./Pages/CompanyDetailsPage";
import JobDetails from "./Pages/JobDetails";
import YourJobPosts from "./Pages/YourJobPosts";
import JobDetailsForm from "./Pages/JobDetailsForm";
import CandidateDashboard from "./Pages/CandidateDashboard";
import ManagesJobApplication from "./Pages/ManagesJobApplication";
import EmployerFilterCandinateList from "./Pages/EmployerFilterCandinateList";
import EmployerShortListCandinate from "./Pages/EmployerShortListCandinate";
import CandinatesList from "./Pages/CandinatesList";
import CandinateProfileDetails from "./Pages/CandinateProfileDetails";
import EmployerCandinateList from "./Pages/EmployerCandinateList";
import CompanyDetailsInfo from "./Pages/CompanyDetailsInfo";
import Employers from "./Pages/Employers";
import JobList from "./Pages/JobList";
import EmployerDashboard from "./Pages/EmployerDashboard";
import CustomResumeCoverLatter from "./Pages/CustomResumeCoverLatter";
import JobAlert from "./Pages/JobAlert";
import Faq from "./Pages/Faq";
import JobDetailsList from "./Pages/JobDetailsList";
import ActivityTimeline from "./Pages/ActivityTimeline";
import ChatMassageSystem from "./Pages/ChatMassageSystem";
import EmployerProfile from "./Pages/EmployerProfile";
import SkillAssementTestPage from "./Pages/SkillAssementTestPage";
import CertificateScorePage from "./Pages/CertificateScorePage";
import RecruiterLists from "./Conponets/RecruiterLists";
import CreateRecruiters from "./Conponets/CreateRecruiters";
import MassagingSystem from "./Pages/MassagingSystem";
import ApplicationManagement from "./Pages/ApplicationManagement";
import AppliedJobList from "./Pages/AppliedJobList";
import EmailOTPVerification from "./Pages/EmailOTPVerification";
import VerifiedCancel from "./Pages/VerifiedCancel";
import AccountVerified from "./Pages/AccountVerified";
import Varification from "./Pages/Varification";
import PrivecyPolicy from "./Pages/PrivecyPolicy";
import TearmCondition from "./Pages/TearmCondition";
import Blog from "./Pages/Blog";
import BlogDetails from "./Pages/BlogDetails";
import Setting from "./Pages/Setting";
import EmployerWallet from "./Pages/EmployerWallet";
import Checkout from "./Pages/Checkout";
import AddPlan from "./Pages/AddPlan";
import ResumeBuilder from "./Pages/ResumeBuilder";
import AddOnPack from "./Pages/AddOnPack";
import SendOtp from "./Pages/SendOtp";
import ManagesApplicants from "./Pages/ManagesApplicants";
import ApplicantsDetails from "./Pages/ApplicantsDetails";
import ChangePassword from "./Pages/ChangePassword";
import CategoryManagement from "./Pages/assesment/ManageAssesment";
import ApplyTest from "./Pages/ApplyTest";
import { elements } from "chart.js";
import StartTest from "./Pages/StartTest";
import TestResult from "./Pages/TestResult";
import ManagesAssement from "./Conponets/ManagesAssement";
import CreateAssement from "./Conponets/CreateAssement";
import AssessmentDetails from "./Pages/AssessmentDetails";
import PaymentSuccess from "../src/Pages/PaymentSuccess";
import PaymentFailed from "../src/Pages/PaymentFailed";
import OfferContact from "./Conponets/OfferContact";
import InvoiceView from "./Pages/InvoiceView";
// "build 04-09-2025"
console.log("Date:20-02-2026,time:-18:05");
function LayoutWrapper() {
  const location = useLocation();
  const noLayoutRoutes = ["/start-test", "/apply-test", "/test-result", "/checkout"];
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

  const bgColor = showSidebar ? "#fff" : "#f0f5f7";
  const showFooter = !hideLayout && !showSidebar;
  return (
    <>
      {!hideLayout && <Header bgColor={bgColor} />}
      {showSidebar && <Sidebar />}

      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/verification" element={<Varification />} />
        <Route path="/account-verified" element={<AccountVerified />} />
        <Route path="/verified-cancel" element={<VerifiedCancel />} />
        <Route path="/register" element={<Register />} />
        <Route path="/recovery-password" element={<RecoveryPassword />} />
        <Route path="/verify-otp" element={<SendOtp />} />
        <Route path="/employer-register" element={<EmployerRegister />} />
        <Route path="/employer-login" element={<EmployerLogin />} />
        <Route path="/email-verification" element={<EmailOTPVerification />} />
        <Route path="/contact-us" element={<ContactUs />} />
        <Route path="/privacy-policy" element={<PrivecyPolicy />} />
        <Route path="/terms-condition" element={<TearmCondition />} />
        <Route path="/companies" element={<Employers />} />
        <Route path="/faq/:type" element={<Faq />} />{" "}
        <Route
          path="/applied-candidate-list"
          element={<EmployerCandinateList />}
        />
        <Route path="/applicants-details" element={<ApplicantsDetails />} />
        <Route path="/about-us" element={<AboutUs />} />
        <Route path="/blog" element={<Blog />} />
        <Route path="/payment-success" element={<PaymentSuccess />} />
        <Route path="/payment-failed" element={<PaymentFailed />} />
        <Route path="/blogDetails/:id" element={<BlogDetails />} />
        <Route path="/employer-home" element={<EmployerHomePage />} />
        <Route
          path="/employer-basic-info"
          element={<EmployerBasicInformation />}
        />
        <Route path="/jobs" element={<JobList />} />
        <Route
          path="/custom-resume-cover-letter"
          element={<CustomResumeCoverLatter />}
        />
        <Route path="/company-details" element={<CompanyDetailsInfo />} />
        <Route path="/add-plan" element={<AddPlan />} />
        <Route path="/add-on-pack" element={<AddOnPack />} />
        {/* Protected Routes */}
        <Route
          path="/job-details-form/:id"
          element={
            <PrivateRoute allowedRoles={["Recruiter", "Company"]}>
              <JobDetailsForm />
            </PrivateRoute>
          }
        />
        <Route
          path="/job-details-form"
          element={
            <PrivateRoute allowedRoles={["Recruiter", "Company"]}>
              <JobDetailsForm />
            </PrivateRoute>
          }
        />
        <Route
          path="/profile-basic-info"
          element={
            <PrivateRoute allowedRoles={["JobSeeker"]}>
              <MyProfile />
            </PrivateRoute>
          }
        />
        <Route
          path="/candidate-profile"
          element={
            <PrivateRoute allowedRoles={["JobSeeker"]}>
              <CandidateProfile />
            </PrivateRoute>
          }
        />
        <Route
          path="/resume-builder"
          element={
            <PrivateRoute allowedRoles={["JobSeeker"]}>
              <ResumeBuilder />
            </PrivateRoute>
          }
        />
        <Route
          path="/employer-dashboard"
          element={
            <PrivateRoute allowedRoles={["Recruiter", "Company"]}>
              <EmployerDashboard />
            </PrivateRoute>
          }
        />
        <Route
          path="/skill-assessments-tests"
          element={
            <PrivateRoute>
              <SkillAssementTestPage />
            </PrivateRoute>
          }
        />
        <Route
          path="/certificates-scores"
          element={
            <PrivateRoute>
              <CertificateScorePage />
            </PrivateRoute>
          }
        />
        <Route
          path="/job-alert"
          element={
            <PrivateRoute>
              <JobAlert />
            </PrivateRoute>
          }
        />
        <Route
          path="/activity-timeline"
          element={
            <PrivateRoute  allowedRoles={["JobSeeker"]}>
              <ActivityTimeline />
            </PrivateRoute>
          }
        />
        <Route
          path="/application-management"
          element={
            <PrivateRoute>
              <ApplicationManagement />
            </PrivateRoute>
          }
        />
        <Route
          path="/applied-jobs-list"
          element={
            <PrivateRoute allowedRoles={["Recruiter", "Company"]}>
              <AppliedJobList />
            </PrivateRoute>
          }
        />
        <Route
          path="/chat-messaging-system"
          element={
            <PrivateRoute allowedRoles={["JobSeeker"]}>
              <ChatMassageSystem />
            </PrivateRoute>
          }
        />
        <Route path="/:companySlug" element={<CompanyDetailsPage />} />
       <Route path="/job/:jobSlug" element={<JobDetails />} />
        <Route
          path="/job-details-list"
          element={
            <PrivateRoute>
              <JobDetailsList />
            </PrivateRoute>
          }
        />
        <Route
          path="/candidate-dashboard"
          element={
            <PrivateRoute allowedRoles={["JobSeeker"]}>
              <CandidateDashboard />
            </PrivateRoute>
          }
        />
        <Route
          path="/manage-job-application"
          element={
            <PrivateRoute allowedRoles={["JobSeeker"]}>
              <ManagesJobApplication />
            </PrivateRoute>
          }
        />
        <Route
          path="/your-job-posts"
          element={
            <PrivateRoute allowedRoles={["Recruiter", "Company"]}>
              <YourJobPosts />
            </PrivateRoute>
          }
        />
        <Route
          path="/employer-wallet"
          element={
            <PrivateRoute allowedRoles={["Recruiter", "Company"]}>
              <EmployerWallet />
            </PrivateRoute>
          }
        />
        <Route
          path="/checkout"
          element={
            <PrivateRoute allowedRoles={["Recruiter", "Company"]}>
              <Checkout />
            </PrivateRoute>
          }
        />
        {/* <Route
          path="/employer-wallet"
          element={
            <PrivateRoute>
              <EmployerWallet />
            </PrivateRoute>
          }
        /> */}
        <Route
          path="/view-invoice/:id"
          element={
            <PrivateRoute>
              <InvoiceView />
            </PrivateRoute>
          }
        />
        <Route
          path="/setting"
          element={
            <PrivateRoute>
              <Setting />
            </PrivateRoute>
          }
        />
        <Route
          path="/manage-applicants"
          element={
            <PrivateRoute>
              <EmployerFilterCandinateList />
            </PrivateRoute>
          }
        />
        <Route
          path="/bookmark-candidate"
          element={
            <PrivateRoute allowedRoles={["Recruiter", "Company"]}>
              <EmployerShortListCandinate />
            </PrivateRoute>
          }
        />
        <Route
          path="/candidates-search"
          element={
            <PrivateRoute allowedRoles={["Recruiter", "Company"]}>
              <CandinatesList />
            </PrivateRoute>
          }
        />
        <Route
          path="/all-applicants-list"
          element={
            <PrivateRoute allowedRoles={["Recruiter", "Company"]}>
              <ManagesApplicants />
            </PrivateRoute>
          }
        />
        <Route
          path="/create-recruiters"
          element={
            <PrivateRoute>
              <CreateRecruiters />
            </PrivateRoute>
          }
        />
        <Route
          path="/create-assessment"
          element={
            <PrivateRoute>
              <CreateAssement />
            </PrivateRoute>
          }
        />
        <Route
          path="/request-plan"
          element={
            <PrivateRoute>
              <OfferContact />
            </PrivateRoute>
          }
        />
        <Route
          path="/manage-recruiter"
          element={
            <PrivateRoute allowedRoles={["Recruiter", "Company"]}>
              <RecruiterLists />
            </PrivateRoute>
          }
        />
        <Route
          path="/manage-assessment"
          element={
            <PrivateRoute allowedRoles={["Recruiter", "Company"]}>
              <ManagesAssement />
            </PrivateRoute>
          }
        />
        <Route
          path="/messaging-system"
          element={
            <PrivateRoute allowedRoles={["Recruiter", "Company"]}>
              <MassagingSystem />
            </PrivateRoute>
          }
        />
        <Route
          path="/company-profile"
          element={
            <PrivateRoute allowedRoles={["Recruiter", "Company"]}>
              <EmployerProfile />
            </PrivateRoute>
          }
        />
        <Route
          path="/assessment-details"
          element={
            <PrivateRoute>
              <AssessmentDetails />
            </PrivateRoute>
          }
        />
        <Route
          path="/change-password"
          element={
            <PrivateRoute>
              <ChangePassword />
            </PrivateRoute>
          }
        />
        <Route
          path="/candidates-details"
          element={
            <PrivateRoute>
              <CandinateProfileDetails />
            </PrivateRoute>
          }
        />
        <Route
          path="/job-search"
          element={
            <PrivateRoute allowedRoles={["JobSeeker"]}>
              <JobSearch />
            </PrivateRoute>
          }
        ></Route>
        <Route
          path="/apply-test"
          element={
            <PrivateRoute>
              <ApplyTest />
            </PrivateRoute>
          }
        ></Route>
        <Route
          path="/start-test"
          element={
            <PrivateRoute>
              <StartTest />
            </PrivateRoute>
          }
        ></Route>
        <Route
          path="/test-result"
          element={
            <PrivateRoute>
              <TestResult />
            </PrivateRoute>
          }
        ></Route>
        <Route path="/companies-list" element={<Companies />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
      {showFooter && <Footer />}
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
