import { useState } from 'react';
import { AlertTriangle, X, Check, Trash2 } from 'lucide-react';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { motion, AnimatePresence } from 'framer-motion';
import { Portal } from './Portal';

/**
 * Componente de modal de confirmación reutilizable
 */
export function ConfirmModal({ 
  isOpen, 
  onClose, 
  onConfirm, 
  title = "Confirmar Acción",
  message = "¿Estás seguro de que quieres realizar esta acción?",
  confirmText = "Confirmar",
  cancelText = "Cancelar",
  type = "warning", // warning, danger, info
  isLoading = false
}) {
  if (!isOpen) return null;

  const getTypeStyles = () => {
    switch (type) {
      case 'danger':
        return {
          icon: <Trash2 className="w-8 h-8 text-red-600" />,
          iconBg: 'bg-red-100 dark:bg-red-900/30',
          confirmButton: 'bg-red-600 hover:bg-red-700 text-white',
          borderColor: 'border-red-200 dark:border-red-800'
        };
      case 'warning':
        return {
          icon: <AlertTriangle className="w-8 h-8 text-amber-600" />,
          iconBg: 'bg-amber-100 dark:bg-amber-900/30',
          confirmButton: 'bg-amber-600 hover:bg-amber-700 text-white',
          borderColor: 'border-amber-200 dark:border-amber-800'
        };
      case 'info':
        return {
          icon: <Check className="w-8 h-8 text-blue-600" />,
          iconBg: 'bg-blue-100 dark:bg-blue-900/30',
          confirmButton: 'bg-blue-600 hover:bg-blue-700 text-white',
          borderColor: 'border-blue-200 dark:border-blue-800'
        };
      default:
        return {
          icon: <AlertTriangle className="w-8 h-8 text-gray-600" />,
          iconBg: 'bg-gray-100 dark:bg-gray-900/30',
          confirmButton: 'bg-gray-600 hover:bg-gray-700 text-white',
          borderColor: 'border-gray-200 dark:border-gray-800'
        };
    }
  };

  const styles = getTypeStyles();

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
        <div className="absolute inset-0 bg-black/60" onClick={onClose} />
        
        {/* Modal */}
        <motion.div
          initial={{ scale: 0.96, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.96, opacity: 0 }}
          transition={{ duration: 0.15, ease: "easeOut" }}
          className="relative w-full max-w-md"
        >
          <Card className={`shadow-xl border-2 ${styles.borderColor}`}>
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center ${styles.iconBg}`}>
                    {styles.icon}
                  </div>
                  <CardTitle className="text-lg">{title}</CardTitle>
                </div>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={onClose}
                  className="h-8 w-8 p-0 hover:bg-gray-100 dark:hover:bg-gray-800"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            </CardHeader>
            
            <CardContent className="space-y-6">
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                {message}
              </p>
              
              <div className="flex items-center justify-end space-x-3">
                <Button 
                  variant="outline" 
                  onClick={onClose}
                  disabled={isLoading}
                  className="px-6"
                >
                  {cancelText}
                </Button>
                <Button 
                  onClick={() => {
                    onConfirm();
                    onClose();
                  }}
                  disabled={isLoading}
                  className={`px-6 ${styles.confirmButton}`}
                >
                  {isLoading ? (
                    <div className="flex items-center space-x-2">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>Procesando...</span>
                    </div>
                  ) : (
                    confirmText
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
 * Hook para manejar modales de confirmación
 */
export function useConfirmModal() {
  const [modal, setModal] = useState({
    isOpen: false,
    title: '',
    message: '',
    confirmText: '',
    cancelText: '',
    type: 'warning',
    onConfirm: null,
    isLoading: false
  });

  const openModal = (config) => {
    setModal({
      isOpen: true,
      title: config.title || 'Confirmar Acción',
      message: config.message || '¿Estás seguro de que quieres realizar esta acción?',
      confirmText: config.confirmText || 'Confirmar',
      cancelText: config.cancelText || 'Cancelar',
      type: config.type || 'warning',
      onConfirm: config.onConfirm || (() => {}),
      isLoading: false
    });
  };

  const closeModal = () => {
    setModal(prev => ({ ...prev, isOpen: false }));
  };

  const setLoading = (loading) => {
    setModal(prev => ({ ...prev, isLoading: loading }));
  };

  const ConfirmModalComponent = () => (
    <ConfirmModal
      isOpen={modal.isOpen}
      onClose={closeModal}
      onConfirm={modal.onConfirm}
      title={modal.title}
      message={modal.message}
      confirmText={modal.confirmText}
      cancelText={modal.cancelText}
      type={modal.type}
      isLoading={modal.isLoading}
    />
  );

  return {
    openModal,
    closeModal,
    setLoading,
    ConfirmModalComponent
  };
}
