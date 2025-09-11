import { useState } from 'react';
import { Package, X, Save } from 'lucide-react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { motion, AnimatePresence } from 'framer-motion';
import { Portal } from './Portal';

/**
 * Modal para actualizar stock de productos
 */
export function UpdateStockModal({ 
  isOpen, 
  onClose, 
  onSave, 
  productName = "Producto",
  currentStock = 0,
  isLoading = false
}) {
  const [newStock, setNewStock] = useState(currentStock.toString());

  const handleSave = () => {
    const stockValue = parseInt(newStock);
    if (!isNaN(stockValue) && stockValue >= 0) {
      onSave(stockValue);
    }
  };

  const handleClose = () => {
    setNewStock(currentStock.toString());
    onClose();
  };

  if (!isOpen) return null;

  return (
    <Portal>
      <AnimatePresence>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[999999] flex items-center justify-center p-4"
        >
        {/* Backdrop */}
        <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={handleClose} />
        
        {/* Modal */}
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="relative w-full max-w-md"
        >
          <Card className="shadow-xl border-2 border-empanada-golden/20">
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-empanada-golden/10 rounded-full flex items-center justify-center">
                    <Package className="w-6 h-6 text-empanada-golden" />
                  </div>
                  <div>
                    <CardTitle className="text-lg">Actualizar Stock</CardTitle>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {productName}
                    </p>
                  </div>
                </div>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={handleClose}
                  className="h-8 w-8 p-0 hover:bg-gray-100 dark:hover:bg-gray-800"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            </CardHeader>
            
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Stock Actual
                  </label>
                  <div className="px-3 py-2 bg-gray-100 dark:bg-gray-800 rounded-md text-gray-600 dark:text-gray-400">
                    {currentStock} unidades
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Nuevo Stock
                  </label>
                  <Input
                    type="number"
                    value={newStock}
                    onChange={(e) => setNewStock(e.target.value)}
                    placeholder="Ingresa la nueva cantidad"
                    min="0"
                    className="w-full"
                  />
                </div>
              </div>
              
              <div className="flex items-center justify-end space-x-3">
                <Button 
                  variant="outline" 
                  onClick={handleClose}
                  disabled={isLoading}
                  className="px-6"
                >
                  Cancelar
                </Button>
                <Button 
                  onClick={handleSave}
                  disabled={isLoading || newStock === currentStock.toString()}
                  className="px-6 bg-empanada-golden hover:bg-empanada-golden/90 text-white"
                >
                  {isLoading ? (
                    <div className="flex items-center space-x-2">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>Guardando...</span>
                    </div>
                  ) : (
                    <>
                      <Save className="w-4 h-4 mr-2" />
                      Actualizar Stock
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
        </motion.div>
      </AnimatePresence>
    </Portal>
  );
}

/**
 * Hook para manejar el modal de actualización de stock
 */
export function useUpdateStockModal() {
  const [modal, setModal] = useState({
    isOpen: false,
    productName: '',
    currentStock: 0,
    onSave: null,
    isLoading: false
  });

  const openModal = (config) => {
    setModal({
      isOpen: true,
      productName: config.productName || 'Producto',
      currentStock: config.currentStock || 0,
      onSave: config.onSave || (() => {}),
      isLoading: false
    });
  };

  const closeModal = () => {
    setModal(prev => ({ ...prev, isOpen: false }));
  };

  const setLoading = (loading) => {
    setModal(prev => ({ ...prev, isLoading: loading }));
  };

  const UpdateStockModalComponent = () => (
    <UpdateStockModal
      isOpen={modal.isOpen}
      onClose={closeModal}
      onSave={modal.onSave}
      productName={modal.productName}
      currentStock={modal.currentStock}
      isLoading={modal.isLoading}
    />
  );

  return {
    openModal,
    closeModal,
    setLoading,
    UpdateStockModalComponent
  };
}
