import { useState, useRef, useEffect } from 'react';
import { useOutletContext } from 'react-router';
import { CalendarIcon, ChevronDownIcon, UserGroupIcon, ClockIcon } from '@heroicons/react/24/solid';
import { useNavigate } from 'react-router';

function getNextDates() {
  const today = new Date();
  const options = { month: 'short', day: 'numeric' };
  const days = [
    { label: 'Today', value: today.toISOString().split('T')[0] },
    { label: 'Tomorrow', value: new Date(today.getTime() + 86400000).toISOString().split('T')[0] },
    { label: new Date(today.getTime() + 2 * 86400000).toLocaleDateString(undefined, options), value: new Date(today.getTime() + 2 * 86400000).toISOString().split('T')[0] }
  ];
  return days;
}

// Helper to format hour to "hh:00 AM/PM"
function formatHour(hour) {
  const h = hour % 24;
  const ampm = h < 12 ? 'AM' : 'PM';
  const displayHour = h % 12 === 0 ? 12 : h % 12;
  return `${displayHour.toString().padStart(2, '0')}:00 ${ampm}`;
}

export default function BookTableSection() {
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [selectedDate, setSelectedDate] = useState(getNextDates()[0].value);
  const [showDateDropdown, setShowDateDropdown] = useState(false);

  const [guests, setGuests] = useState(2);
  const [showGuestDropdown, setShowGuestDropdown] = useState(false);

  const [meal, setMeal] = useState('Breakfast');
  const [showMealDropdown, setShowMealDropdown] = useState(false);
  const mealOptions = ['Breakfast', 'Lunch', 'Dinner'];
  const mealDropdownRef = useRef(null);

  const { restaurantData } = useOutletContext();
  const timeSlots = restaurantData.timeSlots || [];

  const dateOptions = getNextDates();
  const guestOptions = Array.from({ length: 9 }, (_, i) => i + 2);

  const navigate = useNavigate();

  // Get current date and hour
  const now = new Date();
  const currentDateStr = now.toISOString().split('T')[0];
  const currentHour = now.getHours();

  // Remove past slots if selected date is today
  const availableSlots = selectedDate === currentDateStr
    ? timeSlots.filter(hour => hour > currentHour)
    : timeSlots;

  // Filter slots by meal
  const filteredSlots =
    meal === 'Breakfast'
      ? availableSlots.filter(hour => hour < 12)
      : meal === 'Lunch'
      ? availableSlots.filter(hour => hour >= 12 && hour < 18)
      : availableSlots.filter(hour => hour >= 18);

  // Close meal dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event) {
      if (mealDropdownRef.current && !mealDropdownRef.current.contains(event.target)) {
        setShowMealDropdown(false);
      }
    }
    if (showMealDropdown) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showMealDropdown]);

  return (
    <div>
      <h2 className="text-xl font-semibold text-gray-800 mb-4">Select your booking details</h2>

      {/* Booking Filters */}
      <div className="flex space-x-4 mb-6">
        {/* Date Selector */}
        <div className="relative w-1/3">
          <button
            className="flex items-center justify-between w-full px-3 py-2 border border-gray-300 rounded text-gray-700 bg-white"
            onClick={() => setShowDateDropdown((v) => !v)}
            type="button"
          >
            <span className="flex items-center">
              <CalendarIcon className="h-5 w-5 mr-2 text-gray-500" />
              {dateOptions.find(d => d.value === selectedDate)?.label}
            </span>
            <ChevronDownIcon className="h-5 w-5 text-gray-400" />
          </button>
          {showDateDropdown && (
            <div className="absolute z-10 mt-1 w-full bg-white border border-gray-200 rounded shadow">
              {dateOptions.map(opt => (
                <div
                  key={opt.value}
                  className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                  onClick={() => { setSelectedDate(opt.value); setShowDateDropdown(false); }}
                >
                  {opt.label}
                </div>
              ))}
            </div>
          )}
        </div>
        {/* Guest Selector */}
        <div className="relative w-1/3">
          <button
            className="flex items-center justify-between w-full px-3 py-2 border border-gray-300 rounded text-gray-700 bg-white"
            onClick={() => setShowGuestDropdown((v) => !v)}
            type="button"
          >
            <span className="flex items-center">
              <UserGroupIcon className="h-5 w-5 mr-2 text-gray-500" />
              {guests} guests
            </span>
            <ChevronDownIcon className="h-5 w-5 text-gray-400" />
          </button>
          {showGuestDropdown && (
            <div className="absolute z-10 mt-1 w-full bg-white border border-gray-200 rounded shadow max-h-48 overflow-y-auto">
              {guestOptions.map(opt => (
                <div
                  key={opt}
                  className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                  onClick={() => { setGuests(opt); setShowGuestDropdown(false); }}
                >
                  {opt} guests
                </div>
              ))}
            </div>
          )}
        </div>
        {/* Meal Time Selector */}
        <div className="relative w-1/3" ref={mealDropdownRef}>
          <button
            className="flex items-center justify-between w-full px-3 py-2 border border-gray-300 rounded text-gray-700 bg-white"
            onClick={() => setShowMealDropdown((v) => !v)}
            type="button"
          >
            <span className="flex items-center">
              <ClockIcon className="h-5 w-5 mr-2 text-gray-500" />
              {meal}
            </span>
            <ChevronDownIcon className="h-5 w-5 text-gray-400" />
          </button>
          {showMealDropdown && (
            <div className="absolute z-10 mt-1 w-full bg-white border border-gray-200 rounded shadow">
              {mealOptions.map(opt => (
                <div
                  key={opt}
                  className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                  onClick={() => { setMeal(opt); setShowMealDropdown(false); }}
                >
                  {opt}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Time Slot Selection */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-700 mb-3">Select slot</h3>
        <div className="grid grid-cols-5 gap-3">
          {filteredSlots.length === 0 ? (
            <div className="col-span-5 text-gray-500">No slots available.</div>
          ) : (
            filteredSlots.map((hour) => (
              <button
                key={hour}
                onClick={() => setSelectedSlot(hour)}
                className={`border rounded p-2 text-center ${selectedSlot === hour
                  ? 'bg-red-500 text-white border-red-500'
                  : 'border-gray-300 hover:border-red-400'
                  }`}
              >
                <span className="block font-medium text-sm">{formatHour(hour)}</span>
              </button>
            ))
          )}
        </div>
      </div>

      {/* Proceed Button */}
      <button
        className={`w-full py-3 px-4 rounded text-white font-semibold ${selectedSlot ? 'bg-red-500 hover:bg-red-600' : 'bg-gray-300 cursor-not-allowed'
          }`}
        disabled={!selectedSlot}
        onClick={() => {
          if (selectedSlot) {
            navigate('confirmation', {
              state: {
                selectedDate,
                selectedSlot,
                guests,
                restaurantData,
              },
            });
          }
        }}
      >
        {selectedSlot ? 'Proceed to Booking' : <span className="text-gray-500">Proceed to Booking</span>}
      </button>
    </div>
  );
}