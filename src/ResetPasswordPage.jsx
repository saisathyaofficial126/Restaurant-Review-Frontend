import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router';
import axios from "axios";

const ResetPasswordPage = () => {
    const [username, setUsername] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [error, setError] = useState("");
    const [message, setMessage] = useState("");

    const [searchParams] = useSearchParams();
    const token = searchParams.get("token");
    const navigate = useNavigate();

    useEffect(() => {
        if (token) {
            axios
                .get(`${import.meta.env.VITE_BACKEND_URL}/reset-password/verify?token=${token}`)
                .then((response) => {
                    setUsername(response.data.username);
                })
                .catch((err) => {
                    setError("Invalid or expired token");
                });
        } else {
            setError("No token provided.");
            setTimeout(() => {
                navigate(-1); // Go back to previous page if no token
            }, 1000);
        }
    }, [token, navigate]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setMessage("");

        if (newPassword !== confirmPassword) {
            setError("New password and confirm password do not match.");
            return;
        }

        try {
            await axios.post(`${import.meta.env.VITE_BACKEND_URL}/reset-password`, {
                token,
                newPassword,
            });
            setMessage("Password reset successfully. You can now log in.");
            // Redirect to login page after a delay
            setTimeout(() => {
                navigate("/");
            }, 3000);
        } catch (err) {
            setError(err.response?.data?.error || "Error resetting password");
        }
    };

    return (
        <div className="pt-5 flex items-center justify-center ">
            <div className="bg-white p-8 rounded shadow-gray-500 shadow-2xl w-full max-w-sm">
                <h1 className="text-2xl font-bold text-center mb-6">
                    {username ? `Reset Password for ${username}` : "Reset Password"}
                </h1>
                {error && <p className="mb-4 text-red-500 text-center">{error}</p>}
                {message && <p className="mb-4 text-green-500 text-center">{message}</p>}
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label className="block text-gray-700 mb-2">New Password</label>
                        <input
                            type="password"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            placeholder="Enter new password"
                            className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-purple-500"
                            required
                        />
                    </div>
                    <div className="mb-6">
                        <label className="block text-gray-700 mb-2">Confirm Password</label>
                        <input
                            type="password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            placeholder="Confirm new password"
                            className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-purple-500"
                            required
                        />
                    </div>
                    <button
                        type="submit"
                        className="w-full bg-purple-600 hover:bg-purple-700 text-white py-2 rounded transition duration-200"
                    >
                        Reset Password
                    </button>
                </form>
            </div>
        </div>
    );
};

export default ResetPasswordPage;