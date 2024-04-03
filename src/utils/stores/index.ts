import React from 'react';
import { companyStore } from './CompanyStore';
import { phoneListStore } from './PhoneListStore';
import { soundfileStore } from './SoundfileStore';
import { userStore } from './UserStore';
export const storesContext = React.createContext({
    companyStore, phoneListStore, soundfileStore, userStore
});