import React from "react";

const StopComponent = ({ data, setStopData }) => {
    return (
        <div>
            <h4>The stop data for {data.id}</h4>
            <div className="d-flex justify-content-between">
                <div className="form-item col-4">
                    <label htmlFor={`latitude-${data.id}`} className="form-label">
                        Latitude for Stop {data.id}
                    </label>
                    <input
                        id={`latitude-${data.id}`}
                        type="number"
                        name="latitude"
                        value={data.latitude}
                        onChange={(e) => setStopData(e, data.id)}
                        step="0.001"
                        className="form-style"
                        placeholder={`Latitude for Stop ${data.id}`}
                    />
                </div>
                <div className="form-item col-4">
                    <label htmlFor={`longitude-${data.id}`} className="form-label">
                        Longitude for Stop {data.id}
                    </label>
                    <input
                        id={`longitude-${data.id}`}
                        type="number"
                        name="longitude"
                        value={data.longitude}
                        onChange={(e) => setStopData(e, data.id)}
                        step="0.001"
                        className="form-style"
                        placeholder={`Longitude for Stop ${data.id}`}
                    />
                </div>
                <div className="form-item col-4">
                    <label htmlFor={`conatinerSize-${data.id}`} className="form-label">
                        Container Size for Stop {data.id}
                    </label>
                    <input
                        id={`conatinerSize-${data.id}`}
                        type="number"
                        name="currentContainerSize"
                        value={data.currentContainerSize}
                        onChange={(e) => setStopData(e, data.id)}
                        className="form-style"
                        step="0.01"
                        min={0}
                        placeholder={`Container Size for Stop ${data.id}`}
                    />
                </div>
            </div>
            <div className="d-flex">
                <div className="form-item col-4">
                    <label htmlFor={`serviceTime-${data.id}`} className="form-label">
                        Service Time for Stop {data.id}
                    </label>
                    <input
                        id={`serviceTime-${data.id}`}
                        type="number"
                        name="serviceTime"
                        value={data.serviceTime}
                        onChange={(e) => setStopData(e, data.id)}
                        className="form-style"
                        step="0.01"
                        min={0}
                        placeholder={`Service Time for Stop ${data.id}`}
                    />
                </div>
                <div className="form-item col-4">
                    <label htmlFor={`service_type-${data.id}`} className="form-label">
                        Service Type for Stop {data.id}
                    </label>
                    <select
                        id={`service_type-${data.id}`}
                        name="service_type"
                        value={data.service_type}
                        onChange={(e) => setStopData(e, data.id)}
                        className="form-style"
                        placeholder={`Service Type for Stop ${data.id}`}
                    >
                        <option value={0}>SWG</option>
                        <option value={1}>DRT</option>
                    </select>
                </div>
                <div className="form-item col-4">
                    <label htmlFor={`note-${data.id}`} className="form-label">
                        Note for Stop {data.id}
                    </label>
                    <input
                        id={`note-${data.id}`}
                        type="text"
                        name="note"
                        value={data.note}
                        onChange={(e) => setStopData(e, data.id)}
                        className="form-style"
                        placeholder={`Note for Stop ${data.id}`}
                    />
                </div>
            </div>
            <hr/>
        </div>
    );
}
export default StopComponent;