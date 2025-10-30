import { useEffect, useState, useContext } from "react";
import axios from "axios";
import { StarIcon } from "@heroicons/react/24/solid";
import { UserContext } from "./context/UserContext";

const UserReviewsPage = () => {
  const { user } = useContext(UserContext);
  const [completedBookings, setCompletedBookings] = useState([]);
  const [userReviews, setUserReviews] = useState([]);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [rating, setRating] = useState(0);
  const [reviewText, setReviewText] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCompletedBookings = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/user/bookings`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        const completed = response.data
          .filter((booking) => new Date(booking.date) < new Date())
          .sort((a, b) => new Date(b.date) - new Date(a.date));
        setCompletedBookings(completed);
      } catch (error) {
        console.error("Error fetching completed bookings:", error);
      }
    };

    const fetchUserReviews = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/user/reviews`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        const sortedReviews = response.data.sort((a, b) => new Date(b.date) - new Date(a.date)); // Sort by newer to older
        setUserReviews(sortedReviews);
      } catch (error) {
        console.error("Error fetching user reviews:", error);
      }
    };

    fetchCompletedBookings();
    fetchUserReviews();
    setLoading(false);
  }, []);

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    if (!selectedBooking || rating === 0 || reviewText.trim() === "") {
      alert("Please select a booking, provide a rating, and write a review.");
      return;
    }

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/reviews`,
        {
          restaurantId: selectedBooking.restaurantId._id,
          rating,
          text: reviewText,
          userName: user.name,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      // Add the new review to the state
      const newReview = {
        _id: response.data._id,
        restaurantId: selectedBooking.restaurantId,
        userEmail: user.email,
        userName: user.name,
        rating,
        text: reviewText,
        date: new Date().toISOString(),
      };
      setUserReviews((prevReviews) => [newReview, ...prevReviews]); // Add the new review to the top of the list
      alert("Review submitted successfully!");
      setRating(0);
      setReviewText("");
      setSelectedBooking(null);
    } catch (error) {
      console.error("Error submitting review:", error);
      alert("Failed to submit review. Please try again.");
    }
  };

  if (loading) {
    return <div className="text-center text-gray-500">Loading...</div>;
  }

  return (
    <div className="container mx-auto px-4 py-6">
      <h2 className="text-2xl font-semibold text-gray-800 mb-6">Your Reviews</h2>

      <div className="flex flex-col obsolute md:flex-row gap-3">
        {/* Past Reviews Section */}
        <div className="w-full lg:w-2/3">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Your Past Reviews</h3>
          {userReviews.length === 0 ? (
            <div className="text-gray-500">No reviews found.</div>
          ) : (
            <ul className="space-y-4">
              {userReviews.map((review) => (
                <li
                  key={review._id}
                  className="bg-white rounded-lg p-4 shadow-sm border border-gray-200"
                >
                  <h4 className="text-lg font-semibold text-gray-800">
                    {review.restaurantId.name}
                  </h4>
                  <div className="flex items-center mb-2">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <StarIcon
                        key={i}
                        className={`h-5 w-5 ${
                          i < review.rating ? "text-yellow-500" : "text-gray-300"
                        }`}
                      />
                    ))}
                  </div>
                  <p className="text-gray-700">{review.text}</p>
                  <p className="text-gray-500 text-sm">{new Date(review.date).toLocaleDateString()}</p>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Write a Review Section */}
        <div className="w-full lg:w-1/3">
          <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200 sticky top-4">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Write a Review</h3>
            <form onSubmit={handleSubmitReview}>
              <div className="mb-4">
                <label className="block text-gray-700 mb-2">Select Booking</label>
                <select
                  value={selectedBooking ? selectedBooking._id : ""}
                  onChange={(e) =>
                    setSelectedBooking(
                      completedBookings.find((booking) => booking._id === e.target.value)
                    )
                  }
                  className="w-full border border-gray-300 rounded px-3 py-2"
                >
                  <option value="">Select a completed booking</option>
                  {completedBookings.map((booking) => (
                    <option key={booking._id} value={booking._id}>
                      {booking.restaurantId.name} - {booking.date}
                    </option>
                  ))}
                </select>
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 mb-2">Rating</label>
                <div className="flex items-center space-x-2">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <StarIcon
                      key={i}
                      className={`h-6 w-6 cursor-pointer ${
                        i < rating ? "text-yellow-500" : "text-gray-300"
                      }`}
                      onClick={() => setRating(i + 1)}
                    />
                  ))}
                </div>
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 mb-2">Review</label>
                <textarea
                  value={reviewText}
                  onChange={(e) => setReviewText(e.target.value)}
                  placeholder="Write your review here..."
                  className="w-full border border-gray-300 rounded px-3 py-2"
                  rows="4"
                ></textarea>
              </div>
              <button
                type="submit"
                className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
              >
                Submit Review
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserReviewsPage;