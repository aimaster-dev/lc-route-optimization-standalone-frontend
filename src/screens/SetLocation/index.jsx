import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import axios from 'axios';
import PropTypes from 'prop-types';
import Map from '../../components/Map';
import RouteSegmentsTable from '../../components/Tables';
import LandFill from '../../components/LandFill';
import StopComponent from '../../components/StopComponent';
import './style.css';

const SetLocation = ({ setRoutesData }) => {
  const [stopCount, setStopCount] = useState(0);
  const [stopCountData, setStopCountData] = useState([]);
  const [landFillCount, setLandFillCount] = useState(0);
  const [landFillData, setLandFillData] = useState([]);
  const [canSubmit, setCanSubmit] = useState(false);
  const [isSubmit, setIsSubmit] = useState(false);
  const [isToggled, setIsToggled] = useState(false);
  const [submittedData, setSubmittedData] = useState(null);
  const [haul, setHaul] = useState({
    latitude: 0,
    longitude: 0
  });

  const handleLandFillCountChange = (e) => {
    const count = e.target.value
    setLandFillCount(count);
    const newLandFillData = Array.from({ length: count }, (_, index) => ({
      id: index + 1,
      Latitude: 0,
      Longitude: 0
    }));
    setLandFillData(newLandFillData);
  }

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
      service_type: 0,
      landfill_type: 1
    }));
    setStopCountData(newStopData);
    setIsSubmit(false)
  };

  const handleHaulChange = (e) => {
    const { name, value } = e.target;
    setHaul((prevHaul) => ({ ...prevHaul, [name]: value }));
  };

  const handleLandFillChange = (e, id) => {
    const { name, value } = e.target;
    setLandFillData((prevData) =>
      prevData.map((lf) =>
        lf.id === id ? { ...lf, [name]: value } : lf
      )
    );
  };

  const handleLocationChange = (e, id) => {
    const { name, value } = e.target;
    setStopCountData((prevData) =>
      prevData.map((stop) =>
        stop.id === id ? { ...stop, [name]: value } : stop
      )
    );

    setIsSubmit(false)
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
        // LandFill: {
        //   Latitude: parseFloat(landFill.latitude),
        //   Longitude: parseFloat(landFill.longitude)
        // },
        Stops: [
          {
            Latitude: 0,  // Ensure it's a float
            Longitude: 0,
            CURRENT_CONTAINER_SIZE: 0,  // Ensure it's an integer
            SERVICE_WINDOW_TIME: 0,
            // Map stop.service_type to "SWG" if it's 0, otherwise "DRT"
            SERVICE_TYPE_CD: "SWG",
            PERM_NOTES: "",  // Ensure this is a string
          }
        ]
      };
    } else {
      submittedData = {
        Haul: {
          Latitude: parseFloat(haul.latitude),  // Ensure these are floats
          Longitude: parseFloat(haul.longitude)
        },
        // LandFill: {
        //   Latitude: parseFloat(landFill.latitude),
        //   Longitude: parseFloat(landFill.longitude)
        // },
        LandFills: landFillData,
        Stops: stopCountData.map((stop) => ({
          Latitude: parseFloat(stop.latitude),  // Ensure it's a float
          Longitude: parseFloat(stop.longitude),
          CURRENT_CONTAINER_SIZE: parseInt(stop.currentContainerSize, 10),  // Ensure it's an integer
          SERVICE_WINDOW_TIME: 0.0,
          // Map stop.service_type to "SWG" if it's 0, otherwise "DRT"
          SERVICE_TYPE_CD: stop.service_type === 0 ? "SWG" : "DRT",
          PERM_NOTES: "",  // Ensure this is a string
          Landfill_Index: stop.landfill_type
        }))
      };
    }
    
    console.log('--- Stop Count Data ---');
    console.log(stopCountData);

    console.log('--- Submitted Data ---');
    console.log(submittedData);

    try {
      const apiUrl = isToggled ?
      'http://localhost:8000/api/v2/route-map-old'
      : 'http://localhost:8000/api/v1/route-map-new'

      const response = await axios.post(apiUrl, submittedData, {
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
    } catch (err) {
      console.log(err);
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
        const apiUrl = isToggled ?
        'http://localhost:8000/api/v2/route-map-old'
        : 'http://localhost:8000/api/v1/route-map-new'
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
  }, [isToggled, isSubmit, submittedData]);

  useEffect(() => {
    console.log('--- landFillCount ---')
    console.log(landFillCount)
    console.log('--- landFillData Length ---')
    console.log(landFillData.length)

    if(landFillCount == 0 || landFillData.length < 1) {
      setCanSubmit(false);
    } else setCanSubmit(true);
  }, [landFillCount, landFillData]);

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
      
      <div className='d-flex'>
        <label htmlFor='landfill' className="form-label col-2">
          LandFill
        </label>
        <div className="form-item col-4">
          <input type="number" name="landFillCount" id="landFillCount" className="form-style" placeholder='LandFillCount' min={0} value={landFillCount} onChange={handleLandFillCountChange} />
        </div>
      </div>
      <hr />
      {
        landFillData.map((item, key) => (
          <LandFill key={key} data={item} setLandFillData={handleLandFillChange} />
        ))
      }
      
      {
        canSubmit &&
        <>
          <hr />
            <div className='d-flex'>
              <label htmlFor='haul_latitude' className="form-label col-2">
                Stop Count
              </label>
              <div className="form-item col-4">
                <input type="number" name="stopCount" id="stopCount" className="form-style" placeholder='StopCount' min={0} value={stopCount} onChange={handleStopCountChange} />
              </div>
            </div>
          <hr />
        </>
      }
      
      {
        stopCountData.map((item, key) => (
          <StopComponent key={key} data={item} setStopData={handleLocationChange} landFillData={landFillData} />
        ))
      }

      {
        isSubmit && (
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
        )
      }

      <input
        type="submit"
        className="submit pull-right"
        value="Submit"
        disabled={!canSubmit}
        onClick={handleSubmit}
      />

      {
        isSubmit && (
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
        )
      }
    </div>
  );
};

SetLocation.propTypes = {
  setRoutesData: PropTypes.func.isRequired,
};

export default SetLocation;
