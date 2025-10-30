import { useOutletContext } from 'react-router';

const getPhotoUrls = (restaurantData) => {
  const urls = [];
  if (restaurantData.mainImage)
    urls.push(`${import.meta.env.VITE_BACKEND_URL}/uploads/${restaurantData.mainImage}`);
  if (restaurantData.otherImages && restaurantData.otherImages.length > 0)
    urls.push(...restaurantData.otherImages.map(img => `${import.meta.env.VITE_BACKEND_URL}/uploads/${img}`));
  return urls;
};

const PhotosSection = () => {
  const { restaurantData } = useOutletContext();
  const photos = getPhotoUrls(restaurantData);

  return (
    <div className="p-4">
      <h2 className="text-2xl font-semibold text-gray-800 mb-4">{restaurantData.name} Photos</h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2">
        {photos.length === 0 ? (
          <div className="text-gray-500">No photos available.</div>
        ) : (
          photos.map((photo, idx) => (
            <div key={idx} className="relative aspect-square">
              <img
                src={photo}
                alt={`Restaurant ${idx + 1}`}
                className="w-full h-full object-cover rounded-md"
              />
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default PhotosSection;