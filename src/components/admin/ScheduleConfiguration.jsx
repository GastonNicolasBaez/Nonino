import { useState } from 'react';
import React from 'react';
import { Clock, Plus, Trash2, CalendarX, Settings } from 'lucide-react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { CustomSelect } from '../branding';


const specialDayTypes = [
    { value: 'closed', label: 'Cerrado' },
    { value: 'special', label: 'Horario Especial' }
  ];

export function ScheduleConfiguration({
    schedule = null,
    onScheduleChange,
    className = ""
}) {
    // Estado inicial de horarios
    const initialSchedule = Array.from({ length: 7 * 2 }, (_, i) => ({
        dayOfWeek: (i % 7) + 1,      // 1 to 7
        slotIndex: Math.floor(i / 7) + 1, // 1 or 2
        openAt: "00:00",
        closeAt: "23:59",
    }));

    const [scheduleData, setScheduleData] = useState(schedule || initialSchedule);
    const [specialDatesData, setSpecialDatesData] = useState([]);

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

    const addSpecialDay = () => {
        const newSpecialDay = {
            id: Date.now(),
            date: '',
            name: '',
            type: 'closed',
            hours: { start: '12:00', end: '16:00' }
        }

        setSpecialDatesData([...specialDatesData, newSpecialDay]);
    };

    const updateSpecialDay = (id, field, value) => {
        const updatedSpecialDates = specialDatesData.map(day =>
            day.id === id ? { ...day, [field]: value } : day
        );
        setSpecialDatesData(updatedSpecialDates);
    };

    const removeSpecialDay = (id) => {
        const updatedSpecialDates = specialDatesData.filter(day => day.id !== id);
        setSpecialDatesData(updatedSpecialDates);
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
                            Días laborables:
                        </h4>
                        <div className="grid grid-cols-3 gap-3">
                            <div>
                                <p className="text-md text-gray-500">Día</p>
                            </div>
                            <div>
                                <p className="text-md text-gray-500">Apertura</p>
                            </div>
                            <div>
                                <p className="text-md text-gray-500">Cierre</p>
                            </div>
                            {Array.from({ length: 7 }, (_, i) => {
                                const dayOfWeek = i + 1;
                                const slot1 = scheduleData.find(d => d.dayOfWeek === dayOfWeek && d.slotIndex === 1);
                                const slot2 = scheduleData.find(d => d.dayOfWeek === dayOfWeek && d.slotIndex === 2);
                                return (
                                    <React.Fragment key={dayOfWeek}>
                                        <div className="col-span-3 font-semibold mt-2">
                                            {["Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado", "Domingo"][i]}
                                        </div>
                                        {[slot1, slot2].map((slot, idx) => (
                                            <React.Fragment key={idx}>
                                                <div className="pl-4 text-xs">{`Turno ${idx + 1}`}</div>
                                                <div>
                                                    <Input
                                                        type="time"
                                                        value={slot.openAt}
                                                        onChange={e => updateDaySchedule(dayOfWeek, slot.slotIndex, "openAt", e.target.value)}
                                                        className="text-center"
                                                    />
                                                </div>
                                                <div>
                                                    <Input
                                                        type="time"
                                                        value={slot.closeAt}
                                                        onChange={e => updateDaySchedule(dayOfWeek, slot.slotIndex, "closeAt", e.target.value)}
                                                        className="text-center"
                                                    />
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

            {/* Días Especiales y Feriados */}
            <Card>
                <CardHeader className="pb-4">
                    <div className="flex items-center justify-between">
                        <CardTitle className="flex items-center gap-2 text-lg">
                            <CalendarX className="w-5 h-5" />
                            Días Especiales y Feriados
                        </CardTitle>
                        <Button
                            onClick={addSpecialDay}
                            size="sm"
                            className="flex items-center gap-2"
                        >
                            <Plus className="w-4 h-4" />
                            Agregar Excepción
                        </Button>
                    </div>
                </CardHeader>
                <CardContent>
                    {specialDatesData.length === 0 ? (
                        <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                            <CalendarX className="w-12 h-12 mx-auto mb-3 opacity-50" />
                            <p>No hay días especiales configurados</p>
                            <p className="text-sm">Haz clic en "Agregar Excepción" para añadir uno</p>
                        </div>
                    ) : (
                        <div className="space-y-2">
                            {specialDatesData.map((date) => (
                                <div
                                    key={date.id}
                                    className="flex items-center gap-2 p-2 border border-gray-200 dark:border-gray-700 rounded-md bg-gray-50 dark:bg-gray-800/50"
                                >

                                    <div className="flex-shrink-0">
                                        <Input
                                            type="date"
                                            value={date.date}
                                            onChange={(e) => updateSpecialDay(date.id, 'date', e.target.value)}
                                            className="w-32 text-xs h-8"
                                        />
                                    </div>


                                    <div className="flex-1 min-w-0">
                                        <Input
                                            placeholder="Ej: Navidad, Año Nuevo..."
                                            value={date.name}
                                            onChange={(e) => updateSpecialDay(date.id, 'name', e.target.value)}
                                            className="text-xs h-8"
                                        />
                                    </div>


                                    {date.type === 'closed' ? (
                                        <Badge variant="destructive" className="text-xs px-2 py-1">
                                            Cerrado
                                        </Badge>
                                    ) : (
                                        <div className="flex items-center gap-1 text-xs text-gray-600 dark:text-gray-400">
                                            <Input
                                                type="time"
                                                value={date.hours.start}
                                                onChange={(e) => updateSpecialDay(date.id, 'hours', { ...date.hours, start: e.target.value })}
                                                className="w-16 text-xs h-6 p-1"
                                            />
                                            <span>-</span>
                                            <Input
                                                type="time"
                                                value={date.hours.end}
                                                onChange={(e) => updateSpecialDay(date.id, 'hours', { ...date.hours, end: e.target.value })}
                                                className="w-16 text-xs h-6 p-1"
                                            />
                                        </div>
                                    )}


                                    <div className="flex items-center gap-1">
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => updateSpecialDay(date.id, 'type', date.type === 'closed' ? 'special' : 'closed')}
                                            className="h-6 w-6 p-0 text-gray-500 hover:text-gray-700"
                                            title={date.type === 'closed' ? 'Cambiar a horario especial' : 'Marcar como cerrado'}
                                        >
                                            {date.type === 'closed' ? <Clock className="w-3 h-3" /> : <CalendarX className="w-3 h-3" />}
                                        </Button>
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => removeSpecialDay(date.id)}
                                            className="h-6 w-6 p-0 text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20"
                                            title="Eliminar excepción"
                                        >
                                            <Trash2 className="w-3 h-3" />
                                        </Button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}

export default ScheduleConfiguration;