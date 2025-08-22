import React from 'react';

interface CityCardProps {
  city: string;
  temperature: number;
  onRemove: () => void;
}

const CityCard: React.FC<CityCardProps> = ({ city, temperature, onRemove }) => {
  return (
    <div className="bg-white shadow-md rounded-2xl p-4 flex justify-between items-center">
      <div>
        <h2 className="text-lg font-semibold">{city}</h2>
        <p className="text-gray-600">{temperature}°C</p>
      </div>
      <button onClick={onRemove} className="bg-red-500 text-white px-3 py-1 rounded-xl hover:bg-red-600">
        刪除
      </button>
    </div>
  );
};

export default CityCard;
