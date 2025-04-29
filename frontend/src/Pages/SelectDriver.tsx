import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { z } from 'zod';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { IoIosArrowBack } from "react-icons/io";
import { Link, useNavigate } from 'react-router-dom';
import ResponsiveAppBar from '../components/Navbar';
const driverSchema = z.object({
  id: z.number(),
  name: z.string(),
  rating: z.number(),
  trips: z.number(),
  location: z.string(),
  image: z.string(),
});

type Driver = z.infer<typeof driverSchema>;

const SelectDriver: React.FC = () => {
  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [clickCount, setClickCount] = useState(0);
  const localDrivers: Driver[] = [
    {"id": 1, "name": "Ahmed Ali", "rating": 4.9, "trips": 320, "location": "Cairo", "image": "https://i.pravatar.cc/150?img=1"},
    {"id": 2, "name": "Mohamed Samy", "rating": 4.8, "trips": 300, "location": "Alexandria", "image": "https://i.pravatar.cc/150?img=2"},
    {"id": 3, "name": "Youssef Ahmed", "rating": 4.7, "trips": 280, "location": "Giza", "image": "https://i.pravatar.cc/150?img=3"},
    {"id": 4, "name": "Mahmoud Hassan", "rating": 4.6, "trips": 250, "location": "Luxor", "image": "https://i.pravatar.cc/150?img=4"},
    {"id": 5, "name": "Khaled Mohamed", "rating": 4.5, "trips": 240, "location": "Aswan", "image": "https://i.pravatar.cc/150?img=5"},
    {"id": 6, "name": "Omar Ibrahim", "rating": 4.4, "trips": 230, "location": "Port Said", "image": "https://i.pravatar.cc/150?img=6"},
    {"id": 7, "name": "Ali Mahmoud", "rating": 4.3, "trips": 220, "location": "Suez", "image": "https://i.pravatar.cc/150?img=7"},
    {"id": 8, "name": "Hassan Khaled", "rating": 4.2, "trips": 210, "location": "Ismailia", "image": "https://i.pravatar.cc/150?img=8"},
    {"id": 9, "name": "Amr Youssef", "rating": 4.1, "trips": 200, "location": "Mansoura", "image": "https://i.pravatar.cc/150?img=9"},
    {"id": 10, "name": "Tarek Ali", "rating": 4.0, "trips": 190, "location": "Tanta", "image": "https://i.pravatar.cc/150?img=10"},
    {"id": 11, "name": "Samy Mohamed", "rating": 3.9, "trips": 180, "location": "Zagazig", "image": "https://i.pravatar.cc/150?img=11"},
    {"id": 12, "name": "Karim Ahmed", "rating": 3.8, "trips": 170, "location": "Damietta", "image": "https://i.pravatar.cc/150?img=12"},
    {"id": 13, "name": "Fady Hassan", "rating": 3.7, "trips": 160, "location": "Minya", "image": "https://i.pravatar.cc/150?img=13"},
    {"id": 14, "name": "Waleed Mahmoud", "rating": 3.6, "trips": 150, "location": "Beni Suef", "image": "https://i.pravatar.cc/150?img=14"},
    {"id": 15, "name": "Hany Khaled", "rating": 3.5, "trips": 140, "location": "Qena", "image": "https://i.pravatar.cc/150?img=15"},
    {"id": 16, "name": "Ramy Youssef", "rating": 3.4, "trips": 130, "location": "Sohag", "image": "https://i.pravatar.cc/150?img=16"},
    {"id": 17, "name": "Sherif Ali", "rating": 3.3, "trips": 120, "location": "Assiut", "image": "https://i.pravatar.cc/150?img=17"},
    {"id": 18, "name": "Nader Mohamed", "rating": 3.2, "trips": 110, "location": "Faiyum", "image": "https://i.pravatar.cc/150?img=18"},
    {"id": 19, "name": "Bassem Ahmed", "rating": 3.1, "trips": 100, "location": "Hurghada", "image": "https://i.pravatar.cc/150?img=19"},
    {"id": 20, "name": "Adel Hassan", "rating": 3.0, "trips": 90, "location": "Sharm El Sheikh", "image": "https://i.pravatar.cc/150?img=20"},
    {"id": 21, "name": "Osama Mohamed", "rating": 4.9, "trips": 320, "location": "Cairo", "image": "https://i.pravatar.cc/150?img=21"},
    {"id": 22, "name": "Hossam Ali", "rating": 4.8, "trips": 310, "location": "Alexandria", "image": "https://i.pravatar.cc/150?img=22"},
    {"id": 23, "name": "Maged Youssef", "rating": 4.7, "trips": 290, "location": "Giza", "image": "https://i.pravatar.cc/150?img=23"},
    {"id": 24, "name": "Samir Hassan", "rating": 4.6, "trips": 260, "location": "Luxor", "image": "https://i.pravatar.cc/150?img=24"},
    {"id": 25, "name": "Fares Khaled", "rating": 4.5, "trips": 240, "location": "Aswan", "image": "https://i.pravatar.cc/150?img=25"},
    {"id": 26, "name": "Tamer Ibrahim", "rating": 4.4, "trips": 230, "location": "Port Said", "image": "https://i.pravatar.cc/150?img=26"},
    {"id": 27, "name": "Raafat Mahmoud", "rating": 4.3, "trips": 220, "location": "Suez", "image": "https://i.pravatar.cc/150?img=27"},
    {"id": 28, "name": "Gamal Khaled", "rating": 4.2, "trips": 210, "location": "Ismailia", "image": "https://i.pravatar.cc/150?img=28"},
    {"id": 29, "name": "Said Youssef", "rating": 4.1, "trips": 200, "location": "Mansoura", "image": "https://i.pravatar.cc/150?img=29"},
    {"id": 30, "name": "Kamal Ali", "rating": 4.0, "trips": 190, "location": "Tanta", "image": "https://i.pravatar.cc/150?img=30"},
    {"id": 31, "name": "Nabil Mohamed", "rating": 3.9, "trips": 180, "location": "Zagazig", "image": "https://i.pravatar.cc/150?img=31"},
    {"id": 32, "name": "Fouad Ahmed", "rating": 3.8, "trips": 170, "location": "Damietta", "image": "https://i.pravatar.cc/150?img=32"},
    {"id": 33, "name": "Magdy Hassan", "rating": 3.7, "trips": 160, "location": "Minya", "image": "https://i.pravatar.cc/150?img=33"},
    {"id": 34, "name": "Ashraf Mahmoud", "rating": 3.6, "trips": 150, "location": "Beni Suef", "image": "https://i.pravatar.cc/150?img=34"},
    {"id": 35, "name": "Salah Khaled", "rating": 3.5, "trips": 140, "location": "Qena", "image": "https://i.pravatar.cc/150?img=35"},
    {"id": 36, "name": "Moustafa Youssef", "rating": 3.4, "trips": 130, "location": "Sohag", "image": "https://i.pravatar.cc/150?img=36"},
    {"id": 37, "name": "Ehab Ali", "rating": 3.3, "trips": 120, "location": "Assiut", "image": "https://i.pravatar.cc/150?img=37"},
    {"id": 38, "name": "Hesham Mohamed", "rating": 3.2, "trips": 110, "location": "Faiyum", "image": "https://i.pravatar.cc/150?img=38"},
    {"id": 39, "name": "Ayman Ahmed", "rating": 3.1, "trips": 100, "location": "Hurghada", "image": "https://i.pravatar.cc/150?img=39"},
    {"id": 40, "name": "Ibrahim Hassan", "rating": 3.0, "trips": 90, "location": "Sharm El Sheikh", "image": "https://i.pravatar.cc/150?img=40"},
    {"id": 41, "name": "Zakaria Mohamed", "rating": 4.9, "trips": 320, "location": "Cairo", "image": "https://i.pravatar.cc/150?img=41"},
    {"id": 42, "name": "Ramy Ali", "rating": 4.8, "trips": 310, "location": "Alexandria", "image": "https://i.pravatar.cc/150?img=42"},
    {"id": 43, "name": "Kareem Youssef", "rating": 4.7, "trips": 290, "location": "Giza", "image": "https://i.pravatar.cc/150?img=43"},
    {"id": 44, "name": "Samir Hassan", "rating": 4.6, "trips": 260, "location": "Luxor", "image": "https://i.pravatar.cc/150?img=44"},
    {"id": 45, "name": "Fares Khaled", "rating": 4.5, "trips": 240, "location": "Aswan", "image": "https://i.pravatar.cc/150?img=45"},
    {"id": 46, "name": "Tamer Ibrahim", "rating": 4.4, "trips": 230, "location": "Port Said", "image": "https://i.pravatar.cc/150?img=46"},
    {"id": 47, "name": "Raafat Mahmoud", "rating": 4.3, "trips": 220, "location": "Suez", "image": "https://i.pravatar.cc/150?img=47"},
    {"id": 48, "name": "Gamal Khaled", "rating": 4.2, "trips": 210, "location": "Ismailia", "image": "https://i.pravatar.cc/150?img=48"},
    {"id": 49, "name": "Said Youssef", "rating": 4.1, "trips": 200, "location": "Mansoura", "image": "https://i.pravatar.cc/150?img=49"},
    {"id": 50, "name": "Kamal Ali", "rating": 4.0, "trips": 190, "location": "Tanta", "image": "https://i.pravatar.cc/150?img=50"}
  ]

  useEffect(() => {
    try {
      const result = driverSchema.array().parse(localDrivers);
      setDrivers(result);
    } catch (error) {
      console.error('Error parsing local drivers data:', error);
    }
  }, []);
  
  //Api
  // useEffect(() => {
  //   const fetchDrivers = async () => {
  //     try {
  //       const response = await axios.get('http://localhost:3001/drivers');
  //       const result = driverSchema.array().parse(response.data);
  //       setDrivers(result);
  //     } catch (error) {
  //       console.error('Error fetching drivers:', error);
  //     }
  //   };
  //   fetchDrivers();
  // }, []);

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  const filteredDrivers = drivers.filter(driver =>
    driver.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const selectNearestDriver = () => {
    const sortedDrivers = [...drivers].sort((a, b) => b.id - a.id);
    const nextDriver = sortedDrivers[clickCount % sortedDrivers.length];
    setDrivers(prevDrivers => [
      nextDriver,
      ...prevDrivers.filter(d => d.id !== nextDriver.id)
    ]);
    setClickCount(prevCount => prevCount + 1);
    toast.success(`Nearest driver: ${nextDriver.name}`, {
      position: "top-right",
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      theme: "colored",
      style: { background: '#4CAF50', color: '#fff' },
    });
  };

  const selectRandomDriver = () => {
    const randomDriver = drivers[Math.floor(Math.random() * drivers.length)];
    setDrivers(prevDrivers => [randomDriver, ...prevDrivers.filter(d => d.id !== randomDriver.id)]);
    toast.info(`Random driver: ${randomDriver.name}`, {
      position: "top-right",
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      theme: "colored",
      style: { background: '#2196F3', color: '#fff' },
    });
  };

  const handlePickDriver = (driverName: string) => {
    toast.success(`You picked ${driverName}`, {
      position: "top-right",
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      theme: "colored",
      style: { background: '#FF9800', color: '#fff' },
    });
  };

  const navigate = useNavigate();
  const goBack = () => {
    navigate("/HomeRider");
  };

  return (
    <div className="">
      <div className="p-4 min-h-screen text-white">
        <ToastContainer
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="colored"
        />
        <div className="max-w-[750px] mx-auto">
          <div className="grid grid-cols-3 items-center mt-5 mb-10">
            <div className="cursor-pointer">
              <IoIosArrowBack onClick={goBack} size={35} />
            </div>
            <div className="col-span-2 text-center md:text-left">
              <p className='text-2xl sm:text-3xl'>Select a driver</p>
            </div>
          </div>
          <div className="flex flex-col md:flex-row justify-between items-center mb-6 space-y-4 md:space-y-0">
            <input
              type="text"
              placeholder="Search drivers..."
              value={searchTerm}
              onChange={handleSearch}
              className="p-2 border border-gold-1 hover:border-gold-2 focus:border-gold-2 rounded w-full md:w-64 bg-bg text-white"
            />
            <div className="flex space-x-4">
              <button
                onClick={selectNearestDriver}
                className="bg-gold-1 text-text px-4 py-2 rounded-lg hover:bg-gold-2 transition duration-300 text-sm md:text-base"
              >
                Nearest
              </button>
              <button
                onClick={selectRandomDriver}
                className="bg-transparent text-white px-4 py-2 border border-gold-1 hover:border-gold-2 rounded-lg hover:bg-neutral-900 transition duration-300 text-sm md:text-base"
              >
                Random Pick
              </button>
            </div>
          </div>
          <div className="space-y-4">
            {filteredDrivers.map((driver) => (
              <div key={driver.id} className="bg-bg p-4 rounded-lg border border-gold-1 shadow-md flex flex-col md:flex-row justify-between items-center transition duration-300 hover:bg-bg1">
                <div className="flex items-center space-x-4 mb-4 md:mb-0">
                  <img src={driver.image} alt={driver.name} className="w-12 h-12 md:w-16 md:h-16 rounded-full" />
                  <div>
                    <h3 className="text-lg md:text-xl font-semibold">{driver.name}</h3>
                    <p className="text-gray-400 text-sm md:text-base">Rating: {driver.rating} ⭐</p>
                    <p className="text-gray-400 text-sm md:text-base">Trips: {driver.trips}</p>
                    <p className="text-gray-400 text-sm md:text-base">Location: {driver.location}</p>
                  </div>
                </div>
                <Link to={"/Booking"}>
                <button
                  onClick={() => handlePickDriver(driver.name)}
                  className="bg-gold-1 text-text px-4 py-2 text-sm md:text-lg rounded-lg hover:bg-gold-2 transition duration-300"
                >
                  Pick
                </button>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SelectDriver;