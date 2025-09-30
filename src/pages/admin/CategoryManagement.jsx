import { useState } from "react";
import {
    Search,
    Plus,
    Edit,
    Trash2,
    Tag,
    Package,
    RefreshCcw,
    Save,
    X
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useConfirmModal } from "@/components/common/ConfirmModal";
import { SectionHeader, StatsCards, BrandedModal, BrandedModalFooter } from "@/components/branding";
import { toast } from "sonner";

import { useAdminData } from "@/context/AdminDataProvider";
import { useSession } from "@/context/SessionProvider";

export function CategoryManagement() {
    const {
        categoriasTodas: categories,
        productos: products,
        adminDataLoading: loading,
        callCategorias,
        callCrearCategoria,
        callActualizarCategoria,
        callEliminarCategoria,
    } = useAdminData();

    const session = useSession();

    const [searchTerm, setSearchTerm] = useState("");
    const [showAddModal, setShowAddModal] = useState(false);
    const [editingCategory, setEditingCategory] = useState(null);

    // Hooks para modales
    const { openModal: openConfirmModal, ConfirmModalComponent } = useConfirmModal();

    // Filtrar categorías por búsqueda
    const filteredCategories = categories?.filter(category =>
        category.name.toLowerCase().includes(searchTerm.toLowerCase())
    ) || [];

    // Contar productos por categoría
    const getProductCount = (categoryId) => {
        return products?.filter(p => p.category == categoryId).length || 0;
    };

    // Estadísticas
    const stats = [
        {
            id: "total-categories",
            label: "Total Categorías",
            value: categories?.length || 0,
            color: "gray",
            icon: <Tag className="w-5 h-5" />
        },
        {
            id: "total-products",
            label: "Total Productos",
            value: products?.length || 0,
            color: "gray",
            icon: <Package className="w-5 h-5" />
        }
    ];

    // Agregar categoría
    const handleAddCategory = () => {
        setEditingCategory(null);
        setShowAddModal(true);
    };

    // Editar categoría
    const handleEditCategory = (category) => {
        setEditingCategory(category);
        setShowAddModal(true);
    };

    // Guardar categoría (crear o actualizar)
    const handleSaveCategory = async (categoryData) => {
        try {
            if (editingCategory) {
                // Actualizar
                await callActualizarCategoria({
                    _category: {
                        ...categoryData,
                        id: editingCategory.id
                    },
                    _accessToken: session.userData.accessToken
                });
                toast.success(`Categoría "${categoryData.name}" actualizada correctamente`);
            } else {
                // Crear
                await callCrearCategoria({
                    _category: categoryData,
                    _accessToken: session.userData.accessToken
                });
                toast.success(`Categoría "${categoryData.name}" creada correctamente`);
            }

            setShowAddModal(false);
            setEditingCategory(null);
            // Recargar categorías y productos
            await callCategorias(session.userData.accessToken);
        } catch (error) {
            console.error('Error al guardar categoría:', error);
            toast.error("Error al guardar la categoría");
        }
    };

    // Eliminar categoría
    const handleDeleteCategory = (category) => {
        const productCount = getProductCount(category.id);

        if (productCount > 0) {
            toast.error(`No se puede eliminar la categoría "${category.name}" porque tiene ${productCount} producto(s) asociado(s)`);
            return;
        }

        openConfirmModal({
            title: "Eliminar Categoría",
            message: `¿Estás seguro de que quieres eliminar la categoría "${category.name}"? Esta acción no se puede deshacer.`,
            type: "danger",
            confirmText: "Eliminar",
            onConfirm: async () => {
                try {
                    await callEliminarCategoria({
                        _id: category.id,
                        _accessToken: session.userData.accessToken
                    });
                    toast.success(`Categoría "${category.name}" eliminada correctamente`);
                    // Recargar categorías
                    await callProductosYCategorias(session.userData.accessToken);
                } catch (error) {
                    console.error('Error al eliminar categoría:', error);
                    toast.error("Error al eliminar la categoría");
                }
            }
        });
    };

    // Acciones del header
    const headerActions = [
        {
            label: "Agregar Categoría",
            disabled: true,
            variant: "empanada",
            className: "h-9 px-4 text-sm font-medium",
            onClick: handleAddCategory,
            icon: <Plus className="w-4 h-4 mr-2" />
        },
        {
            label: "Actualizar",
            variant: "outline",
            className: "h-9 px-4 text-sm font-medium",
            // onClick: () => callProductosYCategorias(session.userData.accessToken),
            icon: <RefreshCcw className="w-4 h-4 mr-2" />
        },
    ];

    return (
        <div className="space-y-6">
            {/* Header */}
            <SectionHeader
                title="Gestión de Categorías"
                subtitle="Administra las categorías de productos"
                icon={<Tag className="w-6 h-6" />}
                actions={headerActions}
            />

            {/* Stats */}
            <StatsCards stats={stats} />

            {/* Tabla de Categorías */}
            <Card className="">
                <CardContent>
                    {/* Barra de búsqueda */}
                    <div className="my-6">
                        <div className="flex gap-4 items-center">
                            <div className="flex-1 relative">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                                <Input
                                    placeholder="Buscar por nombre..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="pl-10"
                                />
                            </div>
                        </div>
                    </div>

                    {loading ? (
                        <div className="space-y-4">
                            {[1, 2, 3, 4, 5].map(i => (
                                <div key={i} className="animate-pulse">
                                    <div className="bg-gray-200 h-16 rounded-lg" />
                                </div>
                            ))}
                        </div>
                    ) : filteredCategories.length === 0 ? (
                        <div className="text-center py-12">
                            <Tag className="w-16 h-16 mx-auto text-gray-300 mb-4" />
                            <p className="text-gray-500 dark:text-gray-400 text-lg font-medium">
                                {searchTerm ? "No se encontraron categorías" : "No hay categorías"}
                            </p>
                            {!searchTerm && (
                                <Button
                                    variant="empanada"
                                    onClick={handleAddCategory}
                                    className="mt-4"
                                >
                                    <Plus className="w-4 h-4 mr-2" />
                                    Agregar Primera Categoría
                                </Button>
                            )}
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead>
                                    <tr className="border-b">
                                        <th className="text-left p-4 font-medium">Categoría</th>
                                        <th className="text-center p-4 font-medium">Productos</th>
                                        {/* <th className="text-left p-4 font-medium">Acciones</th> */}
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredCategories.map((category) => {
                                        const productCount = getProductCount(category.id);
                                        return (
                                            <tr
                                                key={category.id}
                                                className="border-b admin-table-row"
                                            >
                                                <td className="p-4">
                                                    <div className="flex items-center gap-2">
                                                        <Tag className="w-4 h-4 text-empanada-golden" />
                                                        <span className="font-medium">{category.name}</span>
                                                    </div>
                                                </td>
                                                <td className="p-4 text-center">
                                                    <Badge variant={productCount > 0 ? "empanada" : "outline"}>
                                                        {productCount} {productCount === 1 ? 'producto' : 'productos'}
                                                    </Badge>
                                                </td>
                                                {/* <td className="p-4" style={{ width: '1px' }}>
                                                    <div className="flex gap-2">
                                                        <Button
                                                            variant="outline"
                                                            size="sm"
                                                            onClick={() => handleEditCategory(category)}
                                                            disabled
                                                        >
                                                            <Edit className="w-4 h-4" />
                                                        </Button>
                                                        <Button
                                                            variant="destructive"
                                                            size="sm"
                                                            onClick={() => handleDeleteCategory(category)}
                                                            disabled
                                                        >
                                                            <Trash2 className="w-4 h-4" />
                                                        </Button>
                                                    </div>
                                                </td> */}
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* Modal de Agregar/Editar */}
            {showAddModal && (
                <CategoryModal
                    category={editingCategory}
                    onClose={() => {
                        setShowAddModal(false);
                        setEditingCategory(null);
                    }}
                    onSave={handleSaveCategory}
                />
            )}

            {/* Modal de Confirmación */}
            <ConfirmModalComponent />
        </div>
    );
}

// Modal de Categoría
function CategoryModal({ category, onClose, onSave }) {
    const [formData, setFormData] = useState({
        name: category?.name || '',
        description: category?.description || '',
    });

    const handleSave = () => {
        if (!formData.name.trim()) {
            toast.error("El nombre de la categoría es requerido");
            return;
        }

        onSave(formData);
    };

    const isFormValid = formData.name.trim().length > 0;

    return (
        <BrandedModal
            isOpen={true}
            onClose={onClose}
            title={category ? "Editar Categoría" : "Nueva Categoría"}
            subtitle={category ? `Editar "${category.name}"` : "Crea una nueva categoría de productos"}
            icon={<Tag className="w-6 h-6" />}
        >
            <div className="space-y-4">
                {/* Nombre */}
                <div>
                    <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                        Nombre de la Categoría *
                    </label>
                    <Input
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder="Ej: Empanadas, Bebidas, Postres..."
                        className="text-base"
                    />
                </div>

                {/* Descripción */}
                <div>
                    <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                        Descripción (opcional)
                    </label>
                    <textarea
                        value={formData.description}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        placeholder="Descripción breve de la categoría..."
                        rows={3}
                        className="w-full px-3 py-2 border-2 border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-empanada-golden focus:border-empanada-golden bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                    />
                </div>
            </div>

            <BrandedModalFooter>
                <Button variant="outline" onClick={onClose}>
                    <X className="w-4 h-4 mr-2" />
                    Cancelar
                </Button>
                <Button
                    variant="empanada"
                    onClick={handleSave}
                    disabled={!isFormValid}
                >
                    <Save className="w-4 h-4 mr-2" />
                    {category ? 'Actualizar' : 'Guardar'}
                </Button>
            </BrandedModalFooter>
        </BrandedModal>
    );
}