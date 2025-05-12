import React, { useEffect, useState } from 'react';
import { getComparisonData } from '../../services/routeService';
import './style.css';

const RouteSegmentsTable = ({ route_id }) => {
  const [tableData, setTableData] = useState([]);
  const [manualStandardData, setManualStandardData] = useState([]);
  const [optimalStandardData, setOptimalStandardData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTableData = async () => {
      if (route_id) {
        try {
          const data = await getComparisonData(route_id);
          console.log("Fetched table data:", data);
          if (data.success) {
            setTableData(data.route.sequence || []);
            setManualStandardData(data.route.aggregate[0]['Table Manual Data'] || []);
            setOptimalStandardData(data.route.aggregate[0]['Table Optimal Data'] || []);
          } else {
            setError(data.error);
          }
        } catch (err) {
          setError('Failed to fetch table data.');
        } finally {
          setLoading(false);
        }
      }
    };

    fetchTableData();
  }, [route_id]);

  if (loading) {
    return <p>Loading table data...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  if (!tableData.length) {
    return <p>No table data available.</p>;
  }

  const optimalSegments = tableData.filter(row => row.Route_Type === "Optimal");
  const manualSegments = tableData.filter(row => row.Route_Type === "Manual");

  const calculateTotalTime = (segments) => {
    const baseTime = segments.reduce((acc, row) => acc + Number(row["Time (min)"] || 0), 0);
    return baseTime
    // const additionalTime = segments.length; // Adding 10 minutes after each stop (adjust if needed)
    // return baseTime + additionalTime;
  };

  const totalManualTime = calculateTotalTime(manualSegments);
  const totalManualDistance = manualSegments.reduce((acc, row) => acc + Number(row["Distance (km)"] || 0), 0);

  const totalOptimalTime = calculateTotalTime(optimalSegments);
  const totalOptimalDistance = optimalSegments.reduce((acc, row) => acc + Number(row["Distance (km)"] || 0), 0);

  const mSData = manualStandardData[0].map((name, index) => {
    const isLastIndex = index === manualStandardData[0].length - 1;
    const distance = isLastIndex ? manualSegments.length - manualStandardData[2][index] + 1 : manualStandardData[2][index + 1] - manualStandardData[2][index];
    return {
      name: name,
      distance: distance,
      index: manualStandardData[2][index],
      type: manualStandardData[1][index]
    }
  });

  const oSData = optimalStandardData[0].map((name, index) => {
    const isLastIndex = index === optimalStandardData[0].length - 1;
    const distance = isLastIndex ? optimalSegments.length - optimalStandardData[2][index] + 1 : optimalStandardData[2][index + 1] - optimalStandardData[2][index];
    return {
      name: name,
      distance: distance,
      index: optimalStandardData[2][index],
      type: optimalStandardData[1][index]
    }
  });

  return (
    <div className="table-container">
      <h3>Route Segments</h3>
      <div className="segments-tables-container">
        {/* Actual Segments Table */}
        <div className="segments-table manual-table">
          <h4>Actual Routes</h4>
          <table className="results-table">
            <thead>
              <tr>
                <th>Sequence</th>
                <th>Segment</th>
                <th>Time (min)</th>
                <th>Distance (Mile)</th>
              </tr>
            </thead>
            <tbody>
              {manualSegments.map((row, index) => {
                const stop = mSData.find(stop => stop.index === index + 1);
                return (
                  <tr key={index}>
                    {
                      stop ? <td rowSpan={stop.distance}>{stop.name}-{stop.type}</td> : null
                    }
                    <td>{row.Segment}</td>
                    <td>{row["Time (min)"]}</td>
                    <td>{row["Distance (km)"]}</td>
                  </tr>
                );
              })}

              <tr className="totals-row">
                <td></td>
                <td><strong>Total</strong></td>
                <td><strong>{(totalManualTime / 60).toFixed(2)} hours</strong></td>
                <td><strong>{totalManualDistance.toFixed(1)}</strong></td>
              </tr>
            </tbody>
          </table>
          {/* Actual PERM Notes Table */}
          {/* <div className="notes-table">
            <h5>Actual Service Time</h5>
            <table className="results-table">
              <thead>
                <tr>
                  <th>Service Window</th>
                  <th>Segment</th>
                  <th>Service Time</th>
                </tr>
              </thead>
              <tbody>
                {manualSegments.map((row, index) => {
                  const stop = mSData.find(stop => stop.index === index + 1);
                  return (
                    <tr key={index}>
                      {
                        stop ? <td rowSpan={stop.distance}>{stop.name}-{stop.type}</td> : null
                      }
                      <td>{row.Segment}</td>
                      <td>{row["PERM_NOTES"] || "N/A"}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div> */}
        </div> 
        {/* Optimal Segments Table */}
        <div className="segments-table optimal-table">
          <h4>Optimal Routes</h4>
          <table className="results-table">
            <thead>
              <tr>
                <th>Sequence</th>
                <th>Segment</th>
                <th>Time (min)</th>
                <th>Distance (Mile)</th>
              </tr>
            </thead>
            <tbody>
              {optimalSegments.map((row, index) => {
                const stop = oSData.find(stop => stop.index === index + 1); // +1 because sData uses 1-based index
                return (
                  <tr key={index}>
                    {
                      stop ? <td rowSpan={stop.distance}>{stop.name}-{stop.type}</td> : null
                    }
                    <td>{row.Segment}</td>
                    <td>{row["Time (min)"]}</td>
                    <td>{row["Distance (km)"]}</td>
                  </tr>
                );
              })}

              <tr className="totals-row">
                <td></td>
                <td><strong>Total</strong></td>
                <td><strong>{(totalOptimalTime / 60).toFixed(2)} hours</strong></td>
                <td><strong>{totalOptimalDistance.toFixed(1)}</strong></td>
              </tr>
            </tbody>
          </table>
          {/* Optimal PERM Notes Table
          <div className="notes-table">
            <h5>Optimal Service Time</h5>
            <table className="results-table">
              <thead>
                <tr>
                  <th>Service Window</th>
                  <th>Segment</th>
                  <th>Service Time</th>
                </tr>
              </thead>
              <tbody>
                {optimalSegments.map((row, index) => {
                  const stop = oSData.find(stop => stop.index === index + 1); // +1 because sData uses 1-based index
                  return (
                    <tr key={index}>
                      {
                        stop ? <td rowSpan={stop.distance}>{stop.name}-{stop.type}</td> : null
                      }
                      <td>{row.Segment}</td>
                      <td>{row["PERM_NOTES"] || "N/A"}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div> */}
        </div>
      </div>
    </div>
  );
};

export default RouteSegmentsTable;
