import { ColorPaletteProp } from "@mui/joy";
import { makeAutoObservable } from "mobx";

class ToastStore {
    open: boolean = false;
    message: string = "";
    color: ColorPaletteProp = "success";

    constructor() {
        makeAutoObservable(this);
    }

    show(message: string, color: ColorPaletteProp) {
        this.message = message;
        this.color = color;
        this.open = true;
    }

    close() {
        this.open = false;
    }
}

export const toastStore = new ToastStore();