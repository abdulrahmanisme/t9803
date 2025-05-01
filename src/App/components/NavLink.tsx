import React from 'react';

interface NavLinkProps {
  icon: React.ReactNode;
  text: string;
  onClick?: () => void;
}

export function NavLink({ icon, text, onClick }: NavLinkProps) {
  return (
    <button
      onClick={onClick}
      className="flex items-center gap-2 text-white hover:text-indigo-200 transition-colors duration-200"
    >
      {icon}
      <span>{text}</span>
    </button>
  );
}