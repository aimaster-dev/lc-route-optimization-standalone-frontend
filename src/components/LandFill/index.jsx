import PropTypes from 'prop-types';

const LandFill = ({ data, setLandFillData }) => {
    const handlePaste = (e, id) => {
        e.preventDefault();
        const pastedData = e.clipboardData.getData('text');
        const values = pastedData.split('\t'); // Split by tab for Excel-like data
        
        // Map the pasted values to their corresponding fields
        const fieldMapping = {
            0: { name: 'Latitude', type: 'number' },
            1: { name: 'Longitude', type: 'number' },
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
                setLandFillData(event, id);
            }
        });
    };

    return (
        <table className="table table-bordered">
            <thead>
                <tr>
                    <th colSpan="6">LandFill Data for {data.id}</th>
                </tr>
                <tr>
                    <th>LandFill Latitude</th>
                    <th>LandFill Longitude</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td>
                        <input
                            type="number"
                            name="Latitude"
                            value={data.Latitude}
                            onChange={(e) => setLandFillData(e, data.id)}
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
                            name="Longitude"
                            value={data.Longitude}
                            onChange={(e) => setLandFillData(e, data.id)}
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

LandFill.propTypes = {
    data: PropTypes.shape({
        id: PropTypes.string.isRequired,
        Latitude: PropTypes.number,
        Longitude: PropTypes.number
    }).isRequired,
    setLandFillData: PropTypes.func.isRequired
};

export default LandFill;