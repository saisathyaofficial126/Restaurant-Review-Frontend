import { useState, useContext, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router";
import { UserContext } from "./context/UserContext";

function ForgotPasswordPage() {
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const { user } = useContext(UserContext);

    useEffect(() => {
        if (user) {
            navigate(-1); // Go back to previous page if already logged in
        }
    }, [user, navigate]);

    const handleForgotPassword = async (e) => {
        e.preventDefault();
        setMessage('');
        setError('');

        try {
            const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/forgot-password`, {
                email,
            });
            setMessage(response.data.message);
        } catch (err) {
            setError(err.response?.data?.error || 'Something went wrong');
        }
    };

    return (
        <div className="pt-5 flex items-center justify-center">
            <div className="bg-white p-8 rounded shadow-gray-500 shadow-2xl  w-full max-w-sm">
                <h1 className="text-2xl font-bold text-gray-700 mb-6">Forgot Password</h1>
                <form onSubmit={handleForgotPassword}>
                    {/* Email Input */}
                    <div className="mb-4">
                        <label className="block text-gray-700 mb-2">Email</label>
                        <input
                            type="email"
                            value={email}
                            placeholder="Enter your registered email"
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-green-500"
                            required
                        />
                    </div>
                    {/* Submit Button */}
                    <button
                        type="submit"
                        className="w-full bg-green-600 hover:bg-green-700 text-white py-2 rounded transition duration-200"
                    >
                        Submit
                    </button>
                </form>
                {message && <p className="mt-4 text-center text-green-600">{message}</p>}
                {error && <p className="mt-4 text-center text-red-600">{error}</p>}
            </div>
        </div>
    );
}

export default ForgotPasswordPage;