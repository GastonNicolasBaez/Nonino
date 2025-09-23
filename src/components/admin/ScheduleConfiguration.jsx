import { useState } from 'react';
import { Clock, Plus, Trash2, CalendarX, Settings } from 'lucide-react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { CustomSelect } from '../branding';

/**
 * Componente para configurar horarios de sucursales
 * Incluye horarios regulares y días especiales/feriados
 */
export function ScheduleConfiguration({
  schedule = null,
  onScheduleChange,
  className = ""
}) {
  // Estado inicial de horarios
  const [scheduleData, setScheduleData] = useState(schedule || {
    regularHours: {
      weekdays: { start: '12:00', end: '16:00', start2: '20:00', end2: '00:00' },
      weekends: { start: '12:00', end: '01:00' }
    },
    specialDays: []
  });

  // Opciones para tipos de día especial
  const specialDayTypes = [
    { value: 'closed', label: 'Cerrado' },
    { value: 'special', label: 'Horario Especial' }
  ];

  // Actualizar horarios regulares
  const updateRegularHours = (period, field, value) => {
    const newSchedule = {
      ...scheduleData,
      regularHours: {
        ...scheduleData.regularHours,
        [period]: {
          ...scheduleData.regularHours[period],
          [field]: value
        }
      }
    };
    setScheduleData(newSchedule);
    onScheduleChange?.(newSchedule);
  };

  // Agregar día especial
  const addSpecialDay = () => {
    const newSpecialDay = {
      id: Date.now(),
      date: '',
      name: '',
      type: 'closed',
      hours: { start: '12:00', end: '16:00' }
    };

    const newSchedule = {
      ...scheduleData,
      specialDays: [...scheduleData.specialDays, newSpecialDay]
    };
    setScheduleData(newSchedule);
    onScheduleChange?.(newSchedule);
  };

  // Actualizar día especial
  const updateSpecialDay = (id, field, value) => {
    const newSchedule = {
      ...scheduleData,
      specialDays: scheduleData.specialDays.map(day =>
        day.id === id ? { ...day, [field]: value } : day
      )
    };
    setScheduleData(newSchedule);
    onScheduleChange?.(newSchedule);
  };

  // Eliminar día especial
  const removeSpecialDay = (id) => {
    const newSchedule = {
      ...scheduleData,
      specialDays: scheduleData.specialDays.filter(day => day.id !== id)
    };
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
              Días laborables:
            </h4>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <div>
                <label className="text-xs text-gray-500 mb-1 block">Inicio</label>
                <Input
                  type="time"
                  value={scheduleData.regularHours.weekdays.start}
                  onChange={(e) => updateRegularHours('weekdays', 'start', e.target.value)}
                  className="text-center"
                />
              </div>
              <div>
                <label className="text-xs text-gray-500 mb-1 block">Fin</label>
                <Input
                  type="time"
                  value={scheduleData.regularHours.weekdays.end}
                  onChange={(e) => updateRegularHours('weekdays', 'end', e.target.value)}
                  className="text-center"
                />
              </div>
              <div>
                <label className="text-xs text-gray-500 mb-1 block">2do Turno</label>
                <Input
                  type="time"
                  value={scheduleData.regularHours.weekdays.start2}
                  onChange={(e) => updateRegularHours('weekdays', 'start2', e.target.value)}
                  className="text-center"
                />
              </div>
              <div>
                <label className="text-xs text-gray-500 mb-1 block">Fin</label>
                <Input
                  type="time"
                  value={scheduleData.regularHours.weekdays.end2}
                  onChange={(e) => updateRegularHours('weekdays', 'end2', e.target.value)}
                  className="text-center"
                />
              </div>
            </div>
          </div>

          {/* Fines de semana */}
          <div>
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
          </div>
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
          {scheduleData.specialDays.length === 0 ? (
            <div className="text-center py-8 text-gray-500 dark:text-gray-400">
              <CalendarX className="w-12 h-12 mx-auto mb-3 opacity-50" />
              <p>No hay días especiales configurados</p>
              <p className="text-sm">Haz clic en "Agregar Excepción" para añadir uno</p>
            </div>
          ) : (
            <div className="space-y-2">
              {scheduleData.specialDays.map((day) => (
                <div
                  key={day.id}
                  className="flex items-center gap-2 p-2 border border-gray-200 dark:border-gray-700 rounded-md bg-gray-50 dark:bg-gray-800/50"
                >
                  {/* Fecha compacta */}
                  <div className="flex-shrink-0">
                    <Input
                      type="date"
                      value={day.date}
                      onChange={(e) => updateSpecialDay(day.id, 'date', e.target.value)}
                      className="w-32 text-xs h-8"
                    />
                  </div>

                  {/* Nombre del día */}
                  <div className="flex-1 min-w-0">
                    <Input
                      placeholder="Ej: Navidad, Año Nuevo..."
                      value={day.name}
                      onChange={(e) => updateSpecialDay(day.id, 'name', e.target.value)}
                      className="text-xs h-8"
                    />
                  </div>

                  {/* Estado y horario en una línea */}
                  {day.type === 'closed' ? (
                    <Badge variant="destructive" className="text-xs px-2 py-1">
                      Cerrado
                    </Badge>
                  ) : (
                    <div className="flex items-center gap-1 text-xs text-gray-600 dark:text-gray-400">
                      <Input
                        type="time"
                        value={day.hours.start}
                        onChange={(e) => updateSpecialDay(day.id, 'hours', { ...day.hours, start: e.target.value })}
                        className="w-16 text-xs h-6 p-1"
                      />
                      <span>-</span>
                      <Input
                        type="time"
                        value={day.hours.end}
                        onChange={(e) => updateSpecialDay(day.id, 'hours', { ...day.hours, end: e.target.value })}
                        className="w-16 text-xs h-6 p-1"
                      />
                    </div>
                  )}

                  {/* Botones de acción compactos */}
                  <div className="flex items-center gap-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => updateSpecialDay(day.id, 'type', day.type === 'closed' ? 'special' : 'closed')}
                      className="h-6 w-6 p-0 text-gray-500 hover:text-gray-700"
                      title={day.type === 'closed' ? 'Cambiar a horario especial' : 'Marcar como cerrado'}
                    >
                      {day.type === 'closed' ? <Clock className="w-3 h-3" /> : <CalendarX className="w-3 h-3" />}
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeSpecialDay(day.id)}
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