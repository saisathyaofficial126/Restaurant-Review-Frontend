import { useState } from "react";
import { useNavigate } from "react-router";
import { useContext } from "react";
import { UserContext } from "./context/UserContext";
import { SearchContext } from "./context/SearchContext";
import bgImage from './assets/bg_image.jpg';
import { MapPinIcon, MagnifyingGlassIcon, ChevronDownIcon } from '@heroicons/react/24/outline';

const LandingPage = () => {
    const navigate = useNavigate();
    const { user, logout } = useContext(UserContext);
    const { location, setLocation, searchTerm, setSearchTerm } = useContext(SearchContext);
    const [dropdownOpen, setDropdownOpen] = useState(false);

    const handleSearch = (e) => {
        e.preventDefault();
        navigate('/search');
    };

    const toggleDropdown = () => {
        setDropdownOpen((prev) => !prev);
    };

    const handleOptionClick = (path) => {
        setDropdownOpen(false);
        navigate(path);
    };

    return (
        <div className="relative w-full h-screen bg-gray-100">
            <div
                className="absolute inset-0 bg-cover bg-center opacity-90"
                style={{
                    backgroundImage: `url(${bgImage})`,
                }}
            ></div>

            {/* Dark overlay for text contrast */}
            <div className="absolute inset-0 bg-black/40"></div>

            {/* Navigation Bar */}
            <nav className="relative z-10 flex items-center justify-end px-8 py-9">
                <div className="flex space-x-10 text-2xl">
                    {user ? (
                        <div className="relative">
                            <button
                                className="text-white cursor-pointer flex items-center space-x-1"
                                onClick={toggleDropdown}
                            >
                                <span>{user.name}</span>
                                <ChevronDownIcon className="w-4 h-4" />
                            </button>
                            {dropdownOpen && (
                                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200">
                                    <button
                                        className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100"
                                        onClick={() => handleOptionClick('/profile')}
                                    >
                                        Profile
                                    </button>
                                    <button
                                        className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100"
                                        onClick={() => handleOptionClick('/reviews')}
                                    >
                                        Reviews
                                    </button>
                                    <button
                                        className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100"
                                        onClick={() => handleOptionClick('/bookings')}
                                    >
                                        Bookings
                                    </button>
                                    <button
                                        className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100"
                                        onClick={logout}
                                    >
                                        Logout
                                    </button>
                                </div>
                            )}
                        </div>
                    ) : (
                        <>
                            <button className="text-white cursor-pointer" onClick={() => navigate('/add-restaurant')}>
                                Add restaurant
                            </button>
                            <button className="text-white cursor-pointer" onClick={() => navigate('/LoginPage')}>
                                Log in
                            </button>
                            <button className="text-white cursor-pointer" onClick={() => navigate('/register')}>
                                Sign up
                            </button>
                        </>
                    )}
                </div>
            </nav>

            {/* Hero Content */}
            <div className="relative z-10 flex flex-col gap-5 items-center h-full max-w-4xl mx-auto px-4">
                <div className="text-white text-9xl font-bold">Quisine</div>
                <h1 className="text-white text-3xl sm:text-5xl font-medium text-center mb-6">
                    Find the best restaurants in TamilNadu
                </h1>

                {/* Search Section */}
                <form
                    className="w-full max-w-3xl bg-white rounded-full flex items-center px-4 py-2 shadow-md"
                    onSubmit={handleSearch}
                >
                    <div className="flex items-center bg-white rounded-full px-2 py-1">
                        <MapPinIcon className="w-4 h-4 text-gray-700" />
                        <select
                            value={location}
                            onChange={(e) => setLocation(e.target.value)}
                            className="outline-none text-gray-700 flex-grow sm:flex-grow-0 w-28 sm:w-40 px-2 bg-transparent"
                        >
                            <option value="All">All</option>
                            <option value="Chennai">Chennai</option>
                            <option value="Coimbatore">Coimbatore</option>
                        </select>
                    </div>
                    <span className="text-gray-400 mx-2">|</span>
                    <MagnifyingGlassIcon className="w-4 h-4 mr-2" />
                    <input
                        type="text"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        placeholder="Search for restaurant or a cuisine"
                        className="outline-none flex-grow text-gray-700 px-2"
                    />
                    <button className="bg-red-500 hover:bg-red-600 cursor-pointer text-white rounded-full px-6 py-2 ml-2">
                        Search
                    </button>
                </form>
            </div>
        </div>
    );
};

export default LandingPage;
