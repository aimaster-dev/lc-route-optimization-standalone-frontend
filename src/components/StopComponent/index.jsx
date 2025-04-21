import React from "react";
import PropTypes from 'prop-types';

const StopComponent = ({ data, setStopData }) => {
    const handlePaste = (e, id) => {
        e.preventDefault();
        const pastedData = e.clipboardData.getData('text');
        const values = pastedData.split('\t'); // Split by tab for Excel-like data
        
        // Map the pasted values to their corresponding fields
        const fieldMapping = {
            0: { name: 'latitude', type: 'number' },
            1: { name: 'longitude', type: 'number' },
            2: { name: 'currentContainerSize', type: 'number' },
            3: { name: 'service_type', type: 'select' },
            4: { name: 'lf_latitude', type: 'number' },
            5: { name: 'lf_longitude', type: 'number' },
        };

        values.forEach((value, index) => {
            if (fieldMapping[index]) {
                const { name, type } = fieldMapping[index];
                let processedValue = value.trim();
                
                if (type === 'number') {
                    processedValue = parseFloat(processedValue);
                    if (isNaN(processedValue)) return;
                } else if (type === 'select') {
                    processedValue = processedValue === 'SWG' ? 0 : 1;
                }

                const event = {
                    target: {
                        name,
                        value: processedValue
                    }
                };
                setStopData(event, id);
            }
        });
    };

    return (
        <table className="table table-bordered">
            <thead>
                <tr>
                    <th colSpan="6">Stop Data for {data.id}</th>
                </tr>
                <tr>
                    <th>Latitude</th>
                    <th>Longitude</th>
                    <th>Container Size</th>
                    <th>Service Type</th>
                    <th>LandFill Latitude</th>
                    <th>LandFill Longitude</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td>
                        <input
                            type="number"
                            name="latitude"
                            value={data.latitude}
                            onChange={(e) => setStopData(e, data.id)}
                            onPaste={(e) => handlePaste(e, data.id)}
                            step="0.001"
                            className="form-control"
                            placeholder="Latitude"
                        />
                    </td>
                    <td>
                        <input
                            type="number"
                            name="longitude"
                            value={data.longitude}
                            onChange={(e) => setStopData(e, data.id)}
                            onPaste={(e) => handlePaste(e, data.id)}
                            step="0.001"
                            className="form-control"
                            placeholder="Longitude"
                        />
                    </td>
                    <td>
                        <input
                            type="number"
                            name="currentContainerSize"
                            value={data.currentContainerSize}
                            onChange={(e) => setStopData(e, data.id)}
                            onPaste={(e) => handlePaste(e, data.id)}
                            className="form-control"
                            step="0.01"
                            min={0}
                            placeholder="Container Size"
                        />
                    </td>
                    <td>
                        <select
                            name="service_type"
                            value={data.service_type}
                            onChange={(e) => setStopData(e, data.id)}
                            onPaste={(e) => handlePaste(e, data.id)}
                            className="form-control"
                        >
                            <option value={0}>SWG</option>
                            <option value={1}>DRT</option>
                        </select>
                    </td>
                    <td>
                        <input
                            type="number"
                            name="currentContainerSize"
                            value={data.lf_latitude}
                            onChange={(e) => setStopData(e, data.id)}
                            onPaste={(e) => handlePaste(e, data.id)}
                            className="form-control"
                            step="0.01"
                            min={0}
                            placeholder="LandFill Latitude"
                        />
                    </td>
                    <td>
                        <input
                            type="number"
                            name="currentContainerSize"
                            value={data.lf_longitude}
                            onChange={(e) => setStopData(e, data.id)}
                            onPaste={(e) => handlePaste(e, data.id)}
                            className="form-control"
                            step="0.01"
                            min={0}
                            placeholder="Container Size"
                        />
                    </td>
                </tr>
            </tbody>
        </table>
    );
}

StopComponent.propTypes = {
    data: PropTypes.shape({
        id: PropTypes.string.isRequired,
        latitude: PropTypes.number,
        longitude: PropTypes.number,
        currentContainerSize: PropTypes.number,
        service_type: PropTypes.number,
    }).isRequired,
    setStopData: PropTypes.func.isRequired
};

export default StopComponent;