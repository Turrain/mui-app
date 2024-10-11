import React from 'react';
import { useCompanyStore } from './CompanyStore';
import { usePhoneListStore } from './PhoneListStore';
import { useSoundfileStore } from './SoundfileStore';
import { useUserStore } from './UserStore';
import { useCalendarStore } from './CalendarStore';
import useKanbanStore from './KanbanStore';

export const storesContext = React.createContext({
    useCompanyStore, usePhoneListStore, useSoundfileStore, useUserStore, useCalendarStore, useKanbanStore
});