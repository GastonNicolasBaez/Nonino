import { motion } from "framer-motion";

export function HeartSeparator() {
    return (
        <div className="relative py-12 sm:py-16">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-center">
                    <div className="flex items-center space-x-6">
                        <div className="w-16 h-px bg-gradient-to-r from-transparent via-empanada-golden/40 to-empanada-golden/60"></div>
                        <div className="relative">
                            <div className="w-16 h-16 bg-empanada-golden/20 rounded-full flex items-center justify-center backdrop-blur-sm border border-empanada-golden/30">
                                <svg
                                    className="w-8 h-8 text-empanada-golden"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                                    />
                                </svg>
                            </div>
                            <div className="absolute inset-0 w-16 h-16 bg-empanada-golden/10 rounded-full animate-pulse"></div>
                        </div>
                        <div className="w-16 h-px bg-gradient-to-l from-transparent via-empanada-golden/40 to-empanada-golden/60"></div>
                    </div>
                </div>

                {/* Texto de transición */}
                <div className="text-center mt-8">
                    <p className="text-empanada-golden/90 text-sm font-medium tracking-wide uppercase">
                        ¡Es Hora de Disfrutar!
                    </p>
                </div>
            </div>
        </div>
    );
}
