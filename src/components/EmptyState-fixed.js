import React from 'react';
import '../styles/EmptyState.css';

function EmptyState({ 
  icon = '📭', 
  title = 'Nothing here yet', 
  description = 'Get started by creating something new!', 
  actionText = 'Get Started', 
  onAction = null,
  className = '' 
}) {
  return (
    <div className={`empty-state-modern ${className}`}>
      <div className="empty-state-icon">
        {icon}
      </div>
      <h3 className="empty-state-title">{title}</h3>
      <p className="empty-state-description">{description}</p>
      {onAction && (
        <button onClick={onAction} className="empty-state-action">
          {actionText}
        </button>
      )}
    </div>
  );
}

export default EmptyState;