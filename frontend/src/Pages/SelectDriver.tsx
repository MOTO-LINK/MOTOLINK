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

  useEffect(() => {
    const fetchDrivers = async () => {
      try {
        const response = await axios.get('http://localhost:3001/drivers');
        const result = driverSchema.array().parse(response.data);
        setDrivers(result);
      } catch (error) {
        console.error('Error fetching drivers:', error);
      }
    };
    fetchDrivers();
  }, []);

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
      <ResponsiveAppBar />
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