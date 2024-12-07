import React, { useState, useEffect } from 'react';

const WeatherDashboard = () => {
  const [weatherData, setWeatherData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchWeatherData = async () => {
      try {
        setIsLoading(true);
        const response = await fetch('https://api.cors.lol/?url=https://public-esa.ose.gov.pl/api/v1/smog');
        

        //For Local
        //const response = await fetch('/api/v1/smog');
    
        
        if (!response.ok) {
            console.log(response);
          throw new Error('Network response was not ok');
        }
        
        const data = await response.json();
        console.log(data)
        const targetStation = data.smog_data.find(
          (node) => node.school.post_code === '59-600' 
        );
        setWeatherData(targetStation);
        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching weather data:', error);
        setError(error);
        setIsLoading(false);
      }
    };

    // Fetch data immediately
    fetchWeatherData();

    // Optional: Set up periodic refresh
    const intervalId = setInterval(fetchWeatherData, 5 * 60 * 1000);

    // Cleanup interval on component unmount
    return () => clearInterval(intervalId);
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-xl text-gray-600">Loading weather data...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-red-50">
        <div className="text-xl text-red-600">Error loading weather data</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="card w-full max-w-2xl rounded-xl p-8 space-y-6" 
           style={{
             background: 'linear-gradient(135deg, #ffffff 0%, #f0f4f8 100%)',
             boxShadow: '0 10px 25px rgba(0,0,0,0.1)'
           }}
      >
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-800">School Weather Station</h1>
          <p className="text-gray-500 mt-2">Detailed Atmospheric Conditions</p>
        </div>

        {/* Location Section */}
        <div className="bg-indigo-50 p-6 rounded-lg text-center">
          <h2 className="text-xl font-semibold text-indigo-800 mb-4">Location</h2>
          <div>
            <div className="text-2xl font-bold text-indigo-600">
              {weatherData.school.city}, {weatherData.school.street}
            </div>
            <div className="text-sm text-gray-600 mt-2">
              {weatherData.school.name}
            </div>
          </div>
        </div>

        {/* Weather Measurements Section */}
        <div className="bg-purple-50 p-6 rounded-lg">
          <h2 className="text-xl font-semibold text-purple-800 mb-4">Weather Measurements</h2>
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <div className="text-3xl font-bold text-purple-600">
                {weatherData.data.temperature_avg.toFixed(1)}°C
              </div>
              <div className="text-sm text-gray-600">Average Temperature</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-blue-600">
                {weatherData.data.humidity_avg.toFixed(0)}%
              </div>
              <div className="text-sm text-gray-600">Average Humidity</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-green-600">
                {weatherData.data.pressure_avg.toFixed(0)} hPa
              </div>
              <div className="text-sm text-gray-600">Average Pressure</div>
            </div>
          </div>
        </div>

        {/* Air Quality Section */}
        <div className="bg-red-50 p-6 rounded-lg">
          <h2 className="text-xl font-semibold text-red-800 mb-4">Air Quality Indicators</h2>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <div className="text-2xl font-bold text-red-600">
                {weatherData.data.pm10_avg.toFixed(2)}
              </div>
              <div className="text-sm text-gray-600">PM10 Average</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-red-600">
                {weatherData.data.pm25_avg.toFixed(2)}
              </div>
              <div className="text-sm text-gray-600">PM2.5 Average</div>
            </div>
          </div>
        </div>

        {/* Last Updated Section */}
        <div className="text-center text-gray-500 text-sm">
          Last Updated: {weatherData.timestamp}
        </div>
      </div>
    </div>
  );
};

export default WeatherDashboard;