import { useState } from 'react';
import { BrandedModal, BrandedModalFooter } from '@/components/branding';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Package, Save, User, Mail, Phone } from 'lucide-react';
import { toast } from 'sonner';

/**
 * Modal de ejemplo usando BrandedModal
 * Demuestra el nuevo sistema de branding para modales
 */
export function ExampleBrandedModal({ isOpen, onClose }) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: ''
  });

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSave = () => {
    if (!formData.name.trim()) {
      toast.error('El nombre es requerido');
      return;
    }

    if (!formData.email.trim()) {
      toast.error('El email es requerido');
      return;
    }

    // Simular guardado
    toast.success('Datos guardados correctamente');
    onClose();

    // Resetear formulario
    setFormData({
      name: '',
      email: '',
      phone: ''
    });
  };

  const handleCancel = () => {
    setFormData({
      name: '',
      email: '',
      phone: ''
    });
    onClose();
  };

  return (
    <BrandedModal
      isOpen={isOpen}
      onClose={handleCancel}
      title="Ejemplo de Modal Branding"
      subtitle="Este modal demuestra el nuevo sistema de branding consistente"
      icon={<Package className="w-5 h-5" />}
      footer={
        <BrandedModalFooter
          onCancel={handleCancel}
          onConfirm={handleSave}
          cancelText="Cancelar"
          confirmText="Guardar Ejemplo"
          confirmIcon={<Save className="w-4 h-4" />}
          isConfirmDisabled={!formData.name.trim() || !formData.email.trim()}
        />
      }
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Columna izquierda - Información básica */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-empanada-golden">Información Personal</h3>

          <div>
            <label className="text-sm font-medium mb-2 block flex items-center gap-2">
              <User className="w-4 h-4" />
              Nombre Completo
            </label>
            <Input
              value={formData.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
              placeholder="Ej: Juan Pérez"
            />
          </div>

          <div>
            <label className="text-sm font-medium mb-2 block flex items-center gap-2">
              <Mail className="w-4 h-4" />
              Email
            </label>
            <Input
              type="email"
              value={formData.email}
              onChange={(e) => handleInputChange('email', e.target.value)}
              placeholder="Ej: juan@example.com"
            />
          </div>

          <div>
            <label className="text-sm font-medium mb-2 block flex items-center gap-2">
              <Phone className="w-4 h-4" />
              Teléfono (Opcional)
            </label>
            <Input
              type="tel"
              value={formData.phone}
              onChange={(e) => handleInputChange('phone', e.target.value)}
              placeholder="Ej: +54 9 11 1234-5678"
            />
          </div>
        </div>

        {/* Columna derecha - Vista previa */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-empanada-golden">Vista Previa</h3>

          <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <h4 className="font-medium mb-3">Datos ingresados:</h4>

            <div className="space-y-2 text-sm">
              <div>
                <span className="font-medium">Nombre:</span>
                <span className="ml-2">{formData.name || 'Sin especificar'}</span>
              </div>

              <div>
                <span className="font-medium">Email:</span>
                <span className="ml-2">{formData.email || 'Sin especificar'}</span>
              </div>

              <div>
                <span className="font-medium">Teléfono:</span>
                <span className="ml-2">{formData.phone || 'No especificado'}</span>
              </div>
            </div>
          </div>

          <div className="p-4 bg-empanada-golden/10 rounded-lg border border-empanada-golden/20">
            <h4 className="font-medium mb-2 text-empanada-golden">💡 Características del BrandedModal:</h4>
            <ul className="text-sm space-y-1 text-muted-foreground">
              <li>• Header consistente con ícono y subtítulo</li>
              <li>• Footer estandarizado con botones empanada</li>
              <li>• Backdrop blur y z-index apropiado</li>
              <li>• Responsive y accesible</li>
              <li>• Theming dark/light automático</li>
              <li>• Validación de estados integrada</li>
            </ul>
          </div>
        </div>
      </div>
    </BrandedModal>
  );
}