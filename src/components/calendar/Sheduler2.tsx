import { Calendar, dateFnsLocalizer, Event, SlotInfo, View } from 'react-big-calendar'
import withDragAndDrop from 'react-big-calendar/lib/addons/dragAndDrop'
import format from 'date-fns/format'
import parse from 'date-fns/parse'
import startOfWeek from 'date-fns/startOfWeek'
import getDay from 'date-fns/getDay'
import { ru } from 'date-fns/locale'
import { useContext, useEffect, useState } from 'react'
import { setHours, setMinutes } from 'date-fns'
import 'react-big-calendar/lib/css/react-big-calendar.css';
import 'react-big-calendar/lib/addons/dragAndDrop/styles.css'
import CreateCalendarEventModal from './modals/CreateCalendarEventModal'
import { storesContext } from '../../utils/stores'
import EditCalendarEventModal from './modals/EditCalendarEventModal'

const locales = {
    'ru': ru,
}

const localizer = dateFnsLocalizer({
    format,
    parse,
    startOfWeek,
    getDay,
    locales,
})

interface CEvent extends Event {
    id: number;
}

const Sheduler2 = () => {
    // const [events, setEvents] = useState<CEvent[]>([
    //     { id: 0, title: 'Meeting', start: setHours(setMinutes(new Date(), 0), 9), end: setHours(setMinutes(new Date(), 0), 10) },
    //     { id: 1, title: 'Lunch', start: setHours(setMinutes(new Date(), 0), 12), end: setHours(setMinutes(new Date(), 0), 13) },
    //     { id: 2, title: 'Lunch 2', start: setHours(setMinutes(new Date(), 0), 14), end: setHours(setMinutes(new Date(), 0), 15) },
    //     { id: 3, title: 'Lunch 3', start: setHours(setMinutes(new Date(), 0), 15), end: setHours(setMinutes(new Date(), 0), 16) },
    // ]);
    const { useCalendarStore } = useContext(storesContext);
    const { events, fetchEvents, addEvent, updateEvent, deleteEvent } = useCalendarStore();

    const [currentDate, setCurrentDate] = useState<Date>(new Date());
    const [currentView, setCurrentView] = useState<View>('week');

    const [slotInfo, setSlotInfo] = useState<SlotInfo>();
    const [selectedEvent, setSelectedEvent] = useState<number>(0);
    const [createCalendarEventModalOpen, setCreateCalendarEventModalOpen] = useState<boolean>(false);
    const [editCalendarEventModalOpen, setEditCalendarEventModalOpen] = useState<boolean>(false);

    useEffect(() => {
        fetchEvents();
        console.log(events);
    }, [fetchEvents]);

    const onEventResize = (data: any) => {
        const { event, start, end } = data;
        const updatedEvent = { ...event, start, end };
        updateEvent(updatedEvent);
    };

    const onEventDrop = (data: any) => {
        const { event, start, end } = data;
        const updatedEvent = { ...event, start, end };
        updateEvent(updatedEvent);
    };

    const handleSelectSlot = (slotInfo: SlotInfo) => {
        setSlotInfo(slotInfo);
        setCreateCalendarEventModalOpen(true);
    }

    const handleSelectEvent = (event: any, e: any) => {
        setSelectedEvent(event.id);
        setEditCalendarEventModalOpen(true);
    }

    const DnDCalendar = withDragAndDrop(Calendar);

    return (
        <div>
            <DnDCalendar
                defaultView='week'
                localizer={localizer}
                events={events}
                onEventDrop={onEventDrop}
                onEventResize={onEventResize}
                resizable
                selectable
                onSelectSlot={handleSelectSlot}
                onSelectEvent={handleSelectEvent}
                culture='ru'
                date={currentDate}
                view={currentView}
                onNavigate={(date) => setCurrentDate(date)}
                onView={(view) => setCurrentView(view)}
                style={{ height: 500 }}
            />
            <CreateCalendarEventModal
                open={createCalendarEventModalOpen}
                onClose={() => setCreateCalendarEventModalOpen(false)}
                createEvent={addEvent}
                slotInfo={slotInfo!}
            />
            <EditCalendarEventModal
                id={selectedEvent}
                open={editCalendarEventModalOpen}
                onClose={() => setEditCalendarEventModalOpen(false)}
                updateEvent={updateEvent}
                deleteEvent={deleteEvent}
            />
        </div>
    )
}

export default Sheduler2;