// import { ColorPaletteProp } from "@mui/joy";
// import { makeAutoObservable } from "mobx";

// class ToastStore {
//     open: boolean = false;
//     message: string = "";
//     color: ColorPaletteProp = "success";

//     constructor() {
//         makeAutoObservable(this);
//     }

//     show(message: string, color: ColorPaletteProp) {
//         this.message = message;
//         this.color = color;
//         this.open = true;
//     }

//     close() {
//         this.open = false;
//     }
// }

// export const toastStore = new ToastStore();

import { create } from 'zustand'
import { ColorPaletteProp } from '@mui/joy'

type ToastState = {
    open: boolean,
    message: string,
    color: ColorPaletteProp,
    show: (message: string, color: ColorPaletteProp) => void,
    close: () => void,
}

export const useToastStore = create<ToastState>((set) => ({
    open: false,
    message: '',
    color: 'success',
    show: (message, color) =>
        set(() => ({
            message,
            color,
            open: true,
        })),
    close: () =>
        set(() => ({
            open: false,
        })),
}));