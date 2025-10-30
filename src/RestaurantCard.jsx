import React from 'react';
import { StarIcon } from '@heroicons/react/24/solid';
import { useNavigate } from 'react-router';

const RestaurantCard = ({ restaurant }) => {
    const navigate = useNavigate();
    return (
        <div
            className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300 ease-in-out cursor-pointer border border-gray-100"
            onClick={() => navigate(`/restaurant/${restaurant._id}/info`)}
        >
            {/* Image Section */}
            <div className="relative h-48">
                <img
                    className="w-full h-full object-cover"
                    src={restaurant.imageUrl}
                    alt={restaurant.name}
                    onError={(e) => { e.target.onerror = null; e.target.src = "https://placehold.co/300x200/eee/ccc?text=Image+Error"; }}
                />
            </div>

            {/* Details Section */}
            <div className="p-4">
                {/* Name and Rating */}
                <div className="flex justify-between items-center mb-1">
                    <h3 className="text-lg font-semibold text-gray-800 truncate" title={restaurant.name}>
                        {restaurant.name}
                    </h3>
                    {/* Rating Badge */}
                    {restaurant.rating && (
                        <div className={`flex items-center rounded px-1.5 py-0.5 text-xs font-bold text-white ${getRatingColor(restaurant.rating)}`}>
                            {restaurant.rating}
                            {restaurant.rating !== 'NEW' && <StarIcon className="w-4 h-4 ml-1 text-white" />}
                        </div>
                    )}
                </div>

                {/* Cuisine and Price */}
                <div className="flex justify-between items-start text-sm text-gray-600 mb-2">
                    <p className="truncate w-3/5" title={restaurant.cuisine}>{restaurant.cuisine}</p>
                    <p className="text-right w-2/5">₹{restaurant.priceForTwo} for two</p>
                </div>

                {/* Location and Distance */}
                <div className="flex justify-between items-center text-xs text-gray-500">
                    <p className="truncate">{restaurant.address}</p>
                </div>
            </div>
        </div>
    );
};

function getRatingColor(rating) {
    if (rating >= 4) {
        return 'bg-green-600';
    } else if (rating >= 2) {
        return 'bg-yellow-500';
        return 'bg-red-500';
    }
}

export default RestaurantCard;