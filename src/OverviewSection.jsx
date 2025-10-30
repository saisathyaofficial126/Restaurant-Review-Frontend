import { CheckCircleIcon } from '@heroicons/react/24/solid';
import { useOutletContext, Link } from 'react-router';

export default function OverviewSection() {
  const { restaurantData } = useOutletContext();

  return (
    <div className="space-y-6">
      {/* Menu Card */}
      <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">Menu</h3>
          {restaurantData.menuImages && restaurantData.menuImages.length > 0 && (
            <Link
              to="../menu"
              className="text-sm text-red-500 hover:underline"
            >
              See all menus &rarr;
            </Link>
          )}
        </div>
        <p className="text-gray-600 text-sm mb-2 font-medium">Cuisines</p>
        <div className="flex flex-wrap gap-2 mb-4">
          {restaurantData.cuisines?.map((c) => (
            <span
              key={c}
              className="inline-block text-xs font-medium text-yellow-700 bg-yellow-100 border border-yellow-200 rounded-full px-2 py-0.5"
            >
              {c}
            </span>
          ))}
        </div>
        <div className="flex items-start">
          <img
            src={
              restaurantData.menuImages && restaurantData.menuImages.length > 0
                ? `${import.meta.env.VITE_BACKEND_URL}/uploads/${restaurantData.menuImages[0]}`
                : "https://placehold.co/128x128?text=No+Menu"
            }
            alt="menu preview"
            className="w-32 h-32 object-cover rounded-lg mr-4"
          />
          <div>
            <p className="text-gray-800 font-medium">Menu</p>
            <p className="text-gray-500 text-sm">
              {restaurantData.menuImages?.length || 0} pages
            </p>
          </div>
        </div>
      </div>

      {/* Known For & Cost */}
      <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
        <h3 className="text-lg font-semibold mb-2">
          People Say This Place Is Known For
        </h3>
        <p className="text-gray-600 text-sm mb-4">
          {restaurantData.info?.join(', ') || "—"}
        </p>
        <h4 className="font-semibold mb-1">Average Cost</h4>
        <p className="text-gray-600 text-sm mb-1">
          ₹{restaurantData.priceForTwo} for two people (approx.)
        </p>
        <p className="text-gray-500 text-xs mb-2">
          Exclusive of applicable taxes and charges, if any
        </p>
        <p className="text-gray-600 text-sm">Cash and Cards accepted</p>
        <p className="text-gray-600 text-sm">Digital payments accepted</p>
      </div>

      {/* More Info */}
      <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
        <h3 className="text-lg font-semibold mb-4">More Info</h3>
        <ul className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {restaurantData.info?.map((info) => (
            <li
              key={info}
              className="flex items-center text-gray-700 text-sm"
            >
              <CheckCircleIcon className="w-5 h-5 text-green-500 mr-2" />
              {info}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
