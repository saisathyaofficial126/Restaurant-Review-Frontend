import React, { useState, useEffect } from 'react';
import { Link, Outlet, useLocation, useNavigate, useParams } from 'react-router';
import { StarIcon, MapIcon, ShareIcon, ChatBubbleLeftRightIcon, CalendarIcon, ClockIcon, CurrencyRupeeIcon, PhoneIcon } from '@heroicons/react/24/solid';
import axios from 'axios';

function formatTo12Hour(timeStr) {
    if (!timeStr) return "";
    let [h, m] = timeStr.split(":").map(Number);
    const ampm = h >= 12 ? "PM" : "AM";
    h = h % 12;
    if (h === 0) h = 12;
    return `${h}:${m.toString().padStart(2, "0")}${ampm}`;
}

function RestaurantDetail() {
    const { id } = useParams();
    const location = useLocation();
    const navigate = useNavigate();
    const [restaurantData, setRestaurantData] = useState(null);
    const [copied, setCopied] = useState(false);

    useEffect(() => {
        async function fetchRestaurant() {
            const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/restaurants/${id}`);
            setRestaurantData(res.data);
        }
        fetchRestaurant();
    }, [id]);

    const images = [
        restaurantData?.mainImage
            ? `${import.meta.env.VITE_BACKEND_URL}/uploads/${restaurantData.mainImage}`
            : null,
        ...(restaurantData?.otherImages
            ? restaurantData.otherImages.map(img => `${import.meta.env.VITE_BACKEND_URL}/uploads/${img}`)
            : [])
    ].filter(Boolean);

    const tabs = [
        { name: 'Overview', path: 'info' },
        { name: 'Reviews', path: 'reviews' },
        { name: 'Photos', path: 'photos' },
        { name: 'Menu', path: 'menu' },
        { name: 'Book a Table', path: 'book' }
    ];

    useEffect(() => {
        if (location.pathname === '/restaurant') {
            navigate('info', { replace: true });
        }
    }, [location.pathname, navigate]);

    const currentTab = tabs.find(tab => location.pathname.endsWith(tab.path))?.name || 'Overview';

    const handleShare = () => {
        const url = window.location.href;
        navigator.clipboard.writeText(url).then(() => {
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        });
    };

    function parseTimeToMinutes(timeStr) {
        if (!timeStr) return null;
        const [h, m] = timeStr.split(":").map(Number);
        return h * 60 + m;
    }

    function isOpenNow(opening, closing) {
        const now = new Date();
        const nowMinutes = now.getHours() * 60 + now.getMinutes();
        const openMinutes = parseTimeToMinutes(opening);
        const closeMinutes = parseTimeToMinutes(closing);
        if (openMinutes == null || closeMinutes == null) return false;
        if (closeMinutes <= openMinutes) {
            return nowMinutes >= openMinutes || nowMinutes < closeMinutes;
        }
        return nowMinutes >= openMinutes && nowMinutes < closeMinutes;
    }

    if (!restaurantData) {
        return <div>Loading...</div>;
    }

    const openStatus = isOpenNow(restaurantData.openingTime, restaurantData.closingTime)
        ? <span className="text-green-600 font-semibold">Open now</span>
        : <span className="text-red-600 font-semibold">Closed now</span>;

    return (
        <div className="max-w-6xl mx-auto p-4 font-sans">
            {/* Header Info */}
            <div className="mb-1 sticky top-0 z-2 bg-gray-50 pt-4 pb-0.5">
                <div className="flex justify-between items-start mb-2">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-800">{restaurantData.name}</h1>
                        <p className="text-sm text-gray-600">{restaurantData.cuisines.join(', ')}</p>
                        <p className="text-sm text-gray-500">{restaurantData.address}</p>
                    </div>
                    <div className="flex items-center bg-green-600 text-white px-2 py-1 rounded text-sm font-semibold">
                        <span>{restaurantData.rating.toFixed(1)}</span>
                        <StarIcon className="h-4 w-4 ml-1" />
                        <div className='ml-2 pl-2 border-l border-green-400 text-xs'>
                            {restaurantData.ratingCount} <span className='block font-light'>Ratings</span>
                        </div>
                    </div>
                </div>
                <div className="flex items-center space-x-4 text-xs text-gray-500 border-t border-b border-gray-200 py-2 mb-4">
                    {openStatus}
                    <span>|</span>
                    <span className="flex items-center">
                        <ClockIcon className="h-3 w-3 mr-1" />
                        {isOpenNow(restaurantData.openingTime, restaurantData.closingTime)
                            ? `Closes ${formatTo12Hour(restaurantData.closingTime)}`
                            : `Opens ${formatTo12Hour(restaurantData.openingTime)}`}
                    </span>
                    <span>|</span>
                    <span className="flex items-center"><CurrencyRupeeIcon className="h-3 w-3 mr-0.5" />{restaurantData.priceForTwo} for two</span>
                    <span>|</span>
                    <span className="flex items-center"><PhoneIcon className="h-3 w-3 mr-1" /> {restaurantData.phone}</span>
                </div>
                {/* Action Buttons */}
                <div className="flex space-x-4 mb-4">
                    <a
                        href={restaurantData.direction}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center space-x-1 px-4 py-2 border border-gray-300 rounded text-gray-700 hover:bg-gray-100 text-sm"
                    >
                        <MapIcon className="h-4 w-4 text-red-500" />
                        <span>Direction</span>
                    </a>
                    <button
                        className="flex items-center space-x-1 px-4 py-2 border border-gray-300 rounded text-gray-700 hover:bg-gray-100 text-sm"
                        onClick={handleShare}
                    >
                        <ShareIcon className="h-4 w-4 text-blue-500" />
                        <span>Share</span>
                    </button>
                    <button
                        className="flex items-center space-x-1 px-4 py-2 border border-gray-300 rounded text-gray-700 hover:bg-gray-100 text-sm"
                        onClick={() => navigate('reviews')}
                    >
                        <ChatBubbleLeftRightIcon className="h-4 w-4 text-yellow-500" />
                        <span>Reviews</span>
                    </button>
                    <button
                        className="flex items-center space-x-1 px-4 py-2 border border-gray-300 rounded text-gray-700 hover:bg-gray-100 text-sm"
                        onClick={() => navigate('book')}
                    >
                        <CalendarIcon className="h-4 w-4 text-green-500" />
                        <span>Book a table</span>
                    </button>
                </div>
            </div>

            {/* Show copied message */}
            {copied && (
                <div className="fixed top-25 left-1/2 transform -translate-x-1/2 bg-green-600 text-white px-4 py-2 rounded shadow z-50 transition">
                    Restaurant URL Copied to Clipboard
                </div>
            )}

            {/* Image Gallery */}
            <div className="grid grid-cols-4 grid-rows-2 gap-1 mb-6" style={{ height: '400px' }}>
                {images.length > 0 && (
                    <div className="col-span-2 row-span-2 relative">
                        <img
                            src={images[0]}
                            alt="Restaurant main view"
                            className="w-full h-full object-cover rounded-l"
                        />
                    </div>
                )}
                {images.slice(1, 5).map((img, i) => (
                    <div className="relative" key={i + 1}>
                        <img
                            src={img}
                            alt={`Restaurant view ${i + 2}`}
                            className={`w-full h-full object-cover${i === 1 ? " rounded-tr" : ""}${i === 3 ? " rounded-br" : ""}`}
                        />
                        {images.length > 5 && i === 3 && (
                            <div className="absolute inset-0 bg-black/50 flex items-center justify-center rounded-br">
                                <button className="text-white text-sm font-semibold">View Gallery</button>
                            </div>
                        )}
                    </div>
                ))}
            </div>

            {/* Navigation Tabs */}
            <div className="border-b border-gray-200 mb-6">
                <nav className="flex space-x-8">
                    {tabs.map(tab => (
                        <Link
                            key={tab.path}
                            to={tab.path}
                            className={`py-3 px-1 text-lg font-semibold ${currentTab === tab.name
                                    ? 'border-b-2 border-red-500 text-red-500'
                                    : 'text-gray-500 hover:text-gray-700'
                                }`}
                        >
                            {tab.name}
                        </Link>
                    ))}
                </nav>
            </div>

            {/* Tab Content */}
            <Outlet context={{ restaurantData }} />
        </div>
    );
}

export default RestaurantDetail;