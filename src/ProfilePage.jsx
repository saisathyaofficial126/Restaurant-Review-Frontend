import { useContext } from "react";
import { UserContext } from "./context/UserContext";

const ProfilePage = () => {
  const { user } = useContext(UserContext);

  if (!user) {
    return (
      <div className="text-center text-gray-500">
        Unable to load user details. Please log in again.
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-6">
      <h2 className="text-2xl font-semibold text-gray-800 mb-6">Your Profile</h2>
      <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
        <p className="text-lg font-semibold text-gray-800">Name: {user.name}</p>
        <p className="text-lg font-semibold text-gray-800">Email: {user.email}</p>
      </div>
    </div>
  );
};

export default ProfilePage;