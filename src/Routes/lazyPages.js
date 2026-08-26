import { lazy } from "react";

const lazyPage = (factory) => lazy(factory);

// Public pages (lazy — not needed on first paint)
export const SupportTickets = lazyPage(() => import("../Pages/SupportTickets"));
export const ContactUs = lazyPage(() => import("../Pages/ContactUs"));
export const AboutUs = lazyPage(() => import("../Pages/AboutUs"));
export const Companies = lazyPage(() => import("../Pages/Companies"));
export const EmployerRegister = lazyPage(() => import("../Pages/EmployerRegister"));
export const EmployerLogin = lazyPage(() => import("../Pages/EmployerLogin"));
export const EmployerHomePage = lazyPage(() => import("../Pages/EmployerHomePage"));
export const EmployerBasicInformation = lazyPage(
  () => import("../Pages/EmployerBasicInformation"),
);
export const CompanyDetailsInfo = lazyPage(
  () => import("../Pages/CompanyDetailsInfo"),
);
export const CustomResumeCoverLatter = lazyPage(
  () => import("../Pages/CustomResumeCoverLatter"),
);
export const JobAlert = lazyPage(() => import("../Pages/JobAlert"));
export const Faq = lazyPage(() => import("../Pages/Faq"));
export const Blog = lazyPage(() => import("../Pages/Blog"));
export const BlogDetails = lazyPage(() => import("../Pages/BlogDetails"));
export const PrivecyPolicy = lazyPage(() => import("../Pages/PrivecyPolicy"));
export const TearmCondition = lazyPage(() => import("../Pages/TearmCondition"));
export const AddPlan = lazyPage(() => import("../Pages/AddPlan"));
export const AddOnPack = lazyPage(() => import("../Pages/AddOnPack"));
export const SendOtp = lazyPage(() => import("../Pages/SendOtp"));
export const PaymentSuccess = lazyPage(() => import("../Pages/PaymentSuccess"));
export const PaymentFailed = lazyPage(() => import("../Pages/PaymentFailed"));
export const EmailOTPVerification = lazyPage(
  () => import("../Pages/EmailOTPVerification"),
);
export const VerifiedCancel = lazyPage(() => import("../Pages/VerifiedCancel"));
export const AccountVerified = lazyPage(() => import("../Pages/AccountVerified"));
export const Varification = lazyPage(() => import("../Pages/Varification"));
export const EmployerCandinateList = lazyPage(
  () => import("../Pages/EmployerCandinateList"),
);
export const ApplicantsDetails = lazyPage(
  () => import("../Pages/ApplicantsDetails"),
);

// Private / dashboard pages (heavy — lazy loaded)
export const MyProfile = lazyPage(() => import("../Pages/MyProfile"));
export const CandidateProfile = lazyPage(() => import("../Pages/CandidateProfile"));
export const JobSearch = lazyPage(() => import("../Pages/JobSearch"));
export const YourJobPosts = lazyPage(() => import("../Pages/YourJobPosts"));
export const JobDetailsForm = lazyPage(() => import("../Pages/JobDetailsForm"));
export const CandidateDashboard = lazyPage(
  () => import("../Pages/CandidateDashboard"),
);
export const ManagesJobApplication = lazyPage(
  () => import("../Pages/ManagesJobApplication"),
);
export const EmployerFilterCandinateList = lazyPage(
  () => import("../Pages/EmployerFilterCandinateList"),
);
export const EmployerShortListCandinate = lazyPage(
  () => import("../Pages/EmployerShortListCandinate"),
);
export const CandinatesList = lazyPage(() => import("../Pages/CandinatesList"));
export const CandinateProfileDetails = lazyPage(
  () => import("../Pages/CandinateProfileDetails"),
);
export const EmployerDashboard = lazyPage(() => import("../Pages/EmployerDashboard"));
export const JobDetailsList = lazyPage(() => import("../Pages/JobDetailsList"));
export const ActivityTimeline = lazyPage(() => import("../Pages/ActivityTimeline"));
export const Notifications = lazyPage(() => import("../Pages/Notifications"));
export const ChatMassageSystem = lazyPage(
  () => import("../Pages/ChatMassageSystem"),
);
export const EmployerProfile = lazyPage(() => import("../Pages/EmployerProfile"));
export const SkillAssementTestPage = lazyPage(
  () => import("../Pages/SkillAssementTestPage"),
);
export const CertificateScorePage = lazyPage(
  () => import("../Pages/CertificateScorePage"),
);
export const RecruiterLists = lazyPage(() => import("../Conponets/RecruiterLists"));
export const CreateRecruiters = lazyPage(() => import("../Conponets/CreateRecruiters"));
export const MassagingSystem = lazyPage(() => import("../Pages/MassagingSystem"));
export const ApplicationManagement = lazyPage(
  () => import("../Pages/ApplicationManagement"),
);
export const AppliedJobList = lazyPage(() => import("../Pages/AppliedJobList"));
export const Setting = lazyPage(() => import("../Pages/Setting"));
export const EmployerWallet = lazyPage(() => import("../Pages/EmployerWallet"));
export const Checkout = lazyPage(() => import("../Pages/Checkout"));
export const ResumeBuilder = lazyPage(() => import("../Pages/ResumeBuilder"));
export const ManagesApplicants = lazyPage(() => import("../Pages/ManagesApplicants"));
export const ChangePassword = lazyPage(() => import("../Pages/ChangePassword"));
export const CategoryManagement = lazyPage(
  () => import("../Pages/assesment/ManageAssesment"),
);
export const ApplyTest = lazyPage(() => import("../Pages/ApplyTest"));
export const StartTest = lazyPage(() => import("../Pages/StartTest"));
export const TestResult = lazyPage(() => import("../Pages/TestResult"));
export const ManagesAssement = lazyPage(() => import("../Conponets/ManagesAssement"));
export const CreateAssement = lazyPage(() => import("../Conponets/CreateAssement"));
export const AssessmentDetails = lazyPage(() => import("../Pages/AssessmentDetails"));
export const OfferContact = lazyPage(() => import("../Conponets/OfferContact"));
export const InvoiceView = lazyPage(() => import("../Pages/InvoiceView"));
export const GoogleMarketingConfig = lazyPage(
  () => import("../Pages/admin/GoogleMarketingConfig"),
);
export const HomePageSeoConfig = lazyPage(
  () => import("../Pages/admin/HomePageSeoConfig"),
);
export const AdminJobsListingSeoSettings = lazyPage(
  () => import("../Pages/admin/AdminJobsListingSeoSettings"),
);

// Heavy public pages — kept out of the main bundle to improve FCP on home
export const Login = lazyPage(() => import("../Pages/Login"));
export const Register = lazyPage(() => import("../Pages/Register"));
export const RecoveryPassword = lazyPage(() => import("../Pages/RecoveryPassword"));
export const JobList = lazyPage(() => import("../Pages/JobList"));
export const JobDetails = lazyPage(() => import("../Pages/JobDetails"));
export const Employers = lazyPage(() => import("../Pages/Employers"));
export const CompanyDetailsPage = lazyPage(
  () => import("../Pages/CompanyDetailsPage"),
);
