import { useState } from 'react';
import React from 'react';
import { Clock } from 'lucide-react';
import { Input } from '../ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';

export function ScheduleConfiguration({
    schedule = null,
    onScheduleChange,
    className = ""
}) {
    // Estado inicial de horarios (14 slots: 7 días × 2 turnos)
    const initialSchedule = Array.from({ length: 7 * 2 }, (_, i) => ({
        dayOfWeek: (i % 7) + 1,      // 1 to 7
        slotIndex: Math.floor(i / 7) + 1, // 1 or 2
        openAt: "09:00",
        closeAt: "18:00",
        isActive: true,
    }));

    // Inicializar estado combinando datos del servidor con valores por defecto
    const [scheduleData, setScheduleData] = useState(() => {
        if (!schedule || schedule.length === 0) {
            return initialSchedule;
        }

        // Crear mapa de slots del servidor
        const serverSlots = new Map();
        schedule.forEach(slot => {
            const key = `${slot.dayOfWeek}-${slot.slotIndex}`;
            serverSlots.set(key, slot);
        });

        // Combinar: usar datos del servidor si existen, sino usar valores por defecto
        return initialSchedule.map(defaultSlot => {
            const key = `${defaultSlot.dayOfWeek}-${defaultSlot.slotIndex}`;
            const serverSlot = serverSlots.get(key);
            if (serverSlot) {
                return { ...defaultSlot, ...serverSlot, isActive: serverSlot.isActive ?? true };
            }
            return defaultSlot;
        });
    });

    // Actualizar el horario de un día
    const updateDaySchedule = (dayOfWeek, slotIndex, field, value) => {
        const newSchedule = scheduleData.map(day =>
            day.dayOfWeek === dayOfWeek && day.slotIndex === slotIndex
                ? { ...day, [field]: value }
                : day
        );
        setScheduleData(newSchedule);
        onScheduleChange?.(newSchedule);
    };

    return (
        <div className={`space-y-6 ${className}`}>
            {/* Horario Regular */}
            <Card>
                <CardHeader className="pb-4">
                    <CardTitle className="flex items-center gap-2 text-lg">
                        <Clock className="w-5 h-5" />
                        Horario Regular
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                    {/* Días laborables */}
                    <div>
                        <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                            Horarios de apertura:
                        </h4>
                        <div className="grid grid-cols-4 gap-3">
                            <div>
                                <p className="text-md text-gray-500">Día</p>
                            </div>
                            <div>
                                <p className="text-md text-gray-500">Apertura</p>
                            </div>
                            <div>
                                <p className="text-md text-gray-500">Cierre</p>
                            </div>
                            <div className="text-center">
                                <p className="text-md text-gray-500">Activo</p>
                            </div>
                            {Array.from({ length: 7 }, (_, i) => {
                                const dayOfWeek = i + 1;
                                const slot1 = scheduleData.find(d => d.dayOfWeek === dayOfWeek && d.slotIndex === 1);
                                const slot2 = scheduleData.find(d => d.dayOfWeek === dayOfWeek && d.slotIndex === 2);
                                return (
                                    <React.Fragment key={dayOfWeek}>
                                        <div className="col-span-4 font-semibold mt-2">
                                            {["Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado", "Domingo"][i]}
                                        </div>
                                        {[slot1, slot2].map((slot, idx) => (
                                            <React.Fragment key={idx}>
                                                <div className="pl-4 text-xs flex items-center">{`Turno ${idx + 1}`}</div>
                                                <div>
                                                    <Input
                                                        type="time"
                                                        value={slot.openAt}
                                                        onChange={e => updateDaySchedule(dayOfWeek, slot.slotIndex, "openAt", e.target.value)}
                                                        className={`text-center ${!slot.isActive ? 'opacity-50' : ''}`}
                                                        disabled={!slot.isActive}
                                                    />
                                                </div>
                                                <div>
                                                    <Input
                                                        type="time"
                                                        value={slot.closeAt}
                                                        onChange={e => updateDaySchedule(dayOfWeek, slot.slotIndex, "closeAt", e.target.value)}
                                                        className={`text-center ${!slot.isActive ? 'opacity-50' : ''}`}
                                                        disabled={!slot.isActive}
                                                    />
                                                </div>
                                                <div className="flex items-center justify-center">
                                                    <button
                                                        type="button"
                                                        onClick={() => updateDaySchedule(dayOfWeek, slot.slotIndex, "isActive", !slot.isActive)}
                                                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                                                            slot.isActive ? 'bg-empanada-golden' : 'bg-gray-300 dark:bg-gray-600'
                                                        }`}
                                                    >
                                                        <span className={`inline-block h-4 w-4 transform rounded-full bg-white shadow-sm transition-transform ${
                                                            slot.isActive ? 'translate-x-6' : 'translate-x-1'
                                                        }`} />
                                                    </button>
                                                </div>
                                            </React.Fragment>
                                        ))}
                                    </React.Fragment>
                                );
                            })}
                        </div>
                    </div>

                    {/* Fines de semana */}
                    {/* <div>
                        <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                            Fines de semana:
                        </h4>
                        <div className="grid grid-cols-2 gap-3 max-w-md">
                            <div>
                                <label className="text-xs text-gray-500 mb-1 block">Inicio</label>
                                <Input
                                    type="time"
                                    value={scheduleData.regularHours.weekends.start}
                                    onChange={(e) => updateRegularHours('weekends', 'start', e.target.value)}
                                    className="text-center"
                                />
                            </div>
                            <div>
                                <label className="text-xs text-gray-500 mb-1 block">Fin</label>
                                <Input
                                    type="time"
                                    value={scheduleData.regularHours.weekends.end}
                                    onChange={(e) => updateRegularHours('weekends', 'end', e.target.value)}
                                    className="text-center"
                                />
                            </div>
                        </div>
                    </div> */}
                </CardContent>
            </Card>
        </div>
    );
}

export default ScheduleConfiguration;