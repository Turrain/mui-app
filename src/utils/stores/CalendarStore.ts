import { create } from 'zustand';
import http from '../api/http-client';
import auth from '../api/auth.service';

interface CalendarState {
    events: CalendarEvents[];
    fetchEvents: () => void;
    addEvent: (newEvent: any) => void;
    setEvents: (calendarEvent: any[]) => void;
    updateEvent: (calendarEvent: any) => void;
    deleteEvent: (id: number) => void;
    getEventById: (id: number) => CalendarEvents | undefined;
}

export const useCalendarStore = create<CalendarState>((set, get) => ({
    events: [],
    fetchEvents: () => {
        if (auth.getAuthUser() !== null) {
            http.get('/api/calendar_events')
                .then(response => {
                    get().setEvents(response.data);
                })
                .catch(error => console.error('Ошибка при получении данных:', error));
        }
    },
    addEvent: (newEvent) => {
        http.post('/api/calendar_events', newEvent, {
            headers: { 'Content-Type': 'application/json' },
        })
            .then(response => response.data)
            .then(() => {
                get().fetchEvents();
            })
            .catch(error => {
                console.error('Ошибка при добавлении:', error);
                // show('Ошибка при добавлении', 'danger');
            });
    },
    setEvents: (calendarEvent) => {
        set(() => ({
            events: calendarEvent.map(evt => ({
                id: evt.id,
                title: evt.title,
                start: new Date(evt.start),
                end: new Date(evt.end),
            })),
        }));
    },
    updateEvent: (calendarEvent) => {
        http.put(`/api/calendar_events/${calendarEvent.id}`, calendarEvent, {
            headers: { 'Content-Type': 'application/json' },
        })
            .then(response => response.data)
            .then(() => {
                get().fetchEvents();
                // show('Запись обновлена', 'success');
            })
            .catch(error => {
                console.error('Ошибка при обновлении данных:', error);
                // show('Ошибка при обновлении данных', 'danger');
            });
    },
    deleteEvent: (id) => {
        // const show = useToastStore.getState().show;
        http.delete_(`/api/calendar_events/${id}`)
            .then(() => {
                get().fetchEvents(); // Reload data after deletion
                // show('Запись удалена', 'success');
            })
            .catch(error => {
                console.error('Ошибка при удалении:', error);
                // show('Ошибка при удалении', 'danger');
            });
    },
    getEventById: (id) => {
        return get().events.find(event => event.id === id);
    },
}));