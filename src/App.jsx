import { BrowserRouter, Routes, Route, Outlet } from 'react-router';
import { UserProvider } from './context/UserContext';
import { SearchProvider } from './context/SearchContext';
import SearchPage from './SearchPage'
import LoginPage from "./LoginPage";
import ForgotPasswordPage from './ForgotPasswordPage';
import RegisterPage from './RegisterPage';
import VerifyAccountPage from './VerifyAccountPage';
import ResetPasswordPage from './ResetPasswordPage';
import NavBar from "./NavBar";
import RestaurantDetail from "./RestaurantDetail";
import OverviewSection from "./OverviewSection";
import ReviewSection from "./ReviewSection";
import PhotosSection from "./PhotosSection";
import MenuSection from "./MenuSection";
import BookTableSection from "./BookTableSection";
import SeatConfirmationPage from "./SeatConfirmationPage";
import AddRestaurantForm from './AddRestaurantForm';
import bgImage from './assets/bg_image.jpg';
import './App.css';
import LandingPage from './LandingPage';
import BookingsPage from "./BookingsPage";
import ProfilePage from "./ProfilePage"
import UserReviewsPage from "./UserReviewsPage";

function App() {
  return (
    <UserProvider>
      <SearchProvider>
        <BrowserRouter>
          <Routes>
            {/* Route without NavBar */}
            <Route path="/" element={<LandingPage />} />

            <Route path="/add-restaurant" element={<AddRestaurantForm />} />

            {/* Routes with NavBar and background */}
            <Route element={<LayoutWithNavBar />}>
              <Route path="/LoginPage" element={<LoginPage />} />
              <Route path="/forgot-password" element={<ForgotPasswordPage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route path="/verify-account/:token" element={<VerifyAccountPage />} />
              <Route path="/reset-password" element={<ResetPasswordPage />} />
            </Route>

            {/* Routes with NavBar but NO background */}
            <Route element={<LayoutNavBarNoBg />}>
              <Route path="/search" element={<SearchPage />} />
              <Route path="/restaurant/:id" element={<RestaurantDetail />}>
                <Route path="info" element={<OverviewSection />} />
                <Route path="reviews" element={<ReviewSection />} />
                <Route path="photos" element={<PhotosSection />} />
                <Route path="menu" element={<MenuSection />} />
                <Route path="book" element={<BookTableSection />} />
                <Route path="book/confirmation" element={<SeatConfirmationPage />} />
                <Route index element={<OverviewSection />} /> {/* Default */}
              </Route>
              <Route path="/profile" element={<ProfilePage />} />
              <Route path="/bookings" element={<BookingsPage />} />
              <Route path="/reviews" element={<UserReviewsPage />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </SearchProvider>
    </UserProvider>
  );
}

// Layout with NavBar and background
function LayoutWithNavBar() {
  return (
    <div className="relative min-h-screen flex flex-col">
      {/* Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center opacity-90 -z-10"
        style={{
          backgroundImage: `url(${bgImage})`,
        }}
      ></div>
      <div className="absolute inset-0 bg-black/40 -z-10"></div>

      {/* NavBar */}
      <NavBar className="relative z-10" textColor="text-gray-200" />

      {/* Main Content */}
      <div className="flex-grow relative z-10">
        <Outlet />
      </div>
    </div>
  );
}

// Layout with NavBar and NO background
function LayoutNavBarNoBg() {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <NavBar textColor="text-gray-900" />
      <div className="flex-grow">
        <Outlet />
      </div>
    </div>
  );
}


// function LayoutWithNavBar() {
//   return (
//     <div className="relative min-h-screen">
//       <div
//         className="absolute inset-0 bg-cover bg-center opacity-90"
//         style={{
//           backgroundImage: `url(${bgImage})`,
//         }}
//       ></div>
//       <div className="absolute inset-0 bg-black/40"></div>
//       <NavBar className="relative z-10" />
//       <Outlet className="relative z-10" />
//     </div>
//   );
// }

export default App;