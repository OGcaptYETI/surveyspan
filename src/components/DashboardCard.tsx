import React from "react";

interface DashboardCardProps {
  title: string;
  content: string;
  footer?: React.ReactNode;
}

const DashboardCard: React.FC<DashboardCardProps> = ({ title, content }) => {
  return (
    <div className="bg-white p-4 rounded-lg shadow-md">
      <h3 className="text-lg font-semibold">{title}</h3>
      <p className="text-gray-600">{content}</p>
    </div>
  );
};

export default DashboardCard;
