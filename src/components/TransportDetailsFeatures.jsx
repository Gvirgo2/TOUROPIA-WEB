import { useOutletContext } from "react-router-dom";


export default function TransportDetailsFeatures() {
  const {transport} = useOutletContext()
  return (
    <section className="features-section">
      <div>
        <i className="bi bi-people"></i>
        <span>{transport.seatingCapacity} Seats</span>
      </div>
      <div>
        <i className="bi bi-car-front"></i>
        <span>{transport.transmission}</span>
      </div>
      <div>
        <i className="bi bi-fuel-pump"></i>
        <span>{transport.fuelType}</span>
      </div>
    </section>
  );
}
