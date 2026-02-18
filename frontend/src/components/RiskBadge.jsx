const RiskBadge = ({ status }) => {

  const styles = {
    legit: "bg-green-100 text-green-700",
    medium_risk: "bg-yellow-100 text-yellow-700",
    high_risk: "bg-red-100 text-red-700"
  };

  const labels = {
    legit: "Legit",
    medium_risk: "Medium Risk",
    high_risk: "High Risk"
  };

  return (
    <span
      className={`px-3 py-1 text-xs font-semibold rounded-full ${styles[status]}`}
    >
      {labels[status]}
    </span>
  );
};

export default RiskBadge;
