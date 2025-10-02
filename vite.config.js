import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import basicSsl from '@vitejs/plugin-basic-ssl'
import tsconfigPaths from "vite-tsconfig-paths"

// https://vite.dev/config/
export default defineConfig({
    plugins: [
        react(),
        basicSsl(),
        tsconfigPaths(),
    ],
    server: {
        https: true,
        port: 3000,
    },
    base: "/demo/nonino/",

    // OPTIMIZACIONES DE BUILD
    build: {
        // Aumentar chunk size warning limit
        chunkSizeWarningLimit: 1000,

        // Configuración de Rollup para chunks optimizados
        rollupOptions: {
            output: {
                // Manual chunks para mejor code splitting
                manualChunks: (id) => {
                    // Vendor chunks separados por categoría
                    if (id.includes('node_modules')) {
                        // React core
                        if (id.includes('react') || id.includes('react-dom') || id.includes('react-router')) {
                            return 'vendor-react';
                        }
                        // Framer Motion (pesado)
                        if (id.includes('framer-motion')) {
                            return 'vendor-motion';
                        }
                        // Radix UI components
                        if (id.includes('@radix-ui')) {
                            return 'vendor-ui';
                        }
                        // Carousels
                        if (id.includes('embla-carousel')) {
                            return 'vendor-carousel';
                        }
                        // Charts - solo Recharts (el resto no se usa)
                        if (id.includes('recharts')) {
                            return 'vendor-charts';
                        }
                        // Lucide icons
                        if (id.includes('lucide-react')) {
                            return 'vendor-icons';
                        }
                        // Axios y utilidades HTTP
                        if (id.includes('axios')) {
                            return 'vendor-http';
                        }
                        // NO agrupar el resto - dejar que Vite lo maneje automáticamente
                        // Esto evita dependencias circulares
                    }
                },
                // Nombres de chunks más descriptivos
                chunkFileNames: 'assets/js/[name]-[hash].js',
                entryFileNames: 'assets/js/[name]-[hash].js',
                assetFileNames: 'assets/[ext]/[name]-[hash].[ext]',
            }
        },

        // Minificación agresiva
        minify: 'terser',
        terserOptions: {
            compress: {
                drop_console: true, // Remover console.log en producción
                drop_debugger: true,
                pure_funcs: ['console.log', 'console.info'], // Remover funciones específicas
            },
        },

        // Source maps solo para errores
        sourcemap: false,

        // CSS code splitting
        cssCodeSplit: true,

        // Reportar tamaño comprimido
        reportCompressedSize: true,

        // Target moderno para mejor compresión
        target: 'es2015',
    },

    // Optimizaciones de dependencies
    optimizeDeps: {
        include: [
            'react',
            'react-dom',
            'react-router',
            'framer-motion',
        ],
        exclude: [],
    },
})
