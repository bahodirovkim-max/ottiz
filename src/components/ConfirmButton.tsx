'use client';
import React from 'react';

export function ConfirmButton({ children, text = "Davom etishni tasdiqlaysizmi?", className, title }: any) {
  return (
    <button 
      type="submit" 
      title={title}
      className={className}
      onClick={(e) => {
        if (!window.confirm(text)) {
           e.preventDefault();
        }
      }}
    >
      {children}
    </button>
  );
}
