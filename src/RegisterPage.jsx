import { useState, useContext, useEffect } from 'react'
import { Link, useNavigate } from 'react-router';
import axios from "axios";
import { UserContext } from './context/UserContext';

function RegisterPage() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState("");

    const navigate = useNavigate();
    const { user } = useContext(UserContext);

    useEffect(() => {
        if (user) {
            navigate(-1); // Go back to previous page if already logged in
        }
    }, [user, navigate]);

    const handleRegister = async (e) => {
        e.preventDefault();
        setError("");
        setMessage("");

        // Basic validation to ensure password and confirm password match
        if (password !== confirmPassword) {
            setError("Passwords do not match");
            return;
        }
        if (name.length < 3 || name.length > 50) {
            setError("Name must be between 3 and 50 characters");
            return;
        }

        if (!email.match(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/)) {
            console.log("Invalid email address")
            setError("Invalid email address");
            return;
        }

        try {
            // Call the back-end API
            const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/register`, {
                name,
                email,
                password,
            });

            // If successful
            setMessage(response.data.message || "Registration successful! Please check your email to verify your account.");
            setName("");
            setEmail("");
            setPassword("");
            setConfirmPassword("");
        } catch (err) {
            // Handle error response
            setError(err.response?.data?.error || "An error occurred during registration");
        }
    };

    return (
        <div className="pt-1 flex items-center justify-center">
            <div className="bg-white px-7 py-3 rounded shadow-gray-500 shadow-2xl w-full max-w-sm">
                <h1 className="text-2xl font-bold text-gray-700 mb-4">SignUp</h1>
                {message && <p className="mb-4 text-center text-green-600 font-medium">{message}</p>}
                {error && <p className="mb-4 text-center text-red-600 font-medium">{error}</p>}
                <form onSubmit={handleRegister}>
                    {/* Name Input */}
                    <div className="mb-3">
                        <label htmlFor="name" className="block text-gray-700 mb-1">Name</label>
                        <input
                            type="text"
                            id="name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="Enter your name"
                            className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                            required
                        />
                    </div>
                    {/* Email Input */}
                    <div className="mb-3">
                        <label htmlFor="email" className="block text-gray-700 mb-1">Email</label>
                        <input
                            type="text"
                            id="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="Enter your email"
                            className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                            required
                        />
                    </div>
                    {/* Password Input */}
                    <div className="mb-3">
                        <label htmlFor="password" className="block text-gray-700 mb-1">Password</label>
                        <input
                            type="password"
                            id="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Enter your password"
                            className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                            required
                        />
                    </div>
                    {/* Confirm Password Input */}
                    <div className="mb-5">
                        <label htmlFor="confirmPassword" className="block text-gray-700 mb-1">Confirm Password</label>
                        <input
                            type="password"
                            id="confirmPassword"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            placeholder="Confirm your password"
                            className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                            required
                        />
                    </div>
                    {/* Register Button */}
                    <button
                        type="submit"
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded transition duration-200"
                    >
                        Register
                    </button>
                </form>
                <p className="mt-3 text-center">
                    Already have an account?{' '}
                    <Link to="/LoginPage" className="text-blue-600 hover:underline">
                        Login
                    </Link>
                </p>
            </div>
        </div>
    );
}

export default RegisterPage;
