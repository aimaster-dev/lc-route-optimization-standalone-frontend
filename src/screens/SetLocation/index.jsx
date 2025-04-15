import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { uploadCsv } from '../../services/fileService';
import './style.css';
import { useNavigate } from 'react-router-dom';
import StopComponent from '../../components/StopComponent';
import axios from 'axios';
import RouteSegmentsTable from '../../components/Tables';
import Map from '../../components/Map';

const SetLocation = ({ setRoutesData }) => {
  const navigate = useNavigate();
  const [stopCount, setStopCount] = useState(0);
  const [stopCountData, setStopCountData] = useState([]);
  const [isSubmit, setIsSubmit] = useState(false);
  const [isToggled, setIsToggled] = useState(false);
  const [submittedData, setSubmittedData] = useState(null);
  const [haul, setHaul] = useState({
    latitude: 0,
    longitude: 0
  });
  const [landFill, setLandFill] = useState({
    latitude: 0,
    longitude: 0
  });
  const handleStopCountChange = (e) => {
    const count = e.target.value
    setStopCount(count);
    const newStopData = Array.from({ length: count }, (_, index) => ({
      id: index + 1,
      latitude: 0,
      longitude: 0,
      currentContainerSize: 0,
      serviceTime: 0,
      note: '',
      service_type: 0
    }));
    setIsSubmit(false)
    setStopCountData(newStopData);
  };
  const handleHaulChange = (e) => {
    const { name, value } = e.target;
    setHaul((prevHaul) => ({ ...prevHaul, [name]: value }));
  };

  const handleLandFillChange = (e) => {
    const { name, value } = e.target;
    setLandFill((prevLandFill) => ({ ...prevLandFill, [name]: value }));
  };

  const handleLocationChange = (e, id) => {
    const { name, value } = e.target;
    setIsSubmit(false)
    setStopCountData((prevData) =>
      prevData.map((stop) =>
        stop.id === id ? { ...stop, [name]: value } : stop
      )
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const isValid = stopCountData.every((stop) => stop.latitude && stop.longitude);
    if (!isValid) {
      toast.error('Please fill in all latitude and longitude fields for each stop.');
      return;
    }
    var submittedData = {}
    if (stopCount == 0) {
      submittedData = {
        Haul: {
          Latitude: parseFloat(haul.latitude),  // Ensure these are floats
          Longitude: parseFloat(haul.longitude)
        },
        LandFill: {
          Latitude: parseFloat(landFill.latitude),
          Longitude: parseFloat(landFill.longitude)
        },
        Stops: [
          {
            Latitude: 0,  // Ensure it's a float
            Longitude: 0,
            CURRENT_CONTAINER_SIZE: 0,  // Ensure it's an integer
            SERVICE_WINDOW_TIME: 0,
            // Map stop.service_type to "SWG" if it's 0, otherwise "DRT"
            SERVICE_TYPE_CD: "SWG",
            PERM_NOTES: ""  // Ensure this is a string
          }
        ]
      };
    } else {
      submittedData = {
        Haul: {
          Latitude: parseFloat(haul.latitude),  // Ensure these are floats
          Longitude: parseFloat(haul.longitude)
        },
        LandFill: {
          Latitude: parseFloat(landFill.latitude),
          Longitude: parseFloat(landFill.longitude)
        },
        Stops: stopCountData.map((stop) => ({
          Latitude: parseFloat(stop.latitude),  // Ensure it's a float
          Longitude: parseFloat(stop.longitude),
          CURRENT_CONTAINER_SIZE: parseInt(stop.currentContainerSize, 10),  // Ensure it's an integer
          SERVICE_WINDOW_TIME: 0.0,
          // Map stop.service_type to "SWG" if it's 0, otherwise "DRT"
          SERVICE_TYPE_CD: stop.service_type === 0 ? "SWG" : "DRT",
          PERM_NOTES: ""  // Ensure this is a string
        }))
      };
    }
    try {
      const response = await axios.post('http://localhost:8000/api/v2/route-map-old', submittedData, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
      setRoutesData(submittedData);
      setSubmittedData(submittedData);
      setIsSubmit(true);
      console.log('Submitting data:', submittedData);
      toast.success('Data submitted successfully!');
      console.log(response.data);
    } catch (error) {
      toast.success('Failed to submit Data');
    }
    // You can call an API here or update the state
    // Example: setRoutesData(submittedData);
    // console.log('Submitting data:', submittedData);

    // If everything is successful, show a success message and redirect
    // navigate('/home');
  };

  const handleToggleChange = () => {
    setIsToggled(!isToggled);
  };

  useEffect(() => {
    const fetchData = async () => {
      if (!submittedData) return;
      try {
        const apiUrl = isToggled
          ? 'http://localhost:8000/api/v1/route-map-new'
          : 'http://localhost:8000/api/v2/route-map-old';
        const response = await axios.post(apiUrl, submittedData, {
          headers: {
            'Content-Type': 'application/json',
          },
        });
        // setFetchedData(response.data);
        console.log('Fetched data:', response.data);
      } catch (error) {
        console.log(error);
        toast.error('Failed to fetch data');
      }
    };

    if (isSubmit) {
      fetchData();
    }
  }, [isToggled, isSubmit]);
  return (
    <div className="upload-container">
      <h1 className="welcome-heading">Welcome to Republic Services</h1>
      <h2 className="upload-title">Set Latitude and Longitude</h2>
      <div className="d-flex justify-content-start">
        <label htmlFor='haul_latitude' className="form-label col-2">
          Haul
        </label>
        <div className="form-item col-4">
          <input type="number" name="latitude" id="haul_latitude" step="0.001" className="form-style" placeholder='Latitude'
            value={haul.latitude}
            onChange={handleHaulChange} />
        </div>
        <div className="form-item col-4">
          <input type="number" name="longitude" id="haul_longitude" step="0.001" className="form-style" placeholder='Longitude'
            value={haul.longitude}
            onChange={handleHaulChange} />
        </div>
      </div>
      <div className="d-flex justify-content-start">
        <label htmlFor='haul_latitude' className="form-label col-2">
          LandFill
        </label>
        <div className="form-item col-4">
          <input type="number" name="latitude" id="landfill_latitude" step="0.001" className="form-style" placeholder='Latitude'
            value={landFill.latitude}
            onChange={handleLandFillChange} />
        </div>
        <div className="form-item col-4">
          <input type="number" name="longitude" id="landfill_longitude" step="0.001" className="form-style" placeholder='Longitude'
            value={landFill.longitude}
            onChange={handleLandFillChange} />
        </div>
      </div>
      <div className='d-flex'>
        <label htmlFor='haul_latitude' className="form-label col-2">
          Stop Count
        </label>
        <div className="form-item col-4">
          <input type="number" name="stopCount" id="stopCount" className="form-style" placeholder='StopCount' min={0} value={stopCount} onChange={handleStopCountChange} />
        </div>
      </div>
      <hr />
      {stopCountData.map((item, key) => (
        <StopComponent key={key} data={item} setStopData={handleLocationChange} />
      ))}
      {isSubmit && (
        <div className="toggle-container">
          <label className="toggle-label" htmlFor="toggleSwitch">
            Enable Conversion
          </label>
          <label className="switch">
            <input
              type="checkbox"
              id="toggleSwitch"
              checked={isToggled}
              onChange={handleToggleChange}
            />
            <span className="slider"></span>
          </label>
        </div>
      )}
      <input
        type="submit"
        className="submit pull-right"
        value="Submit"
        onClick={handleSubmit}
      />

      {isSubmit && (
        <div className="map-section">
          <div className="map-container">
            <Map
              key={isToggled ? 'map-new' : 'map-old'}
              route_id={"location"}
              showOptimizeRoute={true}
              showComparison={true}
            />
          </div>

          <div className="compare-routes-section">
            <RouteSegmentsTable key={isToggled ? 'map-new' : 'map-old'} route_id={"location"} />
          </div>
        </div>
      )}
    </div>
  );
};

export default SetLocation;
