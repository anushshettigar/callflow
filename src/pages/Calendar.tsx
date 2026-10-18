import { useState, useMemo, useEffect } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  Calendar,
  Plus,
  Sun,
  MoreHorizontal,
  X,
  Clock,
  MapPin,
  User,
  Phone,
  Video,
  Mail,
  Edit,
  Trash2,
  ChevronDown
} from 'lucide-react';

import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { Input } from '../components/ui/Input';
import { SelectDropdown } from '../components/ui/Dropdown';
import { Modal } from '../components/ui/Modal';
import { Avatar } from '../components/ui/Avatar';
import { Tooltip } from '../components/ui/Tooltip';

import { mockCalendarEvents, getEventsForMonth, getEventsByDate } from '../data/calendar';
import { mockLeads, getLeadById } from '../data/leads';
import { CalendarEvent } from '../types';
import { formatDate, formatTime, classNames, generateId } from '../utils';
import { useToast } from '../components/ui/Toast';

const EVENT_TYPE_COLORS: Record<string, string> = {
  call: '#3B82F6',
  meeting: '#8B5CF6',
  followup: '#F59E0B',
  demo: '#10B981',
  other: '#6B7280'
};

const EVENT_TYPE_ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  call: Phone,
  meeting: User,
  followup: Mail,
  demo: Video,
  other: Calendar
};

export function CalendarPage() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [showEventModal, setShowEventModal] = useState(false);
  const [editingEvent, setEditingEvent] = useState<CalendarEvent | null>(null);
  const [eventForm, setEventForm] = useState({
    title: '',
    description: '',
    date: '',
    time: '09:00',
    duration: 30,
    type: 'call' as CalendarEvent['type'],
    leadId: '',
    color: EVENT_TYPE_COLORS.call
  });
  const [loading, setLoading] = useState(false);
  const { addToast } = useToast();

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const today = new Date();

  const events = useMemo(() => getEventsForMonth(year, month), [year, month]);
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDayOfMonth = new Date(year, month, 1).getDay();
  const prevMonthDays = new Date(year, month, 0).getDate();

  const eventsByDate = useMemo(() => {
    const map: Record<string, CalendarEvent[]> = {};
    events.forEach(event => {
      if (!map[event.date]) map[event.date] = [];
      map[event.date].push(event);
    });
    return map;
  }, [events]);

  const selectedDateStr = selectedDate ? selectedDate.toISOString().split('T')[0] : null;
  const selectedDateEvents = selectedDateStr ? eventsByDate[selectedDateStr] || [] : [];

  const monthName = currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });

  const goToPrevMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
    setSelectedDate(null);
  };

  const goToNextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
    setSelectedDate(null);
  };

  const goToToday = () => {
    setCurrentDate(new Date());
    setSelectedDate(new Date());
  };

  const handleDateClick = (date: Date) => {
    setSelectedDate(date);
  };

  const openCreateEvent = (date?: Date) => {
    const targetDate = date || new Date();
    setEventForm({
      title: '',
      description: '',
      date: targetDate.toISOString().split('T')[0],
      time: '09:00',
      duration: 30,
      type: 'call',
      leadId: '',
      color: EVENT_TYPE_COLORS.call
    });
    setEditingEvent(null);
    setShowEventModal(true);
  };

  const openEditEvent = (event: CalendarEvent) => {
    setEventForm({
      title: event.title,
      description: event.description,
      date: event.date,
      time: event.time,
      duration: event.duration,
      type: event.type,
      leadId: event.leadId || '',
      color: event.color
    });
    setEditingEvent(event);
    setShowEventModal(true);
  };

  const handleSubmitEvent = () => {
    if (!eventForm.title.trim()) return;
    
    const newEvent: CalendarEvent = {
      id: editingEvent?.id || generateId('evt-'),
      ...eventForm,
      color: EVENT_TYPE_COLORS[eventForm.type]
    };

    if (editingEvent) {
      // Update existing event
      addToast({
        type: 'success',
        title: 'Event Updated',
        message: `"${newEvent.title}" has been updated.`
      });
    } else {
      // Create new event
      addToast({
        type: 'success',
        title: 'Event Created',
        message: `"${newEvent.title}" scheduled for ${formatDate(newEvent.date)}.`
      });
    }

    setShowEventModal(false);
    setEditingEvent(null);
  };

  const handleDeleteEvent = (event: CalendarEvent) => {
    addToast({
      type: 'success',
      title: 'Event Deleted',
      message: `"${event.title}" has been deleted.`
    });
    setShowEventModal(false);
  };

  const getDayEvents = (dateStr: string) => eventsByDate[dateStr] || [];

  const renderDay = (day: number, isCurrentMonth: boolean, isToday: boolean, isSelected: boolean, dateStr: string) => {
    const dayEvents = getDayEvents(dateStr);
    const eventDots = dayEvents.slice(0, 3).map((event, i) => (
      <span
        key={i}
        className="w-1.5 h-1.5 rounded-full"
        style={{ backgroundColor: event.color }}
      />
    ));

    return (
      <button
        onClick={() => handleDateClick(new Date(dateStr))}
        className={classNames(
          'relative aspect-square flex flex-col items-center justify-start p-1',
          'transition-colors rounded-lg',
          isCurrentMonth ? 'text-gray-900 hover:bg-gray-100' : 'text-gray-400 hover:bg-gray-50',
          isToday && 'bg-blue-50 ring-2 ring-blue-500',
          isSelected && 'bg-blue-100 ring-2 ring-blue-600'
        )}
        style={{ minHeight: '100px' }}
      >
        <span className={classNames('font-medium', isToday && 'text-blue-600')}>{day}</span>
        <div className="flex gap-0.5 mt-1 flex-wrap">{eventDots}</div>
        {dayEvents.length > 3 && (
          <span className="text-xs text-gray-500 mt-1">+{dayEvents.length - 3} more</span>
        )}
      </button>
    );
  };

  const typeOptions = Object.entries(EVENT_TYPE_COLORS).map(([key, color]) => ({
    value: key,
    label: key.charAt(0).toUpperCase() + key.slice(1)
  }));

  const leadOptions = [
    { value: '', label: 'No lead linked' },
    ...mockLeads.map(l => ({ value: l.id, label: `${l.name} (${l.company})` }))
  ];

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <Calendar className="w-6 h-6 text-blue-600" />
            Calendar
          </h1>
          <p className="text-gray-500 mt-1">Schedule and manage your calls and meetings</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={goToToday}>
            <Sun className="w-4 h-4 mr-2" />
            Today
          </Button>
          <Button variant="primary" size="sm" onClick={() => openCreateEvent()}>
            <Plus className="w-4 h-4 mr-2" />
            New Event
          </Button>
        </div>
      </div>

      {/* Calendar Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Month View */}
        <div className="lg:col-span-3">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div className="flex items-center gap-4">
                <Button variant="ghost" size="icon" onClick={goToPrevMonth} aria-label="Previous month">
                  <ChevronLeft className="w-5 h-5" />
                </Button>
                <h2 className="text-lg font-semibold text-gray-900">{monthName}</h2>
                <Button variant="ghost" size="icon" onClick={goToNextMonth} aria-label="Next month">
                  <ChevronRight className="w-5 h-5" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              {/* Weekday Headers */}
              <div className="grid grid-cols-7 gap-0.5 mb-1">
                {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
                  <div key={day} className="text-center text-xs font-medium text-gray-500 py-2">
                    {day}
                  </div>
                ))}
              </div>
              
              {/* Calendar Days */}
              <div className="grid grid-cols-7 gap-0.5">
                {/* Previous month days */}
                {Array.from({ length: firstDayOfMonth }).map((_, i) => {
                  const day = prevMonthDays - firstDayOfMonth + i + 1;
                  const date = new Date(year, month - 1, day);
                  const dateStr = date.toISOString().split('T')[0];
                  return renderDay(day, false, false, false, dateStr);
                })}
                
                {/* Current month days */}
                {Array.from({ length: daysInMonth }).map((_, i) => {
                  const day = i + 1;
                  const date = new Date(year, month, day);
                  const dateStr = date.toISOString().split('T')[0];
                  const isToday = date.toDateString() === today.toDateString();
                  const isSelected = selectedDateStr === dateStr;
                  return renderDay(day, true, isToday, isSelected, dateStr);
                })}
                
                {/* Next month days */}
                {Array.from({ length: 42 - firstDayOfMonth - daysInMonth }).map((_, i) => {
                  const day = i + 1;
                  const date = new Date(year, month + 1, day);
                  const dateStr = date.toISOString().split('T')[0];
                  return renderDay(day, false, false, false, dateStr);
                })}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Event Details Panel */}
        <div className="lg:col-span-1">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                {selectedDate ? (
                  <>
                    <Calendar className="w-5 h-5" />
                    {selectedDate.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
                  </>
                ) : (
                  <>
                    <Calendar className="w-5 h-5" />
                    Select a date
                  </>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {selectedDate ? (
                <div className="space-y-4">
                  {selectedDateEvents.length > 0 ? (
                    <div className="space-y-3">
                      {selectedDateEvents.map((event) => {
                        const lead = event.leadId ? getLeadById(event.leadId) : null;
                        const Icon = EVENT_TYPE_ICONS[event.type];
                        return (
                          <div
                            key={event.id}
                            className="p-3 bg-gray-50 rounded-lg border-l-4 border-[{event.color}] hover:bg-gray-100 transition-colors"
                          >
                            <div className="flex items-start gap-3">
                              <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0" style={{ backgroundColor: event.color + '20' }}>
                                <span style={{ color: event.color }}>
                                  <Icon className="w-4 h-4" />
                                </span>
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center justify-between">
                                  <h4 className="font-medium text-gray-900 truncate">{event.title}</h4>
                                  <div className="flex items-center gap-1">
                                    <Tooltip content="Edit">
                                      <Button variant="ghost" size="icon" onClick={() => openEditEvent(event)}>
                                        <Edit className="w-3 h-3" />
                                      </Button>
                                    </Tooltip>
                                    <Tooltip content="Delete">
                                      <Button variant="ghost" size="icon" onClick={() => handleDeleteEvent(event)}>
                                        <Trash2 className="w-3 h-3 text-red-500" />
                                      </Button>
                                    </Tooltip>
                                  </div>
                                </div>
                                <p className="text-sm text-gray-500 mt-0.5">{event.description}</p>
                                <div className="flex items-center gap-3 mt-2 text-xs text-gray-500">
                                  <span className="flex items-center gap-1">
                                    <Clock className="w-3 h-3" />
                                    {formatTime(event.time)} • {event.duration}min
                                  </span>
                                  <Badge variant="outline" size="sm">{event.type}</Badge>
                                  {lead && (
                                    <span className="flex items-center gap-1 truncate">
                                      <Avatar name={lead.name} size="xs" />
                                      {lead.name}
                                    </span>
                                  )}
                                </div>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <div className="text-center py-8 text-gray-500">
                      <Calendar className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                      <p className="font-medium">No events scheduled</p>
                      <p className="text-sm mt-1">Click "New Event" to add one</p>
                      <Button variant="outline" size="sm" className="mt-3" onClick={() => openCreateEvent(selectedDate)}>
                        <Plus className="w-4 h-4 mr-2" />
                        Add Event
                      </Button>
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <Calendar className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                  <p className="font-medium">Select a date</p>
                  <p className="text-sm mt-1">Click any day to view events</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Quick Stats */}
          <Card className="mt-4">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="w-5 h-5" />
                This Month
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {Object.entries(EVENT_TYPE_COLORS).map(([type, color]) => {
                  const count = events.filter(e => e.type === type).length;
                  const Icon = EVENT_TYPE_ICONS[type];
                  return (
                    <div key={type} className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ backgroundColor: color + '20' }}>
                        <span style={{ color }}>
                          <Icon className="w-4 h-4" />
                        </span>
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-gray-900 capitalize">{type}</p>
                        <p className="text-sm text-gray-500">{count} events</p>
                      </div>
                      <span className="text-2xl font-bold text-gray-900">{count}</span>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Event Modal */}
      <Modal
        isOpen={showEventModal}
        onClose={() => { setShowEventModal(false); setEditingEvent(null); }}
        title={editingEvent ? 'Edit Event' : 'New Event'}
        size="lg"
      >
        <div className="space-y-4">
          <Input
            label="Title"
            value={eventForm.title}
            onChange={(e) => setEventForm({ ...eventForm, title: e.target.value })}
            placeholder="Enter event title"
            required
          />
          
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Date"
              type="date"
              value={eventForm.date}
              onChange={(e) => setEventForm({ ...eventForm, date: e.target.value })}
              required
            />
            <Input
              label="Time"
              type="time"
              value={eventForm.time}
              onChange={(e) => setEventForm({ ...eventForm, time: e.target.value })}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Duration (minutes)"
              type="number"
              value={eventForm.duration}
              onChange={(e) => setEventForm({ ...eventForm, duration: parseInt(e.target.value) || 0 })}
              min={15}
              max={480}
              step={15}
            />
            <SelectDropdown
              value={eventForm.type}
              options={typeOptions}
              onChange={(v) => setEventForm({ ...eventForm, type: v as CalendarEvent['type'], color: EVENT_TYPE_COLORS[v as CalendarEvent['type']] })}
              placeholder="Event Type"
            />
          </div>

          <SelectDropdown
            value={eventForm.leadId}
            options={leadOptions}
            onChange={(v) => setEventForm({ ...eventForm, leadId: v })}
            placeholder="Link to Lead (optional)"
          />

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Description</label>
            <textarea
              value={eventForm.description}
              onChange={(e) => setEventForm({ ...eventForm, description: e.target.value })}
              rows={3}
              className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Add notes or agenda..."
            />
          </div>

          <div className="pt-4 border-t border-gray-200 flex justify-end gap-3">
            <Button variant="outline" onClick={() => { setShowEventModal(false); setEditingEvent(null); }}>Cancel</Button>
            {editingEvent && (
              <Button variant="destructive" onClick={() => handleDeleteEvent(editingEvent)}>
                <Trash2 className="w-4 h-4 mr-2" />
                Delete
              </Button>
            )}
            <Button variant="primary" onClick={handleSubmitEvent} loading={loading}>
              {editingEvent ? 'Save Changes' : 'Create Event'}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}

export default CalendarPage;