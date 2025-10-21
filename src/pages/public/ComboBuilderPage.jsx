import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { LoadingSpinner } from "@/components/common/LoadingSpinner";
import { ProductStepSelector } from "@/components/menu/ProductStepSelector";
import { ComboSummaryPanel } from "@/components/menu/ComboSummaryPanel";
import { StepperNav } from "@/components/menu/mobile/StepperNav";
import { ComboSummarySheet } from "@/components/menu/mobile/ComboSummarySheet";
import { usePublicData } from "@/context/PublicDataProvider";
import { useCart } from "@/context/CartProvider";
import { useIsMobile } from "@/hooks/useMediaQuery";
import { getStorageItem, setStorageItem, removeStorageItem } from "@/lib/utils";
import { STORAGE_KEYS } from "@/constants";

export function ComboBuilderPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const {
    combos,
    categorias,
    productos: products,
    publicDataLoading: loading,
    sucursalSeleccionada
  } = usePublicData();
  const { addItem } = useCart();

  const isMobile = useIsMobile();
  const [selectedCombo, setSelectedCombo] = useState(null);
  const [currentStep, setCurrentStep] = useState(null);
  const [selections, setSelections] = useState({});
  const [addingToCart, setAddingToCart] = useState(false);

  // Verificar que hay sucursal seleccionada
  useEffect(() => {
    if (!sucursalSeleccionada && !loading) {
      // Solo mostrar toast en desktop
      if (!isMobile) {
        toast.error('Por favor, seleccioná una sucursal primero');
      }
      navigate('/stores');
    }
  }, [sucursalSeleccionada, loading, navigate, isMobile]);

  // Auto-seleccionar combo desde URL params
  useEffect(() => {
    if (loading || !combos || combos.length === 0) return;
    
    const comboId = searchParams.get('comboId');
    if (!comboId) {
      // Solo mostrar toast en desktop
      if (!isMobile) {
        toast.error('No se especificó un combo');
      }
      navigate('/menu');
      return;
    }

    const combo = combos.find(c => c.id === parseInt(comboId));
    if (!combo) {
      // Solo mostrar toast en desktop
      if (!isMobile) {
        toast.error('Combo no encontrado');
      }
      navigate('/menu');
      return;
    }

    setSelectedCombo(combo);

    // Determinar primer paso basado en el combo
    const steps = getRequiredSteps(combo);

    if (steps.length > 0) {
      setCurrentStep(steps[0]);
    } else {
      console.error('❌ No se pudieron determinar los pasos del combo. Verifica que selectionSpec.rules exista.');
      // Solo mostrar toast en desktop
      if (!isMobile) {
        toast.error('El combo no tiene una configuración válida');
      }
      navigate('/menu');
    }
  }, [loading, combos, searchParams, navigate]);

  // Load persisted combo state
  useEffect(() => {
    const comboId = searchParams.get('comboId');
    if (!comboId) return;

    const savedState = getStorageItem(STORAGE_KEYS.COMBO_BUILDER, null);
    
    if (savedState && savedState.comboId === parseInt(comboId)) {
      // Restore state if it matches current combo
      if (savedState.currentStep !== null && savedState.currentStep !== undefined) {
        setCurrentStep(savedState.currentStep);
      }
      if (savedState.selections) {
        setSelections(savedState.selections);
      }
    }
  }, [searchParams]);

  // Save combo state on changes
  useEffect(() => {
    if (selectedCombo && currentStep !== null) {
      setStorageItem(STORAGE_KEYS.COMBO_BUILDER, {
        comboId: selectedCombo.id,
        currentStep,
        selections
      });
    }
  }, [selectedCombo, currentStep, selections]);

  // Determinar los pasos necesarios según el combo seleccionado
  const getRequiredSteps = (combo = selectedCombo) => {
    if (!combo) {
      console.warn('⚠️ getRequiredSteps: combo es null/undefined');
      return [];
    }

    if (!combo.selectionSpec) {
      console.warn('⚠️ getRequiredSteps: combo.selectionSpec es null/undefined', combo);
      return [];
    }

    if (!combo.selectionSpec.rules) {
      console.warn('⚠️ getRequiredSteps: combo.selectionSpec.rules es null/undefined', combo.selectionSpec);
      return [];
    }

    const components = combo.selectionSpec.rules;

    // Obtener los pasos iniciales
    const steps = components.map((c) => (c.categoryId));

    // Filtrar pasos que tienen productos disponibles
    const stepsWithProducts = steps.filter(categoryId => {
      const availableProducts = products.filter(p => p.category === categoryId);
      const hasProducts = availableProducts.length > 0;
      
      if (!hasProducts) {
        console.warn(`⚠️ Categoría ${categoryId} no tiene productos disponibles - se omitirá del flujo`);
      }
      
      return hasProducts;
    });

    // Ordenar pasos según lógica: Empanadas/Tradicionales/Especiales → Bebidas → Postres
    const orderedSteps = [...stepsWithProducts].sort((a, b) => {
      const getCategoryPriority = (catId) => {
        const category = categorias.find(c => c.id === catId);
        if (!category) return 999;
        
        const categoryName = category.name.toLowerCase();
        
        // Prioridad 1: Empanadas, Tradicionales, Especiales
        if (categoryName.includes('empanada') || 
            categoryName.includes('tradicional') || 
            categoryName.includes('especial')) {
          return 1;
        }
        
        // Prioridad 2: Bebidas
        if (categoryName.includes('bebida')) {
          return 2;
        }
        
        // Prioridad 3: Postres
        if (categoryName.includes('postre')) {
          return 3;
        }
        
        // Otros
        return 4;
      };

      return getCategoryPriority(a) - getCategoryPriority(b);
    });
    
    return orderedSteps;
  };

  const requiredSteps = getRequiredSteps();

  // Obtener nombre de categoría para el step actual
  const getCategoryNameForStep = (step) => {
    if (!selectedCombo || !selectedCombo.selectionSpec) return null;

    const { categoryIds, categoryNames } = selectedCombo.selectionSpec;

    if (!categoryIds || !categoryNames) return null;

    // Encontrar el índice del categoryId en el array
    const index = categoryIds.findIndex(id => id === step);

    if (index !== -1 && categoryNames[index]) {
      return categoryNames[index];
    }

    return null;
  };

  // Obtener pasos completados
  const getCompletedSteps = () => {
    return requiredSteps.filter(step => {
      const required = getRequiredQuantity(step);
      const stepSelections = selections[step] || {};
      const selected = Object.values(stepSelections).reduce((sum, qty) => sum + qty, 0);
      return selected >= required;
    });
  };

  // Obtener cantidad requerida para un paso
  const getRequiredQuantity = (step) => {
    if (!selectedCombo || !selectedCombo.selectionSpec.rules) return 0;

    const categoryIds = selectedCombo.selectionSpec.categoryIds.find((c) => c == step);
    return selectedCombo.selectionSpec.rules
      .filter(c => c.categoryId == categoryIds)
      .reduce((sum, c) => sum + c.units, 0);
  };

  // Agregar producto
  const handleProductAdd = (product) => {
    setSelections(prev => {
      const stepSelections = prev[currentStep] || {};
      return {
        ...prev,
        [currentStep]: {
          ...stepSelections,
          [product.id]: (stepSelections[product.id] || 0) + 1
        }
      };
    });
  };

  // Remover producto
  const handleProductRemove = (product) => {
    setSelections(prev => {
      const stepSelections = prev[currentStep] || {};
      const currentQuantity = stepSelections[product.id] || 0;
      if (currentQuantity <= 0) return prev;

      const newStepSelections = { ...stepSelections };
      if (currentQuantity === 1) {
        delete newStepSelections[product.id];
      } else {
        newStepSelections[product.id] = currentQuantity - 1;
      }

      return {
        ...prev,
        [currentStep]: newStepSelections
      };
    });
  };

  // Continuar al siguiente paso
  const handleContinue = () => {
    const currentIndex = requiredSteps.indexOf(currentStep);
    if (currentIndex < requiredSteps.length - 1) {
      setCurrentStep(requiredSteps[currentIndex + 1]);
      // Scroll to top en mobile
      if (isMobile) {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    }
  };

  // Volver al paso anterior
  const handleBack = () => {
    const currentIndex = requiredSteps.indexOf(currentStep);
    if (currentIndex > 0) {
      setCurrentStep(requiredSteps[currentIndex - 1]);
      if (isMobile) {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    } else {
      // Clear persisted state when returning to menu
      removeStorageItem(STORAGE_KEYS.COMBO_BUILDER);
      navigate('/menu');
    }
  };

  // Navegar a un paso específico (desde stepper)
  const handleStepClick = (step) => {
    setCurrentStep(step);
    if (isMobile) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  // Verificar si todos los pasos están completos
  const isComboComplete = () => {
    if (!selectedCombo) return false;

    return requiredSteps.every(step => {
      const required = getRequiredQuantity(step);
      const stepSelections = selections[step] || {};
      const selected = Object.values(stepSelections).reduce((sum, qty) => sum + qty, 0);
      return selected >= required;
    });
  };

  // Agregar al carrito
  const handleAddToCart = async () => {
    if (!isComboComplete()) {
      // Solo mostrar toast en desktop
      if (!isMobile) {
        toast.error('Por favor, completá todos los pasos del combo');
      }
      return;
    }

    setAddingToCart(true);

    try {
      // Preparar detalles del combo con nombres de productos
      const comboDetails = [];
      
      Object.entries(selections).forEach(([categoryType, items]) => {
        Object.entries(items).forEach(([productId, quantity]) => {
          if (quantity > 0) {
            const product = products.find(p => p.id === parseInt(productId));
            if (product) {
              comboDetails.push({
                productId: product.id,
                name: product.name,
                quantity,
                categoryType
              });
            }
          }
        });
      });

      // Agregar combo al carrito
      addItem(
        selectedCombo,
        1,
        { comboDetails },
        true // isCombo
      );

      // Clear persisted state after successful add
      removeStorageItem(STORAGE_KEYS.COMBO_BUILDER);

      // Navegar al carrito
      setTimeout(() => {
        navigate('/carrito');
      }, 500);

    } catch (error) {
      console.error('Error al agregar al carrito:', error);
      // Solo mostrar toast en desktop
      if (!isMobile) {
        toast.error('Error al agregar al carrito');
      }
    } finally {
      setAddingToCart(false);
    }
  };

  // Loading state
  if (loading || !selectedCombo) {
    return (
      <div className="min-h-screen bg-empanada-dark flex items-center justify-center">
        <LoadingSpinner size="xl" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-empanada-dark">
      {/* Header con botón volver */}
      <div className="bg-empanada-medium border-b border-empanada-light-gray sticky top-16 z-30">
        <div className={`${isMobile ? 'px-4 py-3' : 'container mx-auto px-6 py-4'}`}>
          <Button
            variant="ghost"
            onClick={() => navigate('/menu')}
            className="text-gray-400 hover:text-white"
            size={isMobile ? 'sm' : 'default'}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Volver al Menú
          </Button>
        </div>
      </div>

      {/* Layout principal */}
      <div className={isMobile ? '' : 'container mx-auto px-4 py-8'}>
        <div className={isMobile ? '' : 'flex gap-8'}>
          {/* Columna izquierda - Selección */}
          <div className={isMobile ? '' : 'flex-1'}>
            <AnimatePresence mode="wait">
              <motion.div
                key={`step-${currentStep}`}
                initial={{ opacity: 0, x: isMobile ? 0 : -20, y: isMobile ? 20 : 0 }}
                animate={{ opacity: 1, x: 0, y: 0 }}
                exit={{ opacity: 0, x: isMobile ? 0 : -20, y: isMobile ? -20 : 0 }}
                transition={{ duration: 0.3 }}
                className={isMobile ? 'pb-32' : ''}
              >
                <ProductStepSelector
                  categoryType={currentStep}
                  categoryName={getCategoryNameForStep(currentStep)}
                  products={products}
                  maxQuantity={getRequiredQuantity(currentStep)}
                  currentSelections={selections[currentStep] || {}}
                  onProductAdd={handleProductAdd}
                  onProductRemove={handleProductRemove}
                  loading={loading}
                  isMobile={isMobile}
                />
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Columna derecha - Resumen (sticky en desktop, bottom sheet en mobile) */}
          {isMobile ? (
            <ComboSummarySheet
              selectedCombo={selectedCombo}
              currentStep={currentStep}
              selections={selections}
              products={products}
              onContinue={handleContinue}
              onAddToCart={handleAddToCart}
              onBack={handleBack}
              isComplete={isComboComplete()}
              loading={addingToCart}
              requiredSteps={requiredSteps}
            />
          ) : (
            <div className="w-[400px] flex-shrink-0">
              <ComboSummaryPanel
                selectedCombo={selectedCombo}
                currentStep={currentStep}
                selections={selections}
                products={products}
                onContinue={handleContinue}
                onAddToCart={handleAddToCart}
                onBack={handleBack}
                isComplete={isComboComplete()}
                loading={addingToCart}
                requiredSteps={requiredSteps}
              />
            </div>
          )}
        </div>
      </div>

    </div>
  );
}

