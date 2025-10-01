import { useState } from 'react';
import { useNavigate } from 'react-router';
import { MapPin, Edit2 } from 'lucide-react';
import { Button } from '../ui/button';
import { StoreChangeModal } from './StoreChangeModal';
import { useCart } from '@/context/CartProvider';
import { usePublicData } from '@/context/PublicDataProvider';

export function StoreChangeButton({ variant = 'mobile', storeName }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate();
  const { clearCart } = useCart();
  const { setSucursalSeleccionada } = usePublicData();

  const handleConfirmChange = () => {
    // Limpiar carrito
    clearCart();

    // Limpiar sucursal seleccionada
    setSucursalSeleccionada(null);

    // Cerrar modal
    setIsModalOpen(false);

    // Navegar a página de selección de sucursal
    navigate('/pedir');
  };

  if (variant === 'mobile') {
    // Versión mobile: botón icon inline
    return (
      <>
        <button
          onClick={() => setIsModalOpen(true)}
          className="inline-flex items-center gap-1 text-sm text-empanada-golden hover:text-empanada-warm transition-colors"
          aria-label="Cambiar sucursal"
        >
          <Edit2 className="w-4 h-4" />
        </button>

        <StoreChangeModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onConfirm={handleConfirmChange}
        />
      </>
    );
  }

  // Versión desktop: botón con texto
  return (
    <>
      <Button
        variant="outline"
        size="sm"
        onClick={() => setIsModalOpen(true)}
        className="flex items-center gap-2 text-sm border-empanada-light-gray hover:border-empanada-golden hover:bg-empanada-golden/10 transition-colors"
      >
        <MapPin className="w-4 h-4" />
        <span>Cambiar sucursal</span>
      </Button>

      <StoreChangeModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={handleConfirmChange}
      />
    </>
  );
}
