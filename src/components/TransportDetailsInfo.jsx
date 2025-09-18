import { useOutletContext } from "react-router-dom";

export default function TransportDetailInfo() {
  const {transport} = useOutletContext()
  return (
    <div className="car-detail-description">
      <p>{transport.description}</p>
      <p>
        <span className="span-bold">
          <i className="bi bi-geo-alt"></i>
          Pick up location:
        </span> {transport.pickupLocation}
      </p>
    </div>
  );
}
