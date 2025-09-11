import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';

export function Portal({ children, className = 'modal-portal' }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  if (!mounted) {
    return null;
  }

  return createPortal(
    <div className={className}>
      {children}
    </div>,
    document.body
  );
}
