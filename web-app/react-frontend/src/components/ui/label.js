import React from 'react';

const Label = ({ className = "", children, ...props }) => {
  return (
    <label 
      className={`block text-sm font-medium text-gray-700 mb-1 ${className}`}
      {...props}
    >
      {children}
    </label>
  );
};

export { Label };