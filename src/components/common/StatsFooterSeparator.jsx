export function StatsFooterSeparator() {
    return (
        <div className="relative py-6 sm:py-8 bg-empanada-dark">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-center">
                    {/* Línea horizontal dorada con gradiente y efecto de brillo */}
                    <div className="w-full max-w-4xl h-1 bg-gradient-to-r from-transparent via-empanada-golden/60 to-transparent relative">
                        {/* Efecto de brillo central */}
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-empanada-golden to-transparent opacity-80 blur-sm"></div>
                        {/* Línea principal con gradiente */}
                        <div className="absolute inset-0 bg-gradient-to-r from-empanada-golden/30 via-empanada-golden/80 to-empanada-golden/30"></div>
                    </div>
                </div>
            </div>
        </div>
    );
}
