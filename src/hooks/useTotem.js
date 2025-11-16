import { useContext } from 'react';
import { TotemContext } from '@/context/TotemProvider';

export const useTotem = () => {
  const context = useContext(TotemContext);
  if (!context) {
    throw new Error('useTotem debe ser usado dentro de un TotemProvider');
  }
  return context;
};

export default useTotem;
