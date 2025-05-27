import { useState, useEffect } from 'react';

const useMetricAnimation = (
  targetValue: number, 
  duration: number = 1000, 
  delay: number = 0
): number => {
  const [currentValue, setCurrentValue] = useState(0);

  useEffect(() => {
    if (targetValue === 0) {
      setCurrentValue(0);
      return;
    }

    let startValue = currentValue;
    let startTime: number | null = null;
    let animationFrameId: number;

    const timeoutId = setTimeout(() => {
      const animateValue = (timestamp: number) => {
        if (!startTime) startTime = timestamp;
        const elapsed = timestamp - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        const easedProgress = 1 - Math.pow(1 - progress, 3);
        const newValue = startValue + (targetValue - startValue) * easedProgress;
        
        setCurrentValue(newValue);
        
        if (progress < 1) {
          animationFrameId = requestAnimationFrame(animateValue);
        }
      };
      
      animationFrameId = requestAnimationFrame(animateValue);
    }, delay);
    
    return () => {
      clearTimeout(timeoutId);
      cancelAnimationFrame(animationFrameId);
    };
  }, [targetValue, duration, delay]);
  
  return currentValue;
};

export default useMetricAnimation;