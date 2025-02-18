import React from "react";

interface CardProps {
  title: string;
  content: string;
  footer?: React.ReactNode;
}

const Card: React.FC<CardProps> = ({ title, content, footer }) => {
  return (
    <div className="bg-white p-4 rounded-lg shadow-md border">
      <h3 className="text-lg font-semibold">{title}</h3>
      <p className="text-gray-600">{content}</p>
      {footer && <div className="mt-4">{footer}</div>}
    </div>
  );
};

export default Card;
