import { useEffect, useState } from "react";
import axios from "axios";

const BookingsPage = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/user/bookings`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        setBookings(response.data);
      } catch (error) {
        console.error("Error fetching bookings:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, []);

  const handleCancelBooking = async (bookingId) => {
    try {
      await axios.delete(`${import.meta.env.VITE_BACKEND_URL}/reservations/${bookingId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      setBookings((prev) => prev.filter((booking) => booking._id !== bookingId));
      alert("Booking canceled successfully.");
    } catch (error) {
      console.error("Error canceling booking:", error);
      alert("Failed to cancel booking. Please try again.");
    }
  };

  if (loading) {
    return <div className="text-center text-gray-500">Loading bookings...</div>;
  }

  if (bookings.length === 0) {
    return <div className="text-center text-gray-500">No bookings found.</div>;
  }

  return (
    <div className="container mx-auto px-4 py-6">
      <h2 className="text-2xl font-semibold text-gray-800 mb-6">Your Bookings</h2>
      <ul className="space-y-4">
        {bookings.map((booking) => (
          <li
            key={booking._id}
            className="bg-white rounded-lg shadow-md p-4 border border-gray-200 flex justify-between items-center"
          >
            <div>
              <h3 className="text-lg font-semibold text-gray-800">{booking.restaurantId.name}</h3>
              <p className="text-sm text-gray-600">{booking.restaurantId.address}</p>
              <p className="text-sm text-gray-600">
                Date: {booking.date}, Time: {booking.timeSlot}:00
              </p>
              <p className="text-sm text-gray-600">Guests: {booking.guests}</p>
            </div>
            <button
              className="bg-red-500 hover:bg-red-600 text-white rounded-full px-4 py-2"
              onClick={() => handleCancelBooking(booking._id)}
            >
              Cancel
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default BookingsPage;