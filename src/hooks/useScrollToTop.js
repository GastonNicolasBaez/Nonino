import { useEffect } from 'react';
import { useLocation } from 'react-router';

export function useScrollToTop() {
  const location = useLocation();

  useEffect(() => {
    // Skip scroll to top for /inicio to preserve logo animation
    if (location.pathname === '/' || location.pathname === '/inicio') {
      return;
    }

    // Scroll to top when route changes for other pages
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: 'smooth'
    });
  }, [location.pathname]);

  // Return a function to manually scroll to top
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: 'smooth'
    });
  };

  return { scrollToTop };
}
