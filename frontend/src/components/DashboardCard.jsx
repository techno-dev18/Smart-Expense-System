function DashboardCard({
  title,
  value,
  icon,
  className = "",
}) {
  return (
    <div
      className={`dashboard-card ${className}`}
    >
      <div className="card-icon">
        {icon}
      </div>

      <div className="dashboard-card-content">
        <p>{title}</p>

        <h2>{value}</h2>
      </div>
    </div>
  );
}

export default DashboardCard;