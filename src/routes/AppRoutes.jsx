import { Routes, Route } from 'react-router-dom';
import Login from '../pages/auth/Login';
import ActivateAccount from '../pages/auth/ActivateAccount';
import MainLayout from '../layouts/MainLayout';
import Home from '../pages/public/Home';
import DonorList from '../pages/public/DonorList'; 
import Register from '../pages/auth/Register';
import Profile from '../pages/auth/Profile';
import EventPage from '../pages/dashboard/EventPage';
import DashboardPage from '../pages/dashboard/DashboardPage';
import { RequestConfirmation } from '../pages/RequestConfirmation';
import ResendActivationEmail from '../pages/auth/ResendActivationMail';
import UpdateBloodGroup from '../components/Profile/UpdateBloodGroup';
import UpdateProfileInfo from '../components/Profile/UpdateProfileInfo';
import UpdateAvatar from '../components/Profile/UpdateAvatar';
import DonorProfile from '../components/Profile/DonorProfile';
import DonatePage from '../pages/public/DonatePage';
import PaymentSuccess from '../pages/public/PaymentSuccess';
import PaymentFailed from '../pages/public/PaymentFailed';
import ConvencingPage from '../pages/public/ConvenceingPage';
import PaymentCancelled from '../pages/public/PaymentCancelled';
import PaymentHistory from '../pages/public/PaymentHistory';
import CreateEvent2 from '../pages/public/CreateEvent2';
import EventAcceptedButton from '../components/blood/EventAcceptedButton';
import EventInfo from '../components/blood/EventInfo';
import PasswordReset from '../components/auth/PasswordReset';
import PasswordResetConfirm from '../components/auth/PasswordResetConfirm';
import PublicStatsDashboard from '../components/layout/PublicStatsDashboard';
import BloodEvents from '../components/blood/BloodEvents';
import DonationHistory from '../components/blood/DonationHistory';
import AboutPage from '../pages/public/AboutPage';
import ContactPage from '../pages/public/ContactPage';
import Sidebar from '../pages/public/Sidebar';
import MyRequest from '../pages/public/MyRequest';
import DonorRequests from '../components/blood/DonorRequests';
import MyEvents from '../pages/dashboard/MyEvents';
import AdminDashboard from '../components/dashboard/AdminDashboard';
import DashboardHome from '../pages/dashboard/DashboardHome';
// import DashboardHome from '../pages/dashboard/DashboardHome';

export const AppRoutes = () => {
  return (
    <Routes>
      <Route element={<MainLayout />}>
        <Route path="/" element={<Home />} />
        <Route path='/donors' element={<DonorList />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="activate/:uid/:token" element={<ActivateAccount />} />
        <Route path="/request-confirmation/:id" element={<RequestConfirmation />} />  
        <Route path="/resend-activation" element={<ResendActivationEmail />} />
        <Route path='profile' element={<Profile/>} />
        <Route path="/update-avatar" element={<UpdateAvatar />} />
        <Route path="/update-blood" element={<UpdateBloodGroup />} />
        <Route path="/update-profile" element={<UpdateProfileInfo />} />
        <Route path="/create-donor-profile" element={<DonorProfile />} />
        <Route path="/donate" element={<DonatePage />} />
        <Route path="/payment/success" element={<PaymentSuccess />} />
        <Route path="/payment/fail" element={<PaymentFailed />} />
        <Route path="/payment/cancel" element={<PaymentCancelled />} />
        <Route path="/convenceToDonateMoney" element={<ConvencingPage />} />
        <Route path="/payment/history" element={<PaymentHistory />} />
        <Route path="/event-accept" element={<EventAcceptedButton />} />
        <Route path="/event-info" element={<EventInfo />} />
        <Route path="/password/reset" element={<PasswordReset />} />
        <Route path="/password/reset/confirm/:uid/:token" element={<PasswordResetConfirm />} />
        <Route path="/new-section" element={<PublicStatsDashboard />} />
        <Route path="/events_new" element={<BloodEvents />} />
        <Route path="/donation-history" element={<DonationHistory />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/sidebar" element={<Sidebar />} />
        <Route path="/create-event" element={<CreateEvent2 />} />
        <Route path="/my-request" element={<MyRequest />} />
        <Route path="/donor-request" element={<DonorRequests />} />
        <Route path="/my-event" element={<MyEvents />} />
        <Route path="/event-page" element={<EventPage />} />
        
        {/* Dashboard Routes with Persistent Sidebar */}
        <Route path='/dashboard' element={<DashboardPage />}>
          <Route index element={<DashboardHome />} />
          <Route path="profile" element={<Profile />} />
          <Route path="create-event" element={<CreateEvent2 />} />
          <Route path="requests" element={<DonorRequests />} />
          <Route path="events" element={<EventPage />} />
          <Route path="history" element={<DonationHistory />} />
          <Route path="my-request" element={<MyRequest />} />
          <Route path="my-event" element={<MyEvents />} />
        </Route>
        
        <Route path='/admin-dashboard' element={<AdminDashboard />} />
      </Route>
    </Routes> 
  );
};
export default AppRoutes;

// import { Routes, Route } from 'react-router-dom';
// import Login from '../pages/auth/Login';
// import ActivateAccount from '../pages/auth/ActivateAccount';
// import MainLayout from '../layouts/MainLayout';
// import Home from '../pages/public/Home';
// import DonorList from '../pages/public/DonorList'; 
// import Register from '../pages/auth/Register';
// import Profile from '../pages/auth/Profile';
// import EventPage from '../pages/dashboard/EventPage';
// import DashboardPage from '../pages/dashboard/DashboardPage';
// import { RequestConfirmation } from '../pages/RequestConfirmation';
// import ResendActivationEmail from '../pages/auth/ResendActivationMail';
// import UpdateBloodGroup from '../components/Profile/UpdateBloodGroup';
// import UpdateProfileInfo from '../components/Profile/UpdateProfileInfo';
// import UpdateAvatar from '../components/Profile/UpdateAvatar';
// import DonorProfile from '../components/Profile/DonorProfile';
// import DonatePage from '../pages/public/DonatePage';
// import PaymentSuccess from '../pages/public/PaymentSuccess';
// import PaymentFailed from '../pages/public/PaymentFailed';
// import ConvencingPage from '../pages/public/ConvenceingPage';
// import PaymentCancelled from '../pages/public/PaymentCancelled';
// import PaymentHistory from '../pages/public/PaymentHistory';
// import CreateEvent2 from '../pages/public/CreateEvent2';
// import EventAcceptedButton from '../components/blood/EventAcceptedButton';
// import EventInfo from '../components/blood/EventInfo';
// import PasswordReset from '../components/auth/PasswordReset';
// import PasswordResetConfirm from '../components/auth/PasswordResetConfirm';
// // import Dashboard2 from '../components/layout/dashboard2';
// import PublicStatsDashboard from '../components/layout/PublicStatsDashboard';
// import BloodEvents from '../components/blood/BloodEvents';
// import DonationHistory from '../components/blood/DonationHistory';
// import AboutPage from '../pages/public/AboutPage';
// import ContactPage from '../pages/public/ContactPage';
// import Sidebar from '../pages/public/Sidebar';
// import MyRequest from '../pages/public/MyRequest';
// import DonorRequests from '../components/blood/DonorRequests';
// import MyEvents from '../pages/dashboard/MyEvents';
// import AdminDashboard from '../components/dashboard/AdminDashboard';
// import DashboardHome from '../pages/dashboard/DashboardHome';

// // import CreateEventForm from '../components/blood/CreateEventForm';
// // import DonationHistory from '../components/blood/DonationHistory';
// // import BloodEventList from '../components/blood/BloodEventList';

// export const AppRoutes = () => {
//   return (
//     <Routes>
//       <Route element={<MainLayout />}>
//         <Route path="/" element={<Home />} />
//          <Route path='/donors' element={<DonorList />} />
//         <Route path="/login" element={<Login />} />
//         <Route path="/register" element={<Register />} />
//         <Route path="activate/:uid/:token" element={<ActivateAccount />} />
//         <Route path="/request-confirmation/:id" element={<RequestConfirmation />} />  
//         <Route path="/resend-activation" element={<ResendActivationEmail />} />
//         <Route path='profile' element={<Profile/>} />
//         <Route path="/update-avatar" element={<UpdateAvatar />} />
//         <Route path="/update-blood" element={<UpdateBloodGroup />} />
      
//         <Route path="/update-profile" element={<UpdateProfileInfo />} />
//         <Route path="/create-donor-profile" element={<DonorProfile />} />
//         <Route path="/donate" element={<DonatePage />} />
//         <Route path="/payment/success" element={<PaymentSuccess />} />
//         <Route path="/payment/fail" element={<PaymentFailed />} />
//         <Route path="/payment/cancel" element={<PaymentCancelled />} />
//         <Route path="/convenceToDonateMoney" element={<ConvencingPage />} />
       
//         <Route path="/payment/history" element={<PaymentHistory />} />
//         <Route path="/event-accept" element={<EventAcceptedButton />} />
//         <Route path="/event-info" element={<EventInfo />} />
//         <Route path="/password/reset" element={<PasswordReset />} />
//         <Route path="/password/reset/confirm/:uid/:token" element={<PasswordResetConfirm />} />
//         <Route path="/new-section" element={<PublicStatsDashboard />} />
//         <Route path="/events_new" element={<BloodEvents />} />
//         {/* <Route path="/events/create" element={<CreateEventForm />} /> */}
//         <Route path="/donation-history" element={<DonationHistory />} />
//         <Route path="/about" element={<AboutPage />} />
//         <Route path="/contact" element={<ContactPage />} />
//         <Route path="/sidebar" element={<Sidebar />} />
//         <Route path="/create-event" element={<CreateEvent2 />} />
//         <Route path="/my-request" element={<MyRequest />} />
//         <Route path="/donor-request" element={<DonorRequests />} />
//         <Route path="/my-event" element={<MyEvents />} />
//         <Route path="/event-page" element={<EventPage />} />
//          {/* <Route path='/dashboard' element={< DashboardPage/>} /> */}
// <Route path='/dashboard' element={<DashboardPage />}>
//   <Route index element={<DashboardHome />} /> {/* Default dashboard content */}
//   <Route path="requests" element={<DonorRequests />} />
//   <Route path="events" element={<EventPage />} />
//   <Route path="history" element={<DonationHistory />} />
//   <Route path="my-request" element={<MyRequest />} />
//   <Route path="my-event" element={<MyEvents />} />
// </Route>
//          <Route path='/admin-dashboard' element={< AdminDashboard/>} />
//       </Route>
//     </Routes> 
//   );
// };
// export default AppRoutes;


