// src/components/Card.jsx
import React from "react";
import "../index.css"; // Import the CSS file

interface CardProps {
  title: string;
  subtitle?: string;
  content: string;
  imageUrl?: string;
  linkUrl?: string;
}

const Card = ({ title, subtitle, content, imageUrl, linkUrl }: CardProps) => {
  return (
    <div className="border border-white rounded w-[300px] m-4 overflow-hidden transition delay-1000 hover:translate-y-[-5px]">
      {imageUrl && (
        <img
          src={imageUrl}
          alt={title}
          className="w-full h-[180px] object-cover"
        />
      )}
      <div className="p-4">
        <h2 className="text-xl mb-2">{title}</h2>
        {subtitle && (
          <h4 className="text-sm text-customGray mb-4">{subtitle}</h4>
        )}
        <p className="text-base mb-4">{content}</p>
        {linkUrl && (
          <a href={linkUrl} className="text-customDarkBlue no-underline">
            Learn More
          </a>
        )}
      </div>
    </div>
  );
};

export default Card;
