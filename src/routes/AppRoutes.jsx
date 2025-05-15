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
        <Route path='/dashboard' element={< DashboardPage/>} />
        <Route path="/update-profile" element={<UpdateProfileInfo />} />
        <Route path="/create-donor-profile" element={<DonorProfile />} />
        <Route path="/donate" element={<DonatePage />} />
        <Route path="/payment/success" element={<PaymentSuccess />} />
        <Route path="/payment/fail" element={<PaymentFailed />} />
        <Route path="/payment/cancel" element={<PaymentCancelled />} />
        <Route path="/convenceToDonateMoney" element={<ConvencingPage />} />
        <Route path="/event-page" element={<EventPage />} />
        <Route path="/payment/history" element={<PaymentHistory />} />
        <Route path="/event-accept" element={<EventAcceptedButton />} />
        <Route path="/event-info" element={<EventInfo />} />
        <Route path="/password/reset" element={<PasswordReset />} />
        <Route path="/password/reset/confirm/:uid/:token" element={<PasswordResetConfirm />} />


      
      </Route>
    </Routes> 
  );
};
export default AppRoutes;


