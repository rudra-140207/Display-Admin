import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { CheckCircle, AlertCircle, Info, AlertTriangle, X } from 'lucide-react';

const Toast = ({ 
  message, 
  type = 'success', 
  isVisible, 
  onClose, 
  duration = 4000,
  position = 'top-center' 
}) => {
  const [isShowing, setIsShowing] = useState(false);
  const [isLeaving, setIsLeaving] = useState(false);

  useEffect(() => {
    if (isVisible) {
      setIsShowing(true);
      setIsLeaving(false);
      
      const timer = setTimeout(() => {
        handleClose();
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [isVisible, duration]);

  const handleClose = () => {
    setIsLeaving(true);
    setTimeout(() => {
      setIsShowing(false);
      setIsLeaving(false);
      onClose();
    }, 300);
  };

  if (!isVisible && !isShowing) return null;

  const getToastConfig = () => {
    switch (type) {
      case 'success':
        return {
          bgGradient: 'bg-gradient-to-r from-green-500 to-green-600',
          icon: CheckCircle,
          iconColor: 'text-white',
          borderColor: 'border-green-400',
          shadowColor: 'shadow-green-500/25',
        };
      case 'error':
        return {
          bgGradient: 'bg-gradient-to-r from-red-500 to-red-600',
          icon: AlertCircle,
          iconColor: 'text-white',
          borderColor: 'border-red-400',
          shadowColor: 'shadow-red-500/25',
        };
      case 'warning':
        return {
          bgGradient: 'bg-gradient-to-r from-yellow-500 to-yellow-600',
          icon: AlertTriangle,
          iconColor: 'text-white',
          borderColor: 'border-yellow-400',
          shadowColor: 'shadow-yellow-500/25',
        };
      case 'info':
        return {
          bgGradient: 'bg-gradient-to-r from-blue-500 to-blue-600',
          icon: Info,
          iconColor: 'text-white',
          borderColor: 'border-blue-400',
          shadowColor: 'shadow-blue-500/25',
        };
      default:
        return {
          bgGradient: 'bg-gradient-to-r from-gray-500 to-gray-600',
          icon: Info,
          iconColor: 'text-white',
          borderColor: 'border-gray-400',
          shadowColor: 'shadow-gray-500/25',
        };
    }
  };

  const getPositionClasses = () => {
    switch (position) {
      case 'top-left':
        return 'top-6 left-6';
      case 'top-right':
        return 'top-6 right-6';
      case 'bottom-center':
        return 'bottom-6 left-1/2 transform -translate-x-1/2';
      case 'bottom-left':
        return 'bottom-6 left-6';
      case 'bottom-right':
        return 'bottom-6 right-6';
      case 'center':
        return 'top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2';
      case 'top-center':
      default:
        return 'top-6 left-1/2 transform -translate-x-1/2';
    }
  };

  const config = getToastConfig();
  const Icon = config.icon;

  const toastElement = (
    <div
      className={`fixed ${getPositionClasses()} z-[99999] transition-all duration-300 ease-out ${
        isLeaving 
          ? 'opacity-0 transform translate-y-2 scale-95' 
          : 'opacity-100 transform translate-y-0 scale-100'
      }`}
      style={{ 
        position: 'fixed', 
        zIndex: 99999,
        pointerEvents: 'auto'
      }}
    >
      <div
        className={`${config.bgGradient} text-white px-6 py-4 rounded-xl shadow-2xl ${config.shadowColor} border ${config.borderColor} backdrop-blur-sm max-w-sm w-full mx-4 sm:max-w-md sm:mx-0`}
      >
        <div className="flex items-start space-x-3">
          <div className="flex-shrink-0 mt-0.5">
            <Icon size={20} className={config.iconColor} />
          </div>
          
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium leading-5 break-words pr-2">
              {message}
            </p>
          </div>
          
          <button
            onClick={handleClose}
            className="flex-shrink-0 hover:bg-white/20 rounded-full p-1.5 transition-colors duration-200 -mt-0.5 -mr-1"
            aria-label="Close notification"
          >
            <X size={16} className="text-white" />
          </button>
        </div>
        
        {/* Progress bar */}
        {duration > 0 && (
          <div className="mt-3 w-full bg-white/20 rounded-full h-1 overflow-hidden">
            <div 
              className="h-full bg-white/60 rounded-full"
              style={{ 
                animation: `shrinkProgress ${duration}ms linear forwards`,
              }}
            />
          </div>
        )}
      </div>
      
      <style jsx>{`
        @keyframes shrinkProgress {
          from { width: 100%; }
          to { width: 0%; }
        }
      `}</style>
    </div>
  );

  // Use createPortal to render at the root level
  return createPortal(toastElement, document.body);
};

export default Toast;
