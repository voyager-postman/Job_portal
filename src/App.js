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

function LayoutWrapper() {
  const location = useLocation();

  const sidebarRoutes = [
    "/candidate-profile",
    "/job-search",
    "/companies-list",
    "/companies-list",
    "/companies-details",
    "/job-details",
    "/your-job-posts",
    "/job-details-form",
    "/candidate-dashboard"
  ];

  const showSidebar = sidebarRoutes.some((route) =>
    location.pathname.startsWith(route)
  );
  const showFooter = !showSidebar;

  return (
    <>
      <Header />
      {showSidebar && <Sidebar />}
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/recovery-password" element={<RecoveryPassword />} />
        <Route path="/employer-register" element={<EmployerRegister />} />
        <Route path="/employer-login" element={<EmployerLogin />} />
        <Route path="/contact-us" element={<ContactUs />} />
        <Route path="/about-us" element={<AboutUs />} />
        <Route path="/employer-home" element={<EmployerHomePage />} />
        <Route
          path="/employer-basic-info"
          element={<EmployerBasicInformation />}
        />
        {/* Protected Routes */}
        <Route
          path="/job-details-form"
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
          path="/candidate-profile"
          element={
            <PrivateRoute>
              <CandidateProfile />
            </PrivateRoute>
          }
        />
        <Route
          path="/companies-details"
          element={
            <PrivateRoute>
              <CompanyDetailsPage />
            </PrivateRoute>
          }
        />
        <Route
          path="/job-details"
          element={
            <PrivateRoute>
              <JobDetails />
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
          path="/your-job-posts"
          element={
            <PrivateRoute>
              <YourJobPosts />
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

        <Route
          path="/companies-list"
          element={
            <PrivateRoute>
              <Companies />
            </PrivateRoute>
          }
        />

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
