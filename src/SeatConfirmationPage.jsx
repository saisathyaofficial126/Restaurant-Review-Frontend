import { CalendarIcon, UsersIcon, MapPinIcon } from '@heroicons/react/24/outline';
import { useOutletContext, useLocation, useNavigate } from 'react-router';
import axios from "axios";

const formatHour = (hour) => {
  const h = hour % 24;
  const ampm = h < 12 ? 'AM' : 'PM';
  const displayHour = h % 12 === 0 ? 12 : h % 12;
  return `${displayHour.toString().padStart(2, '0')}:00 ${ampm}`;
};

const formatDate = (dateStr) => {
  const date = new Date(dateStr);
  return date.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' });
};

const SeatConfirmationPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { restaurantData, selectedDate, selectedSlot, guests } = location.state || {};

  const handleConfirmBooking = async () => {
    const token = localStorage.getItem("token");

    if (!token) {
      alert("You need to log in to confirm the booking.");
      navigate("/LoginPage"); // Redirect to the login page
      return;
    }

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/reservations`,
        {
          restaurantId: restaurantData._id,
          date: selectedDate,
          timeSlot: selectedSlot,
          guests,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // Display the success message from the server
      alert(response.data.message);
      navigate("/"); // Redirect to home or another page
    } catch (error) {
      if (error.response?.status === 400) {
        alert(error.response.data.error); // Display the server's error message
      } else if (error.response?.status === 401) {
        alert("Session expired. Please log in again.");
        navigate("/LoginPage"); // Redirect to the login page
      } else {
        console.error("Error confirming reservation:", error);
        alert("Failed to confirm reservation. Please try again.");
      }
    }
  };

  if (!restaurantData || !selectedDate || !selectedSlot || !guests) {
    return (
      <div className="bg-white p-4 rounded-lg shadow-md">
        <h2 className="text-lg font-semibold mb-4">Booking Details</h2>
        <div className="text-gray-500">Booking information is missing.</div>
      </div>
    );
  }

  return (
    <div className="bg-white p-4 rounded-lg shadow-md">
      <h2 className="text-lg font-semibold mb-4">Review Booking Details</h2>
      <div className="flex items-center mb-2">
        <CalendarIcon className="w-6 h-6 text-gray-500 mr-2" />
        <p className="text-gray-800 font-semibold">
          {formatDate(selectedDate)} at {formatHour(selectedSlot)}
        </p>
      </div>
      <div className="flex items-center mb-2">
        <UsersIcon className="w-6 h-6 text-gray-500 mr-2" />
        <p className="text-gray-800 font-semibold">{guests} guests</p>
      </div>
      <div className="flex items-center">
        <MapPinIcon className="w-6 h-6 text-gray-500 mr-2" />
        <p className="text-gray-800 font-semibold">{restaurantData.name}</p>
      </div>
      <p className="text-gray-600 ml-8 mb-4">{restaurantData.address}</p>
      <button
        className="w-fit bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded"
        onClick={handleConfirmBooking}
      >
        Confirm Booking
      </button>
    </div>
  );
};

export default SeatConfirmationPage;
