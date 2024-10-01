import { create } from 'zustand';

interface SchedulerState {
    events: CalendarEvents[];
    moveDayEvent: () => void;
    addEvent: () => void;
    deleteEvent: () => void;
}

const useSchedulerStore = create<SchedulerState>((set) => ({
    events: [
        { id: 1, title: 'Meeting', startHour: 9, endHour: 10, date: new Date() },
        { id: 2, title: 'Lunch', startHour: 12, endHour: 13, date: new Date() },
    ],
    addEvent: () => {
        
    },
    moveDayEvent: () => {
        // set((state) => {

        // })
    },
    deleteEvent: () => {
        
    },
}));

export default useSchedulerStore;