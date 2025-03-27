import React, { useState } from 'react';
import Header from '../../components/Header';
import Sidebar from '../../components/Sidebar';
import Map from '../../components/Map';
import RouteSegmentsTable from '../../components/Tables';  // Assumes your Tables component's index.jsx exports RouteSegmentsTable
import './style.css';

const HomeScreen = ({ routesData }) => {
  const [selectedRoute, setSelectedRoute] = useState(null);
  const [showOptimizeRoute, setOptimizeRoute] = useState(false);
  const [showComparison, setShowComparison] = useState(false);

  const handleRouteSelect = (route) => {
    setSelectedRoute(route);
  };

  return (
    <div className="home-container">
      <Header />
      <Sidebar
        routes={routesData}
        selectedRoute={selectedRoute}
        onRouteSelect={handleRouteSelect}
        setOptimizeRoute={setOptimizeRoute}
        showOptimizeRoute={showOptimizeRoute}
        setShowComparison={setShowComparison}
        showComparison={showComparison}
      />
      <div className="map-section">
        <div className="map-container">
          <Map 
            route_id={selectedRoute} 
            showOptimizeRoute={showOptimizeRoute}
            showComparison={showComparison}
          />
        </div>
        {showComparison && (
          <div className="compare-routes-section">
            <RouteSegmentsTable route_id={selectedRoute} />
          </div>
        )}
      </div>
    </div>
  );
};

export default HomeScreen;
