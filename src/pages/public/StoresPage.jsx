import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { MapPin, Phone, Clock, Star, Navigation } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Badge } from "../../components/ui/badge";
import { TextAnimate } from "../../components/ui/text-animate";
import { LoadingSpinner } from "../../components/common/LoadingSpinner";
import { FloatingOrderButton } from "../../components/common/FloatingOrderButton";
import { InteractiveImageAccordion } from "../../components/ui/interactive-image-accordion";
import { storeService } from "../../services/api";
import { formatPrice } from "../../lib/utils";

export function StoresPage() {
  const [stores, setStores] = useState([]);
  const [selectedStore, setSelectedStore] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStores = async () => {
      try {
        const response = await storeService.getAllStores();
        setStores(response.data);
        if (response.data.length > 0) {
          setSelectedStore(response.data[0]);
        }
      } catch (error) {
        // Error silencioso en desarrollo - en producción usar sistema de logging
      } finally {
        setLoading(false);
      }
    };

    fetchStores();
  }, []);

  /**
   * Formatea los horarios de un local
   * @param {Object} hours - Objeto con horarios por día
   * @returns {JSX.Element[]} - Array de elementos JSX con horarios
   */
  const formatHours = (hours) => {
    return Object.entries(hours).map(([day, schedule]) => (
      <div key={day} className="flex justify-between text-sm">
        <span className="capitalize">{day.substring(0, 3)}</span>
        <span>{schedule.open} - {schedule.close}</span>
      </div>
    ));
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="xl" />
      </div>
    );
  }

  return (
    <div>
      {/* Interactive Locations Accordion */}
      <InteractiveImageAccordion
        title="Nuestros Locales y Fábrica"
        subtitle="Descubre todos nuestros puntos de venta y conoce donde hacemos nuestras empanadas"
        buttonText="Únete a Nonino"
        buttonHref="#locales"
      />

      <FloatingOrderButton />
    </div>
  );
}