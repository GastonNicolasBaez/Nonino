/* eslint-disable react-refresh/only-export-components */
/* eslint-disable react-hooks/exhaustive-deps */

import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Eye, EyeOff, Mail, Lock, Store, AlertTriangle, Loader2 } from "lucide-react";
import { useSession } from "@/context/SessionProvider";
import { usePublicData } from "@/context/PublicDataProvider";
import { validateEmail } from "@/lib/utils";
import logoNonino from '@/assets/logos/nonino.png';

export function TotemLogin() {
  const session = useSession();
  const navigate = useNavigate();
  const { setSucursalSeleccionada } = usePublicData();

  const [formData, setFormData] = useState({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});

  // Redirigir si ya está autenticado
  useEffect(() => {
    if (session.isAuthenticated && session.userData) {
      // Solo permitir usuarios LOCAL en el totem
      if (session.userData.isLocal) {
        // Marcar como sesión de totem persistente
        localStorage.setItem('totem_session_persistent', 'true');

        // CRÍTICO: Establecer la sucursal del usuario logueado en PublicDataProvider
        if (session.userData.sucursal) {
          console.log('[TOTEM LOGIN] Estableciendo sucursal del usuario:', session.userData.sucursal);
          setSucursalSeleccionada(session.userData.sucursal);
        }

        // Activar modo pantalla completa
        const enterFullscreen = async () => {
          try {
            if (document.documentElement.requestFullscreen) {
              await document.documentElement.requestFullscreen();
            } else if (document.documentElement.webkitRequestFullscreen) {
              // Safari
              await document.documentElement.webkitRequestFullscreen();
            } else if (document.documentElement.mozRequestFullScreen) {
              // Firefox
              await document.documentElement.mozRequestFullScreen();
            } else if (document.documentElement.mozRequestFullScreen) {
              // IE/Edge
              await document.documentElement.msRequestFullscreen();
            }
            console.log('[TOTEM] Modo pantalla completa activado');
          } catch (error) {
            console.warn('[TOTEM] No se pudo activar pantalla completa:', error);
            // Continuar de todos modos, no es crítico
          }
        };

        enterFullscreen();
        navigate('/totem/welcome');
      } else {
        // Si es ADMIN o FABRICA, no permitir acceso
        toast.error('Solo usuarios de LOCAL pueden acceder al totem');
        session.logout();
      }
    }
  }, [session.isAuthenticated, session.userData]);

  // Limpiar errores cuando cambian los campos
  useEffect(() => {
    if (Object.keys(errors).length > 0) {
      setErrors({});
    }
  }, [formData]);

  const validateForm = () => {
    const newErrors = {};

    if (!formData.email.trim()) {
      newErrors.email = 'El email es requerido';
    } else if (!validateEmail(formData.email)) {
      newErrors.email = 'Formato de email inválido';
    }

    if (!formData.password.trim()) {
      newErrors.password = 'La contraseña es requerida';
    } else if (formData.password.length < 6) {
      newErrors.password = 'La contraseña debe tener al menos 6 caracteres';
    }

    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validar formulario
    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setErrors({});

    try {
      await session.login({
        email: formData.email,
        password: formData.password
      });

      // El redirect se maneja en el useEffect de arriba
    } catch (error) {
      console.error('[TOTEM LOGIN] Error:', error);
      toast.error('Error al iniciar sesión. Verifica tus credenciales.');
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <div className="min-h-screen bg-empanada-dark flex items-center justify-center p-8">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
        className="w-full max-w-2xl"
      >
        <Card className="shadow-2xl border-2 border-empanada-golden bg-empanada-medium">
          <CardHeader className="text-center bg-empanada-dark border-b-2 border-empanada-golden rounded-t-lg pb-8 pt-8">
            <motion.div
              initial={{ y: -20 }}
              animate={{ y: 0 }}
              className="flex flex-col items-center gap-4"
            >
              <img
                src={logoNonino}
                alt="Nonino Empanadas"
                className="w-24 h-24"
              />
              <div>
                <CardTitle className="text-4xl font-bold text-empanada-golden mb-2">
                  TOTEM DE AUTOATENCIÓN
                </CardTitle>
                <p className="text-gray-300 text-xl">
                  Ingresa con tu cuenta de local
                </p>
              </div>
            </motion.div>
          </CardHeader>

          <CardContent className="p-8">
            {/* Información importante */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="mb-8 p-6 bg-blue-500/10 border-2 border-blue-500/30 rounded-xl"
            >
              <div className="flex items-start gap-4">
                <Store className="w-8 h-8 text-blue-400 flex-shrink-0 mt-1" />
                <div className="text-gray-200">
                  <p className="font-bold text-lg mb-2 text-blue-300">
                    🔐 Configuración Inicial
                  </p>
                  <p className="text-base leading-relaxed">
                    Esta es la configuración inicial del totem. Una vez que inicies sesión,
                    <span className="text-empanada-golden font-semibold"> la tablet quedará configurada con tu local</span> y
                    no tendrás que volver a iniciar sesión.
                  </p>
                </div>
              </div>
            </motion.div>

            {/* Mostrar errores generales */}
            {errors.general && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="mb-6 p-4 bg-red-500/20 border-2 border-red-500 rounded-xl"
              >
                <div className="flex items-center gap-3">
                  <AlertTriangle className="w-6 h-6 text-red-400 flex-shrink-0" />
                  <p className="text-base text-red-300 font-medium">{errors.general}</p>
                </div>
              </motion.div>
            )}

            <form onSubmit={handleSubmit} className="space-y-8" noValidate>
              {/* Email */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
              >
                <label
                  htmlFor="totem-email"
                  className="block text-xl font-bold mb-3 text-white"
                >
                  Email del Local
                </label>
                <div className="relative">
                  <Mail className="absolute left-5 top-1/2 transform -translate-y-1/2 text-gray-400 w-6 h-6" />
                  <Input
                    id="totem-email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    placeholder="ejemplo@nonino"
                    className={`pl-16 pr-6 py-8 text-xl border-2 bg-empanada-dark text-white placeholder:text-gray-500 ${
                      errors.email
                        ? 'border-red-500 focus:border-red-400'
                        : 'border-empanada-light-gray focus:border-empanada-golden'
                    }`}
                    autoComplete="email"
                  />
                </div>
                {errors.email && (
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="mt-3 text-base text-red-400 flex items-center gap-2"
                  >
                    <AlertTriangle className="w-5 h-5" />
                    {errors.email}
                  </motion.p>
                )}
              </motion.div>

              {/* Password */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 }}
              >
                <label
                  htmlFor="totem-password"
                  className="block text-xl font-bold mb-3 text-white"
                >
                  Contraseña
                </label>
                <div className="relative">
                  <Lock className="absolute left-5 top-1/2 transform -translate-y-1/2 text-gray-400 w-6 h-6" />
                  <Input
                    id="totem-password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    value={formData.password}
                    onChange={handleChange}
                    required
                    placeholder="Tu contraseña"
                    className={`pl-16 pr-20 py-8 text-xl border-2 bg-empanada-dark text-white placeholder:text-gray-500 ${
                      errors.password
                        ? 'border-red-500 focus:border-red-400'
                        : 'border-empanada-light-gray focus:border-empanada-golden'
                    }`}
                    autoComplete="current-password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-5 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-empanada-golden p-2 focus:outline-none focus:ring-2 focus:ring-empanada-golden rounded transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-6 h-6" /> : <Eye className="w-6 h-6" />}
                  </button>
                </div>
                {errors.password && (
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="mt-3 text-base text-red-400 flex items-center gap-2"
                  >
                    <AlertTriangle className="w-5 h-5" />
                    {errors.password}
                  </motion.p>
                )}
              </motion.div>

              {/* Submit Button */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
              >
                <Button
                  type="submit"
                  className="w-full py-10 text-2xl font-bold bg-empanada-golden text-empanada-dark hover:bg-empanada-golden/90 disabled:opacity-50 disabled:cursor-not-allowed rounded-xl"
                  disabled={session.loading}
                >
                  {session.loading ? (
                    <div className="flex items-center justify-center gap-3">
                      <Loader2 className="w-7 h-7 animate-spin" />
                      Iniciando sesión...
                    </div>
                  ) : (
                    <div className="flex items-center justify-center gap-3">
                      <Store className="w-7 h-7" />
                      CONFIGURAR TOTEM
                    </div>
                  )}
                </Button>
              </motion.div>
            </form>

            {/* Info adicional */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="mt-8 text-center"
            >
              <p className="text-gray-400 text-sm">
                ⚠️ Solo usuarios con rol de LOCAL pueden configurar el totem
              </p>
            </motion.div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}

export default TotemLogin;
