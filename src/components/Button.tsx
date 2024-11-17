import React from 'react';
import { useNavigate } from 'react-router-dom';

interface ButtonProps {
  type: 'button' | 'submit' | 'reset';
  children: React.ReactNode;
  onClick?: () => void;
  to?: string;
  className: string;

}

const Button: React.FC<ButtonProps> = ({ type, onClick,  children, to, className}) => {
  const navigate = useNavigate();

  const handleClick = () => {
    if (to) {
      navigate(to);
    }
    if (onClick) {
      onClick();
    }
  };

  return (
    <button
      type={type}
      onClick={handleClick}
      className={className}
    >
      {children}
    </button>
  );
};

export default Button;
