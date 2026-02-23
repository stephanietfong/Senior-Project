// src/components/Card.jsx
import React from 'react';
import '../index.css'; // Import the CSS file

interface CardProps {
  title: string;
  subtitle?: string;
  content: string;
  imageUrl?: string;
  linkUrl?: string;
}

const Card = ({ title, subtitle, content, imageUrl, linkUrl }: CardProps) => {
  return (
    <div className="card">
      {imageUrl && <img src={imageUrl} alt={title} className="card-image" />}
      <div className="card-body">
        <h2 className="card-title">{title}</h2>
        {subtitle && <h4 className="card-subtitle">{subtitle}</h4>}
        <p className="card-text">{content}</p>
        {linkUrl && (
          <a href={linkUrl} className="card-link">
            Learn More
          </a>
        )}
      </div>
    </div>
  );
};

export default Card;
