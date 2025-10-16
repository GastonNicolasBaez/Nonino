import { motion } from "framer-motion";
import { Button } from "../ui/button";
import { Link } from "react-router";
import { usePublicData } from "@/context/PublicDataProvider";

export function ReadyToEnjoySection() {
    const { sucursalSeleccionada } = usePublicData();

    return (
        <section className="py-12 sm:py-16 lg:py-20 bg-gradient-to-r from-empanada-golden to-empanada-warm text-white relative">
            {/* Decoración superior */}
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-white/30 to-transparent"></div>
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                >
                    <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-3 sm:mb-4 px-2">
                        ¿Listo para disfrutar?
                    </h2>
                    <p className="text-base sm:text-lg md:text-xl mb-6 sm:mb-8 text-white/90 max-w-2xl mx-auto px-2">
                        Hace tu pedido ahora y recibi nuestras deliciosas empanadas
                        en la comodidad de tu hogar
                    </p>
                    <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center px-4">
                        <Link to={sucursalSeleccionada ? "/menu" : "/pedir"} className="w-full sm:w-auto">
                            <Button
                                size="lg"
                                variant="shimmer"
                                className="text-base sm:text-lg px-6 sm:px-8 py-3 sm:py-4 bg-white text-empanada-golden hover:bg-empanada-light border-2 border-white shadow-lg hover:shadow-xl transition-all duration-300 w-full sm:w-auto"
                            >
                                Pedir YA
                            </Button>
                        </Link>
                    </div>
                </motion.div>
            </div>
        </section>
    );
}
