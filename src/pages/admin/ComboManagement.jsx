/* eslint-disable react-hooks/exhaustive-deps */

// CORE
import { useState, useEffect, useMemo } from "react";

// EXTERNO
import { toast } from "sonner";

// COMPONENTES
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Portal } from "@/components/common/Portal";
import { SectionHeader, StatsCards, CustomSelect, BrandedModal, BrandedModalFooter } from "@/components/branding";
import { useConfirmModal } from "@/components/common/ConfirmModal";

// ICONOS
import {
    Search,
    Edit,
    Trash2,
    ShoppingCart,
    Plus,
    Package,
    DollarSign,
    Percent,
    X,
    Save,
    Minus,
    RefreshCw,
    Eye
} from "lucide-react";

// PROVIDERS
import { useAdminData } from "@/context/AdminDataProvider";
import { useSession } from "@/context/SessionProvider";

// UTILIDADES
import { formatPrice } from "@/lib/utils";

export function ComboManagement() {
    const {
        sucursalSeleccionada,
        productos,
        combos,
        adminDataLoading: loading,
        callCombos,
        callCrearCombo,
        callBorrarCombo,
        categoriasTodas: categories,
    } = useAdminData();

    const session = useSession();

    const [searchTerm, setSearchTerm] = useState("");
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [editingCombo, setEditingCombo] = useState(null);
    const [comboForm, setComboForm] = useState({
        name: "",
        description: "",
        products: [],
        discount: 0,
        price: 0,
        active: true
    });
    const [productSearchTerm, setProductSearchTerm] = useState("");

    // Builder de Combo: categorías primero
    const [categoryRequirements, setCategoryRequirements] = useState([]); // [{ categoryId, name, requiredQuantity }]
    const [selectedByCategory, setSelectedByCategory] = useState({}); // { [categoryId]: [{ id, name, price, quantity }] }
    const [searchByCategory, setSearchByCategory] = useState({}); // { [categoryId]: string }

    const categoryOptions = useMemo(() => (
        (categories || []).map(c => ({ value: c.id, label: c.name }))
    ), [categories]);

    const remainingByCategory = useMemo(() => {
        const remaining = {};
        for (const req of categoryRequirements) {
            const sel = selectedByCategory[req.categoryId] || [];
            const selectedCount = sel.reduce((sum, p) => sum + (Number(p.quantity) || 0), 0);
            remaining[req.categoryId] = Math.max(0, (Number(req.requiredQuantity) || 0) - selectedCount);
        }
        return remaining;
    }, [categoryRequirements, selectedByCategory]);

    const allSelectedProducts = useMemo(() => {
        return Object.values(selectedByCategory).flat();
    }, [selectedByCategory]);

    // Hooks para modales
    const { openModal: openConfirmModal, ConfirmModalComponent } = useConfirmModal();

    // Mock data para combos
    // const mockCombos = [
    //     {
    //         id: "combo-001",
    //         name: "Combo Familiar",
    //         description: "4 empanadas de carne + 2 de pollo + gaseosa",
    //         products: [
    //             { id: "prod-001", name: "Empanada de Carne", quantity: 4, price: 1200 },
    //             { id: "prod-002", name: "Empanada de Pollo", quantity: 2, price: 1100 },
    //             { id: "prod-005", name: "Gaseosa 500ml", quantity: 1, price: 800 }
    //         ],
    //         originalPrice: 8000,
    //         discount: 15,
    //         price: 6800,
    //         active: true,
    //         createdAt: "2024-01-15T10:30:00Z"
    //     },
    //     {
    //         id: "combo-002",
    //         name: "Combo Individual",
    //         description: "2 empanadas + bebida",
    //         products: [
    //             { id: "prod-001", name: "Empanada de Carne", quantity: 1, price: 1200 },
    //             { id: "prod-003", name: "Empanada Vegetariana", quantity: 1, price: 950 },
    //             { id: "prod-006", name: "Agua 500ml", quantity: 1, price: 500 }
    //         ],
    //         originalPrice: 2650,
    //         discount: 10,
    //         price: 2385,
    //         active: true,
    //         createdAt: "2024-01-14T14:20:00Z"
    //     }
    // ];

    // Cargar datos mock al inicializar
    // useEffect(() => {
    //     setCombos(mockCombos);
    //     setLoading(false);
    // }, []);

    // Filtrar combos por término de búsqueda
    const filteredCombos = combos.filter(combo =>
        combo.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        combo.description.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleCreateCombo = () => {
        setEditingCombo(null);
        setComboForm({
            name: "",
            description: "",
            products: [],
            discount: 0,
            price: 0,
            active: true
        });
        setProductSearchTerm("");
        setShowCreateModal(true);
    };

    const handleEditCombo = (combo) => {
        if (!combo) {
            toast.error("Combo no válido para editar");
            return;
        }

        setEditingCombo(combo);
        setComboForm({
            name: combo.name || "",
            description: combo.description || "",
            products: combo.products ? [...combo.products] : [], // Crear copia para evitar mutación
            discount: combo.discount || 0,
            price: combo.price || 0,
            active: combo.active !== undefined ? combo.active : true
        });
        setProductSearchTerm("");
        setShowCreateModal(true);
    };

    const handleDeleteCombo = (comboId) => {
        openConfirmModal({
            title: "Eliminar Combo",
            message: "¿Estás seguro de que quieres eliminar este combo?",
            type: "danger",
            confirmText: "Eliminar",
            onConfirm: async () => {
                await callBorrarCombo({
                    _id: comboId,
                    _accessToken: session.userData.accessToken,
                })
                toast.success("Combo eliminado correctamente");
                callCombos(session.userData.accessToken);
            }
        });
    };

    const handleAddProductToCombo = (selectedProduct) => {
        if (!selectedProduct) {
            toast.error("Producto no válido");
            return;
        }

        // Verificar si el producto ya está en el combo
        const existingProductIndex = comboForm.products.findIndex(p => p.id === selectedProduct.id);

        if (existingProductIndex !== -1) {
            // Si ya existe, incrementar la cantidad
            const updatedProducts = [...comboForm.products];
            updatedProducts[existingProductIndex] = {
                ...updatedProducts[existingProductIndex],
                quantity: updatedProducts[existingProductIndex].quantity + 1
            };

            setComboForm(prev => ({
                ...prev,
                products: updatedProducts
            }));
            calculateComboPrice(updatedProducts, comboForm.discount);
            toast.success(`${selectedProduct.name} agregado (cantidad: ${updatedProducts[existingProductIndex].quantity})`);
        } else {
            // Si no existe, agregarlo
            const newProduct = {
                id: selectedProduct.id,
                name: selectedProduct.name,
                quantity: 1,
                price: selectedProduct.price || 1000
            };

            const updatedProducts = [...comboForm.products, newProduct];
            setComboForm(prev => ({
                ...prev,
                products: updatedProducts
            }));
            calculateComboPrice(updatedProducts, comboForm.discount);
            toast.success(`${selectedProduct.name} agregado al combo`);
        }
    };

    const handleRemoveProductFromCombo = (index) => {
        const productName = comboForm.products[index]?.name;
        const updatedProducts = comboForm.products.filter((_, i) => i !== index);

        setComboForm(prev => ({
            ...prev,
            products: updatedProducts
        }));
        calculateComboPrice(updatedProducts, comboForm.discount);

        if (productName) {
            toast.success(`${productName} removido del combo`);
        }
    };

    const handleProductChange = (index, field, value) => {
        if (index < 0 || index >= comboForm.products.length) {
            toast.error("Índice de producto inválido");
            return;
        }

        const updatedProducts = [...comboForm.products];

        // Validaciones específicas por campo
        if (field === 'quantity') {
            const numValue = parseInt(value);
            if (isNaN(numValue) || numValue < 1) {
                toast.error("La cantidad debe ser mayor a 0");
                return;
            }
            updatedProducts[index] = { ...updatedProducts[index], [field]: numValue };
        } else if (field === 'price') {
            const numValue = parseFloat(value);
            if (isNaN(numValue) || numValue < 0) {
                toast.error("El precio debe ser mayor o igual a 0");
                return;
            }
            updatedProducts[index] = { ...updatedProducts[index], [field]: numValue };
        } else if (field === 'id') {
            if (!value) {
                toast.error("Debe seleccionar un producto");
                return;
            }
            const selectedProduct = productos?.find(p => p.id === value);
            if (selectedProduct) {
                updatedProducts[index] = {
                    ...updatedProducts[index],
                    id: value,
                    name: selectedProduct.name,
                    price: selectedProduct.price || 1000
                };
                toast.success(`Producto cambiado a ${selectedProduct.name}`);
            } else {
                toast.error("Producto no encontrado");
                return;
            }
        } else {
            updatedProducts[index] = { ...updatedProducts[index], [field]: value };
        }

        setComboForm(prev => ({
            ...prev,
            products: updatedProducts
        }));
        calculateComboPrice(updatedProducts, comboForm.discount);
    };

    const calculateOriginalPrice = (combo) => {
        const originalPrice = combo.components.reduce((sum, product) => {
            const price = parseFloat(product.price) || 0;
            const quantity = parseInt(product.quantity) || 0;
            return sum + (price * quantity);
        }, 0);

        return originalPrice;
    }

    const calculateDiscountPrice = (combo) => {
        const originalPrice = calculateOriginalPrice(combo);
        const discountValue = (1 - (combo.price / originalPrice)) * 100;

        return discountValue.toFixed(2);
    }

    const calculateComboPrice = (products, discount) => {
        if (!products || products.length === 0) {
            setComboForm(prev => ({
                ...prev,
                price: 0
            }));
            return;
        }

        const originalPrice = products.reduce((sum, product) => {
            const price = parseFloat(product.price) || 0;
            const quantity = parseInt(product.quantity) || 0;
            return sum + (price * quantity);
        }, 0);

        const discountPercent = parseFloat(discount) || 0;
        const discountAmount = (originalPrice * discountPercent) / 100;
        const finalPrice = originalPrice - discountAmount;

        setComboForm(prev => ({
            ...prev,
            price: Math.round(Math.max(0, finalPrice)) // Asegurar que no sea negativo
        }));
    };

    const handleDiscountChange = (discount) => {
        const numDiscount = parseFloat(discount) || 0;

        if (numDiscount < 0) {
            toast.error("El descuento no puede ser negativo");
            return;
        }

        if (numDiscount > 100) {
            toast.error("El descuento no puede ser mayor al 100%");
            return;
        }

        setComboForm(prev => ({
            ...prev,
            discount: numDiscount
        }));
        calculateComboPrice(comboForm.products, numDiscount);
    };

    // Recalcular precio en base a la selección por categorías
    useEffect(() => {
        calculateComboPrice(allSelectedProducts, comboForm.discount);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [allSelectedProducts, comboForm.discount]);

    const handleSaveCombo = async () => {
        // Validaciones
        if (!comboForm.name.trim()) {
            toast.error("El nombre del combo es requerido");
            return;
        }

        if (allSelectedProducts.length === 0) {
            toast.error("Debe agregar productos al combo según las categorías definidas");
            return;
        }

        // Validar que todos los productos tengan datos válidos
        const invalidProduct = allSelectedProducts.find(product =>
            !product.id || !product.name || product.quantity < 1 || product.price < 0
        );

        if (invalidProduct) {
            toast.error("Todos los productos deben tener datos válidos");
            return;
        }

        // Calcular precio original
        const originalPrice = allSelectedProducts.reduce((sum, product) => {
            const price = parseFloat(product.price) || 0;
            const quantity = parseInt(product.quantity) || 0;
            return sum + (price * quantity);
        }, 0);

        const comboData = {
            ...comboForm,
            id: editingCombo?.id || `combo-${Date.now()}`,
            originalPrice: Math.round(originalPrice),
            createdAt: editingCombo?.createdAt || new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };

        try {
            if (editingCombo) {
                setCombos(prev => prev.map(combo =>
                    combo.id === editingCombo.id ? comboData : combo
                ));
                toast.success("Combo actualizado correctamente");
            } else {
                const newComponents = allSelectedProducts.map((component) => ({
                    productId: component.id,
                    quantity: component.quantity,
                }));
                const newCombo = {
                    code: `MAT-${Date.now()}`,
                    name: comboData.name,
                    description: comboData.description,
                    price: comboData.price,
                    active: true,
                    categoryId: 100,
                    components: newComponents,
                    imageBase64: ""
                }

                await callCrearCombo({
                    _combo: newCombo,
                    _accessToken: session.userData.accessToken,
                });
                toast.success("Combo creado correctamente");
                callCombos(session.userData.accessToken);
            }

            // Limpiar el formulario
            setShowCreateModal(false);
            setEditingCombo(null);
            setProductSearchTerm("");
            setCategoryRequirements([]);
            setSelectedByCategory({});
            setSearchByCategory({});
        } catch (error) {
            console.error("Error al guardar combo:", error);
            toast.error("Error al guardar el combo");
        }
    };

    // Filtrar productos disponibles para el buscador
    const getAvailableProductsForCategory = (categoryId, term) => {
        if (!productos || !Array.isArray(productos)) return [];
        const q = (term || "").trim().toLowerCase();
        return productos.filter(product => (
            (!q || product?.name?.toLowerCase().includes(q) || product?.description?.toLowerCase().includes(q)) &&
            String(product?.category) == String(categoryId)
        ));
    };

    const addCategoryRow = () => {
        setCategoryRequirements(prev => ([...prev, { categoryId: null, name: '', requiredQuantity: 1 }]));
    };

    const removeCategoryRow = (index) => {
        const toRemove = categoryRequirements[index];
        setCategoryRequirements(prev => prev.filter((_, i) => i !== index));
        if (toRemove?.categoryId) {
            setSelectedByCategory(prev => {
                const copy = { ...prev };
                delete copy[toRemove.categoryId];
                return copy;
            });
        }
    };

    const updateCategoryRow = (index, field, value) => {
        setCategoryRequirements(prev => prev.map((row, i) => i === index ? { ...row, [field]: value, ...(field === 'categoryId' ? { name: (categories || []).find(c => String(c.id) === String(value))?.name || '' } : {}) } : row));
    };

    const handleAdjustQuantity = (categoryId, product, delta) => {
        setSelectedByCategory(prev => {
            const list = [...(prev[categoryId] || [])];
            const idx = list.findIndex(p => p.id === product.id);
            const remaining = remainingByCategory[categoryId] ?? 0;
            if (idx === -1 && delta > 0 && remaining > 0) {
                list.push({ id: product.id, name: product.name, price: product.price, quantity: 1 });
            } else if (idx >= 0) {
                const current = list[idx].quantity;
                let next = current + delta;
                if (next <= 0) {
                    list.splice(idx, 1);
                } else {
                    const cap = current + remaining;
                    next = Math.min(next, cap);
                    list[idx] = { ...list[idx], quantity: next };
                }
            }
            return { ...prev, [categoryId]: list };
        });
    };


    // Preparar datos para StatsCards
    const statsData = [
        {
            id: "total-combos",
            label: "Total Combos",
            value: combos.length,
            color: "gray",
            icon: <ShoppingCart className="w-5 h-5" />
        },
        {
            id: "combos-activos",
            label: "Combos Activos",
            value: combos.filter(combo => combo.active).length,
            color: "green",
            icon: <Eye className="w-5 h-5" />
        },
        {
            id: "ahorro-promedio",
            label: "Descuento Promedio",
            value: combos.length > 0 ? `${Math.round(combos.reduce((sum, combo) => sum + combo.discount, 0) / combos.length)}%` : "0%",
            color: "gray",
            icon: <Percent className="w-5 h-5" />
        },
        {
            id: "valor-total",
            label: "Valor Total Combos",
            value: formatPrice(combos.reduce((sum, combo) => sum + combo.price, 0)),
            color: "gray",
            icon: <DollarSign className="w-5 h-5" />
        }
    ];

    // Preparar datos para SectionHeader
    const headerActions = [
        {
            label: "Crear Combo",
            variant: "empanada",
            className: "h-9 px-4 text-sm font-medium",
            onClick: handleCreateCombo,
            icon: <Plus className="w-4 h-4 mr-2" />
        },
        {
            label: "Actualizar",
            variant: "outline",
            className: "h-9 px-4 text-sm font-medium",
            onClick: () => {
                callCombos(session.userData.accessToken);
            },
            icon: <RefreshCw className="w-4 h-4 mr-2" />
        }
    ];

    return (
        <div className="space-y-6">
            {/* Header usando SectionHeader */}
            <SectionHeader
                title="Gestión de Combos"
                subtitle={`Crea y gestiona combos de productos${sucursalSeleccionada ? ` - ${sucursalSeleccionada.name}` : ''}`}
                icon={<ShoppingCart className="w-6 h-6" />}
                actions={headerActions}
            />

            {/* Stats usando StatsCards */}
            <StatsCards stats={statsData} />

            {/* Tabla de Combos */}
            <Card>
                <CardContent>
                    {/* Barra de búsqueda */}
                    <div className="my-6">
                        <div className="relative max-w-md">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                            <Input
                                placeholder="Buscar combos por nombre o descripción..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="pl-10"
                            />
                        </div>
                    </div>

                    {loading ? (
                        <div className="space-y-4">
                            {[1, 2, 3].map(i => (
                                <div key={i} className="animate-pulse">
                                    <div className="bg-gray-200 h-24 rounded-lg" />
                                </div>
                            ))}
                        </div>
                    ) : filteredCombos.length === 0 ? (
                        <div className="text-center py-12">
                            <ShoppingCart className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                            <h3 className="text-xl font-semibold mb-2">
                                {searchTerm ? 'No se encontraron combos' : 'No hay combos creados'}
                            </h3>
                            <p className="text-muted-foreground mb-4">
                                {searchTerm
                                    ? 'Intenta con otro término de búsqueda'
                                    : 'Crea tu primer combo para ofrecer mejores precios a tus clientes'
                                }
                            </p>
                            {!searchTerm && (
                                <Button onClick={handleCreateCombo} className="bg-empanada-golden hover:bg-empanada-golden/90">
                                    <Plus className="w-4 h-4 mr-2" />
                                    Crear Primer Combo
                                </Button>
                            )}
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {filteredCombos.map((combo) => (
                                <Card key={combo.id} className="hover:shadow-md transition-shadow">
                                    <CardContent className="p-6">
                                        <div className="flex justify-between items-start">
                                            <div className="flex-1">
                                                <div className="flex items-center gap-3 mb-2">
                                                    <h3 className="text-lg font-semibold">{combo.name}</h3>
                                                    <Badge variant={combo.active ? "default" : "secondary"}>
                                                        {combo.active ? "Activo" : "Inactivo"}
                                                    </Badge>
                                                    <Badge variant="outline" className="text-green-600">
                                                        -{calculateDiscountPrice(combo)}%
                                                    </Badge>
                                                </div>

                                                <p className="text-sm text-muted-foreground mb-4">
                                                    {combo.description}
                                                </p>

                                                <div className="space-y-2">
                                                    <p className="text-sm font-medium text-empanada-golden">Productos incluidos:</p>
                                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
                                                        {combo.components.map((product, index) => (
                                                            <div key={index} className="text-sm bg-gray-50 dark:bg-empanada-dark rounded px-3 py-2">
                                                                <span className="font-medium">{product.quantity}x {product.productName}</span>
                                                                <span className="text-muted-foreground block">
                                                                    {formatPrice(product.price)} c/u
                                                                </span>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>

                                                <div className="flex items-center gap-6 mt-4">
                                                    <div>
                                                        <p className="text-sm text-muted-foreground">Precio original</p>
                                                        <p className="text-lg line-through text-gray-500">
                                                            {formatPrice(calculateOriginalPrice(combo))}
                                                        </p>
                                                    </div>
                                                    <div>
                                                        <p className="text-sm text-muted-foreground">Precio combo</p>
                                                        <p className="text-xl font-bold text-empanada-golden">
                                                            {formatPrice(combo.price)}
                                                        </p>
                                                    </div>
                                                    <div>
                                                        <p className="text-sm text-muted-foreground">Ahorro</p>
                                                        <p className="text-lg font-semibold text-green-600">
                                                            {formatPrice(calculateOriginalPrice(combo) - combo.price)}
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="flex flex-col gap-2 ml-4">
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={() => handleEditCombo(combo)}
                                                >
                                                    <Edit className="w-4 h-4 mr-2" />
                                                    Editar
                                                </Button>
                                                <Button
                                                    variant="destructive"
                                                    size="sm"
                                                    onClick={() => handleDeleteCombo(combo.id)}
                                                >
                                                    <Trash2 className="w-4 h-4 mr-2" />
                                                    Eliminar
                                                </Button>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* Modal de crear/editar combo */}
            <BrandedModal
                isOpen={showCreateModal}
                onClose={() => {
                    setShowCreateModal(false);
                    setEditingCombo(null);
                    setProductSearchTerm("");
                }}
                title={editingCombo ? 'Editar Combo' : 'Crear Nuevo Combo'}
                subtitle="Configure los productos y el descuento para el combo"
                icon={<ShoppingCart className="w-5 h-5" />}
                footer={
                    <BrandedModalFooter
                        onCancel={() => {
                            setShowCreateModal(false);
                            setEditingCombo(null);
                            setProductSearchTerm("");
                        }}
                        onConfirm={handleSaveCombo}
                        confirmText={editingCombo ? 'Actualizar Combo' : 'Crear Combo'}
                        confirmIcon={<Save className="w-4 h-4" />}
                        isConfirmDisabled={!comboForm.name.trim() || comboForm.products.length === 0}
                    />
                }
            >
                <div className="space-y-6">
                    {/* Información Básica */}
                    <Card className="">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2 text-gray-900 dark:text-white">
                                <ShoppingCart className="w-5 h-5" />
                                Información Básica
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-white">Nombre del Combo *</label>
                                    <Input
                                        value={comboForm.name}
                                        onChange={(e) => setComboForm(prev => ({ ...prev, name: e.target.value }))}
                                        placeholder="Ej: Combo Familiar"
                                        className="admin-input"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-white">Descripción</label>
                                    <Input
                                        value={comboForm.description}
                                        onChange={(e) => setComboForm(prev => ({ ...prev, description: e.target.value }))}
                                        placeholder="Describe que incluye el combo"
                                        className="admin-input"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-white">Descuento (%)</label>
                                    <Input
                                        type="number"
                                        value={comboForm.discount}
                                        onChange={(e) => handleDiscountChange(parseFloat(e.target.value) || 0)}
                                        min="0"
                                        max="50"
                                        placeholder="15"
                                        className="admin-input"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-white">Precio Final</label>
                                    <Input
                                        type="number"
                                        value={comboForm.price}
                                        onChange={(e) => setComboForm(prev => ({ ...prev, price: parseFloat(e.target.value) || 0 }))}
                                        min="0"
                                        placeholder="Precio personalizado del combo"
                                        className="admin-input"
                                    />
                                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                                        Puedes ajustar manualmente el precio final del combo
                                    </p>
                                </div>
                            </div>
                            <div className="mt-4">
                                <label className="flex items-center gap-2 text-gray-700 dark:text-white">
                                    <input
                                        type="checkbox"
                                        id="active"
                                        checked={comboForm.active}
                                        onChange={(e) => setComboForm(prev => ({ ...prev, active: e.target.checked }))}
                                        className="rounded border-gray-300 dark:border-empanada-light-gray"
                                    />
                                    Combo activo
                                </label>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Combo */}
                    <Card className="">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2 text-gray-900 dark:text-white">
                                <Package className="w-5 h-5" />
                                Combo
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            {/* Categorías del Combo */}
                            <div className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <h4 className="text-sm font-semibold text-gray-900 dark:text-white">Categorías del Combo</h4>
                                    <Button size="sm" variant="outline" onClick={addCategoryRow}>
                                        <Plus className="w-4 h-4 mr-2" />Agregar categoría
                                    </Button>
                                </div>

                                {categoryRequirements.length === 0 && (
                                    <p className="text-xs text-muted-foreground">Agrega una o más categorías y define cuántos productos debe elegir el cliente en cada una.</p>
                                )}

                                <div className="space-y-2">
                                    {categoryRequirements.map((row, idx) => (
                                        <div key={idx} className="grid grid-cols-1 md:grid-cols-3 gap-3 items-center">
                                            <div>
                                                <label className="block text-xs font-medium mb-1 text-gray-700 dark:text-white">Categoría</label>
                                                <CustomSelect
                                                    value={row.categoryId}
                                                    onChange={(val) => updateCategoryRow(idx, 'categoryId', val)}
                                                    options={categoryOptions}
                                                    placeholder="Seleccionar categoría"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-xs font-medium mb-1 text-gray-700 dark:text-white">Cantidad requerida</label>
                                                <Input
                                                    type="number"
                                                    min="1"
                                                    value={row.requiredQuantity}
                                                    onChange={(e) => updateCategoryRow(idx, 'requiredQuantity', Math.max(1, parseInt(e.target.value) || 1))}
                                                    className="admin-input"
                                                />
                                            </div>
                                            <div className="flex items-end justify-end">
                                                <Button variant="ghost" size="icon" onClick={() => removeCategoryRow(idx)} className="text-red-500">
                                                    <Trash2 className="w-4 h-4" />
                                                </Button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Productos por categoría */}
                            {categoryRequirements.length > 0 && (
                                <div className="space-y-6 mt-6">
                                    {categoryRequirements.filter(r => r.categoryId).map((req) => {
                                        const available = getAvailableProductsForCategory(req.categoryId, searchByCategory[req.categoryId] || '');
                                        const remaining = remainingByCategory[req.categoryId] ?? 0;
                                        const selected = selectedByCategory[req.categoryId] || [];
                                        return (
                                            <div key={req.categoryId} className="border rounded-lg p-4 bg-gray-50 dark:bg-empanada-dark">
                                                <div className="flex items-center justify-between mb-3">
                                                    <h5 className="text-sm font-semibold text-gray-900 dark:text-white">{req.name || 'Categoría'} — <span className="font-normal">{selected.reduce((s,p)=>s+p.quantity,0)} / {req.requiredQuantity}</span></h5>
                                                    <div className="relative w-80 max-w-full">
                                                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                                                        <Input
                                                            value={searchByCategory[req.categoryId] || ''}
                                                            onChange={(e) => setSearchByCategory(prev => ({ ...prev, [req.categoryId]: e.target.value }))}
                                                            placeholder={`Buscar productos de ${req.name || 'categoría'}...`}
                                                            className="pl-10"
                                                        />
                                                    </div>
                                                </div>

                                                {/* Lista de productos disponibles */}
                                                <div className="space-y-2 max-h-48 overflow-y-auto">
                                                    {available.length === 0 ? (
                                                        <p className="text-xs text-muted-foreground text-center py-4">No hay productos disponibles</p>
                                                    ) : available.map(product => {
                                                        const current = (selected.find(p => p.id === product.id)?.quantity) || 0;
                                                        return (
                                                            <div key={product.id} className="flex items-center justify-between p-2 border rounded-lg hover:bg-gray-100 dark:hover:bg-empanada-medium">
                                                                <div className="flex-1">
                                                                    <div className="font-medium text-sm">{product.name}</div>
                                                                    <div className="text-xs text-muted-foreground">{formatPrice(product.price || 0)}</div>
                                                                </div>
                                                                <div className="flex items-center gap-2">
                                                                    <Button size="sm" variant="outline" className="h-6 w-6 p-0" disabled={current<=0} onClick={() => handleAdjustQuantity(req.categoryId, product, -1)}>
                                                                        <Minus className="w-3 h-3" />
                                                                    </Button>
                                                                    <span className="w-8 text-center text-sm">{current}</span>
                                                                    <Button size="sm" variant="outline" className="h-6 w-6 p-0" disabled={remaining<=0} onClick={() => handleAdjustQuantity(req.categoryId, product, +1)}>
                                                                        <Plus className="w-3 h-3" />
                                                                    </Button>
                                                                </div>
                                                            </div>
                                                        );
                                                    })}
                                                </div>
                                                {remaining <= 0 && (
                                                    <p className="text-xs text-green-600 mt-2">Cupo completo para esta categoría.</p>
                                                )}
                                            </div>
                                        );
                                    })}
                                </div>
                            )}

                            {/* Resumen de precios */}
                            {allSelectedProducts.length > 0 && (
                                <div className="space-y-2 p-4 bg-gray-50 dark:bg-empanada-dark rounded-lg mt-6">
                                    <div className="flex justify-between text-sm">
                                        <span>Precio original:</span>
                                        <span>{formatPrice(allSelectedProducts.reduce((sum, p) => sum + (p.price * p.quantity), 0))}</span>
                                    </div>
                                    <div className="flex justify-between text-sm text-green-600">
                                        <span>Descuento ({comboForm.discount}%):</span>
                                        <span>-{formatPrice((allSelectedProducts.reduce((sum, p) => sum + (p.price * p.quantity), 0) * comboForm.discount) / 100)}</span>
                                    </div>
                                    <div className="flex justify-between font-bold text-empanada-golden border-t pt-2">
                                        <span>Precio final:</span>
                                        <span>{formatPrice(comboForm.price)}</span>
                                    </div>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </BrandedModal>

            {/* Modales */}
            <ConfirmModalComponent />
        </div>
    );
}