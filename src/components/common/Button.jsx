
import React from 'react';
import clsx from 'clsx';

export const Button = ({
  children,
  type = 'button',
  disabled = false,
  className = '',
  ...props
}) => {
  return (
    <button
      type={type}
      disabled={disabled}
      className={clsx(
        'bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition duration-200',
        'disabled:bg-red-400 disabled:cursor-not-allowed',
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
};
