import React from "react";
import moto from "../assets/images/moto.png"; // تأكد من وجود الصورة في المسار الصحيح

const BikeOnRoad: React.FC = () => {
  return (
    <div className="flex items-center justify-center h-96 w-[700px] m-auto overflow-hidden">


      {/* الطريق */}
      <div className="relative w-full h-48 bg-gray-900 overflow-hidden rounded-xl">
        {/* إضاءة جانبية على الطريق */}
        <div className="absolute inset-y-0 left-0 w-1/3 bg-gradient-to-r from-yellow-500/10 to-transparent"></div>
        <div className="absolute inset-y-0 right-0 w-1/3 bg-gradient-to-l from-yellow-500/10 to-transparent"></div>

        {/* الخطوط البيضاء على الطريق */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-full h-2 bg-yellow-300 absolute top-1/2 transform -translate-y-1/2"></div>
          <div className="w-full h-2 bg-yellow-300 absolute top-1/2 transform -translate-y-1/2 animate-road-lines"></div>
        </div>
      </div>

      {/* الموتسيكل */}
      <div className="absolute top-20 left-0 transform -translate-x-full animate-move-bike">
        <img
          src={moto}
          alt="moto"
          className="w-64 h-64 object-contain filter drop-shadow-lg"
        />
      </div>
    </div>
  );
};

export default BikeOnRoad;