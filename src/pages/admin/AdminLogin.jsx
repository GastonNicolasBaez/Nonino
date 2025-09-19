/* eslint-disable react-refresh/only-export-components */
/* eslint-disable react-hooks/exhaustive-deps */

// CORE
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router";

// EXTERNO
import { toast } from "sonner";

// COMPONENTES
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

// ICONOS
import {
    Eye,
    EyeOff,
    Mail,
    Lock,
    Shield,
    Info,
    AlertTriangle
} from "lucide-react";


// PROVIDERS
import { useSession } from "@/context/SessionProvider";

// UTILIDADES Y SERVICIOS
import { validateEmail } from "@/lib/utils";
import { DEV_CREDENTIALS, DEV_CONFIG, SECURITY_CONFIG, ERROR_MESSAGES } from "@/config/constants";


// ------------------ IMPORT ------------------ //
// ------------------ CODE   ------------------ //

export function AdminLogin() {

    const session = useSession();
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        email: "admin@nonino",
        password: "admin123"
    });
    const [showPassword, setShowPassword] = useState(false);
    const [errors, setErrors] = useState({});
    const [attempts, setAttempts] = useState(0);

    //Redirigir si ya está autenticado como admin
    useEffect(() => {
        if (session.isAuthenticated && session.isAdmin) {
            navigate('/intranet/admin');
        }
    }, [session.isAuthenticated]);


    // Limpiar errores cuando cambian los campos
    useEffect(() => {
        if (Object.keys(errors).length > 0) {
            setErrors({});
        }
    }, [formData, errors]);



    /**
     * Valida los campos del formulario
     * @returns {Object} - Objeto con errores de validación
     */
    const validateForm = () => {
        const newErrors = {};

        if (!formData.email.trim()) {
            newErrors.email = 'El email es requerido';
        } else if (!validateEmail(formData.email)) {
            newErrors.email = 'Formato de email inválido';
        }

        if (!formData.password.trim()) {
            newErrors.password = 'La contraseña es requerida';
        } else if (formData.password.length < SECURITY_CONFIG.passwordMinLength) {
            newErrors.password = `La contraseña debe tener al menos ${SECURITY_CONFIG.passwordMinLength} caracteres`;
        }

        // Bloquear después de múltiples intentos fallidos
        if (attempts >= SECURITY_CONFIG.maxLoginAttempts) {
            newErrors.general = ERROR_MESSAGES.unknown; // Usar mensaje genérico para no revelar límite
        }

        return newErrors;
    };

    /**
     * Maneja el envío del formulario de login
     * @param {Event} e - Evento del formulario
     */
    const handleSubmit = async (e) => {
        e.preventDefault();

        // Validar formulario
        const validationErrors = validateForm();
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return;
        }

        setErrors({});

        session.login({
            email: formData.email,
            password: formData.password
        });

    };


    // const user = {"id":1,"username":"Martin","email":"admin@noninoempanadas.com","role":"ADMIN","accessToken":"fake"};
    // session.login(user);

    // // Esperar un momento antes de navegar para asegurar que el estado se actualice
    // setTimeout(() => {
    //   navigate("/intranet/admin");
    // }, 100); 

    // try {
    //   const result = await login(formData.email.trim(), formData.password);

    //   if (result.success) {
    //     if (result.user.role === 'admin') {
    //       toast.success("¡Bienvenido al panel de administración!");
    //       navigate("/admin");
    //       setAttempts(0); // Resetear intentos en login exitoso
    //     } else {
    //       toast.error("No tienes permisos de administrador");
    //       setAttempts(prev => prev + 1);
    //     }
    //   } else {
    //     setErrors({ general: result.error });
    //     setAttempts(prev => prev + 1);
    //     toast.error(result.error);
    //   }
    // } catch (error) {
    //   console.error('Error en login de admin:', error);
    //   const errorMessage = 'Error interno del sistema';
    //   setErrors({ general: errorMessage });
    //   toast.error(errorMessage);
    //   setAttempts(prev => prev + 1);
    // } finally {
    //   setLoading(false);
    // }


    /**
     * Maneja los cambios en los campos del formulario
     * @param {Event} e - Evento del input
     */
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));

        // Limpiar error específico del campo
        if (errors[name]) {
            setErrors(prev => ({
                ...prev,
                [name]: undefined
            }));
        }
    };

    /**
     * Llena el formulario con credenciales de desarrollo (solo en desarrollo)
     * @returns {void}
     */
    const fillDefaultCredentials = () => {
        if (import.meta.env.DEV && DEV_CONFIG.enableDevMode) {
            setFormData({
                email: DEV_CREDENTIALS.admin.email,
                password: DEV_CREDENTIALS.admin.password
            });
            // Credenciales de desarrollo cargadas automáticamente
        } else {
            toast.error("Esta función solo está disponible en desarrollo");
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-empanada-dark flex items-center justify-center p-4">
            <div className="w-full max-w-md">
                <Card className="shadow-2xl border-0">
                    <CardHeader className="text-center bg-gradient-to-br from-gray-600 via-gray-700 to-gray-800 text-white rounded-t-lg relative overflow-hidden">
                        {/* Efecto de brillo sutil */}
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent transform -skew-x-12 -translate-x-full animate-pulse"></div>
                        <div className="relative z-10">
                            <div className="flex items-center justify-center mb-4">
                                <div className="p-3 bg-white/20 rounded-full backdrop-blur-sm">
                                    <Shield className="w-12 h-12 drop-shadow-lg" />
                                </div>
                            </div>
                            <CardTitle className="text-2xl font-bold drop-shadow-md">Panel de Administración</CardTitle>
                            <p className="text-white/90 text-lg font-medium drop-shadow-sm">Nonino Empanadas</p>
                        </div>
                    </CardHeader>

                    <CardContent className="p-8">
                        {/* Información de credenciales por defecto - Solo en desarrollo */}
                        {import.meta.env.DEV && (
                            <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                                <div className="flex items-start space-x-3">
                                    <Info className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                                    <div className="text-sm text-blue-800">
                                        <p className="font-medium mb-1">🔧 Modo Desarrollo:</p>
                                        <p className="text-blue-700">Puedes usar credenciales de prueba</p>
                                        <button
                                            onClick={fillDefaultCredentials}
                                            className="mt-2 text-blue-600 hover:text-blue-800 underline text-xs font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 rounded"
                                            aria-label="Llenar credenciales de desarrollo automáticamente"
                                        >
                                            Llenar automáticamente
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Mostrar errores generales */}
                        {errors.general && (
                            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                                <div className="flex items-center space-x-2">
                                    <AlertTriangle className="w-5 h-5 text-red-600 flex-shrink-0" />
                                    <p className="text-sm text-red-800 font-medium">{errors.general}</p>
                                </div>
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className="space-y-6" noValidate>
                            <div>
                                <label
                                    htmlFor="admin-email"
                                    className="block text-sm font-medium mb-2 text-gray-700"
                                >
                                    Email de Administrador *
                                </label>
                                <div className="relative">
                                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                                    <Input
                                        id="admin-email"
                                        name="email"
                                        type="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        required
                                        placeholder="admin@noninoempanadas.com"
                                        className={`pl-10 pr-4 py-3 border-2 transition-colors ${errors.email
                                            ? 'border-red-300 focus:border-red-500'
                                            : 'border-gray-300 focus:border-empanada-golden'
                                            }`}
                                        aria-invalid={!!errors.email}
                                        aria-describedby={errors.email ? "email-error" : undefined}
                                        autoComplete="email"
                                    />
                                </div>
                                {errors.email && (
                                    <p
                                        className="mt-1 text-sm text-red-600 flex items-center gap-1"
                                        id="email-error"
                                        role="alert"
                                    >
                                        <AlertTriangle className="w-4 h-4" />
                                        {errors.email}
                                    </p>
                                )}
                            </div>

                            <div>
                                <label
                                    htmlFor="admin-password"
                                    className="block text-sm font-medium mb-2 text-gray-700"
                                >
                                    Contraseña *
                                </label>
                                <div className="relative">
                                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                                    <Input
                                        id="admin-password"
                                        name="password"
                                        type={showPassword ? "text" : "password"}
                                        value={formData.password}
                                        onChange={handleChange}
                                        required
                                        placeholder="Tu contraseña de administrador"
                                        className={`pl-10 pr-12 py-3 border-2 transition-colors ${errors.password
                                            ? 'border-red-300 focus:border-red-500'
                                            : 'border-gray-300 focus:border-empanada-golden'
                                            }`}
                                        aria-invalid={!!errors.password}
                                        aria-describedby={errors.password ? "password-error" : undefined}
                                        autoComplete="current-password"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 p-1 focus:outline-none focus:ring-2 focus:ring-empanada-golden rounded"
                                        aria-label={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
                                    >
                                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                    </button>
                                </div>
                                {errors.password && (
                                    <p
                                        className="mt-1 text-sm text-red-600 flex items-center gap-1"
                                        id="password-error"
                                        role="alert"
                                    >
                                        <AlertTriangle className="w-4 h-4" />
                                        {errors.password}
                                    </p>
                                )}
                            </div>

                            <Button
                                type="submit"
                                variant="empanada"
                                className="w-full py-3 text-base font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                                disabled={session.loading || attempts >= 3}
                            >
                                {session.loading ? (
                                    <div className="flex items-center justify-center gap-2">
                                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                        Iniciando sesión...
                                    </div>
                                ) : attempts >= 3 ? (
                                    "Bloqueado temporalmente"
                                ) : (
                                    "Acceder al Panel"
                                )}
                            </Button>
                        </form>

                        {/* Back to site */}
                        <div className="mt-6 text-center">
                            <Link
                                to="/"
                                className="inline-flex items-center gap-2 text-sm text-empanada-golden hover:underline focus:outline-none focus:ring-2 focus:ring-empanada-golden rounded px-2 py-1"
                                aria-label="Volver al sitio web principal"
                            >
                                ← Volver al sitio web
                            </Link>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}


