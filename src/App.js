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
import AddPlan from "./Pages/AddPlan";
import ResumeBuilder from "./Pages/ResumeBuilder";

// "build 04-09-2025"
console.log("Date:-18-12-2025,time:-12:11");
function LayoutWrapper() {
  const location = useLocation();

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
    "/shortlist-candidates",
    "/candidates-search",
    "/create-recruiters",
    "/recruiters-list",
    "/messaging-system",
    "/employer-profile",
    "/job-details-form",
    "/job-details-list",
    "/resume-builder",
    // "/job-details",

    "/candidate-dashboard",
    "/chat-messaging-system",
    "/applied-jobs-list",
    "/activity-timeline",
    // "/candidates-profile-details",
    "/manage-job-application",
    "/application-management",
    "/job-alert",
  ];

  const showSidebar = sidebarRoutes.some((route) =>
    location.pathname.startsWith(route)
  );

  const bgColor = showSidebar ? "#fff" : "#f0f5f7";
  const showFooter = !showSidebar;

  return (
    <>
      <Header bgColor={bgColor} />
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
        <Route path="/employer-register" element={<EmployerRegister />} />
        <Route path="/employer-login" element={<EmployerLogin />} />
        <Route path="/email-verification" element={<EmailOTPVerification />} />

        <Route path="/contact-us" element={<ContactUs />} />
        <Route path="/privacy-policy" element={<PrivecyPolicy />} />
        <Route path="/terms-condition" element={<TearmCondition />} />

        <Route path="/employers" element={<Employers />} />
        <Route path="/faq" element={<Faq />} />
        <Route
          path="/employer-candidates-list"
          element={<EmployerCandinateList />}
        />
        <Route path="/about-us" element={<AboutUs />} />
        <Route path="/blog" element={<Blog />} />

        <Route path="/blogDetails" element={<BlogDetails />} />

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
        {/* Protected Routes */}
        <Route
          path="/job-details-form/:id"
          element={
            <PrivateRoute>
              <JobDetailsForm />
            </PrivateRoute>
          }
        />
        <Route
          path="/profile-basic-info"
          element={
            <PrivateRoute>
              <MyProfile />
            </PrivateRoute>
          }
        />
        <Route
          path="/resume-builder"
          element={
            <PrivateRoute>
              <ResumeBuilder />
            </PrivateRoute>
          }
        />
        <Route
          path="/candidate-profile"
          element={
            <PrivateRoute>
              <CandidateProfile />
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
            <PrivateRoute>
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
            <PrivateRoute>
              <AppliedJobList />
            </PrivateRoute>
          }
        />
        <Route
          path="/chat-messaging-system"
          element={
            <PrivateRoute>
              <ChatMassageSystem />
            </PrivateRoute>
          }
        />

        <Route path="/companies-details" element={<CompanyDetailsPage />} />
        <Route path="/job-details/:id" element={<JobDetails />} />

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
            <PrivateRoute>
              <CandidateDashboard />
            </PrivateRoute>
          }
        />
        <Route
          path="/manage-job-application"
          element={
            <PrivateRoute>
              <ManagesJobApplication />
            </PrivateRoute>
          }
        />
        <Route
          path="/your-job-posts"
          element={
            <PrivateRoute>
              <YourJobPosts />
            </PrivateRoute>
          }
        />
        <Route
          path="/employer-wallet"
          element={
            <PrivateRoute>
              <EmployerWallet />
            </PrivateRoute>
          }
        />
        <Route
          path="/employer-dashboard"
          element={
            <PrivateRoute>
              <EmployerDashboard />
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
          path="/shortlist-candidates"
          element={
            <PrivateRoute>
              <EmployerShortListCandinate />
            </PrivateRoute>
          }
        />
        <Route
          path="/candidates-search"
          element={
            <PrivateRoute>
              <CandinatesList />
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
          path="/recruiters-list"
          element={
            <PrivateRoute>
              <RecruiterLists />
            </PrivateRoute>
          }
        />
        <Route
          path="/messaging-system"
          element={
            <PrivateRoute>
              <MassagingSystem />
            </PrivateRoute>
          }
        />
        <Route
          path="/employer-profile"
          element={
            <PrivateRoute>
              <EmployerProfile />
            </PrivateRoute>
          }
        />
        <Route
          path="/candidates-profile-details"
          element={
            <PrivateRoute>
              <CandinateProfileDetails />
            </PrivateRoute>
          }
        />
        <Route
          path="/job-search"
          element={
            <PrivateRoute>
              <JobSearch />
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
    <BrowserRouter basename="/jobPortal">
      <ScrollToTop />
      <LayoutWrapper />
    </BrowserRouter>
  );
}

export default App;
