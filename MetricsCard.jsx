import '../styles/MetricsCard.css';

export default function MetricsCard({ title, value, color, icon }) {
  return (
    <div className="metrics-card" style={{ borderLeftColor: color }}>
      <div className="metrics-icon">{icon}</div>
      <div className="metrics-content">
        <h3 className="metrics-title">{title}</h3>
        <p className="metrics-value">{value}</p>
      </div>
    </div>
  );
}
