import React from 'react'

const NotFound = () => {
    return (
        <>
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <h1 className="text-4xl font-bold text-empanada-golden mb-4">404</h1>
                    <p className="text-gray-600 mb-8">Página no encontrada</p>
                    <a
                        href="/"
                        className="bg-empanada-golden text-white px-6 py-3 rounded-lg hover:bg-empanada-crust transition-colors"
                    >
                        Volver al inicio
                    </a>
                </div>
            </div>
        </>
    )
}

export default NotFound