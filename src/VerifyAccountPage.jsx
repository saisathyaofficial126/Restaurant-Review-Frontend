import { useEffect, useState } from "react";
import { useParams, useNavigate  } from "react-router";
import axios from "axios";

function VerifyAccountPage() {
  const { token } = useParams();
  const navigate = useNavigate();
  const [message, setMessage] = useState("Verifying your account...");
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const verify = async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/verify-account/${token}`);
        setMessage(res.data.message || "Account verified successfully. You can now login.");
        setSuccess(true);
      } catch (err) {
        setMessage(err.response?.data?.error || "Verification failed or token has expired.");
      }
    };
    verify();
  }, [token]);

  useEffect(() => {
    if (success) {
      const timer = setTimeout(() => {
        navigate("/LoginPage");
      }, 3000); // Redirect to login page after 3 seconds
      return () => clearTimeout(timer);
    }
  }, [success, navigate]);

  return (
    <div className="pt-5 flex items-center justify-center">
      <div className="bg-white p-6 rounded shadow-gray-500 shadow-2xl text-center max-w-md w-full">
        <h1 className="text-xl font-bold mb-4">Account Verification</h1>
        <p className="text-gray-700">{message}</p>
        {success && <p className="mt-2 text-sm text-green-600">Redirecting to login page...</p>}
      </div>
    </div>
  );
}

export default VerifyAccountPage;
