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