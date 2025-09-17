import { useState, useCallback } from 'react';

const useToast = (defaultPosition = 'top-center') => {
  const [toast, setToast] = useState({
    message: '',
    type: 'success',
    isVisible: false,
    position: defaultPosition,
  });

  const showToast = useCallback((message, type = 'success', options = {}) => {
    const { 
      duration = 4000, 
      position = defaultPosition,
      onClose 
    } = options;

    setToast({
      message,
      type,
      isVisible: true,
      duration,
      position,
      onClose,
    });
  }, [defaultPosition]);

  const hideToast = useCallback(() => {
    setToast(prev => ({
      ...prev,
      isVisible: false,
    }));
  }, []);

  // Convenience methods for different types
  const showSuccess = useCallback((message, options) => 
    showToast(message, 'success', options), [showToast]);
  
  const showError = useCallback((message, options) => 
    showToast(message, 'error', options), [showToast]);
  
  const showWarning = useCallback((message, options) => 
    showToast(message, 'warning', options), [showToast]);
  
  const showInfo = useCallback((message, options) => 
    showToast(message, 'info', options), [showToast]);

  return {
    toast,
    showToast,
    hideToast,
    showSuccess,
    showError,
    showWarning,
    showInfo,
  };
};

export default useToast;
